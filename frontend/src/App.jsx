import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import CustomerStore from './pages/CustomerStore'
import MerchantPortal from './pages/MerchantPortal'
import SdkDocs from './pages/SdkDocs'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <Router>
      <div className="min-h-screen text-theme-text font-inter">
        {/* Background remains from CSS */}
        <Navigation />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<CustomerStore />} />
            <Route path="/merchant" element={<MerchantPortal />} />
            <Route path="/docs" element={<SdkDocs />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  )
}

export default App