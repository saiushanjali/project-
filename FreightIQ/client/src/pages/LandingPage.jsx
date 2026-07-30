import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  BarChart3, 
  Map, 
  Globe2, 
  Leaf, 
  ArrowRight, 
  CheckCircle,
  Truck,
  Sparkles,
  MessageSquare,
  Mail,
  Send,
  Building,
  User,
  ExternalLink
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import QuoteForm from '../components/QuoteForm'
import heroImage from '../assets/hero.png'

// Animated Counter Component using Intersection Observer (via useInView)
function Counter({ value, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    // Extract numerical value
    const end = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(end)) return

    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress)
      const currentVal = start + easeProgress * (end - start)
      
      if (value.includes('.')) {
        setCount(parseFloat(currentVal.toFixed(1)))
      } else {
        setCount(Math.floor(currentVal))
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

const features = [
  {
    icon: Map,
    title: 'AI Route Optimization',
    description: 'Neural networks compute multi-modal corridors, routing past congestion and weather in real-time.',
    glow: 'from-blue-500/10 to-indigo-500/10',
  },
  {
    icon: Zap,
    title: 'Instant Rate Engine',
    description: 'Algorithmic calculations compare ocean, air, rail, and road pricing variables in under two seconds.',
    glow: 'from-accent-500/10 to-blue-500/10',
  },
  {
    icon: BarChart3,
    title: 'Dynamic Spot Pricing',
    description: 'Integrates real-time freight capacity data and diesel price trackers to offer optimal quotes.',
    glow: 'from-purple-500/10 to-pink-500/10',
  },
  {
    icon: Globe2,
    title: 'Multi-modal Dispatch',
    description: 'Easily bundle ocean shipping, domestic trucking, rail freight, and express air delivery into one lane.',
    glow: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    icon: Leaf,
    title: 'Carbon-Aware Planning',
    description: 'Recommends alternative low-carbon routes and fuel blends to meet company corporate ESG standards.',
    glow: 'from-green-500/10 to-emerald-500/10',
  },
  {
    icon: Shield,
    title: 'Smart Escrow & Security',
    description: 'Logistics cargo contracts are verified dynamically, providing maximum reliability for high-value freight.',
    glow: 'from-orange-500/10 to-amber-500/10',
  },
]

const steps = [
  {
    step: '01',
    title: 'Input Parameters',
    description: 'Specify freight origin, destination ports, exact weight, and cargo classification type.',
  },
  {
    step: '02',
    title: 'AI Neural Matching',
    description: 'FreightIQ algorithms scour thousands of multi-modal routes to optimize cost and time grids.',
  },
  {
    step: '03',
    title: 'Select Quote Option',
    description: 'Compare shipping durations, carbon emission scores, and calculated cost breakdowns side-by-side.',
  },
  {
    step: '04',
    title: 'Instant Dispatch Booking',
    description: 'Confirm and secure your optimized booking, instantly generating digital cargo manifests and tracking IDs.',
  },
]

const stats = [
  { value: '5', suffix: 'M+', label: 'Annual Shipments Routed' },
  { value: '99.8', suffix: '%', label: 'On-Time Dispatch Rate' },
  { value: '20', suffix: 'M+', prefix: '$', label: 'Client Logistics Fees Saved' },
  { value: '45', suffix: '%', label: 'Carbon Emissions Reduction' },
]

export default function LandingPage() {
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setContactSubmitted(true)
    setTimeout(() => {
      setContactSubmitted(false)
      e.target.reset()
    }, 3000)
  }

  const scrollToQuote = (e) => {
    e.preventDefault()
    const el = document.querySelector('#quote-generator')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToFeatures = (e) => {
    e.preventDefault()
    const el = document.querySelector('#features')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden">
        {/* Colorful Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 gradient-primary opacity-10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent-550/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> FREIGHTIQ V2.0 - AI ENGINE ACTIVE
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900"
              >
                Intelligent Freight <br />
                Quote Generation
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-655 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                Get accurate freight rates instantly across roads, rails, skies, and oceans. Optimized routes, dynamic billing simulations, and carbon footprint reduction powered by AI.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <a
                  href="#quote-generator"
                  onClick={scrollToQuote}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl gradient-primary text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Request Quote <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#features"
                  onClick={scrollToFeatures}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-slate-200 hover:border-slate-350 bg-white text-slate-750 hover:text-slate-900 font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                >
                  Explore Features
                </a>
              </motion.div>

              {/* Stats Counters Grid (Horizontal Row) */}
              <div className="pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-12">
                <div className="flex flex-col">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5 justify-center lg:justify-start">
                    <span className="text-blue-500 text-lg">⚡</span> 99.4%
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">On-Time Dispatch</span>
                </div>
                
                <div className="flex flex-col">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5 justify-center lg:justify-start">
                    <span className="text-blue-500 text-lg">🕒</span> &lt; 5s
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Instant Quote SLA</span>
                </div>

                <div className="flex flex-col">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5 justify-center lg:justify-start">
                    <span className="text-blue-500 text-lg">🛡️</span> ₹3,500Cr+
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Freight Managed</span>
                </div>
              </div>
            </div>

            {/* Right Side: Embedded Quote Engine Card */}
            <div id="quote-generator" className="lg:col-span-5 relative w-full">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative border-t border-slate-200/60 bg-white">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent-600/5 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-200 uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              AI-Optimized Logistics Platform
            </h2>
            <p className="text-slate-650 mt-3 text-sm sm:text-base leading-relaxed">
              We leverage cloud telemetry, weather data, and predictive algorithms to give your logistics team unfair efficiency advantages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card rounded-2xl p-6 relative group overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Backdrop Glow effect */}
                  <div className={`absolute -right-16 -bottom-16 w-32 h-32 bg-gradient-to-tr ${feature.glow} opacity-0 group-hover:opacity-100 blur-2xl rounded-full transition-all duration-500`} />

                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-6 text-white shadow-md shadow-accent-500/10 group-hover:shadow-accent-500/25 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-555 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="about" className="py-24 bg-slate-50 border-t border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 text-xs font-semibold text-blue-650 bg-blue-50 rounded-full border border-blue-200 uppercase tracking-widest">
              Operation Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              How FreightIQ Streamlines Shipping
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Achieve digital freight optimization in four animated system steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative group p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow transition-all duration-300"
              >
                {/* Visual line between steps */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 left-[90%] w-[35%] h-[1px] bg-gradient-to-r from-blue-500/20 to-transparent z-0 pointer-events-none" />
                )}

                <div className="relative z-10">
                  <span className="text-4xl font-extrabold gradient-text opacity-40 group-hover:opacity-100 transition-opacity duration-300 block mb-4">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-555 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics / Counters Section */}
      <section className="py-20 border-t border-slate-200/60 relative overflow-hidden bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] gradient-primary opacity-5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ type: 'spring', stiffness: 80, delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center border border-slate-100 relative group hover:border-blue-500/20 transition-all duration-300 shadow-sm"
              >
                <p className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
                  {stat.label}
                </p>
                <div className="text-3xl sm:text-5xl font-black text-slate-900 flex items-center justify-center gap-0.5">
                  {stat.prefix && <span className="text-blue-600">{stat.prefix}</span>}
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-blue-650 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Conversion Banner */}
      <section className="py-16 md:py-20 border-t border-slate-200/60 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl gradient-primary p-8 md:p-12 text-center overflow-hidden shadow-2xl shadow-blue-500/15"
          >
            {/* Decorative glows */}
            <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-3xl pointer-events-none rounded-full" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to Revolutionize Your Supply Chain?
              </h2>
              <p className="text-blue-50 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Join hundreds of enterprise shippers utilizing FreightIQ to calculate shipping lanes, reduce diesel costs, and optimize routing matrices automatically.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 font-bold rounded-2xl shadow-lg hover:shadow-white/20 active:scale-95 transition-all inline-flex items-center justify-center gap-1.5"
                >
                  Create Free Account <ExternalLink className="w-4 h-4 text-slate-900" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 bg-black/15 text-white border border-white/25 hover:bg-black/25 font-bold rounded-2xl active:scale-95 transition-all inline-flex items-center justify-center"
                >
                  Client Portal Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Contact Section */}
      <section id="contact" className="py-20 border-t border-slate-200/60 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left info column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-200 uppercase tracking-widest">
                Support & Contact
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Get in Touch with our Logistics Experts
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Have custom enterprise configuration queries or API integration questions? Fill out the contact ticket, and our team will respond within 4 hours.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500 shrink-0 border border-slate-200">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">HQ Operations</h4>
                    <p className="text-slate-500 text-xs mt-0.5">100 Innovation Way, Suite 400, Boston, MA</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500 shrink-0 border border-slate-200">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Live Support</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Monday – Friday, 8am – 8pm EST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 relative shadow-md">
                
                {contactSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Message Sent Successfully!</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      Thank you for contacting FreightIQ. A logistics technician has received your ticket and will reach out shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-slate-700 font-medium text-xs mb-1.5" htmlFor="contact-name">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <input
                            id="contact-name"
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-medium text-xs mb-1.5" htmlFor="contact-email">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <input
                            id="contact-email"
                            required
                            type="email"
                            placeholder="john@company.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium text-xs mb-1.5" htmlFor="contact-subject">
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        required
                        type="text"
                        placeholder="Enterprise pricing, API integration query..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium text-xs mb-1.5" htmlFor="contact-message">
                        Message Content
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows="4"
                        placeholder="How can we help optimize your shipment routing?"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl gradient-primary text-white font-bold text-xs hover:shadow-lg hover:shadow-accent-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Send Message <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
