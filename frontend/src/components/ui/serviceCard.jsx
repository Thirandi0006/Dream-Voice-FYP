export default function Services() {
  const services = [
    {
      title: "Voice Sample Matching",
      description:
        "AI-powered system that intelligently matches voice samples to specific character profiles with unprecedented accuracy.",
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/20",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      title: "Character Evaluation",
      description:
        "Evaluate commercial and film character traits from text or image input, matched against historical talent performance data.",
      gradient: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/20",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Data-driven Suggestions",
      description:
        "Intelligent similarity scores and data-driven casting recommendations that support confident, informed decisions.",
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/20",
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative bg-[#0a0a1a] py-28 px-6 overflow-hidden">
      {/* Section background accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest text-violet-400 uppercase mb-4">What We Offer</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Our <span className="hero-gradient-text">Services</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Cutting-edge tools designed to revolutionize how you discover and cast voice talent.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
          {services.map(({ title, description, icon, gradient, glow }) => (
            <div
              key={title}
              className={`service-card group relative bg-[#111128] border border-white/5 rounded-2xl p-8 flex flex-col space-y-5 hover:border-white/15 transition-all duration-300 shadow-xl ${glow} hover:shadow-2xl`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                {icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white">{title}</h3>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed flex-1">{description}</p>

              {/* Learn More link */}
              <button className={`service-learn-more bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-semibold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                Learn More
                <svg className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
    </section>
  );
}
