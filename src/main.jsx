import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import MobileDashboard from './components/MobileDashboard.jsx'
import AdminDashboard  from './admin/AdminDashboard.jsx'

function Root() {
  const path = window.location.pathname
  if (path === '/admin' || path.startsWith('/admin/')) {
    return <AdminDashboard />
  }
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768)
  React.useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return isMobile ? <MobileDashboard /> : <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><Root /></React.StrictMode>
)
