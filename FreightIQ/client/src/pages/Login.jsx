import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      alert('Please fill out all fields.')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      localStorage.setItem('token', 'mock-jwt-token')
      localStorage.setItem('userEmail', formData.email)
      
      const registeredStr = localStorage.getItem('registeredUser')
      let foundName = ''
      if (registeredStr) {
        try {
          const registered = JSON.parse(registeredStr)
          if (registered.email.toLowerCase() === formData.email.toLowerCase()) {
            foundName = registered.fullName
          }
        } catch (e) {
          console.error(e)
        }
      }
      
      if (!foundName) {
        const localPart = formData.email.split('@')[0]
        foundName = localPart
          .split(/[\._\-+]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ')
      }
      
      localStorage.setItem('userName', foundName || 'Agent')

      setTimeout(() => {
        // Redirect to dashboard (simulated login)
        navigate('/dashboard')
      }, 1500)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row relative overflow-hidden text-slate-800">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

      {/* Left side: Premium branding & features column (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative gradient-primary items-center justify-center p-12 overflow-hidden border-r border-slate-200">
        {/* Abstract vector overlay */}
        <div className="absolute inset-0 bg-navy-950/10 backdrop-blur-[1px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-400/20 blur-3xl rounded-full" />

        <div className="max-w-md relative z-10 space-y-12">
          {/* Logo link */}
          <Link to="/" className="inline-flex items-center gap-2.5 group w-fit">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/15">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Freight<span className="text-blue-100">IQ</span>
              </span>
              <p className="text-[10px] text-blue-200 -mt-1 font-semibold tracking-wider uppercase">
                Intelligence
              </p>
            </div>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Enterprise Grade Logistics Management
            </h1>
            <p className="text-blue-100 text-base leading-relaxed">
              Log in to access your shipping lanes dashboard, generate AI load estimates, and monitor real-time carbon offsets.
            </p>
          </div>

          {/* Quick value cards */}
          <div className="space-y-4">
            {[
              { title: 'Optimized Routing Protocols', desc: 'Predictive neural calculations bypass weather bottlenecks.' },
              { title: 'Secure Auditable Ledgers', desc: 'All quotes tracked, compared, and logged for cost audits.' },
            ].map((card, i) => (
              <div key={i} className="flex gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                <ShieldCheck className="w-6 h-6 text-accent-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">{card.title}</h4>
                  <p className="text-blue-100 text-xs mt-0.5">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/15 text-xs text-blue-200">
            For academic presentation and final year project validation.
          </div>
        </div>
      </div>

      {/* Right side: Login form column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        
        {/* Mobile Header (only visible on small viewports) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-lg">
              <Truck className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Freight<span className="gradient-text">IQ</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl"
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Login Successful</h3>
                <p className="text-slate-500 text-sm">
                  Welcome back to FreightIQ. Redirecting you to the dashboard...
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-8">
                  <span className="px-2.5 py-1 text-[10px] font-semibold text-blue-650 bg-blue-50 rounded-full border border-blue-200 inline-flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Secure Access
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                    Portal Login
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Enter credentials to manage active shipping operations.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-slate-700 font-medium text-xs mb-2" htmlFor="login-email">
                      Corporate Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 text-xs focus:outline-none focus:border-blue-550 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-slate-700 font-medium text-xs" htmlFor="login-password">
                        Password
                      </label>
                      <a
                        href="#forgot"
                        onClick={(e) => {
                          e.preventDefault()
                          alert('Password recovery mock link triggered.')
                        }}
                        className="text-blue-650 hover:text-blue-750 text-xs font-bold transition-colors"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 text-xs focus:outline-none focus:border-blue-550 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 bg-white border-slate-200 rounded text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-500 cursor-pointer select-none">
                      Remember this browser session
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl gradient-primary text-white font-bold text-xs hover:shadow-lg hover:shadow-accent-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      'Authenticating Credentials...'
                    ) : (
                      <>
                        Authenticate Access <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Redirect Link */}
                <div className="text-center mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    New to the FreightIQ network?{' '}
                    <Link to="/register" className="text-blue-650 hover:text-blue-750 font-bold transition-colors">
                      Register Organization
                    </Link>
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
