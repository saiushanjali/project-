import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  Truck,
  Plane,
  Anchor,
  Train,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Weight,
  Box,
  FileText,
  Info,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import DashboardNavbar from '../components/DashboardNavbar'

const PACKAGE_TYPES = [
  { value: 'container', label: 'Container' },
  { value: 'pallets', label: 'Pallet' },
  { value: 'boxes', label: 'Carton' },
  { value: 'crates', label: 'Crate' },
  { value: 'drums', label: 'Drums / Barrels' },
  { value: 'rolls', label: 'Rolls / Spools' }
]

const CONTAINER_TYPES = [
  { value: '20gp', label: "20' GP — 20ft General Purpose" },
  { value: '40gp', label: "40' GP — 40ft General Purpose" },
  { value: '40hc', label: "40' HC — 40ft High Cube" },
  { value: '20rf', label: "20' RF — 20ft Reefer" },
  { value: '40rf', label: "40' RF — 40ft Reefer" },
  { value: 'lcl', label: "LCL — Less than Container Load" },
  { value: 'none', label: "Bulk — Non-Containerized" }
]

const SHIPPING_METHODS = [
  { value: 'FCL', label: 'FCL — Full container', color: 'orange' },
  { value: 'LCL', label: 'LCL — Consolidated', color: 'blue' },
  { value: 'FOB', label: 'FOB — Free On Board', color: 'slate' }
]

const WEIGHT_LIMITS = {
  '20gp': { max: 18000, label: "20' GP" },
  '40gp': { max: 26000, label: "40' GP" },
  '40hc': { max: 26480, label: "40' HC" },
  '20rf': { max: 17000, label: "20' Reefer" },
  '40rf': { max: 25000, label: "40' Reefer" },
  'lcl': { max: 20000, label: 'LCL' },
  'none': { max: 50000, label: 'Bulk' }
}

const CURRENCIES = [
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' }
]

// Sample shipments data
const SAMPLE_SHIPMENTS = [
  {
    id: 'SH-4021',
    origin: 'Maharashtra (Mumbai Port)',
    destination: 'Delhi NCT (ICD Tughlakabad)',
    mode: 'Road',
    status: 'In Transit',
    date: 'Aug 04, 2026',
    shippingMethod: 'FCL',
    items: [
      { id: 1, packageType: 'container', containerType: '40hc', unitCount: '1', weight: '18400', commodity: 'Cotton textile rolls, unbleached', hsCode: '5208.11' }
    ],
    declaredValue: '3500000',
    currency: 'INR',
    specialInstructions: ''
  },
  {
    id: 'SH-4020',
    origin: 'Gujarat (Mundra Port)',
    destination: 'Tamil Nadu (Chennai Port)',
    mode: 'Ocean',
    status: 'Delivered',
    date: 'Aug 02, 2026',
    shippingMethod: 'FCL',
    items: [
      { id: 1, packageType: 'pallets', containerType: '20gp', unitCount: '4', weight: '8200', commodity: 'Pharmaceutical raw chemicals', hsCode: '2933.39' },
      { id: 2, packageType: 'boxes', containerType: '20gp', unitCount: '12', weight: '3500', commodity: 'Medical devices, sterile packed', hsCode: '9018.90' }
    ],
    declaredValue: '8500000',
    currency: 'INR',
    specialInstructions: 'Temperature controlled storage required. Handle with care.'
  },
  {
    id: 'SH-4019',
    origin: 'Karnataka (Bengaluru Terminal)',
    destination: 'Kerala (Cochin Port)',
    mode: 'Rail',
    status: 'Pending Pickup',
    date: 'Aug 01, 2026',
    shippingMethod: 'LCL',
    items: [
      { id: 1, packageType: 'crates', containerType: 'lcl', unitCount: '8', weight: '6400', commodity: 'Electronic PCB assemblies', hsCode: '8534.00' }
    ],
    declaredValue: '12000000',
    currency: 'INR',
    specialInstructions: 'Fragile — anti-static packaging required.'
  },
  {
    id: 'SH-4018',
    origin: 'West Bengal (Kolkata Port)',
    destination: 'Telangana (Hyderabad Hub)',
    mode: 'Air',
    status: 'Customs Hold',
    date: 'Jul 30, 2026',
    shippingMethod: 'FOB',
    items: [
      { id: 1, packageType: 'drums', containerType: 'none', unitCount: '20', weight: '14000', commodity: 'Industrial lubricant oil, refined', hsCode: '2710.19' }
    ],
    declaredValue: '4200000',
    currency: 'USD',
    specialInstructions: 'Hazardous material. UN3082 classification.'
  }
]

