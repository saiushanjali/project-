import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import BrokerDashboard from './pages/BrokerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import NewShipmentEnquiry from './pages/NewShipmentEnquiry'
import Shipments from './pages/Shipments'
import MasterData from './pages/MasterData'
import Quotations from './pages/Quotations'
import RoutesPage from './pages/RoutesPage'
import AlertsPage from './pages/AlertsPage'

function DashboardRouter() {
  const role = localStorage.getItem('userRole') || 'user'
  if (role === 'admin') {
    return <AdminDashboard />
  } else if (role === 'broker') {
    return <BrokerDashboard />
  } else {
    return <UserDashboard />
  }
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/dashboard/new-shipment" element={<NewShipmentEnquiry />} />
        <Route path="/dashboard/shipments" element={<Shipments />} />
        <Route path="/dashboard/master-data" element={<MasterData />} />
        <Route path="/dashboard/quotations" element={<Quotations />} />
        <Route path="/dashboard/routes" element={<RoutesPage />} />
        <Route path="/dashboard/alerts" element={<AlertsPage />} />
      </Routes>
    </Router>
  )
}

export default App


