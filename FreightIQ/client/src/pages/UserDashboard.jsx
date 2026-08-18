import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Truck, 
  PlusCircle, 
  Layers, 
  CircleDot, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Plane, 
  Anchor, 
  Train 
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
  }
]

export default function UserDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [quotes, setQuotes] = useState([])
  const [userName, setUserName] = useState('Shipper')
  const navigate = useNavigate()

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const name = localStorage.getItem('userName') || 'Shipper Agent'
    setUserName(name)

    // Load user-specific quotes (or fallback)
    const storedQuotes = localStorage.getItem('brokerQuotes')
    if (storedQuotes) {
      try {
        const parsed = JSON.parse(storedQuotes)
        setQuotes(parsed)
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
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-350">Draft</span>
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Main Workspace */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <DashboardNavbar setIsMobileOpen={setIsMobileOpen} title="Shipper Portal" />

        {/* Dashboard Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl border border-slate-800 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-450/20 to-transparent blur-3xl pointer-events-none rounded-full" />
            <div className="relative z-10 space-y-1">
              <span className="px-2.5 py-0.5 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 rounded-full inline-flex items-center gap-1 uppercase tracking-wide">
                <Sparkles className="w-2.5 h-2.5" /> Shipper Workspace Active
              </span>
              <h2 className="text-xl sm:text-2xl font-black">Welcome Back, {userName}</h2>
              <p className="text-slate-400 text-xs font-medium">
                Submit raw cargo specifications, simulate lane dispatches, and track operational CO2 offsets.
              </p>
            </div>
            <Link
              to="/dashboard/new-shipment"
              className="relative shrink-0 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-650 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/10 hover:shadow-sky-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> New Shipment Enquiry
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <DashboardCard 
              title="Active Cargo Lanes" 
              value="3" 
              icon={Layers} 
              trend="+0.0%" 
              trendType="positive"
              color="blue"
            />
            <DashboardCard 
              title="My Shipment Quotes" 
              value={quotes.length.toString()} 
              icon={CircleDot} 
              trend="All Channels"
              trendType="positive"
              color="purple"
            />
            <DashboardCard 
              title="Pending Quotations" 
              value={quotes.filter(q => q.status.toLowerCase().includes('pending')).length.toString()} 
              icon={Activity} 
              trend="Awaiting Broker review" 
              trendType="positive"
              color="amber"
            />
            <DashboardCard 
              title="ESG Carbon Savings" 
              value="14.8 t" 
              icon={ShieldCheck} 
              trend="Clean Route Opt" 
              trendType="positive"
              color="green"
            />
          </div>

          {/* Recent Quotations Table */}
          <div className="glass-card rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">Recent Shipment Enquiries</h3>
                <p className="text-[10px] text-slate-500">History of shippers simulated quote calculations</p>
              </div>
              <Link to="/dashboard/new-shipment" className="text-xs font-bold text-sky-600 hover:underline">
                Create New
              </Link>
            </div>

            <div className="overflow-x-auto -mx-5 sm:-mx-6">
              <div className="inline-block min-w-full align-middle font-sans">
                <table className="min-w-full divide-y divide-slate-100 text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Quote ID</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Route Lane</th>
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
                        className="hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-6 py-3.5 whitespace-nowrap font-bold text-sky-600">
                          {quote.id}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-800">{quote.origin}</p>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-450" />
                              <span className="text-[10px] text-slate-505">{quote.destination}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            {getModeIcon(quote.mode)}
                            <span>{quote.mode}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap font-extrabold text-slate-900">
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
                <p className="text-xs text-slate-505 mt-1 max-w-xs">Create your first shipment enquiry parameters to invoke the AI cost matching calculation.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}
