import { useState, useMemo } from 'react'
import { TrustJSProvider, TrustButton, TrustFormWrapper } from 'trustjs'
import 'trustjs/dist/trustjs.css'
import './App.css'

function App() {
  const [logs, setLogs] = useState([])
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('buttons')

  // Generate stable order IDs that don't change on re-render
  const orderIds = useMemo(() => ({
    btn: `btn_${Date.now()}`,
    modal: `modal_${Date.now()}`,
    inline: `inline_${Date.now()}`,
    direct: `direct_${Date.now()}`
  }), [])

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
          <div className="test-grid">
            {/* Tab Navigation */}
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'buttons' ? 'active' : ''}`}
                onClick={() => setActiveTab('buttons')}
              >
                🎯 Button Variants
              </button>
              <button 
                className={`tab-btn ${activeTab === 'inline' ? 'active' : ''}`}
                onClick={() => setActiveTab('inline')}
              >
                📝 Inline Form
              </button>
              <button 
                className={`tab-btn ${activeTab === 'direct' ? 'active' : ''}`}
                onClick={() => setActiveTab('direct')}
              >
                🧩 Direct Components
              </button>
            </div>

            {/* Button Variant Tests */}
            {activeTab === 'buttons' && (
            <div className="test-section">
              <h2>🎯 Button Variants</h2>
              
              <div className="test-card">
                <h3>Standard Button</h3>
                <p>Click to open payment flow</p>
                <TrustButton
                  amount="99.99"
                  orderId={orderIds.btn}
                  variant="button"
                  onSuccess={handleSuccess}
                  onError={handleError}
                  onMfaRequired={handleMfaRequired}
                >
                  💳 Pay $99.99
                </TrustButton>
              </div>

              <div className="test-card">
                <h3>Modal Button (High Amount - MFA)</h3>
                <p>Opens payment in modal, requires MFA</p>
                <TrustButton
                  amount="999.99"
                  orderId={orderIds.modal}
                  variant="modal"
                  theme="secondary"
                  onSuccess={handleSuccess}
                  onError={handleError}
                  onMfaRequired={handleMfaRequired}
                >
                  🔒 Pay $999.99 (Modal)
                </TrustButton>
              </div>
            </div>
            )}

            {/* Inline Form Tests */}
            {activeTab === 'inline' && (
            <div className="test-section">
              <h2>📝 Inline Form</h2>
              
              <div className="test-card full-width">
                <h3>Inline Payment Form</h3>
                <p>Embedded payment form - no popup</p>
                <TrustButton
                  amount="299.99"
                  orderId={orderIds.inline}
                  variant="inline"
                  customer={{
                    email: 'test@example.com',
                    name: 'Test Customer'
                  }}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  onMfaRequired={handleMfaRequired}
                />
              </div>
            </div>
            )}

            {/* Direct Components */}
            {activeTab === 'direct' && (
            <div className="test-section">
              <h2>🧩 Direct Components</h2>
              
              <div className="test-card full-width">
                <h3>TrustFormWrapper Component</h3>
                <p>Direct usage of TrustFormWrapper without button wrapper</p>
                <TrustFormWrapper
                  amount="49.99"
                  orderId={orderIds.direct}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  onMfaRequired={handleMfaRequired}
                  showCancel={true}
                  onCancel={() => addLog('Payment cancelled by user', 'info')}
                />
              </div>
            </div>
            )}
          </div>
        </TrustJSProvider>
      </main>

      {/* Activity Log */}
      <aside className="activity-log">
        <h3>📊 Activity Log</h3>
        <div className="log-container">
          {logs.length === 0 ? (
            <div className="log-entry info">
              <span className="timestamp">--:--:--</span>
              <span className="message">No activity yet. Try testing a payment!</span>
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className={`log-entry ${log.type}`}>
                <span className="timestamp">{log.timestamp}</span>
                <span className="message">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}

export default App