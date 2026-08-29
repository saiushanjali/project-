import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Anchor,
  Plane,
  Train,
  Truck,
  Compass,
  Layers,
  Activity,
  ShieldCheck,
  Info
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import DashboardNavbar from '../components/DashboardNavbar'
import DashboardCard from '../components/DashboardCard'
import * as db from '../utils/masterDataService'

// Fallback ports in case master data service fails
const FALLBACK_PORTS = [
  { UNLOCODE: 'INNSA', portName: 'Nhava Sheva (JNPT)', city: 'Mumbai', countryCode: 'IN', location: '18.9500° N, 72.9500° E', active: true },
  { UNLOCODE: 'USLAX', portName: 'Port of Los Angeles', city: 'Los Angeles', countryCode: 'US', location: '33.7288° N, 118.2620° W', active: true },
  { UNLOCODE: 'AEJEA', portName: 'Jebel Ali Port', city: 'Dubai', countryCode: 'AE', location: '25.0112° N, 55.0617° E', active: true },
  { UNLOCODE: 'DEHAM', portName: 'Port of Hamburg', city: 'Hamburg', countryCode: 'DE', location: '53.5458° N, 9.9644° E', active: true },
  { UNLOCODE: 'CNSHA', portName: 'Port of Shanghai', city: 'Shanghai', countryCode: 'CN', location: '31.2243° N, 121.4691° E', active: true }
]

