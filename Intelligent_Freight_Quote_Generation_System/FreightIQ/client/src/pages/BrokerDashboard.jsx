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
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)
  const [approvalComment, setApprovalComment] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleApprovalAction = async (quoteUuid, action) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Session expired. Please log in.')
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`/api/v1/quotes/${quoteUuid}/${action}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: approvalComment || `Processed by Broker.`
        })
      })

      const data = await response.json()
      if (response.ok) {
        alert(`Quote successfully ${action === 'approve' ? 'approved' : 'rejected'}!`)
        setApprovalComment('')
        // Refresh quotes list
        window.location.reload()
      } else {
        alert(data.detail || `Action failed: Permission denied or invalid threshold.`)
      }
    } catch (e) {
      console.error(e)
      alert(`Error connecting to server.`)
    }
  }

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

    const fetchQuotes = async () => {
      let localQuotes = []
      try {
        const stored = localStorage.getItem('freightiq_local_quotes')
        if (stored) {
          localQuotes = JSON.parse(stored)
        } else {
          const INITIAL_MOCK_QUOTES = [
            { id: 'IQ-2026-9821', origin: 'INNSA', destination: 'AEJEA', mode: 'Ocean', cost: 164200, currency: 'INR', status: 'Approved', date: '2026-08-20', weight: 1250 },
            { id: 'IQ-2026-9820', origin: 'INNSA', destination: 'USLAX', mode: 'Ocean', cost: 320000, currency: 'INR', status: 'Pending Approval', date: '2026-08-18', weight: 14000 },
            { id: 'IQ-2026-9819', origin: 'INBLR', destination: 'DEHAM', mode: 'Air', cost: 8500, currency: 'USD', status: 'Draft', date: '2026-08-15', weight: 450 }
          ]
          localStorage.setItem('freightiq_local_quotes', JSON.stringify(INITIAL_MOCK_QUOTES))
          localQuotes = INITIAL_MOCK_QUOTES
        }
      } catch (e) {
        console.error(e)
      }

      const mapLocalQuote = (q) => {
        const symbol = q.currency === 'INR' ? '₹' : (q.currency === 'USD' ? '$' : q.currency + ' ')
        return {
          id: q.id,
          origin: q.origin,
          destination: q.destination,
          mode: q.mode,
          cost: `${symbol}${parseFloat(q.cost || 0).toLocaleString('en-IN')}`,
          status: q.status,
          date: new Date(q.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          weight: q.weight ? `${parseFloat(q.weight).toLocaleString('en-IN')} kg` : 'N/A',
          customer: q.customer || 'Shipper Corporation',
          rawCost: parseFloat(q.cost || 0),
          rawCurrency: q.currency || 'INR',
          raw: q
        }
      }

      try {
        const response = await fetch('/api/v1/quotes/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const resData = await response.json()
          const apiQuotes = resData.data || []
          
          const mapped = apiQuotes.map(q => {
            const latestVer = q.latest_version || {}
            
            let costStr = 'N/A'
            if (latestVer.final_quote) {
              const symbol = latestVer.currency === 'INR' ? '₹' : (latestVer.currency || 'USD') + ' '
              costStr = `${symbol}${parseFloat(latestVer.final_quote).toLocaleString('en-IN')}`
            }

            let displayStatus = q.status
            const statusUpper = (q.status || '').toUpperCase()
            if (statusUpper === 'PENDING_APPROVAL') displayStatus = 'Pending Approval'
            else if (statusUpper === 'APPROVED') displayStatus = 'Approved'
            else if (statusUpper === 'ACCEPTED' || statusUpper === 'ISSUED') displayStatus = 'Booking Confirmed'
            else if (statusUpper === 'DRAFT') displayStatus = 'Draft'

            let modeDisplay = 'Road'
            const modeUpper = (q.mode || '').toUpperCase()
            if (modeUpper === 'OCEAN') modeDisplay = 'Ocean'
            else if (modeUpper === 'AIR') modeDisplay = 'Air'
            else if (modeUpper === 'GROUND_RAIL') modeDisplay = 'Rail'
            else if (modeUpper === 'EXPRESS_AIR') modeDisplay = 'Express Air'

            return {
              id: q.quote_number,
              origin: q.origin_code || (q.shipment ? q.shipment.origin_code : ''),
              destination: q.destination_code || (q.shipment ? q.shipment.destination_code : ''),
              mode: modeDisplay,
              cost: costStr,
              status: displayStatus,
              date: new Date(q.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              weight: q.weight ? `${parseFloat(q.weight).toLocaleString('en-IN')} kg` : 'N/A',
              customer: q.customer_name || 'Shipper Corporation',
              rawCost: parseFloat(latestVer.final_quote || latestVer.total_cost || 0),
              rawCurrency: latestVer.currency || 'INR',
              raw: q
            }
          })
          
          const apiIds = new Set(mapped.map(item => item.id))
          const localDrafts = localQuotes.filter(item => !apiIds.has(item.id)).map(mapLocalQuote)
          setQuotes([...mapped, ...localDrafts])
        } else {
          setQuotes(localQuotes.map(mapLocalQuote))
        }
      } catch (err) {
        console.warn('API fetch error, utilizing fallback:', err)
        setQuotes(localQuotes.map(mapLocalQuote))
      }
    }

    fetchQuotes()
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
      weight: '18,400 kg',
      mode: 'Ocean'
    }

    const originInfo = getHubDetails(currentQuote.origin)
    const destInfo = getHubDetails(currentQuote.destination)
    
    // Parse cost for alternative options
    const baseCostNum = parseInt(currentQuote.cost.replace(/[^\d]/g, '')) || 384500
    const mode = currentQuote.mode || 'Ocean'

    // Interactive Route Options definition
    const routeOptions = [
      {
        name: 'Direct Express Leg',
        type: 'Fastest Route',
        transitTime: mode.toLowerCase() === 'air' ? '1-2 Days' : '6-8 Days',
        reliability: '94%',
        congestion: 'Low',
        emissions: 'High CO2',
        score: 9.2,
        cost: baseCostNum,
        carrier: mode.toLowerCase() === 'air' ? 'FedEx Express' : 'Maersk Line',
        pathD: 'M 80 120 Q 250 40 420 120',
        color: '#f97316',
        legend: 'Recommended -- direct',
        timeline: [
          { label: 'Origin Pickup', desc: 'Local cartage to port hub', val: '1.0 d' },
          { label: 'Staging & Customs', desc: 'FCL clearance and loading', val: '1.5 d' },
          { label: mode.toLowerCase() === 'air' ? 'Air Flight Transit' : 'Ocean Direct Vessel Transit', desc: 'Active shipping lane speed', val: mode.toLowerCase() === 'air' ? '0.5 d' : '3.0 d' },
          { label: 'Destination Customs', desc: 'Import port clear', val: '1.0 d' },
          { label: 'Final Delivery Leg', desc: 'Truck transport to warehouse', val: '0.5 d' }
        ]
      },
      {
        name: 'Transhipment Corridor',
        type: 'Cheapest Route',
        transitTime: mode.toLowerCase() === 'air' ? '3-4 Days' : '10-12 Days',
        reliability: '85%',
        congestion: 'Medium',
        emissions: 'Medium CO2',
        score: 8.1,
        cost: Math.round(baseCostNum * 0.85),
        carrier: mode.toLowerCase() === 'air' ? 'Emirates SkyCargo' : 'COSCO Shipping',
        pathD: 'M 80 120 Q 250 120 420 120',
        color: '#38bdf8',
        legend: 'Alternative -- 1 transhipment',
        timeline: [
          { label: 'Origin Pickup', desc: 'Local cartage to port hub', val: '1.0 d' },
          { label: 'Staging & Load staging', desc: 'LCL staging at warehouse', val: '2.5 d' },
          { label: mode.toLowerCase() === 'air' ? 'Midpoint Hub Routing' : 'Ocean Transit (Transhipment)', desc: 'Routed via intermediate tranship hub', val: mode.toLowerCase() === 'air' ? '1.5 d' : '5.5 d' },
          { label: 'Destination Customs', desc: 'Import port clear', val: '1.5 d' },
          { label: 'Final Delivery Leg', desc: 'Truck transport to warehouse', val: '0.5 d' }
        ]
      },
      {
        name: 'Eco-Rail Combined',
        type: 'Balanced ESG Route',
        transitTime: mode.toLowerCase() === 'air' ? '4-5 Days' : '12-14 Days',
        reliability: '89%',
        congestion: 'Low',
        emissions: 'Low CO2 (ESG Opt)',
        score: 8.5,
        cost: Math.round(baseCostNum * 0.92),
        carrier: mode.toLowerCase() === 'air' ? 'DHL Express' : 'Ocean Network Express (ONE)',
        pathD: 'M 80 120 Q 250 180 420 120',
        color: '#10b981',
        legend: 'Alternative -- direct, slower',
        timeline: [
          { label: 'Origin Pickup', desc: 'Electric truck cartage', val: '1.0 d' },
          { label: 'Staging & Customs', desc: 'Eco-certified warehouse load', val: '1.5 d' },
          { label: mode.toLowerCase() === 'air' ? 'Green Air Flight' : 'Green Vessel Transit (LNG)', desc: 'Carbon offset shipping lane', val: mode.toLowerCase() === 'air' ? '2.0 d' : '6.0 d' },
          { label: 'Destination Customs', desc: 'Import port clear', val: '1.0 d' },
          { label: 'Final Delivery Leg', desc: 'Electric truck dispatch', val: '0.5 d' }
        ]
      }
    ]

    const selectedRoute = routeOptions[selectedRouteIndex] || routeOptions[0]

    // Predefined carrier comparison list
    const carrierComparison = [
      { logo: 'MSK', name: 'Maersk Line', mode: 'Ocean', time: '7 Days', reliability: '94%', rate: baseCostNum, score: '9.2', status: 'Recommended' },
      { logo: 'COS', name: 'COSCO Shipping', mode: 'Ocean', time: '11 Days', reliability: '89%', rate: Math.round(baseCostNum * 0.85), score: '8.1', status: 'Cheapest' },
      { logo: 'ONE', name: 'ONE Express', mode: 'Ocean', time: '9 Days', reliability: '91%', rate: Math.round(baseCostNum * 0.90), score: '8.7', status: 'Balanced' },
      { logo: 'FED', name: 'FedEx Freight', mode: 'Air', time: '2 Days', reliability: '97%', rate: Math.round(baseCostNum * 2.3), score: '9.5', status: 'Express' }
    ]

    return (
      <div className="space-y-6 font-sans">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
              Quotations <span className="text-slate-400">/</span> <span className="text-blue-600 font-bold">{currentQuote.id}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-800">
                {currentQuote.customer || 'Shipper Corp'} <span className="text-slate-400 font-medium font-sans">·</span> {originInfo.name} ➔ {destInfo.name}
              </h2>
              {getStatusBadge(currentQuote.status)}
            </div>
          </div>
          {currentQuote.status?.toLowerCase() === 'pending approval' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              <input
                type="text"
                placeholder="Add approval/rejection comment..."
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-medium min-w-[200px]"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApprovalAction(currentQuote.uuid, 'approve')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApprovalAction(currentQuote.uuid, 'reject')}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Route options graph & Recommended Service (span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Interactive Route Options Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">
              <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-tight mb-3">
                Select Route Option -- ranked by composite SLA score
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {routeOptions.map((opt, idx) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setSelectedRouteIndex(idx)}
                    className={`p-3 text-left rounded-xl border-2 transition-all flex flex-col justify-between h-24 cursor-pointer ${
                      selectedRouteIndex === idx
                        ? 'border-blue-600 bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{opt.type}</span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">{opt.name}</span>
                    </div>
                    <div className="flex justify-between items-center w-full mt-2">
                      <span className="text-xs font-black text-blue-650">₹ {opt.cost.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-150">
                        Score {opt.score}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Canvas SVG Route Visualizer */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm tracking-tight">Active Route Coordinates Map</h3>
                  <p className="text-[10px] text-slate-500">Live shipping lane transit simulation</p>
                </div>
                <span className="text-[10px] text-emerald-650 font-black bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-150">
                  {selectedRoute.emissions}
                </span>
              </div>

              <div className="bg-[#0c1524] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-[240px] border border-slate-950">
                {/* Decorative map dots in background */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <svg viewBox="0 0 500 240" className="w-full h-full max-w-lg relative z-10">
                  {/* Legend Overlay at bottom left */}
                  <g transform="translate(10, 160)">
                    <rect width="180" height="65" rx="6" fill="#0f172a" fillOpacity="0.8" stroke="#1e293b" strokeWidth="1" />
                    <g transform="translate(10, 15)">
                      <line x1="0" y1="0" x2="15" y2="0" stroke="#f97316" strokeWidth="2.5" />
                      <text x="22" y="3" fill="#94a3b8" fontSize="8" fontWeight="bold">Direct Route (Express)</text>
                    </g>
                    <g transform="translate(10, 30)">
                      <line x1="0" y1="0" x2="15" y2="0" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                      <text x="22" y="3" fill="#94a3b8" fontSize="8" fontWeight="bold">Transhipment Route</text>
                    </g>
                    <g transform="translate(10, 45)">
                      <line x1="0" y1="0" x2="15" y2="0" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
                      <text x="22" y="3" fill="#94a3b8" fontSize="8" fontWeight="bold">Eco-Rail Combined</text>
                    </g>
                  </g>

                  {/* Ocean Route Arcs */}
                  {/* Option 3: Eco-Rail */}
                  <path d="M 80 120 Q 250 180 420 120" fill="none" stroke="#10b981" strokeWidth={selectedRouteIndex === 2 ? 3.0 : 1.2} strokeDasharray={selectedRouteIndex === 2 ? "none" : "3,3"} />
                  
                  {/* Option 2: Transhipment */}
                  <path d="M 80 120 Q 250 120 420 120" fill="none" stroke="#38bdf8" strokeWidth={selectedRouteIndex === 1 ? 3.0 : 1.2} strokeDasharray={selectedRouteIndex === 1 ? "none" : "3,3"} />
                  
                  {/* Option 1: Direct */}
                  <path id="direct-path" d="M 80 120 Q 250 40 420 120" fill="none" stroke="#f97316" strokeWidth={selectedRouteIndex === 0 ? 3.0 : 1.2} strokeDasharray={selectedRouteIndex === 0 ? "none" : "3,3"} />
                  
                  {/* Animating vessel/plane along selected path */}
                  <circle r="6" fill={selectedRoute.color} className="shadow-lg shadow-white/40">
                    <animateMotion dur="6s" repeatCount="indefinite" path={selectedRoute.pathD} />
                  </circle>

                  {/* Port Nodes */}
                  <g transform="translate(80, 120)">
                    <circle r="6" fill={selectedRoute.color} />
                    <circle r="12" fill="none" stroke={selectedRoute.color} strokeWidth="1.5" strokeOpacity="0.4" className="animate-ping" />
                    <text x="-12" y="4" fill="#e2e8f0" fontSize="9" fontWeight="black" textAnchor="end">{originInfo.code || 'Origin'}</text>
                    <text x="-12" y="14" fill="#94a3b8" fontSize="7" fontWeight="medium" textAnchor="end">{originInfo.name}</text>
                  </g>
                  
                  <g transform="translate(420, 120)">
                    <circle r="6" fill="#3b82f6" />
                    <circle r="12" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.4" />
                    <text x="12" y="4" fill="#e2e8f0" fontSize="9" fontWeight="black" textAnchor="start">{destInfo.code || 'Dest'}</text>
                    <text x="12" y="14" fill="#94a3b8" fontSize="7" fontWeight="medium" textAnchor="start">{destInfo.name}</text>
                  </g>

                  {/* Midpoint Info Box */}
                  <g transform="translate(250, 75)">
                    <rect x="-45" y="-12" width="90" height="24" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                    <text y="3" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {mode.toUpperCase()} LANE
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Carrier Comparison Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm tracking-tight">Active Carrier Comparison</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Spot Contract Quotes</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-slate-505 uppercase text-[9px] font-extrabold">
                      <th className="px-4 py-2 text-left">Carrier</th>
                      <th className="px-4 py-2 text-left">Transit</th>
                      <th className="px-4 py-2 text-left">Reliability</th>
                      <th className="px-4 py-2 text-left">Spot Rate</th>
                      <th className="px-4 py-2 text-left">SLA Score</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {carrierComparison.map((carrier) => (
                      <tr key={carrier.name} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[9px] border border-blue-200">
                            {carrier.logo}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{carrier.name}</p>
                            <span className="text-[9px] text-slate-500">{carrier.mode} Freight</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700">{carrier.time}</td>
                        <td className="px-4 py-3 font-semibold text-slate-700">{carrier.reliability}</td>
                        <td className="px-4 py-3 font-black text-slate-900">₹ {carrier.rate.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <span className="font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-150">
                            {carrier.score}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            carrier.status === 'Recommended' ? 'bg-orange-50 text-orange-700 border border-orange-150' :
                            carrier.status === 'Cheapest' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {carrier.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Score, Timeline, Weight (span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Composite SLA Route Score Card with Radial Progress */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4 flex flex-col items-center">
              <div className="w-full pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm tracking-tight text-left">Route Composite Score</h3>
              </div>
              
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* SVG Radial Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="46" 
                    stroke={selectedRoute.color} 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * (selectedRoute.score * 10)) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-slate-800">{selectedRoute.score}</span>
                  <span className="text-[10px] text-slate-500 block font-semibold">/ 10 Rating</span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-xs font-bold text-slate-800">{selectedRoute.name}</h4>
                <p className="text-[10px] text-slate-450 font-semibold uppercase">{selectedRoute.type}</p>
              </div>

              {/* Sub-Score parameters */}
              <div className="w-full space-y-2 pt-2 border-t border-slate-100">
                {[
                  { label: 'Transit duration', val: selectedRoute.transitTime, pct: 90 },
                  { label: 'Carrier reliability', val: selectedRoute.reliability, pct: parseFloat(selectedRoute.reliability) },
                  { label: 'ESG / CO2 Index', val: selectedRoute.emissions, pct: selectedRouteIndex === 2 ? 95 : selectedRouteIndex === 1 ? 65 : 45 }
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>{item.label}</span>
                      <span className="text-slate-800">{item.val}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transit Time timeline */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm tracking-tight">Transit Time breakdown</h3>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{selectedRoute.transitTime}</span>
              </div>

              <div className="space-y-4 relative pl-4 border-l border-slate-200 ml-2 pt-1 font-sans">
                {selectedRoute.timeline.map((step, i) => (
                  <div key={step.label} className="relative space-y-0.5">
                    {/* Circle marker on line */}
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-blue-600" />
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-bold text-slate-850">{step.label}</span>
                      <span className="text-slate-500 font-extrabold">{step.val}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weight & Charge Basis */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm tracking-tight">Weight & charge basis</h3>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {[
                  { label: 'Charge basis', value: 'PER_CONTAINER' },
                  { label: 'Units', value: mode.toLowerCase() === 'air' ? '1 * Pallet' : '2 * 40HC' },
                  { label: 'Gross weight', value: currentQuote.weight || '18,400 kg' },
                  { label: 'Payload limit', value: '28,000 kg' },
                  { label: 'Volumetric basis', value: mode.toLowerCase() === 'air' ? '1:6000 Volumetric' : 'n/a -- FCL' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-slate-550 font-semibold">{item.label}</span>
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
                  title="Total Quotes" 
                  value={quotes.length.toString()} 
                  icon={Layers} 
                  trend="All Channels" 
                  trendType="positive"
                  color="blue"
                />
                <DashboardCard 
                  title="Issued Quotes" 
                  value={quotes.filter(q => q.status.toLowerCase() !== 'draft').length.toString()} 
                  icon={CircleDot} 
                  trend="Active & Dispatched"
                  trendType="positive"
                  color="purple"
                />
                <DashboardCard 
                  title="Drafts Saved" 
                  value={quotes.filter(q => q.status.toLowerCase() === 'draft').length.toString()} 
                  icon={Activity} 
                  trend="Pending Simulation" 
                  trendType="positive"
                  color="amber"
                />
                <DashboardCard 
                  title="Total Registry Value" 
                  value={`₹ ${Math.round(quotes.reduce((sum, q) => {
                    let costNum = q.rawCost || 0;
                    if (q.rawCurrency === 'USD') costNum *= 83;
                    else if (q.rawCurrency === 'EUR') costNum *= 90;
                    else if (q.rawCurrency === 'AED') costNum *= 22.6;
                    else if (q.rawCurrency === 'GBP') costNum *= 108;
                    else if (q.rawCurrency === 'SGD') costNum *= 62;
                    return sum + costNum;
                  }, 0)).toLocaleString('en-IN')}`} 
                  icon={ShieldCheck} 
                  trend="Calculated in INR" 
                  trendType="positive"
                  color="green"
                />
              </div>

              {/* Milestone 3 Intelligence Summary Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" /> Intelligence Overview
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Real-Time ML & Risk Analytics</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* 1. ML Predicted Price */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">ML PRICE PREDICTION</span>
                    <div className="text-lg font-black text-slate-900 font-mono">₹ 2,31,500</div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Rule: ₹2,37,360</span>
                      <span className="text-emerald-600 font-bold font-mono">-2.5% Variance</span>
                    </div>
                  </div>

                  {/* 2. Weather Risk */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">WEATHER RISK SCORE</span>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900 font-mono">25 <span className="text-xs font-normal text-slate-400">/100</span></span>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">LOW</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Est. Delay Buffer: <strong>+1.8 Days</strong></span>
                  </div>

                  {/* 3. Customs Status */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">CUSTOMS READINESS</span>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-emerald-600 font-mono">100%</span>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">READY</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">ICEGATE BOE & Tariff Verified</span>
                  </div>

                  {/* 4. Overall Shipment Risk */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">OVERALL SHIPMENT RISK</span>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900 font-mono">22.5 <span className="text-xs font-normal text-slate-400">/100</span></span>
                      <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-emerald-500 text-white uppercase">LOW</span>
                    </div>
                    {/* Risk Indicators */}
                    <div className="flex items-center gap-1 text-[8px] font-mono pt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">LOW</span>
                      <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 opacity-40">MED</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 opacity-40">HIGH</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 opacity-40">CRIT</span>
                    </div>
                  </div>

                  {/* 5. Active Risk Alerts */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 flex flex-col justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">ACTIVE RISK ALERTS</span>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-amber-600 font-mono">3 Pending</span>
                      <Link to="/dashboard/alerts" className="text-[10px] font-bold text-blue-600 hover:text-blue-700">View All →</Link>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Severe weather & customs advisories</span>
                  </div>
                </div>
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
