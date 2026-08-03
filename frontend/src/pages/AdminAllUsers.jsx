import React, { useEffect, useState } from "react";
import { 
  Search, 
  UserCheck, 
  UserX, 
  Trash2, 
  Users, 
  ShieldCheck, 
  Filter, 
  Download, 
  MoreVertical, 
  Activity, 
  BarChart3,
  Lock,
  Unlock,
  ChevronRight,
  LogOut
} from "lucide-react";

export default function AdminAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/user");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/user/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchUsers();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently revoke user access and purge data?")) return;
    try {
      await fetch(`http://localhost:5000/user/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || (user.status || "active") === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => (u.status || "active") === "active").length,
    hold: users.filter(u => u.status === "hold").length,
  };


  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.clear();

  window.location.href = "/"; // or use navigate("/")
};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Synchronizing Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-900 rounded-3xl text-white shadow-xl">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                Access <span className="text-primary italic">Controller</span>
              </h1>
              <p className="text-slate-500 font-medium">Administrator portal for user orchestration and system governance.</p>
            </div>
          </div>
       <div className="flex gap-4">
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
  >
    <LogOut size={18} />
    LOG OUT
  </button>
</div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <AdminStatCard title="Total Population" value={stats.total} icon={<Users size={24} />} color="indigo" />
          <AdminStatCard title="Authorized" value={stats.active} icon={<UserCheck size={24} />} color="emerald" />
          <AdminStatCard title="Restricted" value={stats.hold} icon={<Lock size={24} />} color="rose" />
        </section>

        {/* Toolbar */}
        <section className="flex flex-col md:flex-row gap-4 animate-fade-in">
          <div className="flex-1 relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by identity or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pl-14 h-14 font-bold text-slate-700 shadow-sm"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Filter size={18} />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-premium pl-12 pr-10 h-14 font-bold text-slate-700 appearance-none bg-white shadow-sm"
              >
                <option value="all">ALL DEPLOYMENTS</option>
                <option value="active">AUTHORIZED ONLY</option>
                <option value="hold">RESTRICTED ONLY</option>
              </select>
            </div>
          </div>
        </section>

        {/* Users Table */}
        <section className="card-premium overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tier</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Authorization</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user, idx) => (
                  <tr key={user._id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-black text-slate-800 block">{user.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user._id.slice(-8).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{user.email}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border ${
                        user.subscription === "Premium" ? "bg-purple-50 text-purple-700 border-purple-100" :
                        user.subscription === "Pro" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                        "bg-slate-50 text-slate-600 border-slate-100"
                      }`}>
                        {user.subscription?.toUpperCase() || "STANDARD"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => updateStatus(user._id, (user.status || "active") === "active" ? "hold" : "active")}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black tracking-widest transition-all ${
                          (user.status || "active") === "active" ? 
                          "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" : 
                          "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100"
                        }`}
                      >
                        {(user.status || "active") === "active" ? <Unlock size={12} /> : <Lock size={12} />}
                        {(user.status || "active")?.toUpperCase()}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => deleteUser(user._id)}
                        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-2xl transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 space-y-6 text-slate-300">
              <UserX size={64} />
              <p className="text-xl font-black uppercase tracking-widest text-slate-400">Registry query yielded zero results</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon, color }) {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-100',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-100',
    rose: 'from-rose-500 to-rose-600 shadow-rose-100',
  };

  return (
    <div className="card-premium p-8 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorMap[color]} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="flex items-center gap-6 relative z-10">
        <div className={`p-4 rounded-[2rem] shadow-xl text-white bg-gradient-to-br ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{title}</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}