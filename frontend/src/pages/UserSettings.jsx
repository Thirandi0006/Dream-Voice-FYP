import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, 
  Mail, 
  Lock, 
  ShieldAlert, 
  Save, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Settings,
  Bell
} from "lucide-react";

export default function UserSettings() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    subscription: "Basic"
  });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/user/${userId}`)
        .then(res => {
          const data = res.data;
          setUser({
            name: data.name || "",
            email: data.email || "",
            password: "",
            subscription: data.subscription || "Basic"
          });
        })
        .catch(err => showNotification("Failed to fetch account metadata.", "error"));
    }
  }, [userId]);

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const updateDetails = () => {
    if (!user.name.trim() || !user.email.trim() || !user.password.trim()) {
      showNotification("All security fields required.", "error");
      return;
    }
    axios.put(`http://localhost:5000/user/${userId}`, user)
      .then(() => showNotification("Profile parameters updated.", "success"))
      .catch(() => showNotification("Update synchronization failed.", "error"));
  };

  const deleteAccount = () => {
    axios.delete(`http://localhost:5000/user/${userId}`)
      .then(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        showNotification("Account purged successfully.", "success");
        window.location.href = "/auth";
      })
      .catch(() => showNotification("Purge operation failed.", "error"));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-4 animate-fade-in">
          <div className="p-4 bg-slate-900 rounded-3xl text-white shadow-xl">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Account <span className="text-primary italic">Security</span>
            </h1>
            <p className="text-slate-500 font-medium">Manage your identity and authentication parameters.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Navigation Sidebar */}
         

          {/* Settings Form */}
          <div className="md:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-premium p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Identity Parameters</h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      name="name"
                      type="text"
                      value={user.name}
                      onChange={handleChange}
                      className="input-premium pl-12 h-12 font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Electronic Mail</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={handleChange}
                      className="input-premium pl-12 h-12 font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Authentication Credential</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      name="password"
                      type="password"
                      value={user.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters required"
                      className="input-premium pl-12 h-12 font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <button onClick={updateDetails} className="btn-primary flex-1 py-4 uppercase tracking-[0.2em] text-xs">
                    <Save size={16} />
                    Deploy Changes
                  </button>
                  <button onClick={() => setShowDeleteConfirm(true)} className="btn-secondary text-rose-600 border-rose-100 hover:bg-rose-50 px-8 uppercase tracking-[0.2em] text-xs">
                    <Trash2 size={16} />
                    Purge Account
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                <ShieldAlert size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Security Notice</p>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">Updating your authentication credentials will invalidate all active sessions across other devices. Ensure your backup recovery methods are active.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 space-y-8 animate-slide-up">
            <div className="text-center space-y-4">
              <div className="inline-flex p-6 bg-rose-50 text-rose-600 rounded-[2rem]">
                <ShieldAlert size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Confirm Purge?</h3>
              <p className="text-slate-500 font-medium">All associated vocal assets, neural profiles, and synchronized project metadata will be permanently deleted from our archives.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button onClick={deleteAccount} className="btn-primary bg-rose-600 hover:bg-rose-700 border-rose-500 shadow-rose-200 py-4 font-black">
                PROCEED WITH PURGE
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary py-4 font-black">
                ABORT OPERATION
              </button>
            </div>
          </div>
        </div>
      )}

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
