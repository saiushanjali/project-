import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Activity, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";

function SlaNetwork() {
  const [activeRegion, setActiveRegion] = useState("na");

  const regions = {
    na: {
      name: "West & Central India",
      hubs: [
        { name: "Nhava Sheva Port Hub (JNPT)", status: "Operational", ping: "99.8% SLA", delay: "Normal" },
        { name: "Mumbai Air Cargo Hub (BOM)", status: "Operational", ping: "99.2% SLA", delay: "Normal" },
        { name: "Indore Logistics Park", status: "Operational", ping: "99.6% SLA", delay: "Normal" }
      ],
      avgTransit: "1.2 Days",
      activeLanes: "1,850 Lanes"
    },
    eu: {
      name: "North India",
      hubs: [
        { name: "Delhi IGI Air Cargo (DEL)", status: "Operational", ping: "99.9% SLA", delay: "Normal" },
        { name: "ICD Dadri Terminal", status: "Operational", ping: "98.7% SLA", delay: "Normal" },
        { name: "Ludhiana Logistics Hub", status: "Operational", ping: "99.5% SLA", delay: "Normal" }
      ],
      avgTransit: "1.5 Days",
      activeLanes: "2,120 Lanes"
    },
    apac: {
      name: "South & East India",
      hubs: [
        { name: "Chennai Port Terminal (MAA)", status: "Operational", ping: "99.1% SLA", delay: "Normal" },
        { name: "Bengaluru Cargo Hub (BLR)", status: "Operational", ping: "99.7% SLA", delay: "Normal" },
        { name: "Kolkata Port Trust (CCU)", status: "Operational", ping: "99.4% SLA", delay: "Normal" }
      ],
      avgTransit: "1.8 Days",
      activeLanes: "3,240 Lanes"
    }
  };

  return (
    <section 
      id="sla" 
      className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / Info Panel */}
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-500 bg-primary-50 dark:bg-primary-950/40 px-3.5 py-1.5 rounded-full border border-primary-200/40 dark:border-primary-800/30">
              Live Network Status
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              National Logistics Infrastructure & SLA
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              We monitor shipping lanes, customs gates, and carrier volumes around the clock. If port congestion spikes, our AI automatically recalculates routes and triggers carrier transfers.
            </p>

            {/* Region Toggles */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 w-fit">
              {Object.entries(regions).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setActiveRegion(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeRegion === key
                      ? "bg-white dark:bg-slate-900 text-primary-600 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>

            {/* SLA Status Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Avg Regional Transit</span>
                <p className="text-2xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
                  {regions[activeRegion].avgTransit}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Active Carrier Lanes</span>
                <p className="text-2xl font-extrabold tracking-tight mt-1 text-primary-600 dark:text-primary-400">
                  {regions[activeRegion].activeLanes}
                </p>
              </div>
            </div>
          </div>

          {/* Right Map/Hub Status Panel */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 relative shadow-inner">
              
              {/* Graphic Ring Visual (pulsating) */}
              <div className="absolute top-6 right-6 flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-200/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                99.64% National SLA Active
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white text-left mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" />
                Network Hub Operations
              </h3>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRegion}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-3.5 text-left"
                  >
                    {regions[activeRegion].hubs.map((hub, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary-400 dark:hover:border-primary-700/65 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* MapPin badge */}
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-primary-500">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{hub.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {hub.status}
                              </span>
                              <span>•</span>
                              <span>Delay: {hub.delay}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 px-2.5 py-1 rounded-lg">
                            {hub.ping}
                          </span>
                          <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-500">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Graphic Lane simulation widget */}
              <div className="mt-8 border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-500">
                    <Globe className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">Optimizing Algorithm</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Predictive Routing v4.1.2</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Updated: <span className="text-slate-800 dark:text-slate-200 font-mono">Just Now</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default SlaNetwork;
