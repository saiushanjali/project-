import { motion } from "framer-motion";
import { Route, Zap, Leaf, FileText, LineChart, Coins } from "lucide-react";

function Features() {
  const featuresList = [
    {
      icon: <Route className="w-6 h-6 text-primary-500" />,
      title: "AI Route Optimization",
      description: "Intelligent pathfinding algorithms dynamically balance cost, carbon, and transit speeds to find the ideal lane combinations."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Instant Quote Engine",
      description: "Get real-time spot rates from over 140 carriers globally in under 5 seconds. No brokers, no haggling, no delay."
    },
    {
      icon: <Leaf className="w-6 h-6 text-emerald-500" />,
      title: "CO₂ Emission Control",
      description: "Full visibility into carbon outputs per transit leg. Meet ESG standards easily by selecting eco-friendly freight offsets."
    },
    {
      icon: <FileText className="w-6 h-6 text-violet-500" />,
      title: "Automated Customs Scan",
      description: "AI-powered documents pre-filing matches local import rules automatically, minimizing compliance latency at shipping hubs."
    },
    {
      icon: <LineChart className="w-6 h-6 text-rose-500" />,
      title: "Carrier Capacity Analytics",
      description: "Real-time spot rate trends tracking and carrier lane utilization forecasting so you can lock in rates before pricing peaks."
    },
    {
      icon: <Coins className="w-6 h-6 text-sky-500" />,
      title: "Smart Audit & Billing",
      description: "Automated bill audits compare delivery timestamps with agreed SLAs, catching invoice overcharges instantly."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section 
      id="features" 
      className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden"
    >
      {/* Background Graphic Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-primary-400/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-500 bg-primary-50 dark:bg-primary-950/40 px-3.5 py-1.5 rounded-full border border-primary-200/40 dark:border-primary-800/30">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-5 text-slate-900 dark:text-white">
            Logistics Management, Re-engineered
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
            FreightIQ moves past simple route listing. We unify intelligence, compliance, and billing audits to give you complete visibility into cargo operations.
          </p>
        </div>

        {/* Feature Grid Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 p-8 shadow-sm hover:shadow-md transition-all group flex flex-col items-start text-left"
            >
              {/* Icon Container */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                {feature.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default Features;