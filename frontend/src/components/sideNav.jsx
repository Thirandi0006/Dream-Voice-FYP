import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Mic2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SideNav({ closeMenu }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Main Dashboard", icon: "📊", sub: "Overview & Analytics" },
    { path: "/dashboard/analysis", label: "Character Analyzer", icon: "🔍", sub: "AI Character Analysis" },
    { path: "/dashboard/compare-voices", label: "Compare Voices", icon: "🎵", sub: "Voice Comparison Tool" },
    { path: "/dashboard/create-project", label: "Create Project", icon: "🚀", sub: "New Project Creation" },
    { path: "/dashboard/media-store", label: "Media Store", icon: "📁", sub: "Media Library" },
    { path: "/dashboard/settings", label: "Settings", icon: "⚙️", sub: "System Configuration" },
  ];

  const isActive = (path) => location.pathname === path;

  // ── Logout: clear entire session then redirect ──
  const handleLogout = () => {
    localStorage.clear();      // wipes all localStorage keys
    sessionStorage.clear();    // wipe session storage too
    navigate("/auth");
  };

  return (
    <nav
      className="w-72 text-white h-full flex flex-col border-r relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0a1a 0%, #0f0f24 60%, #0a0a1a 100%)",
        borderRightColor: "rgba(124,58,237,0.2)",
      }}
    >
      {/* Top violet line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-56 h-56 bg-violet-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Close button (mobile only) ── */}
      <div className="relative z-10 flex items-center justify-between lg:hidden p-5 pb-4 border-b" style={{ borderBottomColor: "rgba(124,58,237,0.15)" }}>
        <BrandLogo />
        <button
          onClick={closeMenu}
          className="p-2 rounded-lg transition-all hover:bg-violet-500/10 group"
        >
          <XMarkIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* ── Desktop header ── */}
      <div className="relative z-10 hidden lg:flex flex-col p-6 pb-5 border-b" style={{ borderBottomColor: "rgba(124,58,237,0.15)" }}>
        <BrandLogo />
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="px-3 py-1.5 rounded-lg border" style={{ background: "rgba(124,58,237,0.08)", borderColor: "rgba(124,58,237,0.2)" }}>
            <span className="text-slate-300">Premium</span>
            <span className="ml-2 text-violet-400 font-medium">Active</span>
          </div>
          <div className="text-slate-500">v2.5.1</div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="relative z-10 flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
          <span className="w-1 h-3.5 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
          Main Navigation
        </p>

        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeMenu}
                  className={`relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group overflow-hidden ${active
                    ? "border-l-[3px] border-violet-500"
                    : "hover:border-l-[3px] border-l-[3px] border-transparent"
                    }`}
                  style={{
                    background: active
                      ? "rgba(124,58,237,0.12)"
                      : undefined,
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = ""; }}
                >
                  <div className="relative flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${active ? "" : ""
                        }`}
                      style={{
                        background: active
                          ? "rgba(124,58,237,0.2)"
                          : "rgba(255,255,255,0.05)",
                      }}
                    >
                      <span className="text-lg leading-none">{item.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-medium text-sm ${active ? "text-white" : "text-slate-300 group-hover:text-white"} transition-colors`}>
                        {item.label}
                      </span>
                      <span className={`text-xs ${active ? "text-violet-300/70" : "text-slate-500 group-hover:text-slate-400"} transition-colors`}>
                        {item.sub}
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon
                    className={`w-4 h-4 transition-all duration-200 ${active ? "text-violet-400 translate-x-0.5" : "text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5"
                      }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-6 px-2 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
      </div>

      {/* ── User Profile Footer ── */}
      <div
        className="relative z-10 p-5 border-t"
        style={{ borderTopColor: "rgba(124,58,237,0.2)", background: "rgba(10,10,26,0.6)" }}
      >
        <div className="flex items-center justify-between gap-3">


          {/* Logout button — clears full session */}
          <button
            onClick={handleLogout}
            title="Log out and clear session"
            className="group flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 border transition-all duration-200 hover:text-white"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.12)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
              e.currentTarget.style.color = "#fca5a5";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "";
            }}
          >
            {/* Logout icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>

        <Link
          to="/support"
          className="mt-3 block text-center text-xs text-slate-600 hover:text-violet-400 transition-colors"
        >
          Need help? Contact support
        </Link>
      </div>
    </nav>
  );
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
        <Mic2 className="text-black" size={20} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Dream Voice</h2>
        <p className="text-[10px] text-slate-500 tracking-wider uppercase">AI Voice Studio</p>
      </div>
    </div>
  );
}