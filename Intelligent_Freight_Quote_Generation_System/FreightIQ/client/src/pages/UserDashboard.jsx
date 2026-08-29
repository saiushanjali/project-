import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Truck, 
  Layers, 
  CircleDot, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Plane, 
  Anchor, 
  Train,
  Calculator,
  Download,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Cpu,
  RotateCcw,
  Clock,
  TrendingUp,
  X,
  Plus
} from 'lucide-react'

import Sidebar from '../components/Sidebar'

const INITIAL_QUOTES = [
  {
    id: 'QT-2026-46877',
    mode: 'Air',
    status: 'Issued',
    validUntil: 'Aug 28, 2026',
    origin: 'Chennai Port',
    destination: 'Singapore Port',
    carrier: 'Air Direct Verified Express • Estimated Transit: 2 – 3 Days',
    cargo: '1 Package(s) (Commercial Export Goods)',
    cost: '₹5,15,200',
    numericCost: 515200
  },
  {
    id: 'QT-2026-51267',
    mode: 'Ocean',
    status: 'Issued',
    validUntil: 'Aug 28, 2026',
    origin: 'Chennai Port',
    destination: 'Singapore Port',
    carrier: 'Maersk Line Direct Service • Estimated Transit: 5 – 6 Days',
    cargo: '2 × 40HC Containers',
    cost: '₹1,48,350',
    numericCost: 148350
  },
  {
    id: 'QT-2026-09834',
    mode: 'Ocean',
    status: 'Issued',
    validUntil: 'Aug 28, 2026',
    origin: 'Chennai Port',
    destination: 'Singapore Port',
    carrier: 'COSCO Direct Verified Express • Estimated Transit: 5 – 6 Days',
    cargo: '1 Package(s) (Commercial Export Goods)',
    cost: '₹1,56,400',
    numericCost: 156400
  },
  {
    id: 'QT-2026-99874',
    mode: 'Air',
    status: 'Issued',
    validUntil: 'Aug 28, 2026',
    origin: 'Tamil Nadu',
    destination: 'Singapore (SGSIN)',
    carrier: 'Real AI Express • Estimated Transit: 8 – 9 Days',
    cargo: 'Automotive Components (10,400 kg)',
    cost: '₹1,74,800',
    numericCost: 174800
  },
  {
    id: 'QT-2026-2553',
    mode: 'Road',
    status: 'Issued',
    validUntil: 'Aug 28, 2026',
    origin: 'Tamil Nadu',
    destination: 'Singapore (SGSIN)',
    carrier: 'Real AI Express • Estimated Transit: 8 – 9 Days',
    cargo: 'Automotive Components (10,400 kg)',
    cost: '₹1,74,800',
    numericCost: 174800
  }
]

