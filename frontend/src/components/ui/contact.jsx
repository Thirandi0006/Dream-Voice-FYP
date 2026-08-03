export default function Contact() {
  const contactDetails = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: "support@voicecasting.com",
      href: "mailto:support@voicecasting.com",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: "Phone",
      value: "+1 (234) 567-890",
      href: "tel:+1234567890",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Address",
      value: "123 Voice St, Audio City, CA",
      href: null,
    },
  ];

  return (
    <section className="relative bg-[#0a0a1a] py-28 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-800/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/3" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-800/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/3" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest text-violet-400 uppercase mb-4">Contact Us</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Get in <span className="hero-gradient-text">Touch</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Whether you have questions or want to collaborate, we'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — Contact Info */}
          <div className="space-y-8">
            <p className="text-slate-400 leading-relaxed">
              Reach out to our team and we'll get back to you within 24 hours. Our casting specialists are available to help you find the perfect voice for your project.
            </p>

            <div className="space-y-5">
              {contactDetails.map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
                    {href ? (
                      <a href={href} className="text-slate-200 hover:text-violet-400 transition-colors font-medium">
                        {value}
                      </a>
                    ) : (
                      <span className="text-slate-200 font-medium">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links placeholder */}
            <div className="flex gap-3 pt-4">
              {["Twitter", "LinkedIn", "Instagram"].map((s) => (
                <button key={s} className="px-4 py-2 text-xs font-semibold text-slate-400 border border-white/10 rounded-lg hover:border-violet-500/40 hover:text-violet-400 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Contact Form */}
          <form
            className="bg-[#111128] border border-white/5 rounded-2xl p-8 space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm text-slate-400 mb-2 font-medium">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  className="contact-input"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-slate-400 mb-2 font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="contact-input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm text-slate-400 mb-2 font-medium">Subject</label>
              <input
                id="subject"
                type="text"
                className="contact-input"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-slate-400 mb-2 font-medium">Message</label>
              <textarea
                id="message"
                required
                rows="5"
                className="contact-input resize-none"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5"
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
