import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  Filter,
  Bell,
  AlertTriangle,
  ShieldAlert,
  CloudRain,
  FileCheck2,
  CheckCircle2,
  Cpu,
  Clock,
  ExternalLink,
  Plus,
  X,
  Sparkles,
  RefreshCw,
  Anchor,
  Zap
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import DashboardNavbar from '../components/DashboardNavbar'
import DashboardCard from '../components/DashboardCard'

const DEFAULT_ALERTS = [
  {
    id: 'ALT-2026-101',
    title: 'Severe Weather Swell Warning',
    alert_type: 'WEATHER_RISK',
    severity: 'HIGH',
    message: 'South-West Monsoon swell active along Chennai (INMAA) → Shanghai (CNSHA) maritime corridor. Est. transit delay buffer: +3.5 days.',
    timestamp: 'Today, 14:15',
    status: 'UNACKNOWLEDGED',
    acknowledged: false,
    action_link: '/dashboard/new-shipment'
  },
  {
    id: 'ALT-2026-102',
    title: 'Customs Compliance Hold Risk',
    alert_type: 'CUSTOMS_RISK',
    severity: 'CRITICAL',
    message: 'Dangerous Goods Declaration (DGD) and Certificate of Origin missing for shipment INNSA → USLAX. Action required prior to port entry.',
    timestamp: 'Today, 13:45',
    status: 'UNACKNOWLEDGED',
    acknowledged: false,
    action_link: '/dashboard/quotations'
  },
  {
    id: 'ALT-2026-103',
    title: 'High Composite Shipment Risk',
    alert_type: 'SHIPMENT_RISK',
    severity: 'HIGH',
    message: 'Shipment QT-2026-9820 evaluated with Composite Risk Score 53.5/100 (HIGH). Manager approval required before carrier booking.',
    timestamp: 'Today, 12:30',
    status: 'UNACKNOWLEDGED',
    acknowledged: false,
    action_link: '/dashboard/quotations'
  },
  {
    id: 'ALT-2026-104',
    title: 'Nhava Sheva Port Congestion Notice',
    alert_type: 'SHIPMENT_RISK',
    severity: 'MEDIUM',
    message: 'Port of Nhava Sheva (JNPT) experiencing 48hr berth congestion delay due to container terminal crane maintenance.',
    timestamp: 'Today, 11:10',
    status: 'UNACKNOWLEDGED',
    acknowledged: false,
    action_link: '/dashboard'
  },
  {
    id: 'ALT-2026-105',
    title: 'Bunker Fuel Surcharge Spike',
    alert_type: 'ML_PRICE',
    severity: 'MEDIUM',
    message: 'Fuel price index increased by +4.2%. ML rate predictor auto-adjusting ocean freight spot rate forecasts.',
    timestamp: 'Today, 09:15',
    status: 'ACKNOWLEDGED',
    acknowledged: true,
    action_link: '/dashboard/master-data'
  },
  {
    id: 'ALT-2026-106',
    title: 'ML Price Prediction Variance',
    alert_type: 'ML_PRICE',
    severity: 'INFO',
    message: 'GradientBoosting ML model predicted ₹2,31,500 vs rule-based cost ₹2,37,360 (-2.47% variance corridor).',
    timestamp: 'Yesterday, 18:00',
    status: 'ACKNOWLEDGED',
    acknowledged: true,
    action_link: '/dashboard/master-data'
  }
]

