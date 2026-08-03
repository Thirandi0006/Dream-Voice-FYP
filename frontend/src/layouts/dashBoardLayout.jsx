import { ArrowRightOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideNav from "../components/sideNav";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", subscription: "", role: "User" });
  const navigate = useNavigate();

  const session = JSON.parse(localStorage.getItem("user"));
  const userId = session;

  // Fetch user data from backend
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/user/${userId}`)
        .then(res => {
          const data = res.data;
          setUser({
            name: data.name || "",
            email: data.email || "",
            subscription: data.subscription || "Basic",
            role: "User" // or set dynamically if your API returns a role
          });
        })
        .catch(err => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen">

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 z-50 w-72 h-full transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ background: '#0a0a1a' }}
      >
        <SideNav closeMenu={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-72">

        <header className="flex items-center justify-between px-6 py-4 border-b" style={{ background: 'rgba(10,10,26,0.95)', backdropFilter: 'blur(12px)', borderBottomColor: 'rgba(124,58,237,0.15)' }}>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-violet-500/10 border border-white/5 transition-all lg:hidden">
            <Bars3Icon className="w-6 h-6" />
          </button>


          <div className="flex items-center space-x-6 ml-auto">
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user.name || "User"}</p>
                <p className="text-xs text-violet-400">{user.role}</p>
              </div>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0D8ABC&color=fff&size=40`}
                alt="User avatar"
                className="w-10 h-10 rounded-full border border-violet-500/20"
              />
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <button
              onClick={handleLogout}
              className="group flex flex-col items-center justify-center p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Exit</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-8 py-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
