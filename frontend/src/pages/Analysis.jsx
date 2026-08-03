import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  FileText,
  Mic2,
  Plus,
  RefreshCcw,
  Save,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useMediaStore from "../components/hooks/seMediaStore";
import useAnalysis from "../components/hooks/useAnalysis";
import useProjects from "../components/hooks/useProjects";

export default function Analyzer() {
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;
  const { projects, addProject, loading } = useProjects(userId);
  const {
    handleVoiceAnalyze,
    analysisVoiceResult,
    finalAnalysis,
    FinalAnalyze,
    loadingVoice,
    loadingFinal,
    handleUpdateProject,
    fetchPastProject,
    pastData,
    loadingPast,
  } = useAnalysis(userId);
  const { voiceFiles, fetchFiles, handleUpload } = useMediaStore(userId);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [script, setScript] = useState("");
  const [showPastResult, setShowPastResult] = useState(false);

  useEffect(() => {
    if (pastData) {
      setScript(pastData.characterDetails || "");
    }
  }, [pastData]);

  const formatVoiceAnalysis = (data) => {
    if (!data) return "No data available.";
    const v = data.voice1;
    if (!v) return "No valid voice data.";

    return `
**Pitch:** ${v.pitch.value} ${v.pitch.unit} (${v.pitch.label})\n
**Energy:** ${v.energy.value} ${v.energy.unit} (${v.energy.label})\n
**Tone:** ${v.tone.value} ${v.tone.unit} (${v.tone.label})\n
**Speech Rate:** ${v.speech_rate.value} ${v.speech_rate.unit} (${v.speech_rate.label})\n
**Emotion:** ${v.emotion}\n
`;
  };

  const Row = ({ label, value }) => (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 bg-primary rounded-full"></div>
        <div className="font-bold text-slate-700">{label}</div>
      </div>
      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 font-mono text-sm leading-relaxed text-slate-600 shadow-inner">
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    </div>
  );

  const handleSelectVoice = (url) => {
    const voice = voiceFiles.find((v) => v.url === url);
    setSelectedVoice(voice);
  };

  const handleViewPast = async () => {
    if (!selectedProjectId) return;
    await fetchPastProject(selectedProjectId);
    setShowPastResult(true);
  };

  const isProjectSelected = !!selectedProjectId;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-8 space-y-8">
        {/* Header */}
        <header className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Voice + Character <span className="text-primary">Analyzer</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl">
                Upload your voice, character profile and let AI do the analysis
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary px-6"
              >
                <Plus size={20} />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </header>

        {/* Phase 1: Project Selection */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <Search size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Project Selection</h2>
                <p className="text-slate-500 text-sm">Select an existing project or load previous results</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="input-premium h-[52px]"
                  disabled={loading}
                >
                  <option value="">-- Select a Project to Begin --</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleViewPast}
                disabled={!isProjectSelected || loadingPast}
                className="btn-secondary px-8 h-[52px] disabled:opacity-50"
              >
                <BookOpen size={20} />
                <span>View Past Result</span>
              </button>
            </div>
          </div>
        </section>

        {!isProjectSelected && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4 animate-fade-in">
            <div className="p-6 bg-slate-100 rounded-full">
              <AlertCircle size={48} />
            </div>
            <p className="text-xl font-medium">Please select a project to enable analysis tools</p>
          </div>
        )}

        {/* Analysis Workspace */}
        <div className={`space-y-8 transition-all duration-700 ${isProjectSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Voice Analysis */}
            <section className="space-y-8">
              <div className="card-premium p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                      <Mic2 size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Voice Profiling</h2>
                      <p className="text-slate-500 text-sm">Upload and analyze acoustic features</p>
                    </div>
                  </div>
                  <button onClick={fetchFiles} className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <RefreshCcw size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upload New Audio</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleUpload(e.target.files, "voice")}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Sample</label>
                    <select
                      className="input-premium"
                      onChange={(e) => handleSelectVoice(e.target.value)}
                    >
                      <option>-- Choose from Library --</option>
                      {voiceFiles.map((v) => (
                        <option key={v.url} value={v.url}>{v.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedVoice && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-fade-in">
                      <audio 
                        key={selectedVoice.url} 
                        controls 
                        className="w-full h-10"
                        src={selectedVoice.url}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  <button
                    onClick={() => selectedVoice ? handleVoiceAnalyze(selectedVoice.url) : alert("Select a voice sample first")}
                    disabled={loadingVoice || !selectedVoice}
                    className="btn-primary w-full py-4 text-lg"
                  >
                    {loadingVoice ? <RefreshCcw className="animate-spin" /> : <ChevronRight />}
                    <span>Run Voice Analysis</span>
                  </button>

                  {analysisVoiceResult?.voice1 && (
                    <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10 animate-slide-up">
                      <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        Acoustic Profile
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { l: "Pitch", v: `${analysisVoiceResult.voice1.pitch.value} Hz` },
                          { l: "Emotion", v: analysisVoiceResult.voice1.emotion, highlight: true },
                          { l: "Energy", v: analysisVoiceResult.voice1.energy.label },
                          { l: "Rate", v: analysisVoiceResult.voice1.speech_rate.label },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.l}</p>
                            <p className={`text-lg font-bold ${item.highlight ? 'text-primary' : 'text-slate-700'}`}>{item.v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Right Column: Character Details & Final Analysis */}
            <section className="space-y-8">
              <div className="card-premium p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Character Script</h2>
                    <p className="text-slate-500 text-sm">Define context and performance goals</p>
                  </div>
                </div>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={6}
                  className="input-premium resize-none min-h-[180px]"
                  placeholder="Describe the character's background, current emotional state, or paste the script here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => finalAnalysis(analysisVoiceResult, script)}
                  disabled={loadingFinal || !analysisVoiceResult || !script.trim()}
                  className="btn-primary py-4 text-lg bg-gradient-to-r from-slate-800 to-slate-900">
                  <Search size={20} />
                  <span>Final Analysis</span>
                </button>

                <button
                  onClick={() => {
                    const payload = {
                      audio: selectedVoice?.url || "",
                      voiceAnalysis: analysisVoiceResult,
                      characterDetails: script,
                      finalAnalysis: FinalAnalyze,
                    };
                    handleUpdateProject(selectedProjectId, payload);
                  }}
                  disabled={!isProjectSelected}
                  className="btn-secondary py-4 text-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Save size={20} />
                  <span>Save Project</span>
                </button>
              </div>
            </section>
          </div>

          {/* Final Results Display */}
          {(loadingFinal || FinalAnalyze) && (
            <section className="animate-slide-up">
              <div className="card-premium p-8 lg:p-12 border-t-4 border-t-primary">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-primary/10 rounded-3xl text-primary">
                    <Search size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-800">Comprehensive Analysis</h2>
                    <p className="text-slate-500">Cross-referenced voice and character profile</p>
                  </div>
                </div>

                {loadingFinal ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-lg font-bold text-slate-700 animate-pulse">Generating Intelligence Report...</p>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-full bg-slate-50/50 p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-inner leading-relaxed">
                    <ReactMarkdown>{FinalAnalyze}</ReactMarkdown>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 space-y-8 animate-slide-up">
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-3xl text-primary mb-6">
                <Plus size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Create Project</h3>
              <p className="text-slate-500">Start a new analysis workspace</p>
            </div>

            <input
              type="text"
              placeholder="Project Name (e.g. Hero Protagonist)"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="input-premium py-4"
              autoFocus
            />

            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  if (newProjectName.trim()) {
                    const proj = await addProject(newProjectName);
                    setSelectedProjectId(proj._id);
                  }
                  setShowCreateModal(false);
                  setNewProjectName("");
                }}
                className="btn-primary py-4 text-lg"
              >
                Create and Start
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary py-4"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {showPastResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl relative overflow-hidden animate-slide-up flex flex-col">
            <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Historical Intelligence</h2>
              </div>
              <button
                onClick={() => setShowPastResult(false)}
                className="p-3 hover:bg-slate-200 rounded-full transition-colors"
              >
                <ChevronRight size={24} className="rotate-90 md:rotate-0" />
              </button>
            </div>

            <div className="p-8 md:p-12 overflow-y-auto flex-1">
              {loadingPast ? (
                <div className="text-center py-20 flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-slate-500 font-medium">Retrieving from Archives...</p>
                </div>
              ) : !pastData ? (
                <div className="text-center py-20">
                  <p className="text-slate-400">No archival data found for this project.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Identity</p>
                      <h4 className="text-2xl font-bold text-slate-800">{pastData.title}</h4>
                      <div className="mt-4 inline-flex px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold uppercase tracking-tighter">
                        {pastData.status}
                      </div>
                    </div>
                    {pastData.audio && (
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reference Audio</p>
                        <audio 
                          key={pastData.audio}
                          controls 
                          className="w-full h-10 mt-2"
                          src={pastData.audio}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>

                  <Row label="Acoustic Metadata" value={formatVoiceAnalysis(pastData.voiceAnalysis)} />
                  <Row label="Character Context" value={pastData.characterDetails} />
                  <Row label="Final Intelligence Report" value={pastData.finalAnalysis} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}