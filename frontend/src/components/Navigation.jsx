import { Link, useLocation } from 'react-router-dom'
import { Shield, Store, BarChart3 } from 'lucide-react'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="backdrop-blur-md bg-white/5 border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600 border border-purple-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-theme-text">PayShield</span>
          </div>
          
          <div className="flex space-x-2">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-white/12 text-white border border-white/20' 
                  : 'text-theme-text/70 hover:text-white hover:bg-white/8'
              }`}
            >
              <Store className="h-4 w-4" />
              Customer Store
            </Link>
            
            <Link 
              to="/merchant" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/merchant' 
                  ? 'bg-white/12 text-white border border-white/20' 
                  : 'text-theme-text/70 hover:text-white hover:bg-white/8'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Merchant Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation