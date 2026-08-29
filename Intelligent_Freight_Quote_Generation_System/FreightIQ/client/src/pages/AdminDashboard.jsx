import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Building, 
  PlusCircle, 
  Search, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  UserCheck, 
  Activity, 
  Mail, 
  Phone, 
  Briefcase, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  X,
  Database
} from 'lucide-react'

import Sidebar from '../components/Sidebar'
import DashboardNavbar from '../components/DashboardNavbar'
import DashboardCard from '../components/DashboardCard'

const INITIAL_USERS = [
  { id: 'usr-1', fullName: 'Jane Doe', email: 'jane@corp.com', phone: '+91 98765 43210', companyName: 'Acme Shippers', active: true },
  { id: 'usr-2', fullName: 'Rahul Sharma', email: 'rahul@garments.com', phone: '+91 87654 32109', companyName: 'Sharma Textiles', active: true },
  { id: 'usr-3', fullName: 'Amir Khan', email: 'amir@exports.in', phone: '+91 76543 21098', companyName: 'Indo Garments', active: false }
]

const INITIAL_BROKERS = [
  { id: 'brk-1', fullName: 'Mumbai Port Logi-Broker', email: 'mumbai@broker.com', phone: '+91 99988 77766', companyName: 'Oceanwide Logistics', tier: 'Premium', active: true },
  { id: 'brk-2', fullName: 'Mundra Freight Service', email: 'mundra@broker.com', phone: '+91 88877 66655', companyName: 'Mundra Freight Services', tier: 'Gold', active: true },
  { id: 'brk-3', fullName: 'Kolkata Maritime Agency', email: 'kolkata@broker.com', phone: '+91 77766 55544', companyName: 'East Coast Shipping', tier: 'Standard', active: false }
]

