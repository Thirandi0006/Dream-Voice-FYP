import { useState } from "react";
import useMediaStore from "../components/hooks/seMediaStore";
import { 
  CloudUpload, 
  Trash2, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Download, 
  MoreVertical, 
  Database, 
  HardDrive, 
  FileAudio,
  ChevronRight,
  ShieldCheck,
  Check
} from "lucide-react";

export default function MediaStore() {
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;
  const { voiceFiles, handleUpload, handleDelete, fetchFiles } = useMediaStore(userId);

  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [uploadProgress, setUploadProgress] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dragOver, setDragOver] = useState(false);

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;
    try {
      const progressState = {};
      files.forEach(file => {
        const key = `voice-${file.name}-${Date.now()}`;
        progressState[key] = { progress: 0, name: file.name };
      });
      setUploadProgress(progressState);

      Object.keys(progressState).forEach(key => {
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[key];
            if (!current || current.progress >= 95) {
              clearInterval(interval);
              return prev;
            }
            return { ...prev, [key]: { ...current, progress: current.progress + 5 } };
          });
        }, 100);
      });

      await handleUpload(files);
      setTimeout(() => {
        Object.keys(progressState).forEach(key => {
          setUploadProgress(prev => ({ ...prev, [key]: { ...prev[key], progress: 100 } }));
        });
      }, 500);

      showNotification(`${files.length} node(s) synchronized successfully`, "success");
      setTimeout(() => setUploadProgress({}), 1500);
    } catch (error) {
      showNotification(`Synchronization failed`, "error");
      setUploadProgress({});
    }
  };

  const handleFileDelete = async (file) => {
    if (window.confirm(`Permanently purge "${file.name}" from the vault?`)) {
      try {
        await handleDelete(file);
        showNotification("Asset purged", "success");
      } catch (error) {
        showNotification("Purge failed", "error");
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const filteredFiles = () => {
    let files = voiceFiles.map((f) => ({ ...f, type: "voice" }));
    if (searchQuery) {
      files = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    files.sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : 0);
    return files;
  };

  const totalSize = voiceFiles.reduce((sum, f) => sum + (f.size || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
              Vocal <span className="text-primary italic">Vault</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-md">Encrypted repository for high-fidelity vocal assets and synchronized metadata.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <HardDrive size={24} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Capacity</p>
                <p className="text-xl font-black text-slate-800">{formatFileSize(totalSize)}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Upload Terminal */}
        <section className="animate-slide-up">
          <div 
            className={`card-premium p-1 md:p-1.5 transition-all duration-500 ${dragOver ? 'ring-4 ring-primary/20 bg-primary/5' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload([...e.dataTransfer.files]); }}
          >
            <div className="bg-slate-900 rounded-[2.2rem] p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 opacity-50"></div>
              <div className="relative z-10 space-y-6">
                <div className="inline-flex p-6 bg-white/5 rounded-[2.5rem] border border-white/10 text-white shadow-2xl backdrop-blur-md">
                  <CloudUpload size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Upload Voice file</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Drag files to transmit to the vocal cloud</p>
                </div>
                <div className="flex justify-center">
                  <label className="btn-primary cursor-pointer px-10 py-4 shadow-indigo-500/20">
                    <Check size={18} />
                    <span>BROWSE LOCAL FILES</span>
                    <input type="file" multiple accept="audio/*" className="hidden" onChange={(e) => handleFileUpload([...e.target.files])} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Active Uploads */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-6 space-y-3 animate-slide-up">
              {Object.entries(uploadProgress).map(([key, { progress, name }]) => (
                <div key={key} className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-6 shadow-lg">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Database size={20} className="animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-slate-700 truncate max-w-[200px]">{name}</span>
                      <span className="text-xs font-black text-primary">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Filter & Search Bar */}
        <section className="flex flex-col md:flex-row gap-4 animate-fade-in">
          <div className="flex-1 relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Query vocal index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-14 h-14 font-bold text-slate-700 shadow-sm"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Filter size={18} />
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-premium pl-12 pr-10 h-14 font-bold text-slate-700 appearance-none bg-white shadow-sm"
              >
                <option value="newest">NEWEST INDEX</option>
                <option value="name">DESCRIPTOR A-Z</option>
              </select>
            </div>
          </div>
        </section>

        {/* Assets Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {filteredFiles().map((file, idx) => (
            <div 
              key={idx} 
              className="card-premium group p-6 flex flex-col justify-between hover:-translate-y-2 transition-all duration-500"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-slate-900 rounded-3xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    <FileAudio size={24} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => window.open(file.url, '_blank')} className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-400 hover:text-primary rounded-xl transition-colors shadow-sm">
                      <Download size={18} />
                    </button>
                    <button onClick={() => handleFileDelete(file)} className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors shadow-sm">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1 truncate">{file.name}</h3>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black tracking-widest border border-emerald-100">
                    <ShieldCheck size={10} />
                    <span>VERIFIED</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatFileSize(file.size)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <audio controls className="w-full h-8 opacity-70 contrast-125 saturate-150" src={file.url} />
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Index Date: {file.uploadedAt || 'N/A'}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {filteredFiles().length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 space-y-6 text-slate-300">
            <div className="p-8 bg-slate-100 rounded-[3rem]">
              <Database size={64} />
            </div>
            <p className="text-xl font-black uppercase tracking-widest text-slate-400">Vault index empty</p>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 animate-slide-up border ${notification.type === 'success' ? 'bg-slate-900 border-emerald-500 text-white' : 'bg-slate-900 border-rose-500 text-white'}`}>
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
          <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
        </div>
      )}
    </div>
  );
}