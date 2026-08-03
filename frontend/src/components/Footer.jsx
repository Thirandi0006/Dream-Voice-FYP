export default function Footer() {
  return (
    <footer style={{ background: '#07071a', borderTop: '1px solid rgba(124,58,237,0.2)' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        {/* Brand */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl text-white font-bold mb-1 ">Dream Voice</h1>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {[
            { label: "Home", href: "#home" },
            { label: "Services", href: "#services" },
            { label: "Pricing", href: "#pricing" },
            { label: "Contact", href: "#about" },
            { label: "Privacy Policy", href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-slate-400 hover:text-violet-400 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex justify-center gap-3">
          {/* Twitter */}
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 transition-all">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5A4.5 4.5 0 0023 3z" /></svg>
          </a>
          {/* Facebook */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 transition-all">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.437 9.877v-6.987H7.897v-2.89h2.54V9.413c0-2.507 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.459h-1.261c-1.243 0-1.63.772-1.63 1.563v1.868h2.777l-.444 2.89h-2.333v6.987C18.343 21.128 22 16.991 22 12z" /></svg>
          </a>
          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 transition-all">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm8.5 1.5h-8.5c-2.348 0-4.25 1.902-4.25 4.25v8.5c0 2.348 1.902 4.25 4.25 4.25h8.5c2.348 0 4.25-1.902 4.25-4.25v-8.5c0-2.348-1.902-4.25-4.25-4.25zm-4.25 3a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 1.5a4 4 0 100 8 4 4 0 000-8zm5-1a1 1 0 110 2 1 1 0 010-2z" /></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