export default function AlertsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  // Modal State for Adding New Alert
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('WEATHER_RISK')
  const [newSeverity, setNewSeverity] = useState('HIGH')
  const [newMessage, setNewMessage] = useState('')
  const [newActionLink, setNewActionLink] = useState('/dashboard/quotations')

  const navigate = useNavigate()

  const fetchAlerts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/v1/alerts/')
      if (res.ok) {
        const resData = await res.json()
        if (resData.data && Array.isArray(resData.data) && resData.data.length > 0) {
          setAlerts(resData.data)
        } else {
          setAlerts(DEFAULT_ALERTS)
        }
      } else {
        setAlerts(DEFAULT_ALERTS)
      }
    } catch (e) {
      console.warn('Backend alert endpoint unavailable, loading intelligent risk alerts:', e)
      setAlerts(DEFAULT_ALERTS)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const handleAcknowledge = async (alertId) => {
    // Optimistic update
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, acknowledged: true, status: 'ACKNOWLEDGED' } : a
    ))

    try {
      await fetch(`/api/v1/alerts/${alertId}/acknowledge/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (e) {
      console.error('Error acknowledging alert:', e)
    }
  }

  const handleCreateAlert = async (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newMessage.trim()) return

    const newAlertObj = {
      id: `ALT-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      alert_type: newType,
      severity: newSeverity,
      message: newMessage.trim(),
      timestamp: 'Just Now',
      status: 'UNACKNOWLEDGED',
      acknowledged: false,
      action_link: newActionLink || '/dashboard'
    }

    setAlerts(prev => [newAlertObj, ...prev])
    setShowAddModal(false)

    // Reset form
    setNewTitle('')
    setNewMessage('')

    // Try posting to backend
    try {
      await fetch('/api/v1/alerts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAlertObj.title,
          alert_type: newAlertObj.alert_type,
          severity: newAlertObj.severity,
          message: newAlertObj.message,
          action_link: newAlertObj.action_link
        })
      })
    } catch (err) {
      console.warn('Backend unavailable, alert added locally:', err)
    }
  }

  const handleApplyPreset = (preset) => {
    switch (preset) {
      case 'weather':
        setNewTitle('Typhoon Advisory: East China Sea Route')
        setNewType('WEATHER_RISK')
        setNewSeverity('CRITICAL')
        setNewMessage('Category 3 Typhoon warning along Shanghai (CNSHA) → Ningbo corridor. Vessel re-routing recommended.')
        setNewActionLink('/dashboard/new-shipment')
        break
      case 'customs':
        setNewTitle('Customs Tariff Audit Flag')
        setNewType('CUSTOMS_RISK')
        setNewSeverity('HIGH')
        setNewMessage('HS Code 8504.40 re-classification required for Rotterdam port entry. Potential +5% duty adjustment.')
        setNewActionLink('/dashboard/quotations')
        break
      case 'shipment':
        setNewTitle('High Risk Cargo Inspection Required')
        setNewType('SHIPMENT_RISK')
        setNewSeverity('HIGH')
        setNewMessage('High value electronics shipment QT-2026-8819 flagged for physical port security inspection.')
        setNewActionLink('/dashboard/quotations')
        break
      case 'congestion':
        setNewTitle('Port Berth Congestion Delay')
        setNewType('SHIPMENT_RISK')
        setNewSeverity('MEDIUM')
        setNewMessage('Port of Los Angeles (USLAX) reporting 72-hour container dwell time delay.')
        setNewActionLink('/dashboard')
        break
      default:
        break
    }
  }

  const getAlertIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'WEATHER_RISK':
      case 'WEATHER':
        return <CloudRain className="w-5 h-5 text-amber-500" />
      case 'CUSTOMS_RISK':
      case 'CUSTOMS':
        return <FileCheck2 className="w-5 h-5 text-rose-500" />
      case 'SHIPMENT_RISK':
        return <ShieldAlert className="w-5 h-5 text-purple-500" />
      default:
        return <Cpu className="w-5 h-5 text-blue-500" />
    }
  }

  const getSeverityBadge = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white uppercase">CRITICAL</span>
      case 'HIGH':
        return <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-black uppercase">HIGH</span>
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-yellow-400 text-black uppercase">MEDIUM</span>
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-blue-500 text-white uppercase">INFO</span>
    }
  }

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.id || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === 'all' || (a.alert_type || a.category || '').toLowerCase() === filterType.toLowerCase()
    const matchesSeverity = filterSeverity === 'all' || (a.severity || '').toLowerCase() === filterSeverity.toLowerCase()
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'unacknowledged' && !a.acknowledged) ||
      (filterStatus === 'acknowledged' && a.acknowledged)

    return matchesSearch && matchesType && matchesSeverity && matchesStatus
  })

  const unackCount = alerts.filter(a => !a.acknowledged).length
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <DashboardNavbar setIsMobileOpen={setIsMobileOpen} title="Risk Alerts Inbox" />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">

          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" /> Risk Alerts Inbox
                </h1>
                <p className="text-[10px] text-slate-500 font-medium">Real-time intelligence notifications for weather, customs holds, and shipment risk scores</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAlerts(DEFAULT_ALERTS)}
                className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Reset to default alerts"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Reset Alerts
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Risk Alert
              </button>
            </div>
          </div>

          {/* Metric Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardCard
              title="Total Active Risk Alerts"
              value={alerts.length.toString()}
              icon={Bell}
              trend="Monitored 24/7"
              trendType="positive"
              color="blue"
            />
            <DashboardCard
              title="Unacknowledged Alerts"
              value={unackCount.toString()}
              icon={AlertTriangle}
              trend="Pending Review"
              trendType="negative"
              color="purple"
            />
            <DashboardCard
              title="High / Critical Risks"
              value={criticalCount.toString()}
              icon={ShieldAlert}
              trend="Action Required"
              trendType="negative"
              color="red"
            />
          </div>

          {/* Search and Filters */}
          <div className="glass-card rounded-3xl bg-white border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search alert title, message, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Alert Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold cursor-pointer min-w-[130px]"
                >
                  <option value="all">All Risk Types</option>
                  <option value="weather_risk">Weather Risk</option>
                  <option value="customs_risk">Customs Risk</option>
                  <option value="shipment_risk">Shipment Risk</option>
                  <option value="ml_price">ML Pricing</option>
                </select>

                {/* Severity Filter */}
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold cursor-pointer min-w-[120px]"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="info">Info</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold cursor-pointer min-w-[140px]"
                >
                  <option value="all">All Statuses</option>
                  <option value="unacknowledged">Unacknowledged</option>
                  <option value="acknowledged">Acknowledged</option>
                </select>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3 pt-2">
              {filteredAlerts.map((alert) => {
                const isAck = alert.acknowledged || alert.status === 'ACKNOWLEDGED'
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isAck
                        ? 'bg-slate-50/60 border-slate-200 text-slate-600'
                        : 'bg-white border-amber-200 shadow-sm text-slate-900 ring-1 ring-amber-400/20'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                        {getAlertIcon(alert.alert_type || alert.category)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-extrabold text-slate-400">{alert.id}</span>
                          <h4 className="text-xs font-black text-slate-800">{alert.title}</h4>
                          {getSeverityBadge(alert.severity)}
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase ${
                            isAck ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isAck ? 'ACKNOWLEDGED' : 'UNACKNOWLEDGED'}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">{alert.message}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {alert.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isAck ? (
                        <span className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Acknowledge Alert
                        </button>
                      )}
                      {alert.action_link && (
                        <button
                          onClick={() => navigate(alert.action_link)}
                          className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              {filteredAlerts.length === 0 && (
                <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700">No alerts match search criteria</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Try resetting your filters or click below to generate sample risk alerts.</p>
                  <button
                    onClick={() => setAlerts(DEFAULT_ALERTS)}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Load Default Risk Alerts
                  </button>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>

      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Add New Risk Alert</h3>
                  <p className="text-xs text-slate-500">Create a real-time risk notification or use quick presets</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <label className="text-xs font-bold text-slate-600 mb-2 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Risk Presets:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('weather')}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-amber-600" /> Typhoon Warning
                  </div>
                  <div className="text-[10px] text-amber-700/80 truncate">Weather Delay advisory</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset('customs')}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-left transition-all cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-rose-900 flex items-center gap-1">
                    <FileCheck2 className="w-3 h-3 text-rose-600" /> Tariff Audit
                  </div>
                  <div className="text-[10px] text-rose-700/80 truncate">Customs document hold</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset('shipment')}
                  className="px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition-all cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-purple-600" /> Cargo Inspection
                  </div>
                  <div className="text-[10px] text-purple-700/80 truncate">High composite risk</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset('congestion')}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition-all cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                    <Anchor className="w-3 h-3 text-blue-600" /> Port Congestion
                  </div>
                  <div className="text-[10px] text-blue-700/80 truncate">Dwell time delay</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Typhoon Warning in East China Sea"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Risk Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                  >
                    <option value="WEATHER_RISK">Weather Risk</option>
                    <option value="CUSTOMS_RISK">Customs Risk</option>
                    <option value="SHIPMENT_RISK">Shipment Risk</option>
                    <option value="ML_PRICE">ML Pricing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="INFO">Info</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the risk event, route impact, or required mitigation steps..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Action Link (Optional)</label>
                <input
                  type="text"
                  placeholder="/dashboard/quotations"
                  value={newActionLink}
                  onChange={(e) => setNewActionLink(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Add Risk Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
