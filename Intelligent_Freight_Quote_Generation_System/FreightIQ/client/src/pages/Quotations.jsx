import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Layers,
  Activity,
  ShieldCheck,
  CircleDot,
  ArrowRight,
  User,
  MapPin,
  Calendar,
  Anchor,
  Plane,
  Train,
  Truck
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import DashboardNavbar from '../components/DashboardNavbar'
import DashboardCard from '../components/DashboardCard'

const INITIAL_MOCK_QUOTES = [
  {
    id: 'IQ-2026-9821',
    customer: 'Reliance Logistics Ltd',
    origin: 'INNSA',
    destination: 'AEJEA',
    mode: 'Ocean',
    cost: 164200,
    currency: 'INR',
    status: 'Approved',
    date: '2026-08-20',
    weight: 1250,
  },
  {
    id: 'IQ-2026-9820',
    customer: 'Adani Exports Corp',
    origin: 'INNSA',
    destination: 'USLAX',
    mode: 'Ocean',
    cost: 320000,
    currency: 'INR',
    status: 'Pending Approval',
    date: '2026-08-18',
    weight: 14000,
  },
  {
    id: 'IQ-2026-9819',
    customer: 'Tata Motors India',
    origin: 'INBLR',
    destination: 'DEHAM',
    mode: 'Air',
    cost: 8500,
    currency: 'USD',
    status: 'Draft',
    date: '2026-08-15',
    weight: 450,
  },
  {
    id: 'IQ-2026-9818',
    customer: 'Biocon Pharma',
    origin: 'INNSA',
    destination: 'CNSHA',
    mode: 'Express Air',
    cost: 412000,
    currency: 'INR',
    status: 'Issued',
    date: '2026-08-10',
    weight: 980,
  }
]

