import { motion } from "framer-motion";
import { ShieldCheck, Zap, Clock, ArrowRight } from "lucide-react";
import QuoteForm from "./QuoteForm";

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const scrollToQuote = () => {
    const el = document.getElementById("quote-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { icon: <Zap className="w-5 h-5 text-primary-400" />, value: "99.4%", label: "On-Time Dispatch" },
    { icon: <Clock className="w-5 h-5 text-primary-400" />, value: "< 5s", label: "Instant Quote SLA" },
    { icon: <ShieldCheck className="w-5 h-5 text-primary-400" />, value: "$450M+", label: "Freight Managed" },
  ];

  return (
    <section
      id="home"
      className="relative bg-slate-950 text-white min-h-screen pt-28 pb-16 flex items-center overflow-hidden bg-grid-pattern-dark"
    >
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Decorative Radial Gradient to mask the grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#020617_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Animated Version Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping" />
              FreightIQ v2.0 - AI Engine Active
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              Intelligent Freight <br />
              <span className="gradient-text-light">Quote Generation</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="text-slate-300 text-base sm:text-lg max-w-xl mb-8 leading-relaxed"
            >
              Get accurate freight rates instantly across roads, rails, skies, and oceans. Optimized routes, dynamic billing simulations, and carbon footprint reduction powered by AI.
            </motion.p>

            {/* CTA and Learn More Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mb-10 w-full sm:w-auto"
            >
              <button
                onClick={scrollToQuote}
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Request Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#features"
                className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold px-8 py-4 rounded-2xl text-center backdrop-blur-sm transition-colors"
              >
                Explore Features
              </a>
            </motion.div>

            {/* Real-time stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-slate-800/80 w-full"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    {stat.icon}
                    <span className="text-xl sm:text-2xl font-bold tracking-tight">{stat.value}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right QuoteForm Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="lg:col-span-5 w-full relative"
          >
            {/* Background design decoration for Quote Form container */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-500 to-blue-600 rounded-3xl blur-xl opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity" />
            <QuoteForm />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;