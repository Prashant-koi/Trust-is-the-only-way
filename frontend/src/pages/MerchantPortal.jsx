import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react'
import TransactionChart from '../components/analytics/TransactionChart'
import FraudDetectionPanel from '../components/analytics/FraudDetectionPanel'
import MfaAnalytics from '../components/analytics/MfaAnalytics'
import RecentTransactions from '../components/analytics/RecentTransactions'
import './MerchantPortal.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin

function MerchantPortal() {
  const [analyticsData, setAnalyticsData] = useState({
    totalTransactions: 0,
    successfulTransactions: 0,
    fraudAttempts: 0,
    mfaUsage: 0,
    totalRevenue: 0,
    recentTransactions: [],
    dailyStats: [],
    fraudPatterns: [],
    blockchainTransactions: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/merchant/analytics`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalyticsData(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateFraudRate = () => {
    const total = analyticsData.totalTransactions + analyticsData.fraudAttempts
    return total > 0 ? ((analyticsData.fraudAttempts / total) * 100).toFixed(2) : 0
  }

  const calculateMfaSuccessRate = () => {
    return analyticsData.mfaUsage > 0 ? 
      ((analyticsData.successfulTransactions / analyticsData.mfaUsage) * 100).toFixed(2) : 0
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-state">
          <Activity className="loading-icon" />
          <p>Loading merchant analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <XCircle className="error-icon" />
          <h2>Error Loading Analytics</h2>
          <p>{error}</p>
          <button onClick={fetchAnalytics} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="portal-header">
        <div className="header-content">
          <h1>📊 Merchant Analytics Portal</h1>
          <p className="subtitle">Real-time fraud detection and transaction analytics</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchAnalytics} className="refresh-btn">
            <Activity className="btn-icon" />
            Refresh Data
          </button>
        </div>
      </header>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">
            <DollarSign />
          </div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <div className="metric-value">${analyticsData.totalRevenue.toLocaleString()}</div>
            <div className="metric-change positive">+12.5% from last month</div>
          </div>
        </div>

        <div className="metric-card transactions">
          <div className="metric-icon">
            <CheckCircle />
          </div>
          <div className="metric-content">
            <h3>Successful Transactions</h3>
            <div className="metric-value">{analyticsData.successfulTransactions.toLocaleString()}</div>
            <div className="metric-change positive">
              {analyticsData.totalTransactions > 0 ? 
                ((analyticsData.successfulTransactions / analyticsData.totalTransactions) * 100).toFixed(1) : 0}% success rate
            </div>
          </div>
        </div>

        <div className="metric-card fraud">
          <div className="metric-icon">
            <AlertTriangle />
          </div>
          <div className="metric-content">
            <h3>Fraud Attempts</h3>
            <div className="metric-value">{analyticsData.fraudAttempts.toLocaleString()}</div>
            <div className="metric-change negative">{calculateFraudRate()}% fraud rate</div>
          </div>
        </div>

        <div className="metric-card mfa">
          <div className="metric-icon">
            <Shield />
          </div>
          <div className="metric-content">
            <h3>MFA Verifications</h3>
            <div className="metric-value">{analyticsData.mfaUsage.toLocaleString()}</div>
            <div className="metric-change positive">{calculateMfaSuccessRate()}% success rate</div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="analytics-grid">
        <div className="analytics-section">
          <h2>📈 Transaction Trends</h2>
          <TransactionChart data={analyticsData.dailyStats} />
        </div>

        <div className="analytics-section">
          <h2>🚨 Fraud Detection</h2>
          <FraudDetectionPanel 
            fraudAttempts={analyticsData.fraudAttempts}
            patterns={analyticsData.fraudPatterns}
          />
        </div>

        <div className="analytics-section">
          <h2>🔐 MFA Analytics</h2>
          <MfaAnalytics 
            mfaUsage={analyticsData.mfaUsage}
            successRate={calculateMfaSuccessRate()}
          />
        </div>

        <div className="analytics-section full-width">
          <h2>📋 Recent Transactions & Blockchain Records</h2>
          <RecentTransactions 
            transactions={analyticsData.recentTransactions}
            blockchainTransactions={analyticsData.blockchainTransactions}
          />
        </div>
      </div>
    </div>
  )
}

export default MerchantPortal