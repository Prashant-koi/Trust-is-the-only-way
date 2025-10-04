import { Link, useLocation } from 'react-router-dom'
import { Store, BarChart3, Shield } from 'lucide-react'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Shield className="nav-icon" />
          <span className="nav-title">PayShield</span>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Store className="nav-link-icon" />
            Customer Store
          </Link>
          
          <Link 
            to="/merchant" 
            className={`nav-link ${location.pathname === '/merchant' ? 'active' : ''}`}
          >
            <BarChart3 className="nav-link-icon" />
            Merchant Portal
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation