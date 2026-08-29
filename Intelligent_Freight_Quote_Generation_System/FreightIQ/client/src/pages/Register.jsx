import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User, Building, Phone } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validations
    if (!formData.fullName || !formData.email || !formData.phone || !formData.companyName || !formData.password || !formData.confirmPassword) {
      alert('Please fill out all mandatory fields.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please verify your typing.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          full_name: formData.fullName,
          phone: formData.phone,
          company_name: formData.companyName,
          role: 'CUSTOMER'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        // Store basic registration details if needed
        localStorage.setItem('registeredUser', JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          companyName: formData.companyName
        }))
        setTimeout(() => {
          setIsLoading(false)
          navigate('/login')
        }, 1500)
      } else {
        setIsLoading(false)
        // Show validation messages from backend if any
        let errMsg = 'Registration failed. Please check your inputs.'
        if (data.email) {
          errMsg = Array.isArray(data.email) ? data.email[0] : data.email
        } else if (data.password) {
          errMsg = Array.isArray(data.password) ? data.password[0] : data.password
        } else if (data.confirm_password) {
          errMsg = Array.isArray(data.confirm_password) ? data.confirm_password[0] : data.confirm_password
        } else if (data.detail) {
          errMsg = data.detail
        }
        alert(errMsg)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Registration error:', error)
      alert('Failed to connect to the registration server. Please ensure the backend is running.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row relative overflow-hidden text-slate-800">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

      {/* Left side: Premium branding & features column (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative gradient-primary items-center justify-center p-12 overflow-hidden border-r border-slate-200">
        {/* Backdrop overlay */}
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
              Join the Future of Smart Freight
            </h1>
            <p className="text-blue-100 text-base leading-relaxed">
              Register your organization to integrate FreightIQ quote estimation widgets, query route APIs, and connect customized shipper channels.
            </p>
          </div>

          {/* Quick value cards */}
          <div className="space-y-4">
            {[
              { title: 'Free Simulation Tier', desc: 'Compute up to 250 monthly logistics quotes at zero cost.' },
              { title: 'Multi-User Workspace', desc: 'Invite dispatch agents, load schedulers, and finance audit teams.' },
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

      {/* Right side: Register form column */}
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

        <div className="w-full max-w-md pt-12 lg:pt-0">
          {/* Card Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl"
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
                <h3 className="text-xl font-bold text-slate-900">Registration Complete</h3>
                <p className="text-slate-500 text-sm">
                  Your corporate profile has been registered. Redirecting to login portal...
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="px-2.5 py-1 text-[10px] font-semibold text-blue-655 bg-blue-50 rounded-full border border-blue-200 inline-flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Quick Signup
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Create Shipper Profile
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    Fill out organization parameters to initialize accounts.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium text-[11px] mb-1.5" htmlFor="reg-name">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          id="reg-name"
                          name="fullName"
                          type="text"
                          required
                          placeholder="Jane Doe"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-550 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium text-[11px] mb-1.5" htmlFor="reg-email">
                        Business Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          id="reg-email"
                          name="email"
                          type="email"
                          required
                          placeholder="jane@corp.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-550 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Company Name Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium text-[11px] mb-1.5" htmlFor="reg-phone">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          id="reg-phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+1 (555) 012-3456"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-550 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium text-[11px] mb-1.5" htmlFor="reg-company">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          id="reg-company"
                          name="companyName"
                          type="text"
                          required
                          placeholder="Acme Logistics Ltd"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-550 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passwords Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium text-[11px] mb-1.5" htmlFor="reg-password">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          id="reg-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-550 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-655 cursor-pointer"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium text-[11px] mb-1.5" htmlFor="reg-confirmPassword">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          id="reg-confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-550 focus:ring-1 focus:ring-blue-550 transition-all placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-655 cursor-pointer"
                          aria-label="Toggle confirm password visibility"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* T&C check */}
                  <div className="flex items-start pt-2">
                    <input
                      id="termsChecked"
                      required
                      type="checkbox"
                      className="w-4 h-4 mt-0.5 bg-white border-slate-200 rounded text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                    />
                    <label htmlFor="termsChecked" className="ml-2 text-[10px] text-slate-500 cursor-pointer leading-relaxed">
                      I agree to the corporate FreightIQ terms of use, privacy policy guidelines, and billing parameters.
                    </label>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl gradient-primary text-white font-bold text-xs hover:shadow-lg hover:shadow-accent-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 pt-2.5"
                  >
                    {isLoading ? (
                      'Creating Workspace Profile...'
                    ) : (
                      <>
                        Register Organization <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Redirect Link */}
                <div className="text-center mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">
                    Already registered under FreightIQ?{' '}
                    <Link to="/login" className="text-blue-650 hover:text-blue-755 font-bold transition-colors">
                      Authenticate Portal
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
