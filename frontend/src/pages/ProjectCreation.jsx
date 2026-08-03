import { useState, useRef, useEffect } from "react";
import useProjects from "../components/hooks/useProjects";
import { 
  Plus, 
  Folder, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  MoreHorizontal,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";

export default function ProjectCreation() {
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;
  const { projects, loading, addProject, editProject, removeProject } = useProjects(userId);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("In Progress");
  const [editDescription, setEditDescription] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  const handleAdd = async () => {
    if (!newProjectName.trim()) return showNotification("Project title required", "error");
    try {
      await addProject({ title: newProjectName.trim(), description: newProjectDescription.trim() });
      setNewProjectName("");
      setNewProjectDescription("");
      showNotification("Project successfully deployed", "success");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showNotification("Deployment failed", "error");
    }
  };

  const saveEdit = async () => {
    if (!editName.trim()) return showNotification("Name required", "error");
    try {
      await editProject(editingId, { title: editName.trim(), status: editStatus, description: editDescription.trim() });
      setEditingId(null);
      showNotification("Parameters updated", "success");
    } catch (error) {
      showNotification("Update failed", "error");
    }
  };

  const handleDelete = async (projectId, projectName) => {
    if (window.confirm(`Purge project "${projectName}"? All associated data will be lost.`)) {
      try {
        await removeProject(projectId);
        showNotification("Project purged", "success");
      } catch (error) {
        showNotification("Purge failed", "error");
      }
    }
  };

  const filteredProjects = projects
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status?.toLowerCase().includes('complete')).length,
    active: projects.filter(p => !p.status?.toLowerCase().includes('complete')).length,
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
              Project <span className="text-primary italic">Workspace</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-md">Initialize and orchestrate your vocal analysis workflows.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Layers size={24} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Clusters</p>
                <p className="text-xl font-black text-slate-800">{stats.total}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left: Project Creation Form */}
          <div className="xl:col-span-1">
            <div className="card-premium p-8 sticky top-8 animate-slide-up">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-slate-900 rounded-[2rem] text-white shadow-xl">
                  <Plus size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">New Project</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Create Vocal Projects</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Workspace Descriptor</label>
                  <input
                    type="text"
                    placeholder="e.g. Hero Protagonist Alpha"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="input-premium h-14 font-bold text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Context</label>
                  <textarea
                    placeholder="Optional metadata or project scope..."
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    rows={4}
                    className="input-premium py-4 resize-none font-medium text-slate-600"
                  />
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!newProjectName.trim()}
                  className="btn-primary w-full py-5 text-sm font-black uppercase tracking-[0.2em] shadow-indigo-500/20"
                >
                  <ArrowRight size={18} />
                  <span>Deploy Project</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Projects Explorer */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Explorer Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 animate-fade-in">
              <div className="flex-1 relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Search size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Query project index..."
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
                    <option value="newest">NEWEST FIRST</option>
                    <option value="name">DESCRIPTOR A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {filteredProjects.map((proj, idx) => (
                <div key={proj._id} className="card-premium group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/20">
                  {editingId === proj._id ? (
                    <div className="p-8 space-y-8 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Update Descriptor</label>
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="input-premium h-12 font-bold text-slate-700"
                            autoFocus
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Status</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="input-premium h-12 font-bold text-slate-700"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context</label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="input-premium py-3 resize-none font-medium text-slate-600"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button onClick={() => setEditingId(null)} className="btn-secondary px-6">Cancel</button>
                        <button onClick={saveEdit} className="btn-primary px-8">Save Update</button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex items-start gap-6">
                          <div className={`p-4 rounded-3xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${proj.status?.toLowerCase().includes('complete') ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                            <Folder size={24} />
                          </div>
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{proj.title}</h3>
                              <StatusBadge status={proj.status} />
                            </div>
                            {proj.description && (
                              <p className="text-slate-500 font-medium text-sm max-w-xl leading-relaxed">{proj.description}</p>
                            )}
                            <div className="flex items-center gap-6 pt-2">
                              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Calendar size={14} className="text-slate-300" />
                                {new Date(proj.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Info size={14} className="text-slate-300" />
                                IDX: {proj._id.slice(-8).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button onClick={() => setEditingId(proj._id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 rounded-2xl transition-all shadow-sm">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(proj._id, proj.title)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-2xl transition-all shadow-sm">
                            <Trash2 size={18} />
                          </button>
                          {/* <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-colors shadow-xl">
                            ENTER HUB
                          </button> */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 space-y-6 text-slate-300 bg-white rounded-[3rem] border border-slate-100 border-dashed">
                  <Folder size={64} />
                  <p className="text-xl font-black uppercase tracking-widest text-slate-400">No projects indexed</p>
                </div>
              )}
            </div>
          </div>
        </div>
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

function StatusBadge({ status }) {
  const normalized = (status || "inprogress").toLowerCase().replace(/\s+/g, '');
  const config = {
    completed: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500", label: "COMPLETED" },
    inprogress: { bg: "bg-indigo-50 text-indigo-700 border-indigo-100", dot: "bg-indigo-500", label: "IN PROGRESS" },
    pending: { bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500", label: "PENDING" }
  }[normalized] || { bg: "bg-slate-50 text-slate-600 border-slate-100", dot: "bg-slate-400", label: normalized.toUpperCase() };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black tracking-widest ${config.bg}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></div>
      {config.label}
    </div>
  );
}