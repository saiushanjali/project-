import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Truck, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Plane, 
  Anchor, 
  Train, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Calendar,
  Layers,
  CircleDot,
  Calculator,
  User,
  Building,
  Mail,
  Phone,
  Info
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import DashboardNavbar from '../components/DashboardNavbar'
import DashboardCard from '../components/DashboardCard'

const INITIAL_QUOTES = [
  {
    id: 'IQ-9821',
    origin: 'Maharashtra',
    destination: 'Delhi NCT',
    mode: 'Road',
    cost: '₹1,06,400',
    status: 'Approved',
    date: 'Aug 04, 2026',
    weight: '1,250 kg',
  },
  {
    id: 'IQ-9820',
    origin: 'Gujarat',
    destination: 'Tamil Nadu',
    mode: 'Ocean',
    cost: '₹2,15,000',
    status: 'Pending Approval',
    date: 'Aug 03, 2026',
    weight: '14,000 kg',
  },
  {
    id: 'IQ-9819',
    origin: 'Karnataka',
    destination: 'Delhi NCT',
    mode: 'Air',
    cost: '₹3,45,000',
    status: 'Booking Confirmed',
    date: 'Aug 02, 2026',
    weight: '450 kg',
  },
  {
    id: 'IQ-9818',
    origin: 'West Bengal',
    destination: 'Telangana',
    mode: 'Rail',
    cost: '₹89,000',
    status: 'Draft',
    date: 'Jul 31, 2026',
    weight: '22,000 kg',
  }
]

const INITIAL_ACTIVITIES = [
  { id: 1, text: 'Quotation #IQ-9821 approved by system dispatcher', time: '10 mins ago', type: 'system' },
  { id: 2, text: 'New shipping enquiry saved: Mumbai to Tughlakabad', time: '20 mins ago', type: 'user' },
  { id: 3, text: 'Transit telemetry updated: Mundra lane weather bypass active', time: '2 hrs ago', type: 'system' },
  { id: 4, text: 'User profile updated to enterprise SLA corporate tier', time: '1 day ago', type: 'account' },
]

const HUB_CODES = {
  'Maharashtra': { code: 'INNSA', name: 'Mumbai' },
  'Gujarat': { code: 'INMUN', name: 'Mundra' },
  'Tamil Nadu': { code: 'INMAA', name: 'Chennai' },
  'West Bengal': { code: 'INCCU', name: 'Kolkata' },
  'Kerala': { code: 'INCOK', name: 'Cochin' },
  'Delhi NCT': { code: 'INTKD', name: 'Delhi' },
  'Karnataka': { code: 'INBLR', name: 'Bengaluru' },
  'Telangana': { code: 'INHYD', name: 'Hyderabad' },
  'Andhra Pradesh': { code: 'INVTZ', name: 'Vizag' },
  'Goa': { code: 'INMRM', name: 'Goa' },
  'Dubai': { code: 'AEJEA', name: 'Dubai' }
}

const getHubDetails = (locationName) => {
  if (!locationName) return { code: 'INNSA', name: 'Mumbai' }
  const key = Object.keys(HUB_CODES).find(k => 
    locationName.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(locationName.toLowerCase())
  )
  return key ? HUB_CODES[key] : { code: 'AEJEA', name: locationName.split(' ')[0] }
}

