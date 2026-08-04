import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import BrokerDashboard from './pages/BrokerDashboard'
import NewShipmentEnquiry from './pages/NewShipmentEnquiry'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<BrokerDashboard />} />
        <Route path="/dashboard/new-shipment" element={<NewShipmentEnquiry />} />
      </Routes>
    </Router>
  )
}

export default App
