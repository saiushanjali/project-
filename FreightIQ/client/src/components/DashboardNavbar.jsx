import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, Globe, ChevronDown, LogOut } from 'lucide-react'

export default function DashboardNavbar({ setIsMobileOpen, title }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('agent@freightiq.com')
  const [userName, setUserName] = useState('Agent')
  const navigate = useNavigate()

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'agent@freightiq.com'
    setUserEmail(email)
    
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
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    navigate('/')
  }

  const mockNotifications = [
    { id: 1, text: 'Quotation #IQ-9821 approved by carrier', time: '10 mins ago' },
    { id: 2, text: 'New shipment route optimized to Kolkata Hub', time: '1 hr ago' },
    { id: 3, text: 'Carbon offset metrics monthly report ready', time: '1 day ago' },
  ]

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 py-3.5 px-6 z-20 flex items-center justify-between shadow-sm">
      {/* Left section: Hamburger (mobile) & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {title || 'Broker Workspace'}
          </h1>
          <p className="text-[10px] text-slate-500 hidden sm:block">
            FreightIQ AI Automated Dispatch Network
          </p>
        </div>
      </div>

      {/* Center: Search (hidden on very small viewports) */}
      <div className="hidden md:flex items-center max-w-xs w-full relative">
        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search shipments, carriers, quotes..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors focus:bg-white"
        />
      </div>

      {/* Right section: Info / profile / notification */}
      <div className="flex items-center gap-3.5">
        {/* Globe Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-150 rounded-full text-[10px] font-bold tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live SLA
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              setProfileOpen(false)
            }}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-850">Recent System Notifications</span>
                <span className="text-[10px] text-blue-500 cursor-pointer font-semibold">Mark read</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                    <p className="text-xs text-slate-700 font-medium leading-normal">{notif.text}</p>
                    <span className="text-[9px] text-slate-500 block mt-1">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative border-l border-slate-200 pl-3.5">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen)
              setNotificationsOpen(false)
            }}
            className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition-colors text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-blue-500/10 uppercase">
              {userName.substring(0, 1).toUpperCase()}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{userName}</p>
              <span className="text-[9px] text-slate-500 block truncate max-w-[120px]">
                {userEmail}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block shrink-0" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{userName}</p>
                <span className="text-[9px] text-slate-500 truncate block">{userEmail}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-50 text-left font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
