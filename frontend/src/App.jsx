import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import CustomerStore from './pages/CustomerStore'
import MerchantPortal from './pages/MerchantPortal'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<CustomerStore />} />
              <Route path="/merchant" element={
                <ErrorBoundary>
                  <MerchantPortal />
                </ErrorBoundary>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App