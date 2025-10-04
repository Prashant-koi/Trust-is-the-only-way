import { useState } from 'react'
import { TrustJSProvider, TrustButton, TrustForm } from 'trustjs'
import 'trustjs/dist/trustjs.css'
import './App.css'

function App() {
  const [logs, setLogs] = useState([])
  const [connected, setConnected] = useState(false)

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev.slice(-4), { timestamp, message, type, id: Date.now() }])
  }

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/health')
      if (response.ok) {
        const data = await response.json()
        setConnected(true)
        addLog(`✅ Backend connected: ${data.status}`, 'success')
      } else {
        throw new Error('Backend health check failed')
      }
    } catch (error) {
      setConnected(false)
      addLog(`❌ Backend connection failed: ${error.message}`, 'error')
      addLog('💡 Make sure PayShield backend is running on port 3001', 'warning')
    }
  }

  const handleSuccess = (payment) => {
    console.log('Payment successful:', payment)
    addLog(`🎉 Payment successful! Order: ${payment.orderId}`, 'success')
  }

  const handleError = (error) => {
    console.error('Payment error:', error)
    addLog(`❌ Payment failed: ${error.message}`, 'error')
  }

  const handleMfaRequired = (paymentIntent) => {
    console.log('MFA required:', paymentIntent)
    addLog('🔐 MFA verification required - check backend for OTP', 'warning')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🔒 TrustJS SDK Test Environment</h1>
          <p>Professional testing environment for the TrustJS payment SDK</p>
          
          <div className="connection-status">
            <button 
              onClick={testBackendConnection}
              className={`status-btn ${connected ? 'connected' : 'disconnected'}`}
            >
              {connected ? '🟢 Backend Connected' : '🔴 Test Connection'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <TrustJSProvider
          publishableKey="pk_test_51SEPdMHqjaPgoLNariaByJzqugHs05citHWNSmTx2z5Zkn9oH85qD1KYXRMubgt3PYa0q43hIZ0OAbLXmcoxMZWO00cd448f5V"
          merchantId="demo_merchant_001"
          config={{
            apiUrl: 'http://localhost:3001',
            theme: 'dark',
            mfaThreshold: 500,
            enableAnalytics: true,
            enableBlockchain: true
          }}
        >
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