export default function BrokerDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [quotes, setQuotes] = useState([])
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES)
  const [userName, setUserName] = useState('Agent')
  const navigate = useNavigate()
  const location = useLocation()

  // Parse Tab Query Param
  const queryParams = new URLSearchParams(location.search)
  const activeTab = queryParams.get('tab')

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const email = localStorage.getItem('userEmail') || 'agent@freightiq.com'
    const name = localStorage.getItem('userName')
    if (name) {
      setUserName(name)
    } else {
      const localPart = email.split('@')[0]
      const cleanName = localPart
        .split(/[\._\-+]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
      setUserName(cleanName || 'Agent')
    }

    // Load quotes from localStorage (merge with initial mocks)
    const storedQuotes = localStorage.getItem('brokerQuotes')
    if (storedQuotes) {
      try {
        const parsed = JSON.parse(storedQuotes)
        // Combine keeping newest first
        const combined = [...parsed, ...INITIAL_QUOTES.filter(q => !parsed.some(pq => pq.id === q.id))]
        setQuotes(combined)
      } catch (e) {
        setQuotes(INITIAL_QUOTES)
      }
    } else {
      setQuotes(INITIAL_QUOTES)
      localStorage.setItem('brokerQuotes', JSON.stringify(INITIAL_QUOTES))
    }
  }, [navigate])

  const getModeIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'air': return <Plane className="w-4 h-4 text-sky-500" />
      case 'ocean': return <Anchor className="w-4 h-4 text-blue-600" />
      case 'rail': return <Train className="w-4 h-4 text-purple-600" />
      default: return <Truck className="w-4 h-4 text-indigo-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>
      case 'booking confirmed':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Confirmed</span>
      case 'pending approval':
      case 'pending':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">Pending Review</span>
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-150 text-slate-700 border border-slate-350">Draft</span>
    }
  }

  // Detailed Quote Route Options View
  const renderQuotationDetail = () => {
    const selectedQuoteId = queryParams.get('quoteId')
    const currentQuote = quotes.find(q => q.id === selectedQuoteId) || quotes[0] || {
      id: 'QT-2026-00930',
      origin: 'Maharashtra',
      destination: 'Dubai',
      cost: '₹3,84,500',
      status: 'Draft',
      weight: '18,400 kg'
    }

    const originInfo = getHubDetails(currentQuote.origin)
    const destInfo = getHubDetails(currentQuote.destination)
    
    // Parse cost for alternative options
    const baseCostNum = parseInt(currentQuote.cost.replace(/[^\d]/g, '')) || 384500

    return (
      <div className="space-y-6">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
              Quotations <span className="text-slate-400">/</span> <span className="text-blue-600 font-bold">{currentQuote.id}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-800">
                Sharma Textiles <span className="text-slate-400 font-medium font-sans">·</span> {originInfo.name} ➔ {destInfo.name}
              </h2>
              {getStatusBadge(currentQuote.status)}
            </div>
          </div>
          {/* Note: Regenerate and Continue to Pricing buttons are REMOVED as requested */}
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Route options graph & Recommended Service (span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Route Options Graph Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-tight">Route options -- ranked by composite score</h3>
                </div>
                <span className="text-[10px] text-emerald-650 font-black bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-150">
                  3 viable routings
                </span>
              </div>

              {/* Dark Canvas SVG Route Visualizer */}
              <div className="bg-[#0c1524] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-[240px] border border-slate-950">
                {/* Decorative map dots in background */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <svg viewBox="0 0 500 240" className="w-full h-full max-w-lg relative z-10">
                  {/* Legend Overlay at bottom left */}
                  <g transform="translate(10, 160)">
                    <rect width="180" height="65" rx="6" fill="#0f172a" fillOpacity="0.8" stroke="#1e293b" strokeWidth="1" />
                    <g transform="translate(10, 15)">
                      <line x1="0" y1="0" x2="15" y2="0" stroke="#f97316" strokeWidth="2.5" />
                      <text x="22" y="3" fill="#94a3b8" fontSize="8" fontWeight="bold">Recommended -- direct</text>
                    </g>
                    <g transform="translate(10, 30)">
                      <line x1="0" y1="0" x2="15" y2="0" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                      <text x="22" y="3" fill="#94a3b8" fontSize="8" fontWeight="bold">Alternative -- 1 transhipment</text>
                    </g>
                    <g transform="translate(10, 45)">
                      <line x1="0" y1="0" x2="15" y2="0" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,2" />
                      <text x="22" y="3" fill="#94a3b8" fontSize="8" fontWeight="bold">Alternative -- direct, slower</text>
                    </g>
                  </g>

                  {/* Ocean Route Arcs */}
                  {/* Alt 2: Direct, slower */}
                  <path d="M 80 120 Q 250 180 420 120" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,2" />
                  
                  {/* Alt 1: 1 transhipment */}
                  <path d="M 80 120 Q 250 120 420 120" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                  
                  {/* Recommended: Direct */}
                  <path d="M 80 120 Q 250 40 420 120" fill="none" stroke="#f97316" strokeWidth="2.5" />
                  
                  {/* Port Nodes */}
                  <g transform="translate(80, 120)">
                    <circle r="5" fill="#f97316" />
                    <circle r="10" fill="none" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.4" />
                    <text x="-12" y="4" fill="#e2e8f0" fontSize="9" fontWeight="black" textAnchor="end">{originInfo.code}</text>
                    <text x="-12" y="14" fill="#94a3b8" fontSize="7" fontWeight="medium" textAnchor="end">{originInfo.name}</text>
                  </g>
                  
                  <g transform="translate(420, 120)">
                    <circle r="5" fill="#3b82f6" />
                    <circle r="10" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.4" />
                    <text x="12" y="4" fill="#e2e8f0" fontSize="9" fontWeight="black" textAnchor="start">{destInfo.code}</text>
                    <text x="12" y="14" fill="#94a3b8" fontSize="7" fontWeight="medium" textAnchor="start">{destInfo.name}</text>
                  </g>

                  {/* Midpoint vessel */}
                  <g transform="translate(250, 80)">
                    <circle r="4" fill="#f97316" />
                    <text y="-8" fill="#94a3b8" fontSize="8" fontWeight="extrabold" textAnchor="middle">
                      {currentQuote.mode?.toLowerCase() === 'air' ? 'AE3AF' : 'AE3EA'}
                    </text>
                    <text y="15" fill="#475569" fontSize="7" fontWeight="bold" textAnchor="middle">
                      {currentQuote.mode?.toLowerCase() === 'air' ? 'FLIGHT ROUTE' : 'VESSEL TRANSIT'}
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Recommended Service Summary Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-black text-orange-700 bg-orange-50 border border-orange-200 rounded uppercase tracking-wider">
                    RECOMMENDED
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-850 mt-1">
                    {currentQuote.mode?.toLowerCase() === 'air' ? 'FedEx -- Cargo Express' : 'Maersk -- MECL Service'}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Direct -- weekly {currentQuote.mode?.toLowerCase() === 'air' ? 'flight' : 'sailing'} -- reliability 94% <span className="text-slate-355">|</span> {currentQuote.mode?.toLowerCase() === 'air' ? 'Air Telemetry' : '1,205 nm -- 3 d sailing'}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xl font-black text-slate-850">{currentQuote.cost}</span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Indicative flat rate</p>
                </div>
              </div>

              {/* Progress Index Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Transit', score: 0.92 },
                  { label: 'Cost', score: 0.70 },
                  { label: 'Reliability', score: 0.94 },
                  { label: 'Congestion', score: 0.71 }
                ].map((metric) => (
                  <div key={metric.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <span>{metric.label}</span>
                      <span className="text-slate-850">{metric.score.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${metric.score * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Breakdowns (span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Transit Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm tracking-tight">Transit breakdown</h3>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Pickup leg (34 km road)', value: '1.0 d' },
                  { label: 'Origin dwell -- FCL', value: '3.0 d' },
                  { label: 'Sea leg -- 1,205 nm * 400', value: currentQuote.mode?.toLowerCase() === 'air' ? '0.5 d' : '3.0 d' },
                  { label: 'Schedule wait (weekly) * 1', value: '3.5 d' },
                  { label: 'Destination dwell', value: '3.0 d' },
                  { label: 'Delivery leg', value: '0.0 d' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">{item.label}</span>
                    <span className="text-slate-800 font-bold">{item.value}</span>
                  </div>
                ))}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-800 uppercase">Total</span>
                  <span className="text-xs font-black text-slate-800">
                    {currentQuote.mode?.toLowerCase() === 'air' ? '11.0 -- 2-4 d *' : '13.5 -- 6-10 d *'}
                  </span>
                </div>
              </div>
            </div>

            {/* Weight & Charge Basis */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm tracking-tight">Weight & charge basis</h3>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Charge basis', value: 'PER_CONTAINER' },
                  { label: 'Units', value: currentQuote.mode?.toLowerCase() === 'air' ? '1 * Palette' : '2 * 40HC' },
                  { label: 'Gross weight', value: currentQuote.weight || '18,400 kg' },
                  { label: 'Payload limit', value: '28,000 kg' },
                  { label: 'Volumetric', value: 'n/a -- FCL' },
                  { label: 'Chargeable', value: 'n/a -- FCL' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">{item.label}</span>
                    <span className="text-slate-800 font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Sidebar navigation */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Main workspace */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <DashboardNavbar setIsMobileOpen={setIsMobileOpen} title="Client Dashboard" />

        {/* Dashboard Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'quotations' ? (
            renderQuotationDetail()
          ) : (
            <>
              {/* Welcome Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl border border-slate-800 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-400/20 to-transparent blur-3xl pointer-events-none rounded-full" />
                <div className="relative z-10 space-y-1">
                  <span className="px-2.5 py-0.5 text-[9px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-400/20 rounded-full inline-flex items-center gap-1 uppercase tracking-wide">
                    <Sparkles className="w-2.5 h-2.5" /> Workspace Online
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">Welcome Back, {userName}</h2>
                  <p className="text-slate-400 text-xs font-medium">
                    Monitor logistics lanes, evaluate carbon indexes, and trigger multi-modal route dispatches.
                  </p>
                </div>
                <Link
                  to="/dashboard/new-shipment"
                  className="relative shrink-0 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/10 hover:shadow-sky-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> New Shipment Enquiry
                </Link>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <DashboardCard 
                  title="Active Lanes" 
                  value="12" 
                  icon={Layers} 
                  trend="+15.2%" 
                  trendType="positive"
                  color="blue"
                />
                <DashboardCard 
                  title="Total Quotes" 
                  value={quotes.length.toString()} 
                  icon={CircleDot} 
                  trend={`+${quotes.length * 5}%`}
                  trendType="positive"
                  color="purple"
                />
                <DashboardCard 
                  title="Pending Bookings" 
                  value="5" 
                  icon={Activity} 
                  trend="-4.8%" 
                  trendType="positive"
                  color="amber"
                />
                <DashboardCard 
                  title="Carbon Savings" 
                  value="34.2 t" 
                  icon={ShieldCheck} 
                  trend="+8.1%" 
                  trendType="positive"
                  color="green"
                />
              </div>

              {/* Columns Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Recent Quotations Table (span 8) */}
                <div className="lg:col-span-8 flex flex-col">
                  <div className="glass-card rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">Recent Quotations</h3>
                        <p className="text-[10px] text-slate-500">History of neural calculated shipment lane dispatches</p>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-lg">
                        {quotes.length} Total Quotes
                      </span>
                    </div>

                    <div className="overflow-x-auto -mx-5 sm:-mx-6 flex-grow">
                      <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-slate-100">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Quote ID</th>
                              <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Route Lanes</th>
                              <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Mode</th>
                              <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Estimated Cost</th>
                              <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Created</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-100">
                            {quotes.map((quote) => (
                              <tr 
                                key={quote.id} 
                                onClick={() => navigate(`/dashboard?tab=quotations&quoteId=${quote.id}`)}
                                className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                              >
                                <td className="px-6 py-3.5 whitespace-nowrap text-xs font-bold text-sky-600">
                                  {quote.id}
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="space-y-0.5 max-w-[200px] sm:max-w-xs">
                                    <p className="text-xs font-bold text-slate-800 truncate">{quote.origin}</p>
                                    <div className="flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                      <span className="text-[10px] text-slate-450 truncate">{quote.destination}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-3.5 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                                    {getModeIcon(quote.mode)}
                                    <span>{quote.mode}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-3.5 whitespace-nowrap text-xs font-extrabold text-slate-900">
                                  {quote.cost}
                                </td>
                                <td className="px-6 py-3.5 whitespace-nowrap">
                                  {getStatusBadge(quote.status)}
                                </td>
                                <td className="px-6 py-3.5 whitespace-nowrap text-[10px] font-bold text-slate-500">
                                  {quote.date}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {quotes.length === 0 && (
                      <div className="text-center py-12 flex-grow flex flex-col items-center justify-center">
                        <Truck className="w-12 h-12 text-slate-300 stroke-1.5 mb-3" />
                        <h4 className="text-sm font-bold text-slate-700">No shipments registered yet</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">Create your first shipment enquiry parameters to invoke the AI cost matching calculation.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Recent Activities (span 4) */}
                <div className="lg:col-span-4">
                  <div className="glass-card rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 h-full flex flex-col">
                    <div className="pb-4 border-b border-slate-100 mb-4">
                      <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">Recent Activity Log</h3>
                      <p className="text-[10px] text-slate-500">Real-time system telemetry and transaction audits</p>
                    </div>

                    <div className="flex-grow space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3 items-start">
                          <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5 shadow-sm shadow-sky-500" />
                          <div className="space-y-0.5 overflow-hidden">
                            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                              {activity.text}
                            </p>
                            <span className="text-[9px] text-slate-450 block font-medium">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-6 text-center">
                      <button 
                        onClick={() => alert('Full logs require administrative credentials in Milestone 2.')}
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline transition-all cursor-pointer"
                      >
                        View Complete Audit Trail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
