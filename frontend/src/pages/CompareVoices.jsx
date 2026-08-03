import { useState } from "react";
import useMediaStore from "../components/hooks/seMediaStore";
import useAnalysis from "../components/hooks/useAnalysis";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  ArrowLeftRight, 
  Upload, 
  FileAudio, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  PlayCircle,
  ChevronRight,
  TrendingUp,
  Brain,
  RefreshCcw
} from "lucide-react";

const PitchComparisonChart = ({ data1, data2 }) => {
  const chartData = data1.map((val, i) => ({
    time: i,
    voice1: val,
    voice2: data2[i] || 0
  }));

  return (
    <div className="h-72 w-full mt-6 bg-white/50 rounded-3xl p-4 border border-slate-100">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorV1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorV2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="time" hide />
          <YAxis 
            domain={['dataMin - 20', 'dataMax + 20']} 
            tick={{fontSize: 10, fill: '#94a3b8'}}
            axisLine={false}
            tickLine={false}
            unit="Hz"
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '24px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)'
            }}
          />
          <Legend iconType="circle" />
          <Area
            type="monotone"
            dataKey="voice1"
            name="Voice 1 (Hz)"
            stroke="#6366f1"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorV1)"
            animationDuration={2000}
          />
          <Area
            type="monotone"
            dataKey="voice2"
            name="Voice 2 (Hz)"
            stroke="#10b981"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorV2)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function CompareVoices() {
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;

  const { voiceFiles, handleUpload } = useMediaStore(userId);
  const { analysisVoiceResult, handleVoiceAnalyze, loadingVoice } = useAnalysis(userId);

  const [voice1, setVoice1] = useState(null);
  const [voice2, setVoice2] = useState(null);
  const [selectedVoice1, setSelectedVoice1] = useState("");
  const [selectedVoice2, setSelectedVoice2] = useState("");
  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeBothVoices = async () => {
    if (!voice1 || !voice2) return;
    setIsAnalyzing(true);
    const v1 = typeof voice1 === "string" ? voice1 : voice1.url;
    const v2 = typeof voice2 === "string" ? voice2 : voice2.url;
    try {
      await handleVoiceAnalyze(v1, v2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceUpload = async (e, setVoice, setUploading, setSelected) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const file = files[0];
    setUploading(true);
    setSelected("");
    try {
      await handleUpload([file], "voice");
      setVoice(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectVoice = (url, setVoice, setSelected) => {
    const voiceFile = voiceFiles.find(f => f.url === url);
    if (voiceFile) {
      setVoice(voiceFile);
      setSelected(url);
    }
  };

  const renderMetricComparison = (data1, data2, metric) => {
    if (!data1 || !data2) return null;

    if (metric === 'emotion') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={18} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Emotional Tone</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
              <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Voice 1</p>
              <p className="text-lg font-black text-indigo-700">{data1[metric] || "Neutral"}</p>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
              <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Voice 2</p>
              <p className="text-lg font-black text-emerald-700">{data2[metric] || "Neutral"}</p>
            </div>
          </div>
          <div className={`text-xs font-bold text-center py-2 px-4 rounded-full ${data1[metric] === data2[metric] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {data1[metric] === data2[metric] ? "Perfect Emotional Match" : "Distinct Emotional States"}
          </div>
        </div>
      );
    }

    const value1 = data1[metric]?.value;
    const value2 = data2[metric]?.value;
    const unit = data1[metric]?.unit || "";
    if (value1 === undefined || value2 === undefined) return null;

    const diff = Math.abs(value1 - value2);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{metric.replace("_", " ")}</span>
          </div>
          <div className="px-3 py-1 bg-slate-800 text-white text-[10px] font-black rounded-full">
            Δ {diff.toFixed(1)} {unit}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-bold text-slate-400">VOICE 1</span>
              <span className="text-sm font-black text-slate-700">{value1.toFixed(1)} {unit}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(metric === 'energy' ? value1 * 500 : value1 / 5, 100)}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-bold text-slate-400">VOICE 2</span>
              <span className="text-sm font-black text-slate-700">{value2.toFixed(1)} {unit}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(metric === 'energy' ? value2 * 500 : value2 / 5, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SelectionCard = ({ title, voice, setVoice, selectedVoice, setSelectedVoice, color, uploading }) => {
    const isIndigo = color === 'indigo';
    return (
      <div className="card-premium p-8 animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[2rem] ${isIndigo ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <FileAudio size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">{title}</h3>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Configure Input Source</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Library Samples</label>
            <select
              className="input-premium h-[56px] font-bold text-slate-700"
              value={selectedVoice}
              onChange={(e) => handleSelectVoice(e.target.value, setVoice, setSelectedVoice)}
              disabled={uploading}
            >
              <option value="">Choose a voice sample...</option>
              {voiceFiles?.map((f) => (
                <option key={f.url} value={f.url}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="relative group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Direct Upload</label>
            <div className={`border-2 border-dashed ${isIndigo ? 'border-indigo-200 group-hover:border-indigo-400' : 'border-emerald-200 group-hover:border-emerald-400'} rounded-3xl p-8 text-center transition-all duration-300 bg-slate-50/50 group-hover:bg-white`}>
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <RefreshCcw className="animate-spin text-primary" />
                  <span className="text-xs font-bold text-slate-400">Transmitting Data...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isIndigo ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <Upload size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">Drop audio file here</span>
                </div>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleVoiceUpload(e, setVoice, isIndigo ? setUploading1 : setUploading2, isIndigo ? setSelectedVoice1 : setSelectedVoice2)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
            </div>
          </div>

          {voice && (
            <div className="p-6 bg-slate-900 rounded-[2rem] shadow-2xl animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <PlayCircle size={20} className={isIndigo ? 'text-indigo-400' : 'text-emerald-400'} />
                <span className="text-xs font-black text-white uppercase truncate max-w-[200px]">
                  {typeof voice === "string" ? voiceFiles.find(f => f.url === voice)?.name : voice.name}
                </span>
              </div>
              <audio controls className="w-full h-8 opacity-90 contrast-125 saturate-150" src={voice.url || (voice instanceof Blob ? URL.createObjectURL(voice) : "")} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const similarity = analysisVoiceResult ? Math.round(
    (() => {
      const v1 = analysisVoiceResult.voice1;
      const v2 = analysisVoiceResult.voice2;
      const p = Math.max(0, 100 - Math.abs(v1.pitch.value - v2.pitch.value));
      const e = Math.max(0, 100 - Math.abs(v1.energy.value - v2.energy.value) * 1000);
      const r = Math.max(0, 100 - Math.abs(v1.speech_rate.value - v2.speech_rate.value) * 20);
      const em = v1.emotion === v2.emotion ? 100 : 0;
      return (p * 0.3 + e * 0.2 + r * 0.2 + em * 0.3);
    })()
  ) : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-8 animate-fade-in">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
              Voice <span className="text-primary italic">Comparator</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-lg">
              Compare your voice with the best voice talents and find the perfect match for your project.
            </p>
          </div>
          <button
            onClick={analyzeBothVoices}
            disabled={!voice1 || !voice2 || isAnalyzing}
            className="group relative"
          >
            <div className={`absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${(!voice1 || !voice2) && 'hidden'}`}></div>
            <div className={`relative flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 ${!voice1 || !voice2 || isAnalyzing ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:scale-105 active:scale-95'}`}>
              {isAnalyzing ? <RefreshCcw className="animate-spin" /> : <ArrowLeftRight />}
              <span>{isAnalyzing ? 'SYNCHRONIZING...' : 'START COMPARISON'}</span>
            </div>
          </button>
        </header>

        {/* Input Phase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SelectionCard
            title="Standard A"
            voice={voice1}
            setVoice={setVoice1}
            selectedVoice={selectedVoice1}
            setSelectedVoice={setSelectedVoice1}
            color="indigo"
            uploading={uploading1}
          />
          <SelectionCard
            title="Sample B"
            voice={voice2}
            setVoice={setVoice2}
            selectedVoice={selectedVoice2}
            setSelectedVoice={setSelectedVoice2}
            color="emerald"
            uploading={uploading2}
          />
        </div>

        {/* Analysis Phase */}
        {analysisVoiceResult && (
          <div className="space-y-12 animate-slide-up">
            {/* Full-Width Intelligence Summary */}
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/10 rounded-[1.5rem] text-primary shadow-inner">
                      <TrendingUp size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tight text-white uppercase italic">Intelligence Summary</h3>
                      <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1">Global Cross-Reference Results</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${analysisVoiceResult.voice1.emotion === analysisVoiceResult.voice2.emotion ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {analysisVoiceResult.voice1.emotion === analysisVoiceResult.voice2.emotion ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Emotion Alignment</p>
                        <p className="text-xl font-black text-white">{analysisVoiceResult.voice1.emotion === analysisVoiceResult.voice2.emotion ? 'SYSTEM MATCH' : 'VARIANT DETECTED'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">PROBABILITY</span>
                      <span className="text-2xl font-black text-primary">{(similarity * 0.98).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Aggregate Match Accuracy</span>
                      <h4 className="text-6xl font-black text-white tracking-tighter mt-1">
                        {similarity}<span className="text-primary">%</span>
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Optimal Range</span>
                    </div>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-primary to-emerald-400 rounded-full transition-all duration-[2500ms] ease-out relative" 
                      style={{ width: `${similarity}%` }}
                    >
                      <div className="absolute top-0 right-0 w-4 h-full bg-white/30 blur-sm"></div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase text-center mt-4">Acoustic fingerprint synchronization complete</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Sidebar: Pitch & Emotion */}
              <div className="xl:col-span-1 space-y-8">
                <div className="card-premium p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Pitch Spectral Overlay</h4>
                    <Activity size={18} className="text-primary animate-pulse" />
                  </div>
                  {analysisVoiceResult.voice1.pitch.contour && (
                    <PitchComparisonChart 
                      data1={analysisVoiceResult.voice1.pitch.contour} 
                      data2={analysisVoiceResult.voice2.pitch.contour} 
                    />
                  )}
                </div>

                <div className="card-premium p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Emotional Tone</h4>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Brain size={16} />
                    </div>
                  </div>
                  {renderMetricComparison(
                    analysisVoiceResult.voice1,
                    analysisVoiceResult.voice2,
                    'emotion'
                  )}
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="xl:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {['pitch', 'energy', 'tone', 'speech_rate'].map((metric, idx) => (
                    <div 
                      key={metric} 
                      className="card-premium p-8"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      {renderMetricComparison(
                        analysisVoiceResult.voice1,
                        analysisVoiceResult.voice2,
                        metric
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