export default function UserDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('quotations') // 'quotations' | 'calculator'
  const [userName, setUserName] = useState('poiuytrewq')
  const [userEmail, setUserEmail] = useState('poiuytrewq@gmail.com')
  const [quotesList, setQuotesList] = useState(INITIAL_QUOTES)

  // Calculator State
  const [calcParams, setCalcParams] = useState({
    origin: 'Chennai (Chennai Port INMAA)',
    destination: 'Singapore (Port of Singapore SGSIN)',
    containerType: '40hc',
    containerCount: 2,
    baseFreight: 50000,
    bafPercent: 10,
    originThc: 8000,
    docFee: 3000,
    marginPercent: 15
  })
  const [isCalculated, setIsCalculated] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      // Allow demo viewing if logged in or set fallback user info
      localStorage.setItem('token', 'demo-token')
    }

    const email = localStorage.getItem('userEmail') || 'poiuytrewq@gmail.com'
    setUserEmail(email)

    const name = localStorage.getItem('userName') || email.split('@')[0]
    setUserName(name)

    const fetchBackendQuotes = async () => {
      try {
        const res = await fetch('/api/v1/quotes/', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const resData = await res.json()
          const data = resData.data || []
          if (data.length > 0) {
            const mapped = data.map(q => ({
              id: q.quote_number || q.id,
              uuid: q.id,
              mode: q.mode === 'OCEAN' ? 'Ocean' : (q.mode === 'AIR' ? 'Air' : 'Road'),
              status: q.status === 'PENDING_APPROVAL' ? 'Pending Approval' : (q.status || 'Issued'),
              validUntil: 'Aug 28, 2026',
              origin: q.shipment?.origin_code || 'Chennai Port',
              destination: q.shipment?.destination_code || 'Singapore Port',
              carrier: 'Maersk Line Direct Service • Estimated Transit: 5 – 6 Days',
              cargo: q.shipment?.gross_weight_kg ? `${q.shipment.gross_weight_kg} kg Cargo` : 'Commercial Goods',
              cost: `₹${parseFloat(q.latest_version?.final_quote || 148350).toLocaleString('en-IN')}`,
              numericCost: parseFloat(q.latest_version?.final_quote || 148350)
            }))
            setQuotesList(mapped)
          }
        }
      } catch (err) {
        console.warn('Dashboard quote fetch error:', err)
      }
    }

    fetchBackendQuotes()

    // Load any dynamic quotes from localStorage if present
    try {
      const stored = localStorage.getItem('freightiq_local_quotes')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) {
          const mapped = parsed.map(q => ({
            id: q.id || `QT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            mode: q.mode || 'Ocean',
            status: q.status || 'Issued',
            validUntil: 'Aug 28, 2026',
            origin: q.origin || 'Chennai Port',
            destination: q.destination || 'Singapore Port',
            carrier: 'Maersk Line Direct Service • Estimated Transit: 5 – 6 Days',
            cargo: q.weight ? `${q.weight} kg Cargo` : 'Commercial Goods',
            cost: `₹${parseFloat(q.cost || 148350).toLocaleString('en-IN')}`,
            numericCost: parseFloat(q.cost || 148350)
          }))
          setQuotesList(prev => {
            const ids = new Set(prev.map(p => p.id))
            const filteredNew = mapped.filter(m => !ids.has(m.id))
            return [...filteredNew, ...prev]
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [navigate])

  // Calculation math
  const baseTotal = calcParams.containerCount * calcParams.baseFreight
  const bafTotal = baseTotal * (calcParams.bafPercent / 100)
  const thcTotal = calcParams.containerCount * calcParams.originThc
  const docTotal = calcParams.docFee
  const totalBuyCost = baseTotal + bafTotal + thcTotal + docTotal
  const marginAmount = totalBuyCost * (calcParams.marginPercent / 100)
  const finalSellPrice = totalBuyCost + marginAmount

  const handleResetDefaults = () => {
    setCalcParams({
      origin: 'Chennai (Chennai Port INMAA)',
      destination: 'Singapore (Port of Singapore SGSIN)',
      containerType: '40hc',
      containerCount: 2,
      baseFreight: 50000,
      bafPercent: 10,
      originThc: 8000,
      docFee: 3000,
      marginPercent: 15
    })
    setIsCalculated(false)
  }

  const handleSaveAsQuote = () => {
    const newQuote = {
      id: `QT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      mode: 'Ocean',
      status: 'Issued',
      validUntil: 'Aug 28, 2026',
      origin: 'Chennai Port',
      destination: 'Singapore Port',
      carrier: 'Maersk Line Direct Service • Estimated Transit: 5 – 6 Days',
      cargo: `${calcParams.containerCount} × 40HC Containers`,
      cost: `₹${Math.round(finalSellPrice).toLocaleString('en-IN')}`,
      numericCost: finalSellPrice
    }
    setQuotesList(prev => [newQuote, ...prev])
    setActiveTab('quotations')
    alert('Quote saved successfully to Active Quotations!')
  }

  const handleAcceptQuote = (quote) => {
    const newShipmentId = `SH-${Math.floor(4100 + Math.random() * 800)}`
    const weightStr = quote.cargo?.includes('kg') 
      ? quote.cargo.match(/[\d,.]+\s*kg/)?.[0] || '18,400 kg'
      : '18,400 kg'
    const cleanWeightNum = weightStr.replace(/[^\d]/g, '') || '18400'

    const newShipment = {
      id: newShipmentId,
      origin: quote.origin || 'Tamil Nadu',
      destination: quote.destination || 'Singapore (SGSIN)',
      mode: quote.mode || 'Ocean',
      status: 'Pending Pickup',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      shippingMethod: 'FCL',
      items: [
        { 
          id: 1, 
          packageType: 'container', 
          containerType: '40hc', 
          unitCount: '1', 
          weight: cleanWeightNum, 
          commodity: 'Commercial Export Goods', 
          hsCode: '8471.30' 
        }
      ],
      declaredValue: quote.numericCost ? String(quote.numericCost) : '237360',
      currency: 'INR',
      specialInstructions: `Booking confirmed from Quotation ${quote.id}. Dispatch instructions active.`
    }

    try {
      const storedShipments = JSON.parse(localStorage.getItem('freightiq_local_shipments') || '[]')
      localStorage.setItem('freightiq_local_shipments', JSON.stringify([newShipment, ...storedShipments]))
    } catch (e) {
      console.error(e)
    }

    setQuotesList(prev => prev.map(item => item.id === quote.id ? { ...item, status: 'Accepted' } : item))
    alert(`Quote ${quote.id} Accepted!\n\nShipment ${newShipmentId} (${quote.origin || 'Tamil Nadu'} → ${quote.destination || 'Singapore (SGSIN)'}) created and added to your System Shipments Ledger.\n\nRedirecting to Shipments...`)
    navigate('/dashboard/shipments')
  }

  const getModeIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'air': return <Plane className="w-4 h-4 text-sky-500" />
      case 'ocean': return <Anchor className="w-4 h-4 text-blue-600" />
      case 'rail': return <Train className="w-4 h-4 text-purple-600" />
      default: return <Truck className="w-4 h-4 text-indigo-500" />
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Main Workspace */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard" 
              onClick={() => setActiveTab('quotations')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <button 
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'calculator' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ZapIcon className="w-3.5 h-3.5 text-amber-500" /> Instant Quote Calculator
            </button>
            <button 
              onClick={() => navigate('/dashboard/new-shipment')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl hidden sm:flex items-center gap-1.5 transition-all"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-600" /> 5-Agent Multi-Verification
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Deterministic M2 Calculation Ready
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl pointer-events-none rounded-full" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="px-3 py-1 text-[10px] font-extrabold text-blue-200 bg-white/10 border border-white/20 rounded-full inline-flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Customer Portal
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome back, {userName}</h2>
                <p className="text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
                  Track active shipments, test live freight calculations (Base Freight, BAF, THC, Docs & Margin), and issue verified quotes.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Calculator className="w-4 h-4" /> Quote Calculator
                </button>
                <Link
                  to="/dashboard/new-shipment"
                  className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> 5-Agent Verification
                </Link>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">ACTIVE SHIPMENTS</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">5</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Truck className="w-5.5 h-5.5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">PENDING QUOTATIONS</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">11</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <FileText className="w-5.5 h-5.5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">BOOKED FREIGHT</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">₹7,94,500</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <TrendingUp className="w-5.5 h-5.5" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">AVERAGE TRANSIT</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">4.8 Days</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Clock className="w-5.5 h-5.5" />
              </div>
            </div>
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

          {/* Toggle Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('quotations')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quotations'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Active Quotations (11)
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Interactive Quote Calculator (Chennai – Singapore)
            </button>
          </div>

          {/* TAB 1: ACTIVE QUOTATIONS & ENQUIRIES */}
          {activeTab === 'quotations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Your Active Quotations & Enquiries</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Review commercial proposals with guaranteed validity timers and transparent pricing.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('calculator')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  ⚡ Open Calculator <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {quotesList.map((q) => (
                  <div 
                    key={q.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      {/* Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">{q.id}</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                          {getModeIcon(q.mode)} {q.mode}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Issued</span>
                        <span className="text-slate-400 font-medium">Valid until: <strong className="text-slate-700">{q.validUntil}</strong></span>
                      </div>

                      {/* Corridor Heading */}
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-black text-base">📍</span>
                        <h4 className="text-base font-extrabold text-slate-900">{q.origin} → {q.destination}</h4>
                      </div>

                      {/* Sub-text info */}
                      <p className="text-xs text-slate-500 font-medium">
                        Carrier Service: <strong className="text-slate-700">{q.carrier}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Cargo: {q.cargo}
                      </p>
                    </div>

                    {/* Right side pricing & action buttons */}
                    <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <div className="text-right">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">TOTAL ALL-IN SELL RATE</span>
                        <span className="text-xl font-black text-slate-900">{q.cost}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleAcceptQuote(q)}
                          disabled={q.status === 'Accepted'}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                            q.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {q.status === 'Accepted' ? '✓ Accepted' : 'Accept Quote'}
                        </button>
                        <button 
                          onClick={() => alert(`Quote ${q.id} declined.`)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                        <button 
                          onClick={() => alert(`Downloading official PDF quote manifest for ${q.id}...`)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                          title="Download Quote PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE QUOTE CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 text-[9px] font-extrabold text-blue-400 bg-blue-500/10 border border-blue-400/20 rounded-full inline-flex items-center gap-1 uppercase tracking-wider">
                      <Calculator className="w-3 h-3" /> Deterministic 5-Step Pricing Formula
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">Freight Quote Calculation Engine</h3>
                    <p className="text-slate-400 text-xs font-medium max-w-2xl">
                      Input container count, base rate, surcharges, and margin to compute total buy cost and client sell price.
                    </p>
                  </div>
                  <button
                    onClick={handleResetDefaults}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                  </button>
                </div>
              </div>

              {/* Calculator Section Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Card: Input Parameters */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                      <h4 className="font-extrabold text-slate-900 text-sm">Input Parameters</h4>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">EXACT USER TEST SPEC</span>
                  </div>

                  <div className="space-y-4">
                    {/* Origin & Destination */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">📍 FROM (ORIGIN)</label>
                        <select
                          value={calcParams.origin}
                          onChange={(e) => setCalcParams(prev => ({ ...prev, origin: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Chennai (Chennai Port INMAA)">Chennai (Chennai Port INMAA)</option>
                          <option value="Singapore (Port of Singapore SGSIN)">Singapore (Port of Singapore SGSIN)</option>
                          <option value="Nhava Sheva / JNPT (INNSA)">Nhava Sheva / JNPT (INNSA)</option>
                          <option value="Jebel Ali Port (AEJEA)">Jebel Ali Port (AEJEA)</option>
                          <option value="Port of Los Angeles (USLAX)">Port of Los Angeles (USLAX)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">📍 TO (DESTINATION)</label>
                        <select
                          value={calcParams.destination}
                          onChange={(e) => setCalcParams(prev => ({ ...prev, destination: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Singapore (Port of Singapore SGSIN)">Singapore (Port of Singapore SGSIN)</option>
                          <option value="Chennai (Chennai Port INMAA)">Chennai (Chennai Port INMAA)</option>
                          <option value="Nhava Sheva / JNPT (INNSA)">Nhava Sheva / JNPT (INNSA)</option>
                          <option value="Jebel Ali Port (AEJEA)">Jebel Ali Port (AEJEA)</option>
                          <option value="Port of Los Angeles (USLAX)">Port of Los Angeles (USLAX)</option>
                        </select>
                      </div>
                    </div>

                    {/* Container Type & Count */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">📦 CONTAINER TYPE</label>
                        <select
                          value={calcParams.containerType}
                          onChange={(e) => setCalcParams(prev => ({ ...prev, containerType: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                        >
                          <option value="40hc">40' High Cube (40HC)</option>
                          <option value="20gp">20' General Purpose (20GP)</option>
                          <option value="40gp">40' General Purpose (40GP)</option>
                          <option value="20rf">20' Reefer (20RF)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">CONTAINER COUNT</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={calcParams.containerCount}
                          onChange={(e) => setCalcParams(prev => ({ ...prev, containerCount: parseInt(e.target.value) || 1 }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    {/* Base Freight & BAF Surcharge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">BASE FREIGHT / CONTAINER (₹)</label>
                        <input
                          type="number"
                          step="1000"
                          value={calcParams.baseFreight}
                          onChange={(e) => setCalcParams(prev => ({ ...prev, baseFreight: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">BAF FUEL SURCHARGE (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1"
                            value={calcParams.bafPercent}
                            onChange={(e) => setCalcParams(prev => ({ ...prev, bafPercent: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 pr-8"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Origin THC & Doc Fee */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">ORIGIN THC / CONTAINER (₹)</label>
                        <input
                          type="number"
                          step="500"
                          value={calcParams.originThc}
                          onChange={(e) => setCalcParams(prev => ({ ...prev, originThc: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">DOCUMENTATION FEE (₹)</label>
                        <input
                          type="number"
                          step="500"
                          value={calcParams.docFee}
                          onChange={(e) => setCalcParams(prev => ({ ...prev, docFee: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    {/* Commercial Profit Margin Slider */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-extrabold">
                        <span className="text-slate-600 uppercase tracking-wider flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> COMMERCIAL PROFIT MARGIN MARKUP
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md border font-bold ${
                          calcParams.marginPercent < 5
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {calcParams.marginPercent}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="35"
                        step="1"
                        value={calcParams.marginPercent}
                        onChange={(e) => setCalcParams(prev => ({ ...prev, marginPercent: parseInt(e.target.value) || 0 }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>Floor: 5%</span>
                        <span>Test: 15%</span>
                        <span>Max: 35%</span>
                      </div>

                      {calcParams.marginPercent < 5 && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold flex items-center gap-2 mt-2">
                          <span className="shrink-0">⚠️</span>
                          <span><strong>Below Margin Floor Warning:</strong> Commercial margin ({calcParams.marginPercent}%) is below the minimum required 5.0% threshold. Requires Senior Broker approval.</span>
                        </div>
                      )}
                    </div>

                    {/* Calculate Quote Button */}
                    <button
                      onClick={() => setIsCalculated(true)}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 active:scale-98 cursor-pointer mt-4"
                    >
                      <Calculator className="w-4 h-4" /> Calculate Quote
                    </button>
                  </div>
                </div>

                {/* Right Card: Calculation Results */}
                <div className="lg:col-span-5 flex flex-col">
                  {!isCalculated ? (
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex-1 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <Calculator className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">Ready for Calculation</h4>
                        <p className="text-xs text-slate-500 font-medium max-w-xs mt-1 leading-relaxed">
                          Click "Calculate Quote" on the left to evaluate Base Freight, BAF, THC, Documentation, and {calcParams.marginPercent}% Margin.
                        </p>
                      </div>

                      <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs font-mono space-y-1">
                        <span className="text-[10px] font-sans font-extrabold text-slate-400 uppercase block">PRESET TEST SCENARIO:</span>
                        <p className="text-slate-700">• Corridor: {calcParams.origin.split(' ')[0]} → {calcParams.destination.split(' ')[0]}</p>
                        <p className="text-slate-700">• Cargo: {calcParams.containerCount} x 40HC Containers</p>
                        <p className="text-slate-700">• Total Cost: ₹{totalBuyCost.toLocaleString('en-IN')}</p>
                        <p className="text-slate-700">• Margin: {calcParams.marginPercent}% (₹{Math.round(marginAmount).toLocaleString('en-IN')})</p>
                        <p className="text-blue-600 font-bold">• Sell Price: ₹{Math.round(finalSellPrice).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-xl flex-1 flex flex-col justify-between space-y-6 border border-slate-800">
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <span className="px-2.5 py-0.5 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 rounded-full flex items-center gap-1 uppercase">
                            <CheckCircle2 className="w-3 h-3" /> QUOTE CALCULATION
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">{calcParams.containerType.toUpperCase()} × {calcParams.containerCount} Containers</span>
                        </div>

                        <div>
                          <h4 className="text-lg font-black text-white">{calcParams.origin.split(' ')[0]} → {calcParams.destination.split(' ')[0]}</h4>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">40HC × {calcParams.containerCount} Containers</p>
                        </div>

                        {/* Breakdown List */}
                        <div className="space-y-2.5 text-xs font-mono pt-2">
                          <div className="flex justify-between text-slate-300">
                            <span>Base Freight ({calcParams.containerCount} × ₹{calcParams.baseFreight.toLocaleString('en-IN')}):</span>
                            <span className="font-bold">₹{baseTotal.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="flex justify-between text-slate-300">
                            <span>BAF ({calcParams.bafPercent}% of Base):</span>
                            <span className="font-bold">₹{bafTotal.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="flex justify-between text-slate-300">
                            <span>Origin THC ({calcParams.containerCount} × ₹{calcParams.originThc.toLocaleString('en-IN')}):</span>
                            <span className="font-bold">₹{thcTotal.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="flex justify-between text-slate-300">
                            <span>Documentation:</span>
                            <span className="font-bold">₹{docTotal.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[11px]">
                            <span>TOTAL BUY COST:</span>
                            <span className="font-bold">₹{totalBuyCost.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="flex justify-between text-emerald-400 text-xs">
                            <span>Margin ({calcParams.marginPercent}%):</span>
                            <span className="font-bold">+ ₹{Math.round(marginAmount).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Final Invoiced Price Card */}
                      <div className="p-4 rounded-2xl bg-blue-900/60 border border-blue-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-extrabold text-blue-300 uppercase tracking-wider block">FINAL SELL PRICE</span>
                          <span className="text-[10px] text-blue-200 font-medium">Client Invoiced Total</span>
                        </div>
                        <span className="text-2xl font-black text-emerald-400 font-mono">₹{Math.round(finalSellPrice).toLocaleString('en-IN')}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => alert('Downloading PDF official quote summary...')}
                          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </button>
                        <button
                          onClick={handleSaveAsQuote}
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Save as Quote
                        </button>
                      </div>

                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}

function ZapIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}
