import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import MobileDashboard from './components/MobileDashboard.jsx'

function Root() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768)

  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return isMobile ? <MobileDashboard /> : <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><Root /></React.StrictMode>
)
