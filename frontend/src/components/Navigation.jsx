import { Link, useLocation } from 'react-router-dom'
import { Store, BarChart3, Shield } from 'lucide-react'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PayShield</span>
          </div>
          
          <div className="flex space-x-1">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Store className="h-4 w-4" />
              Customer Store
            </Link>
            
            <Link 
              to="/merchant" 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/merchant' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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