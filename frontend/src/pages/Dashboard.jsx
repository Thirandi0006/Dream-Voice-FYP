import { useMemo } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart
} from "recharts";
import { 
  Folder, 
  Mic2, 
  CheckCircle2, 
  Activity, 
  Clock, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

import useMediaStore from "../components/hooks/seMediaStore";
import useProjects from "../components/hooks/useProjects";

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];

export default function Dashboard() {
  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;
  const { projects, loading: loadingProjects } = useProjects(userId);
  const { voiceFiles, loadingMedia } = useMediaStore(userId);

  const stats = useMemo(() => ({
    projects: projects.length,
    voiceInputs: voiceFiles.length,
    completed: projects.filter(p => p.status?.toLowerCase() === 'completed').length,
  }), [projects, voiceFiles]);

  const projectStatusData = useMemo(() => {
    const statusCounts = { Completed: 0, "In Progress": 0, Pending: 0 };
    projects.forEach((p) => {
      let status = p.status?.toLowerCase() || "pending";
      if (status === "completed") statusCounts.Completed += 1;
      else if (status === "inprogress") statusCounts["In Progress"] += 1;
      else statusCounts.Pending += 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [projects]);

  const activityData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      voices: Math.floor(Math.random() * 20) + 5,
    }));
  }, []);

  const recentProjects = useMemo(() => projects.slice(-5).reverse(), [projects]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-900 rounded-3xl text-white shadow-xl">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                System <span className="text-primary italic">Overview</span>
              </h1>
              <p className="text-slate-500 font-medium">Real-time intelligence and project synchronization.</p>
            </div>
          </div>
          {/* <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm"> */}
            {/* <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active System</p>
              <p className="font-bold text-slate-700">Vocal Analysis Engine v2.0</p>
            </div> */}
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          {/* </div> */}
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <StatCard 
            title="Total Projects"
            value={stats.projects}
            icon={<Folder size={24} />}
            color="indigo"
            description="Active working sets"
            loading={loadingProjects}
          />
          <StatCard 
            title="Voice Samples"
            value={stats.voiceInputs}
            icon={<Mic2 size={24} />}
            color="emerald"
            description="Analyzed audio nodes"
            loading={loadingMedia}
          />
          <StatCard 
            title="Finalized"
            value={stats.completed}
            icon={<CheckCircle2 size={24} />}
            color="purple"
            description="Completed performances"
            loading={loadingProjects}
          />
        </section>

        {/* Analysis Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          {/* Growth Trend */}
          <div className="lg:col-span-2 card-premium p-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-slate-800">System Activity</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Weekly Processing Volume</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                <TrendingUp size={16} className="text-primary" />
                <span className="text-sm font-black text-slate-600">+24% Increase</span>
              </div>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorVoices" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="voices" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorVoices)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Distribution */}
          <div className="card-premium p-8">
            <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-800">Distribution</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Lifecycle Status</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full space-y-3 mt-6">
                {projectStatusData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-colors hover:bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                      <span className="text-sm font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <section className="card-premium overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recent Archives</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Latest Intelligence Operations</p>
            </div>
            <button className="btn-secondary text-xs px-6 py-2.5">
              Access Full Archives
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Descriptor</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Index Code</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Synchronization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentProjects.map((project) => (
                  <tr key={project._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                          <Activity size={18} className="text-primary" />
                        </div>
                        <span className="font-black text-slate-800">{project.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500">
                        {project._id.slice(-8).toUpperCase()}
                      </code>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="inline-flex items-center gap-2 text-xs font-black text-primary hover:text-indigo-700 transition-colors">
                        OPEN INTELLIGENCE
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {recentProjects.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Clock size={48} className="text-slate-200" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No synchronized archives found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, description, loading }) {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-100',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-100',
    purple: 'from-purple-500 to-purple-600 shadow-purple-100',
  };

  return (
    <div className="card-premium p-8 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorMap[color]} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : color === 'emerald' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-600'}`}>
              {icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
          </div>
          
          {loading ? (
            <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-2xl"></div>
          ) : (
            <div className="space-y-1">
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{value.toLocaleString()}</p>
              <p className="text-xs font-bold text-slate-400">{description}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-700">ONLINE</span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || "pending").toLowerCase().replace(/\s+/g, '');
  const config = {
    completed: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dot: "bg-emerald-500",
      label: "COMPLETED"
    },
    inprogress: {
      bg: "bg-indigo-50 text-indigo-700 border-indigo-100",
      dot: "bg-indigo-500",
      label: "IN PROGRESS"
    },
    pending: {
      bg: "bg-amber-50 text-amber-700 border-amber-100",
      dot: "bg-amber-500",
      label: "PENDING"
    }
  }[normalized] || {
    bg: "bg-slate-50 text-slate-600 border-slate-100",
    dot: "bg-slate-400",
    label: normalized.toUpperCase()
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black tracking-widest ${config.bg}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></div>
      {config.label}
    </div>
  );
}