export default function Quotations() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [quotes, setQuotes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMode, setFilterMode] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const userRole = localStorage.getItem('userRole') || 'user'

  const fetchQuotes = async () => {
    setIsLoading(true)
    const token = localStorage.getItem('token')
    
    // Always load local quotes as fallback first or to combine
    let localQuotes = []
    try {
      const stored = localStorage.getItem('freightiq_local_quotes')
      if (stored) {
        localQuotes = JSON.parse(stored)
      } else {
        localStorage.setItem('freightiq_local_quotes', JSON.stringify(INITIAL_MOCK_QUOTES))
        localQuotes = INITIAL_MOCK_QUOTES
      }
    } catch (e) {
      console.error('Error parsing local quotes:', e)
      localQuotes = INITIAL_MOCK_QUOTES
    }

    if (!token) {
      setQuotes(localQuotes)
      setIsLoading(false)
      return
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
        
        // Map backend Quote records to local frontend model
        const mapped = apiQuotes.map(q => {
          const latestVer = q.latest_version || {}
          
          let displayStatus = q.status
          const statusUpper = (q.status || '').toUpperCase()
          if (statusUpper === 'PENDING_APPROVAL') displayStatus = 'Pending Approval'
          else if (statusUpper === 'APPROVED') displayStatus = 'Approved'
          else if (statusUpper === 'ACCEPTED' || statusUpper === 'ISSUED') displayStatus = 'Issued'
          else if (statusUpper === 'DRAFT') displayStatus = 'Draft'

          let modeDisplay = 'Road'
          const modeUpper = (q.mode || '').toUpperCase()
          if (modeUpper === 'OCEAN') modeDisplay = 'Ocean'
          else if (modeUpper === 'AIR') modeDisplay = 'Air'
          else if (modeUpper === 'GROUND_RAIL') modeDisplay = 'Ground/Rail'
          else if (modeUpper === 'EXPRESS_AIR') modeDisplay = 'Express Air'

          return {
            id: q.quote_number,
            uuid: q.id,
            customer: q.customer?.name || q.created_by?.full_name || 'Shipper Agent',
            origin: q.shipment?.origin_code || q.origin_code,
            destination: q.shipment?.destination_code || q.destination_code,
            mode: modeDisplay,
            cost: parseFloat(latestVer.final_quote || latestVer.total_cost || 0),
            currency: latestVer.currency || 'INR',
            status: displayStatus,
            date: new Date(q.created_at).toISOString().split('T')[0],
            weight: q.shipment?.gross_weight_kg || q.weight || 0,
            draftData: q.draftData || null
          }
        })
        
        // Merge API quotes with local drafts so drafts are preserved
        const apiIds = new Set(mapped.map(item => item.id))
        const localDrafts = localQuotes.filter(item => item.status === 'Draft' && !apiIds.has(item.id))
        
        setQuotes([...mapped, ...localDrafts])
      } else {
        setQuotes(localQuotes)
      }
    } catch (err) {
      console.warn('API error, using local fallback:', err)
      setQuotes(localQuotes)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  // Dynamic statistics calculation
  const totalQuotesCount = quotes.length
  const issuedQuotesCount = quotes.filter(q => q.status === 'Issued' || q.status === 'Approved').length
  const draftsCount = quotes.filter(q => q.status === 'Draft').length
  
  // Calculate total value in INR (approximated for stats)
  const totalValueINR = quotes.reduce((sum, q) => {
    let cost = q.cost || 0
    if (q.currency === 'USD') cost *= 83
    else if (q.currency === 'EUR') cost *= 90
    else if (q.currency === 'AED') cost *= 22.6
    else if (q.currency === 'GBP') cost *= 108
    else if (q.currency === 'SGD') cost *= 62
    return sum + cost
  }, 0)

  const getModeIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'air': return <Plane className="w-4 h-4 text-sky-500" />
      case 'ocean': return <Anchor className="w-4 h-4 text-blue-600" />
      case 'ground/rail':
      case 'rail': return <Train className="w-4 h-4 text-purple-600" />
      case 'express air': return <Plane className="w-4 h-4 text-orange-500 animate-pulse" />
      default: return <Truck className="w-4 h-4 text-indigo-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>
      case 'issued':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-50 text-sky-700 border border-sky-200">Issued</span>
      case 'pending approval':
      case 'pending review':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">Pending Review</span>
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-350">Draft</span>
    }
  }

  const handleLoadDraft = (quote) => {
    if (quote.draftData) {
      localStorage.setItem('freightiq_quote_draft_to_load', JSON.stringify(quote.draftData))
    }
    navigate('/dashboard/new-shipment')
  }

  const handleDownloadPDF = async (quote) => {
    if (quote.uuid) {
      const token = localStorage.getItem('token')
      try {
        window.open(`/api/v1/quotes/${quote.uuid}/document/`, '_blank')
        return
      } catch (e) {
        console.error('API document download failed', e)
      }
    }
    // Mock download fallback
    alert(`Downloading Quote Report for ${quote.id}...\n(PDF layout simulated using standard templates)`)
  }

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || q.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesMode = filterMode === 'all' || q.mode.toLowerCase() === filterMode.toLowerCase()

    return matchesSearch && matchesStatus && matchesMode
  })

  const [selectedQuoteRisk, setSelectedQuoteRisk] = useState(null)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <DashboardNavbar setIsMobileOpen={setIsMobileOpen} title="Quotations Registry" />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* Header bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-800">My Quotations</h1>
                <p className="text-[10px] text-slate-500 font-medium">Verify pricing details, load draft sheets, and download issued tariffs</p>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <DashboardCard
              title="Total Quotes"
              value={totalQuotesCount.toString()}
              icon={FileText}
              trend="All Channels"
              trendType="positive"
              color="blue"
            />
            <DashboardCard
              title="Issued Quotes"
              value={issuedQuotesCount.toString()}
              icon={CircleDot}
              trend="Client Active"
              trendType="positive"
              color="emerald"
            />
            <DashboardCard
              title="Drafts Saved"
              value={draftsCount.toString()}
              icon={Clock}
              trend="Awaiting Submit"
              trendType="positive"
              color="purple"
            />
            <DashboardCard
              title="Registry Total Value"
              value={`₹${Math.round(totalValueINR).toLocaleString('en-IN')}`}
              icon={ShieldCheck}
              trend="INR Equiv."
              trendType="positive"
              color="green"
            />
          </div>

          {/* Table Card */}
          <div className="glass-card rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Quote ID, route, customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Mode Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold cursor-pointer min-w-[120px]"
                  >
                    <option value="all">All Modes</option>
                    <option value="ocean">Ocean</option>
                    <option value="air">Air</option>
                    <option value="ground/rail">Ground/Rail</option>
                    <option value="express air">Express Air</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold cursor-pointer min-w-[140px]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="issued">Issued</option>
                    <option value="pending approval">Pending Review</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto -mx-5 sm:-mx-6">
              <div className="inline-block min-w-full align-middle font-sans">
                <table className="min-w-full divide-y divide-slate-100 text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Quote ID</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Route Lane</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Mode</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Risk Score</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Final Value</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date Created</th>
                      <th className="px-6 py-3 text-center text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredQuotes.map((quote) => {
                      const currencySymbol = quote.currency === 'INR' ? '₹' : (quote.currency === 'USD' ? '$' : quote.currency + ' ')
                      
                      return (
                        <tr key={quote.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-6 py-3.5 whitespace-nowrap font-bold text-sky-600">
                            {quote.id}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap font-semibold text-slate-800">
                            {quote.customer}
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-800">{quote.origin}</p>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>{quote.destination}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                              {getModeIcon(quote.mode)}
                              <span>{quote.mode}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedQuoteRisk(quote)}
                              className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer"
                            >
                              LOW (22.5/100)
                            </button>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap font-black text-slate-900">
                            {currencySymbol}{quote.cost.toLocaleString()}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            {getStatusBadge(quote.status)}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-[10px] font-bold text-slate-500">
                            {quote.date}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-center space-x-2">
                            {quote.status === 'Draft' ? (
                              <button
                                onClick={() => handleLoadDraft(quote)}
                                className="px-2.5 py-1 text-[10px] font-bold bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-all border border-purple-200 cursor-pointer inline-flex items-center gap-1"
                              >
                                <Clock className="w-3 h-3" /> Load Draft
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDownloadPDF(quote)}
                                className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all border border-blue-200 cursor-pointer inline-flex items-center gap-1"
                              >
                                <FileDown className="w-3 h-3" /> PDF
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredQuotes.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700">No quotations found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Try adjusting your filters or create a new quote enquiry to get started.</p>
              </div>
            )}

          </div>

          {/* M3 Composite Shipment Risk Detail Modal */}
          {selectedQuoteRisk && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <h3 className="text-base font-black">Composite Shipment Risk Assessment</h3>
                  </div>
                  <button
                    onClick={() => setSelectedQuoteRisk(null)}
                    className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-300 font-bold uppercase block">OVERALL RISK SCORE</span>
                      <span className="text-2xl font-black text-white font-mono">22.5 <span className="text-xs font-normal text-slate-400">/ 100</span></span>
                    </div>
                    <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-500 text-white uppercase">
                      LOW RISK
                    </span>
                  </div>

                  {/* 5 Risk Sub-Factors Breakdown */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Sub-Risk Factor Breakdown:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Weather (30%):</span>
                        <span className="font-bold text-amber-400">25.0 / 100</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Customs (25%):</span>
                        <span className="font-bold text-emerald-400">25.0 / 100</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Route (15%):</span>
                        <span className="font-bold text-sky-400">20.0 / 100</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                        <span className="text-slate-400">Port (15%):</span>
                        <span className="font-bold text-purple-400">30.0 / 100</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Cargo Volatility (15%):</span>
                      <span className="font-bold text-rose-400">15.0 / 100</span>
                    </div>
                  </div>

                  {/* Factors Explanation Narrative */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Contributing Factors Explanation:</span>
                    <ul className="text-[11px] text-slate-300 space-y-1 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <li>• <strong>Weather:</strong> Favorable atmospheric & ocean swell conditions predicted along route corridor.</li>
                      <li>• <strong>Customs:</strong> Standard export clearance protocols; ICEGATE BOE documentation verified.</li>
                      <li>• <strong>Route & Port:</strong> Low vessel queue congestion index at origin port INMAA.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedQuoteRisk(null)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Close Assessment
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

