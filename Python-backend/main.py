from fastapi import FastAPI, UploadFile, File
import io
import librosa
import numpy as np
import pickle
import tensorflow as tf
import os
import tempfile
import asyncio
from typing import List
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

# ======== Load Custom Model, Scaler, and Encoder ========
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'keras_model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'encoder.pkl')

print("Loading local models...")
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    with open(ENCODER_PATH, 'rb') as f:
        encoder = pickle.load(f)
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    model = None
    scaler = None
    encoder = None

# Thread pool for CPU-bound tasks
executor = ThreadPoolExecutor(max_workers=os.cpu_count())

# ======== Vocal Metrics (Pitch, Energy, Tone, Rate) ========
def get_pitch_data(y, sr):
    f0, voiced_flag, _ = librosa.pyin(y, fmin=50, fmax=500, sr=sr)
    if f0 is None:
        return 0.0, []
    
    voiced_f0 = f0[~np.isnan(f0)]
    median_pitch = float(np.median(voiced_f0)) if len(voiced_f0) > 0 else 0.0
    
    # Downsample the contour to ~100 points for smooth visualization
    full_contour = np.nan_to_num(f0)
    if len(full_contour) > 100:
        indices = np.linspace(0, len(full_contour) - 1, 100).astype(int)
        downsampled_contour = full_contour[indices].tolist()
    else:
        downsampled_contour = full_contour.tolist()
        
    return median_pitch, [round(float(v), 1) for v in downsampled_contour]

def get_energy(y, frame_length=2048, hop_length=512):
    rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)
    return float(rms.mean())

def get_tone(y, sr):
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr).mean()
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr).mean()
    return float((centroid + rolloff) / 2)

def get_speech_rate(y, sr):
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    peaks = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr)
    duration = librosa.get_duration(y=y, sr=sr)
    return len(peaks) / duration if duration > 0 else 0.0

# Labels
def pitch_label(p): return "Low" if p<100 else "Medium" if p<200 else "High"
def energy_label(e): return "Low" if e<0.02 else "Medium" if e<0.05 else "High"
def tone_label(t): return "Warm" if t<2000 else "Neutral" if t<4000 else "Bright"
def speech_rate_label(s): return "Slow" if s<2 else "Normal" if s<4 else "Fast"

# ======== Feature Extraction (Emotion Mode) ========
def extract_features(data, sample_rate=22050):
    result = np.array([])
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
    result = np.hstack((result, zcr))
    stft = np.abs(librosa.stft(data))
    chroma_stft = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)
    result = np.hstack((result, chroma_stft))
    mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sample_rate).T, axis=0)
    result = np.hstack((result, mfcc))
    rms = np.mean(librosa.feature.rms(y=data).T, axis=0)
    result = np.hstack((result, rms))
    mel = np.mean(librosa.feature.melspectrogram(y=data, sr=sample_rate).T, axis=0)
    result = np.hstack((result, mel))
    return result

# ======== Prediction Logic ========
def predict_emotion_custom(audio_path):
    if model is None or scaler is None or encoder is None:
        return "Error", 0.0, {}

    try:
        data, sample_rate = librosa.load(audio_path, duration=2.5, offset=0.6)
        features = extract_features(data, sample_rate)
        scaled_features = scaler.transform(features.reshape(1, -1))
        expanded_features = np.expand_dims(scaled_features, axis=2)
        
        prediction_probabilities = model.predict(expanded_features)
        predicted_id = np.argmax(prediction_probabilities, axis=1)
        
        predicted_emotion_one_hot = np.zeros_like(prediction_probabilities)
        predicted_emotion_one_hot[np.arange(len(prediction_probabilities)), predicted_id] = 1
        predicted_emotion_label = encoder.inverse_transform(predicted_emotion_one_hot)
        
        emotion = predicted_emotion_label[0][0]
        confidence = float(np.max(prediction_probabilities))
        
        classes = encoder.categories_[0]
        all_probs = {str(cls): round(float(prob), 4) for cls, prob in zip(classes, prediction_probabilities[0])}
        
        return emotion, confidence, all_probs
    except Exception as e:
        print(f"Prediction error: {e}")
        return "Error", 0.0, {"error": str(e)}

# ======== CPU-bound file processing ========
def _sync_process_file(contents):
    y, sr = librosa.load(io.BytesIO(contents), sr=None, duration=30)
    
    p_val, p_contour = get_pitch_data(y, sr)
    e_val = get_energy(y)
    t_val = get_tone(y, sr)
    s_val = get_speech_rate(y, sr)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        emotion, confidence, all_probs = predict_emotion_custom(tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    return {
        "pitch": {
            "value": round(p_val, 2), 
            "unit": "Hz", 
            "label": pitch_label(p_val),
            "contour": p_contour
        },
        "energy": {"value": round(e_val, 4), "unit": "RMS", "label": energy_label(e_val)},
        "tone": {"value": round(t_val, 2), "unit": "Hz", "label": tone_label(t_val)},
        "speech_rate": {"value": round(s_val, 2), "unit": "events/sec", "label": speech_rate_label(s_val)},
        "emotion": emotion
    }

# ======== Async wrapper ========
async def process_file(file: UploadFile):
    contents = await file.read()
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, _sync_process_file, contents)

# ======== FastAPI endpoint ========
@app.post("/analyze")
async def analyze(files: List[UploadFile] = File(...)):
    if not files:
        return {"error": "Please upload at least 1 audio file"}

    tasks = [process_file(file) for file in files]
    results_list = await asyncio.gather(*tasks)
    results = {f"voice{i+1}": r for i, r in enumerate(results_list)}
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)