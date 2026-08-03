export default function Subscriptions() {
  const plans = [
    {
      name: "Basic",
      price: "$60",
      period: "mo",
      features: [
        "Access to voice casting database",
        "Basic voice matching",
        "Email support",
      ],
      popular: false,
      gradient: "from-slate-600 to-slate-700",
      accentColor: "text-slate-300",
    },
    {
      name: "Pro",
      price: "$120",
      period: "mo",
      features: [
        "Everything in Basic",
        "Advanced voice matching algorithms",
        "Cast similarity reports",
      ],
      popular: true,
      gradient: "from-violet-600 to-purple-700",
      accentColor: "text-violet-300",
    },
    {
      name: "Enterprise",
      price: "$210",
      period: "mo",
      features: [
        "All Pro features",
        "Dedicated account manager",
        "Custom integrations",
      ],
      popular: false,
      gradient: "from-cyan-600 to-blue-700",
      accentColor: "text-cyan-300",
    },
  ];

  return (
    <section className="relative bg-[#07071a] py-28 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-700/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">Flexible Pricing</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Choose Your <span className="hero-gradient-text">Plan</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Transparent pricing with no hidden fees. Scale as your casting needs grow.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 items-start">
          {plans.map(({ name, price, period, features, popular, gradient, accentColor }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-2 ${popular
                  ? "bg-gradient-to-br from-violet-500 via-purple-600 to-pink-500 shadow-2xl shadow-violet-500/30"
                  : "bg-gradient-to-br from-white/10 to-white/5"
                }`}
            >
              <div className="relative bg-[#0f0f24] rounded-2xl p-8 h-full flex flex-col space-y-6">
                {/* Popular badge */}
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold tracking-wide shadow-lg">
                    ✦ Most Popular
                  </div>
                )}

                {/* Plan name */}
                <div>
                  <span className={`text-sm font-semibold tracking-widest uppercase ${accentColor}`}>{name}</span>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-white">{price}</span>
                    <span className="text-slate-400 mb-2">/{period}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className={`h-px w-full bg-gradient-to-r ${gradient} opacity-30`} />

                {/* Features */}
                <ul className="flex-1 space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-300 text-sm">
                      <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${accentColor}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${popular
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30"
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                    }`}
                >
                  Get Started with {name}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-10">All plans include a 14-day free trial. No credit card required.</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
    </section>
  );
}
