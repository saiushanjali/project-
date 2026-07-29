import { useState } from "react";
import { Ship, Send, Globe, Mail } from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const footerLinks = {
    Product: ["AI Pricing", "Multi-modal Routing", "Carbon Offset Tracker", "API Integration", "SaaS Pricing"],
    Solutions: ["Enterprise Supply Chain", "eCommerce Shipments", "Hazardous Logistics", "Cold Chain Logistics"],
    Resources: ["Carrier API Documentation", "Industry Whitepapers", "Logistics Insights Blog", "Freight Rate Trends"],
    Company: ["About Us", "Carrier Network Partners", "Sustainability Mission", "Press & News", "Contact support"]
  };

  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-500 py-16 sm:py-24 relative overflow-hidden bg-grid-pattern">
      {/* Background visual flair */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 pb-16 border-b border-slate-200">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-2 rounded-xl">
                <Ship className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Freight<span className="text-primary-500">IQ</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Next-generation freight calculation & route optimization platform. Empowering modern supply chains with instant spot rates, automated customs auditing, and lower carbon outputs.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors" aria-label="Globe">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columns 2-5: Dynamic Links */}
          {Object.entries(footerLinks).map(([category, links], idx) => (
            <div key={idx} className="space-y-4 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {category}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href="#" className="hover:text-primary-600 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Panel: Newsletter & Legal */}
        <div className="pt-12 flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
          
          {/* Newsletter subscription form */}
          <div className="space-y-3.5 max-w-md text-left">
            <h4 className="text-sm font-bold text-slate-800">Subscribe to Rate Sheet Alerts</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get weekly updates on shipping trends, custom regulations adjustments, and fuel index changes directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 relative max-w-sm">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-450" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:border-primary-500 focus:outline-none transition-colors text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {subscribed ? "Saved" : "Subscribe"}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] font-semibold text-emerald-500">
                Success! You are now subscribed to spot-rate digests.
              </p>
            )}
          </div>

          {/* Copyrights and Terms */}
          <div className="flex flex-col sm:flex-row gap-6 text-xs text-slate-400 items-start lg:items-end justify-end">
            <div>
              <p>© 2026 FreightIQ. All Rights Reserved.</p>
              <p className="mt-1">Built with intelligent predictive algorithms & secure ledger integrations.</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
              <span className="text-slate-350">|</span>
              <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
              <span className="text-slate-350">|</span>
              <a href="#" className="hover:text-slate-800 transition-colors">GDPR SLA</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;