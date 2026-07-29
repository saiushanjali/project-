import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Scale, Package, ShieldAlert, ArrowRight, ArrowLeft, 
  Plane, Ship, Truck, Check, RefreshCw, Leaf, Calculator, CheckCircle2 
} from "lucide-react";

const indianCities = [
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Bengaluru, Karnataka",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Kochi, Kerala"
];

function QuoteForm() {
  // Calculator States: 'form' | 'loading' | 'results' | 'booked'
  const [step, setStep] = useState("form");
  const [loadingPhase, setLoadingPhase] = useState(0);
  
  // Form values
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState(1250);
  const [cargoType, setCargoType] = useState("General");
  const [volume, setVolume] = useState(4.2);

  // Results State
  const [selectedOption, setSelectedOption] = useState("optimal");
  const [calculatedQuotes, setCalculatedQuotes] = useState({});

  // Compute the final prices dynamically based on user inputs
  const calculateRates = useCallback(() => {
    const w = parseFloat(weight) || 100;
    const v = parseFloat(volume) || 1;
    
    // Cargo type pricing modifier
    let multiplier = 1.0;
    if (cargoType === "Perishable") multiplier = 1.25;
    if (cargoType === "Fragile") multiplier = 1.4;
    if (cargoType === "Hazardous") multiplier = 1.75;

    // Base quotes calculation
    const expressCost = Math.round((w * 5.4 + v * 85 + 250) * multiplier);
    const optimalCost = Math.round((w * 2.6 + v * 40 + 150) * multiplier);
    const ecoCost = Math.round((w * 0.95 + v * 15 + 95) * multiplier);

    setCalculatedQuotes({
      express: {
        id: "express",
        name: "Express Priority",
        icon: <Plane className="w-5 h-5" />,
        mode: "Air Freight",
        cost: expressCost,
        eta: "2 - 3 Days",
        reliability: "99.1%",
        co2: Math.round(w * 0.0028 * 100) / 100, // tons of CO2
        features: ["Direct flights", "Priority customs", "Full value insurance"],
        popular: false,
      },
      optimal: {
        id: "optimal",
        name: "Smart Multi-Modal",
        icon: <Truck className="w-5 h-5" />,
        mode: "Air + Road Combined",
        cost: optimalCost,
        eta: "5 - 7 Days",
        reliability: "96.4%",
        co2: Math.round(w * 0.0009 * 100) / 100,
        features: ["Optimized hubs", "Standard customs", "GPS tracking"],
        popular: true,
      },
      eco: {
        id: "eco",
        name: "Eco Ocean Saver",
        icon: <Ship className="w-5 h-5" />,
        mode: "Ocean + Rail",
        cost: ecoCost,
        eta: "18 - 22 Days",
        reliability: "91.8%",
        co2: Math.round(w * 0.00015 * 100) / 100,
        features: ["Lowest pricing", "Minimized carbon footprint", "Rail connection"],
        popular: false,
      }
    });
  }, [weight, volume, cargoType]);

  // Loading animation simulation
  useEffect(() => {
    if (step !== "loading") return;
    
    setLoadingPhase(0);
    const timers = [
      setTimeout(() => setLoadingPhase(1), 1200),
      setTimeout(() => setLoadingPhase(2), 2400),
      setTimeout(() => {
        calculateRates();
        setStep("results");
      }, 3600)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [step, calculateRates]);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!origin || !destination || weight <= 0) return;
    setStep("loading");
  };

  const handleBook = () => {
    setStep("booked");
  };

  const resetForm = () => {
    setStep("form");
    setSelectedOption("optimal");
  };

  // Phase labels for the AI loading screen
  const loadingPhases = [
    { title: "Querying Global Carrier Networks", desc: "Analyzing spot rates from 140+ sea and air partners" },
    { title: "Simulating Route Lane Performance", desc: "Modeling weather patterns, customs queues & modal handoffs" },
    { title: "Optimizing Financial Layout", desc: "Applying cargo risk mitigation & carbon offsets" }
  ];

  return (
    <div 
      id="quote-section"
      className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden text-slate-800 dark:text-slate-100 transition-all duration-300"
    >
      <AnimatePresence mode="wait">
        
        {/* Step 1: Input Form */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-bold tracking-tight">AI Route & Quote Engine</h2>
            </div>
            
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Origin */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Origin</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                      className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all appearance-none cursor-pointer ${
                        origin === "" ? "text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      <option value="" disabled className="text-slate-400">Select Origin</option>
                      {indianCities.map((city) => (
                        <option 
                          key={city} 
                          value={city} 
                          disabled={city === destination}
                          className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950"
                        >
                          {city}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-4.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400" />
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all appearance-none cursor-pointer ${
                        destination === "" ? "text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      <option value="" disabled className="text-slate-400">Select Destination</option>
                      {indianCities.map((city) => (
                        <option 
                          key={city} 
                          value={city} 
                          disabled={city === origin}
                          className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950"
                        >
                          {city}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-4.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Weight */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Weight (Kg)</label>
                  <div className="relative">
                    <Scale className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      required
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Volume */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Volume (m³)</label>
                  <div className="relative">
                    <Package className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="Volume"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Cargo Type */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cargo Classification</label>
                <div className="relative">
                  <Package className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <select
                    value={cargoType}
                    onChange={(e) => setCargoType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="General">General Goods (No Special Handling)</option>
                    <option value="Perishable">Perishable (Cold Chain Required)</option>
                    <option value="Fragile">Fragile Goods (High Care Protection)</option>
                    <option value="Hazardous">Hazardous / ADR (Restricted Classification)</option>
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400" />
                </div>
              </div>

              {/* Alert notice for Hazardous classification */}
              {cargoType === "Hazardous" && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl flex gap-2.5 items-start text-xs text-amber-700 dark:text-amber-300">
                  <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                  <span>Hazardous cargo generates safety surcharges and requires local compliance document checks.</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                Optimize Route & Generate Rate
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 2: Simulated AI Loader */}
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[420px] text-center"
          >
            {/* Spinning Radar Icon */}
            <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary-500/10 border-t-primary-500 animate-spin" />
              <RefreshCw className="w-8 h-8 text-primary-500 animate-pulse" />
            </div>

            {/* Simulated Phases Details */}
            <div className="max-w-xs space-y-3">
              <span className="text-[10px] tracking-wider uppercase font-bold text-primary-500">
                Phase {loadingPhase + 1} of 3
              </span>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {loadingPhases[loadingPhase].title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {loadingPhases[loadingPhase].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Fake progress dots */}
            <div className="flex gap-2.5 mt-8">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === loadingPhase 
                      ? "bg-primary-500 scale-125" 
                      : idx < loadingPhase 
                        ? "bg-primary-300" 
                        : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Interactive Results */}
        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 sm:p-8"
          >
            {/* Header Route Details */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800/80 pb-5 mb-5">
              <div>
                <button
                  onClick={resetForm}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 mb-2 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Edit
                </button>
                <h3 className="text-lg font-bold leading-tight">AI Optimized Lane Pricing</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Route: <strong className="text-slate-700 dark:text-slate-300">{origin}</strong> to <strong className="text-slate-700 dark:text-slate-300">{destination}</strong> ({weight}kg)
                </p>
              </div>
              <div className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/30 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Optimal Found
              </div>
            </div>

            {/* List of Quotes Option Cards */}
            <div className="space-y-3.5">
              {Object.values(calculatedQuotes).map((quote) => {
                const isSelected = selectedOption === quote.id;
                return (
                  <div
                    key={quote.id}
                    onClick={() => setSelectedOption(quote.id)}
                    className={`relative p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 hover:shadow-md ${
                      isSelected
                        ? "bg-slate-50 dark:bg-slate-900 border-primary-500 ring-1 ring-primary-500/50"
                        : "bg-white dark:bg-slate-950 border-slate-200/80 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {quote.popular && (
                      <div className="absolute -top-2 right-4 bg-primary-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Recommended
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Mode Icon Box */}
                      <div className={`p-3 rounded-xl ${
                        isSelected 
                          ? "bg-primary-600 text-white shadow-md shadow-primary-500/10" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}>
                        {quote.icon}
                      </div>

                      {/* Info columns */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-sm font-bold truncate pr-2">{quote.name}</h4>
                          <span className="text-lg font-extrabold tracking-tight text-primary-600 dark:text-primary-400">
                            ${quote.cost.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                          <span>Mode: {quote.mode}</span>
                          <span>ETA: <strong className="text-slate-800 dark:text-slate-200">{quote.eta}</strong></span>
                        </div>

                        {/* Badges footer */}
                        <div className="flex gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            Confidence: {quote.reliability}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                            <Leaf className="w-3.5 h-3.5 text-emerald-500 mr-0.5" /> {quote.co2} t CO₂
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Extended Details Panel for selected card */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80"
                        >
                          <h5 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                            Package Benefits & Surcharges Included
                          </h5>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {quote.features.map((feat, idx) => (
                              <li key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                <Check className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Action CTA */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3">
              <button
                onClick={resetForm}
                className="w-full sm:w-1/3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
              >
                Reset Router
              </button>
              <button
                onClick={handleBook}
                className="w-full sm:w-2/3 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Book Selected Shipment
                <Check className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Booked Confirmation Overlay */}
        {step === "booked" && (
          <motion.div
            key="booked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 sm:p-12 text-center min-h-[420px] flex flex-col items-center justify-center"
          >
            {/* Animated Success Badge */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mb-6 shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold tracking-tight mb-2">Quote Secured!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
              We have locked in the <strong className="text-slate-700 dark:text-slate-200">{calculatedQuotes[selectedOption]?.name}</strong> rate of <strong className="text-primary-600 dark:text-primary-400">${calculatedQuotes[selectedOption]?.cost.toLocaleString()}</strong> for your shipment from {origin} to {destination}.
            </p>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl w-full max-w-xs mb-8 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Tracking Ref:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">IQ-9828-FLX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Transit Speed:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{calculatedQuotes[selectedOption]?.eta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Est. Emissions:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{calculatedQuotes[selectedOption]?.co2} t CO₂</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={resetForm}
                className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
              >
                New Quote
              </button>
              <button
                onClick={() => {
                  alert("Redirecting to dashboard client registration mockup...");
                  resetForm();
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default QuoteForm;