export default function RoutesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState('all')
  const [routesList, setRoutesList] = useState([])
  const navigate = useNavigate()

  // Helper: Parse Lat/Lng coordinates from string
  const parseCoordinates = (locString) => {
    if (!locString) return { lat: 20, lng: 78 }
    try {
      const cleanStr = locString.replace(/°/g, '')
      const parts = cleanStr.split(',')
      if (parts.length === 2) {
        const latPart = parts[0].trim()
        const lngPart = parts[1].trim()
        
        let latVal = parseFloat(latPart)
        let lngVal = parseFloat(lngPart)
        
        if (latPart.toLowerCase().includes('s')) latVal = -latVal
        if (lngPart.toLowerCase().includes('w')) lngVal = -lngVal
        
        return { lat: latVal, lng: lngVal }
      }
    } catch (e) {
      console.error('Error parsing coordinates:', e)
    }
    return { lat: 20, lng: 78 }
  }

  // Calculate distance using Haversine formula
  const getHaversineDistance = (coords1, coords2) => {
    const R = 6371 // Earth radius in km
    const dLat = (coords2.lat - coords1.lat) * Math.PI / 180
    const dLng = (coords2.lng - coords1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return Math.round(R * c)
  }

  useEffect(() => {
    const fetchBackendRoutes = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const res = await fetch('/api/v1/routes/options/', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const resData = await res.json()
            const data = resData.data || resData.results || []
            if (data.length > 0) {
              const mapped = data.map(r => ({
                id: r.id || `${r.origin_code}-${r.destination_code}`,
                originCode: r.origin_code || r.origin?.un_locode || 'INMAA',
                originName: r.origin_name || r.origin?.name || 'Chennai Port',
                originCity: r.origin_city || 'Chennai',
                originCountry: 'IN',
                destCode: r.destination_code || r.destination?.un_locode || 'SGSIN',
                destName: r.destination_name || r.destination?.name || 'Port of Singapore',
                destCity: r.destination_city || 'Singapore',
                destCountry: 'SG',
                mode: r.mode === 'OCEAN' ? 'Ocean' : (r.mode === 'AIR' ? 'Air' : 'Ground/Rail'),
                distance: Math.round(r.distance_nm || r.distance_km || 1580),
                transitTime: r.transit_days || 5
              }))
              setRoutesList(mapped)
              return
            }
          }
        } catch (err) {
          console.warn('Routes API fetch fallback:', err)
        }
      }

      // Fallback calculation using master data
      let ports = db.getItems('ports')
      if (!ports || ports.length === 0) {
        ports = FALLBACK_PORTS
      }

      const generated = []
      const modes = ['Ocean', 'Air', 'Ground/Rail', 'Express Air']

      for (let i = 0; i < ports.length; i++) {
        for (let j = 0; j < ports.length; j++) {
          if (i === j) continue
          const origin = ports[i]
          const dest = ports[j]
          const coords1 = parseCoordinates(origin.location)
          const coords2 = parseCoordinates(dest.location)
          const distance = getHaversineDistance(coords1, coords2)

          modes.forEach(mode => {
            let averageSpeed = 60
            if (mode === 'Air') averageSpeed = 750
            if (mode === 'Express Air') averageSpeed = 820
            if (mode === 'Ocean') averageSpeed = 22

            const hours = distance / averageSpeed
            let transitDays = Math.ceil(hours / 10)
            if (mode === 'Air' || mode === 'Express Air') {
              transitDays = Math.max(1, Math.round(hours / 24) || 1)
            } else if (mode === 'Ocean') {
              transitDays = Math.max(5, transitDays)
            }

            generated.push({
              id: `${origin.UNLOCODE}-${dest.UNLOCODE}-${mode.replace(/\s+/g, '').toUpperCase()}`,
              originCode: origin.UNLOCODE,
              originName: origin.portName,
              originCity: origin.city || origin.portName.split(' ')[0],
              originCountry: origin.countryCode,
              destCode: dest.UNLOCODE,
              destName: dest.portName,
              destCity: dest.city || dest.portName.split(' ')[0],
              destCountry: dest.countryCode,
              mode: mode,
              distance: distance,
              transitTime: transitDays
            })
          })
        }
      }
      setRoutesList(generated)
    }

    fetchBackendRoutes()
  }, [])

  const getModeIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'air': return <Plane className="w-4 h-4 text-sky-500" />
      case 'ocean': return <Anchor className="w-4 h-4 text-blue-600" />
      case 'ground/rail': return <Truck className="w-4 h-4 text-indigo-500" />
      case 'express air': return <Plane className="w-4 h-4 text-orange-500 animate-pulse" />
      default: return <Compass className="w-4 h-4 text-slate-500" />
    }
  }

  const filteredRoutes = routesList.filter(route => {
    const matchesSearch = route.originCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.originCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.originName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesMode = filterMode === 'all' || route.mode.toLowerCase() === filterMode.toLowerCase()

    return matchesSearch && matchesMode
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <DashboardNavbar setIsMobileOpen={setIsMobileOpen} title="Trade Lane Matrix" />

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
                <h1 className="text-lg sm:text-xl font-black text-slate-800">Trade Lanes & Distance Matrix</h1>
                <p className="text-[10px] text-slate-500 font-medium">Verify distance, telemetry, and transit times for port-to-port routes</p>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <DashboardCard
              title="Active Hubs"
              value="5 Global Hubs"
              icon={MapPin}
              trend="FCL / Air Terminals"
              trendType="positive"
              color="blue"
            />
            <DashboardCard
              title="Total Lanes Generated"
              value={routesList.length.toString()}
              icon={Layers}
              trend="Full Connectivity"
              trendType="positive"
              color="purple"
            />
            <DashboardCard
              title="Active Modes"
              value="4 Modes"
              icon={Compass}
              trend="Ocean/Air/Road/Rail"
              trendType="positive"
              color="amber"
            />
            <DashboardCard
              title="Shortest Trade Lane"
              value="INNSA → AEJEA"
              icon={ShieldCheck}
              trend="1,935 km"
              trendType="positive"
              color="green"
            />
          </div>

          {/* Table Card */}
          <div className="glass-card rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by city name, gateway code (e.g. INNSA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold cursor-pointer min-w-[150px]"
                >
                  <option value="all">All Modes</option>
                  <option value="ocean">Ocean Freight</option>
                  <option value="air">Standard Air</option>
                  <option value="ground/rail">Ground/Rail</option>
                  <option value="express air">Express Air</option>
                </select>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto -mx-5 sm:-mx-6">
              <div className="inline-block min-w-full align-middle font-sans">
                <table className="min-w-full divide-y divide-slate-100 text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Lane Code</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Origin Gateway</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Destination Gateway</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Transport Mode</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Calculated Distance</th>
                      <th className="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Avg. Transit Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredRoutes.map((route) => (
                      <tr key={route.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-3.5 whitespace-nowrap font-bold text-sky-600">
                          {route.id}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-800">{route.originCity} ({route.originCode})</p>
                            <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">{route.originName}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-800">{route.destCity} ({route.destCode})</p>
                            <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">{route.destName}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            {getModeIcon(route.mode)}
                            <span>{route.mode}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap font-black text-slate-900">
                          {route.distance.toLocaleString()} km
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-700">
                          {route.transitTime} {route.transitTime > 1 ? 'Days' : 'Day'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredRoutes.length === 0 && (
              <div className="text-center py-16">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700">No lanes match your criteria</h4>
                <p className="text-xs text-slate-505 mt-1">Try adjusting search query or filters.</p>
              </div>
            )}

            <div className="flex gap-2 items-start text-[10px] text-slate-450 bg-slate-50 p-4 rounded-2xl border border-slate-150">
              <Info className="w-4 h-4 text-blue-650 shrink-0 mt-0.5" />
              <p className="leading-normal font-semibold">
                Transit times and distances are mathematically projected based on geodesic Haversine distance computations and average logistics speed averages for respective transport modalities. Actual times are subject to customs, carrier wait times, and weather routes.
              </p>
            </div>

          </div>

        </main>
      </div>
    </div>
  )
}