export default function AdminDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'users' | 'brokers'
  
  // State for directories
  const [users, setUsers] = useState([])
  const [brokers, setBrokers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [brokerSearch, setBrokerSearch] = useState('')
  
  // Modal / Form state
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('user') // 'user' | 'broker'
  const [modalMode, setModalMode] = useState('add') // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    tier: 'Standard',
    active: true
  })

  const navigate = useNavigate()

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    if (!token) {
      navigate('/login')
      return
    }
    if (role !== 'admin') {
      navigate('/dashboard')
      return
    }

    // Load initial users
    const storedUsers = localStorage.getItem('admin_users')
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers))
      } catch (e) {
        setUsers(INITIAL_USERS)
      }
    } else {
      setUsers(INITIAL_USERS)
      localStorage.setItem('admin_users', JSON.stringify(INITIAL_USERS))
    }

    // Load initial brokers
    const storedBrokers = localStorage.getItem('admin_brokers')
    if (storedBrokers) {
      try {
        setBrokers(JSON.parse(storedBrokers))
      } catch (e) {
        setBrokers(INITIAL_BROKERS)
      }
    } else {
      setBrokers(INITIAL_BROKERS)
      localStorage.setItem('admin_brokers', JSON.stringify(INITIAL_BROKERS))
    }
  }, [navigate])

  const saveUsersToStorage = (updatedList) => {
    setUsers(updatedList)
    localStorage.setItem('admin_users', JSON.stringify(updatedList))
  }

  const saveBrokersToStorage = (updatedList) => {
    setBrokers(updatedList)
    localStorage.setItem('admin_brokers', JSON.stringify(updatedList))
  }

  // Handle Create / Edit submissions
  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.companyName) {
      alert('Please fill out all required fields.')
      return
    }

    if (modalType === 'user') {
      if (modalMode === 'add') {
        const newUser = {
          id: `usr-${Date.now()}`,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          active: formData.active
        }
        saveUsersToStorage([newUser, ...users])
      } else {
        const updated = users.map(u => 
          u.id === editingId ? { ...u, ...formData } : u
        )
        saveUsersToStorage(updated)
      }
    } else {
      // Broker
      if (modalMode === 'add') {
        const newBroker = {
          id: `brk-${Date.now()}`,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          tier: formData.tier,
          active: formData.active
        }
        saveBrokersToStorage([newBroker, ...brokers])
      } else {
        const updated = brokers.map(b => 
          b.id === editingId ? { ...b, ...formData } : b
        )
        saveBrokersToStorage(updated)
      }
    }

    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      tier: 'Standard',
      active: true
    })
    setEditingId(null)
  }

  const handleEditClick = (type, item) => {
    setModalType(type)
    setModalMode('edit')
    setEditingId(item.id)
    setFormData({
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      companyName: item.companyName,
      tier: item.tier || 'Standard',
      active: item.active
    })
    setShowModal(true)
  }

  const handleAddClick = (type) => {
    setModalType(type)
    setModalMode('add')
    resetForm()
    setShowModal(true)
  }

  const handleDeleteItem = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'user') {
        const updated = users.filter(u => u.id !== id)
        saveUsersToStorage(updated)
      } else {
        const updated = brokers.filter(b => b.id !== id)
        saveBrokersToStorage(updated)
      }
    }
  }

  const handleToggleActive = (type, item) => {
    if (type === 'user') {
      const updated = users.map(u => 
        u.id === item.id ? { ...u, active: !u.active } : u
      )
      saveUsersToStorage(updated)
    } else {
      const updated = brokers.map(b => 
        b.id === item.id ? { ...b, active: !b.active } : b
      )
      saveBrokersToStorage(updated)
    }
  }

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.companyName.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredBrokers = brokers.filter(b => 
    b.fullName.toLowerCase().includes(brokerSearch.toLowerCase()) ||
    b.email.toLowerCase().includes(brokerSearch.toLowerCase()) ||
    b.companyName.toLowerCase().includes(brokerSearch.toLowerCase())
  )

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
        <DashboardNavbar setIsMobileOpen={setIsMobileOpen} title="Admin Control Center" />

        {/* Dashboard Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl border border-slate-800 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-transparent blur-3xl pointer-events-none rounded-full" />
            <div className="relative z-10 space-y-1">
              <span className="px-2.5 py-0.5 text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-400/20 rounded-full inline-flex items-center gap-1 uppercase tracking-wide">
                <ShieldCheck className="w-2.5 h-2.5" /> Administrator Mode
              </span>
              <h2 className="text-xl sm:text-2xl font-black">System Dashboard</h2>
              <p className="text-slate-400 text-xs font-medium">
                Manage platform users, verify broker entities, and configure operational master data.
              </p>
            </div>
            <div className="flex gap-2 relative z-10">
              <button
                onClick={() => handleAddClick('user')}
                className="px-4 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Create User
              </button>
              <button
                onClick={() => handleAddClick('broker')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Create Broker
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <DashboardCard 
              title="Registered Shippers" 
              value={users.length.toString()} 
              icon={Users} 
              trend={`+${users.filter(u => u.active).length} Active`} 
              trendType="positive"
              color="indigo"
            />
            <DashboardCard 
              title="Verified Brokers" 
              value={brokers.length.toString()} 
              icon={Building} 
              trend={`+${brokers.filter(b => b.active).length} Active`} 
              trendType="positive"
              color="blue"
            />
            <DashboardCard 
              title="Access Control status" 
              value="Secure" 
              icon={UserCheck} 
              trend="100% Policy" 
              trendType="positive"
              color="green"
            />
            <DashboardCard 
              title="Global Master Data" 
              value="17 Nodes" 
              icon={Database} 
              trend="Operational" 
              trendType="positive"
              color="amber"
            />
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-200 flex gap-6">
            {[
              { id: 'overview', label: 'System Overview', icon: Activity },
              { id: 'users', label: 'Manage Users', icon: Users },
              { id: 'brokers', label: 'Manage Brokers', icon: Building }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-indigo-655 text-indigo-655 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content Panels */}
          <div>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Users Quick list */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-850 text-sm">Shipper Profiles</h3>
                    <button onClick={() => setActiveTab('users')} className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {users.slice(0, 3).map(u => (
                      <div key={u.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{u.fullName}</p>
                          <span className="text-[10px] text-slate-505">{u.companyName}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${u.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brokers Quick list */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-850 text-sm">Broker Organizations</h3>
                    <button onClick={() => setActiveTab('brokers')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {brokers.slice(0, 3).map(b => (
                      <div key={b.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{b.fullName}</p>
                          <span className="text-[10px] text-slate-505">{b.companyName} ({b.tier})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${b.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                          {b.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search shippers by name, company, or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={() => handleAddClick('user')}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Shipper User
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 text-xs">
                    <thead className="bg-slate-50 text-slate-505 uppercase text-[9px] font-extrabold tracking-wider">
                      <tr>
                        <th className="px-6 py-3 text-left">Full Name</th>
                        <th className="px-6 py-3 text-left">Company Name</th>
                        <th className="px-6 py-3 text-left">Credentials</th>
                        <th className="px-6 py-3 text-left">Active State</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-800">{u.fullName}</td>
                          <td className="px-6 py-4 text-slate-600 font-semibold">{u.companyName}</td>
                          <td className="px-6 py-4">
                            <div className="space-y-0.5">
                              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                <Mail className="w-3.5 h-3.5 text-slate-400" /> {u.email}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                <Phone className="w-3.5 h-3.5 text-slate-400" /> {u.phone}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              type="button"
                              onClick={() => handleToggleActive('user', u)}
                              className="text-slate-450 hover:text-indigo-600 transition-colors cursor-pointer"
                            >
                              {u.active ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-3">
                              <button onClick={() => handleEditClick('user', u)} className="text-slate-400 hover:text-indigo-650 transition-all cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteItem('user', u.id)} className="text-slate-400 hover:text-rose-600 transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-slate-450 font-bold">No shippers matched.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'brokers' && (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search brokers by agency, email, or name..."
                      value={brokerSearch}
                      onChange={(e) => setBrokerSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={() => handleAddClick('broker')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Broker Profile
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 text-xs">
                    <thead className="bg-slate-50 text-slate-550 uppercase text-[9px] font-extrabold tracking-wider">
                      <tr>
                        <th className="px-6 py-3 text-left">Agency Name</th>
                        <th className="px-6 py-3 text-left">Primary Broker</th>
                        <th className="px-6 py-3 text-left">SLA Tier</th>
                        <th className="px-6 py-3 text-left">Contact Info</th>
                        <th className="px-6 py-3 text-left">Active State</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {filteredBrokers.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-800">{b.companyName}</td>
                          <td className="px-6 py-4 text-slate-600 font-semibold">{b.fullName}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                              b.tier === 'Premium' ? 'bg-purple-50 text-purple-750 border-purple-200' :
                              b.tier === 'Gold' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {b.tier}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-0.5">
                              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                <Mail className="w-3.5 h-3.5 text-slate-400" /> {b.email}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                <Phone className="w-3.5 h-3.5 text-slate-400" /> {b.phone}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              type="button"
                              onClick={() => handleToggleActive('broker', b)}
                              className="text-slate-450 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              {b.active ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-3">
                              <button onClick={() => handleEditClick('broker', b)} className="text-slate-400 hover:text-blue-600 transition-all cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteItem('broker', b.id)} className="text-slate-400 hover:text-rose-600 transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredBrokers.length === 0 && (
                    <div className="text-center py-8 text-slate-450 font-bold">No brokers matched.</div>
                  )}
                </div>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Slide-over / Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative z-10 text-slate-800"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] text-indigo-650 font-extrabold uppercase tracking-wide">
                    {modalMode === 'add' ? 'Register New' : 'Modify Record'}
                  </span>
                  <h3 className="text-lg font-black text-slate-800 mt-0.5">
                    {modalMode === 'add' 
                      ? (modalType === 'user' ? 'Create Shipper Account' : 'Create Broker Profile')
                      : (modalType === 'user' ? 'Edit Shipper Details' : 'Edit Broker Profile')
                    }
                  </h3>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-505 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1.5">
                    {modalType === 'user' ? 'Representative Name' : 'Primary Broker Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1.5">
                    {modalType === 'user' ? 'Shipper Company Name' : 'Broker Agency Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Globex Corp"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1.5">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@corp.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1.5">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 99988 77766"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* SLA Tier (For Broker only) */}
                {modalType === 'broker' && (
                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1.5">Contract SLA Tier</label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Gold">Gold</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                )}

                {/* Active Switch */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="modal-active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                  <label htmlFor="modal-active" className="text-xs text-slate-600 cursor-pointer select-none">
                    Status Active upon creation
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-505 text-xs font-bold hover:bg-slate-50 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold cursor-pointer text-center shadow-md shadow-indigo-600/10"
                  >
                    {modalMode === 'add' ? 'Register Account' : 'Apply Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
