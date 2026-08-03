import Contact from "../components/ui/contact";
import Services from "../components/ui/serviceCard";
import Subscriptions from "../components/ui/subscriptions";
import { 
  ArrowRight, 
  Play, 
  Mic2, 
  ChevronDown, 
  Sparkles,
  Zap,
  Shield
} from "lucide-react";

export default function Home() {
  return (
    <div id="home" className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20">
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[160px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-20%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        </div>

        {/* Floating Badge */}
        <div className="relative z-10 mt-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in">
          <Sparkles className="text-indigo-400" size={16} />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Next-Gen Vocal Intelligence</span>
        </div>

        {/* Main Headline */}
        <h1 className="relative z-10 text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8 animate-slide-up">
          REIMAGINE<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-emerald-400 italic">VOCAL CASTING</span>
        </h1>

        {/* Subtext */}
        <p className="relative z-10 text-lg md:text-xl text-slate-400 max-w-2xl mb-12 font-medium leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Harnessing advanced acoustic neural networks to synchronize the perfect voice talent with your character's emotional core.
        </p>

        {/* CTA Matrix */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button onClick={() => window.location.href='/auth'} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
              INITIALIZE PLATFORM
              <ArrowRight size={18} />
            </div>
          </button>
          
          <button 
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 backdrop-blur-md"
          >
            <Play size={18} className="fill-current" />
            EXPLORE SERVICES
          </button>
        </div>

        {/* Performance Metrics */}
        <div className="relative z-10 mt-24 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {[
            { value: "10K+", label: "Vocal Nodes", icon: <Mic2 size={20} /> },
            { value: "500+", label: "Neural Projects", icon: <Zap size={20} /> },
            { value: "99.8%", label: "Match Index", icon: <Shield size={20} /> },
          ].map(({ value, label, icon }) => (
            <div key={label} className="text-center group">
              <div className="inline-flex p-3 bg-white/5 rounded-2xl border border-white/5 mb-4 group-hover:text-indigo-400 transition-colors">
                {icon}
              </div>
              <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>

        {/* Scroll Anchor */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Downstream</span>
          <ChevronDown className="text-slate-700" size={20} />
        </div>
      </section>

      {/* Section Dividers */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>

      {/* Services Context */}
      <div id="services">
        <Services />
      </div>

      {/* Pricing Matrix */}
      <div id="pricing">
        <Subscriptions />
      </div>

      {/* Terminal Contact */}
      <div id="about">
        <Contact />
      </div>
    </div>
  );
}