export default function Shipments() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [shipments, setShipments] = useState(SAMPLE_SHIPMENTS)
  const [expandedShipment, setExpandedShipment] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
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

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'in transit':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Truck, dotColor: 'bg-blue-500' }
      case 'delivered':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, dotColor: 'bg-emerald-500' }
      case 'pending pickup':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, dotColor: 'bg-amber-500' }
      case 'customs hold':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, dotColor: 'bg-red-500' }
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: Package, dotColor: 'bg-slate-500' }
    }
  }

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = searchQuery === '' ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.items.some(item => item.commodity.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = filterStatus === 'all' || s.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const toggleExpand = (shipmentId) => {
    setExpandedShipment(expandedShipment === shipmentId ? null : shipmentId)
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

      {/* Main Workspace Column */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <DashboardNavbar setIsMobileOpen={setIsMobileOpen} title="Shipments" />

        {/* Content View */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">

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
                <h1 className="text-lg sm:text-xl font-black text-slate-800">Shipment Details</h1>
                <p className="text-[10px] text-slate-500 font-medium">Track and manage all active shipments with cargo specifications</p>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="glass-card rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID, route, or commodity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium cursor-pointer appearance-none min-w-[140px]"
              >
                <option value="all">All Statuses</option>
                <option value="in transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="pending pickup">Pending Pickup</option>
                <option value="customs hold">Customs Hold</option>
              </select>
            </div>
            <span className="px-2.5 py-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-lg whitespace-nowrap self-center">
              {filteredShipments.length} Shipments
            </span>
          </div>

          {/* Shipment Cards */}
          <div className="space-y-4">
            {filteredShipments.map((shipment) => {
              const statusConfig = getStatusConfig(shipment.status)
              const StatusIcon = statusConfig.icon
              const isExpanded = expandedShipment === shipment.id
              const totalWeight = shipment.items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0)
              const totalUnits = shipment.items.reduce((sum, item) => sum + (parseInt(item.unitCount) || 0), 0)

              return (
                <motion.div
                  key={shipment.id}
                  layout
                  className="glass-card rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Shipment Summary Row (always visible) */}
                  <div
                    onClick={() => toggleExpand(shipment.id)}
                    className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Status Dot + ID */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.dotColor} shadow-sm`} />
                          <span className="text-sm font-extrabold text-sky-600">{shipment.id}</span>
                        </div>

                        {/* Route */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{shipment.origin}</span>
                            <span className="text-slate-300">→</span>
                            <span className="truncate">{shipment.destination}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        {/* Mode */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                          {getModeIcon(shipment.mode)}
                          <span>{shipment.mode}</span>
                        </div>

                        {/* Weight summary */}
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {totalWeight.toLocaleString()} kg
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {shipment.status}
                        </span>

                        {/* Date */}
                        <span className="text-[10px] font-bold text-slate-400 hidden sm:block">{shipment.date}</span>

                        {/* Expand toggle */}
                        <div className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Shipment Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 space-y-5 border-t border-slate-100 pt-5">

                          {/* Shipping Method Tabs */}
                          <div>
                            <div className="flex flex-wrap gap-2 mb-1">
                              {SHIPPING_METHODS.map((method) => (
                                <div
                                  key={method.value}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                                    shipment.shippingMethod === method.value
                                      ? method.value === 'FCL'
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                                        : method.value === 'LCL'
                                          ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20'
                                          : 'bg-slate-700 text-white border-slate-700 shadow-md shadow-slate-500/20'
                                      : 'bg-white text-slate-400 border-slate-200'
                                  }`}
                                >
                                  {method.label}
                                  {shipment.shippingMethod === method.value && (
                                    <span className="ml-1.5 bg-white/25 text-[9px] px-1.5 py-0.5 rounded-md font-extrabold">ACTIVE</span>
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium mt-1">Decide which cost leg basis in the quote.</p>
                          </div>

                          {/* Section Title */}
                          <div className="flex items-center gap-2 pt-1">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-800">Shipment details</h3>
                              <p className="text-[10px] text-blue-600 font-bold">What is being shipped</p>
                            </div>
                          </div>

                          {/* Cargo Item Cards */}
                          {shipment.items.map((item, index) => {
                            const weightLimit = WEIGHT_LIMITS[item.containerType] || WEIGHT_LIMITS['40hc']
                            const currentWeight = parseFloat(item.weight) || 0
                            const isOverweight = currentWeight > weightLimit.max
                            const packageLabel = PACKAGE_TYPES.find(p => p.value === item.packageType)?.label || item.packageType
                            const containerLabel = CONTAINER_TYPES.find(c => c.value === item.containerType)?.label || item.containerType

                            return (
                              <div key={item.id} className="relative bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
                                {/* Item Header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                      <Package className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Item {index + 1}</span>
                                  </div>
                                  {shipment.items.length > 1 && (
                                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                      {index + 1} of {shipment.items.length}
                                    </span>
                                  )}
                                </div>

                                {/* Package Type + Container Type Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-slate-500 font-semibold text-[10px] mb-1 uppercase tracking-wider">
                                      Package type <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md font-bold ml-1 normal-case tracking-normal">REQ</span>
                                    </label>
                                    <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                                      {packageLabel}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-slate-500 font-semibold text-[10px] mb-1 uppercase tracking-wider">
                                      Container type <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md font-bold ml-1 normal-case tracking-normal">REQ</span>
                                    </label>
                                    <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                                      {containerLabel}
                                    </div>
                                  </div>
                                </div>

                                {/* Unit Count + Weight Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-slate-500 font-semibold text-[10px] mb-1 uppercase tracking-wider">Unit per item</label>
                                    <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                                      {item.unitCount}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-slate-500 font-semibold text-[10px] mb-1 uppercase tracking-wider">
                                      Total gross weight (kg) <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md font-bold ml-1 normal-case tracking-normal">REQ</span>
                                    </label>
                                    <div className={`w-full px-4 py-2.5 bg-white border rounded-xl text-xs text-slate-800 font-medium ${
                                      isOverweight ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                                    }`}>
                                      {parseFloat(item.weight).toLocaleString()}
                                    </div>
                                    <p className={`text-[10px] mt-1 font-medium ${
                                      isOverweight ? 'text-red-500' : 'text-slate-400'
                                    }`}>
                                      {isOverweight
                                        ? `⚠ Exceeds max ${weightLimit.max.toLocaleString()} kg for ${weightLimit.label}`
                                        : `Limit for ${weightLimit.label} = ${weightLimit.max.toLocaleString()} kg`
                                      }
                                    </p>
                                  </div>
                                </div>

                                {/* Commodity + HS Code Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-slate-500 font-semibold text-[10px] mb-1 uppercase tracking-wider">
                                      Commodity description <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md font-bold ml-1 normal-case tracking-normal">REQ</span>
                                    </label>
                                    <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                                      {item.commodity}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1 italic">*General cargo is rejected — customs-grade specifics</p>
                                  </div>

                                  <div>
                                    <label className="block text-slate-500 font-semibold text-[10px] mb-1 uppercase tracking-wider">
                                      HS code (suggested) <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md font-bold ml-1 normal-case tracking-normal">AUTO</span>
                                    </label>
                                    <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                                      {item.hsCode}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}

                          {/* Additional Details Section */}
                          <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm shadow-amber-500/20">
                                <FileText className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h3 className="text-sm font-extrabold text-slate-800">Additional details</h3>
                                <p className="text-[10px] text-slate-500 font-medium">Value, invoicing and special requirements</p>
                              </div>
                            </div>

                            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-slate-500 font-semibold text-[10px] mb-1 uppercase tracking-wider">Declared value</label>
                                  <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                                    {parseFloat(shipment.declaredValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-slate-500 font-semibold text-[10px] mb-1 uppercase tracking-wider">
                                    Currency <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md font-bold ml-1 normal-case tracking-normal">REQ</span>
                                  </label>
                                  <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                                    {CURRENCIES.find(c => c.value === shipment.currency)?.label || shipment.currency}
                                  </div>
                                </div>
                              </div>

                              {shipment.specialInstructions && (
                                <div>
                                  <label className="block text-slate-500 font-semibold text-[10px] mb-1 uppercase tracking-wider">Special instructions <span className="text-[10px] text-slate-400 normal-case tracking-normal font-normal italic">(optional)</span></label>
                                  <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium leading-relaxed">
                                    {shipment.specialInstructions}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Summary Footer */}
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-150">
                            <Info className="w-4 h-4 text-blue-500 shrink-0" />
                            <p className="leading-normal font-semibold">
                              Shipment {shipment.id} contains {shipment.items.length} item{shipment.items.length > 1 ? 's' : ''} totaling {totalWeight.toLocaleString()} kg across {totalUnits} unit{totalUnits > 1 ? 's' : ''}.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {/* Empty State */}
            {filteredShipments.length === 0 && (
              <div className="glass-card rounded-2xl bg-white border border-slate-200 shadow-sm p-12 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700">No shipments found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create a new shipment enquiry to get started.'}
                </p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}
