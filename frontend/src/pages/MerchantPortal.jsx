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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin

function MerchantPortal() {
  const [analyticsData, setAnalyticsData] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    fraudAttempts: 0,
    mfaUsage: 0,
    successfulTransactions: 0,
    dailyStats: [],
    fraudPatterns: [],
    recentTransactions: [],
    blockchainTransactions: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`${BACKEND_URL}/api/merchant/analytics`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setAnalyticsData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

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
      <div className="min-h-screen">
        <div className="page-shell">
          <div className="glass-panel text-center py-12">
            <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
            <p className="text-theme-text/60 mt-4">Loading merchant analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="page-shell">
          <div className="glass-panel text-center py-12">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-theme-text mb-2">Error Loading Analytics</h2>
            <p className="text-theme-text/60 mb-4">{error}</p>
            <button 
              onClick={fetchAnalytics} 
              className="primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="page-shell">
        <div className="page-header">
          <div>
            <p className="eyebrow">Fraud Detection Analytics</p>
            <h1>Merchant Portal</h1>
            <p className="subtitle">
              Real-time fraud detection and transaction analytics powered by blockchain MFA verification.
            </p>
          </div>
          <button 
            onClick={fetchAnalytics} 
            className="glass-button flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        {/* Key Metrics Cards */}
        <div className="panel-grid">
          <div className="glass-panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-theme-text/70">Total Revenue</p>
                <p className="text-2xl font-bold text-theme-text">${analyticsData.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-400 mt-1">+12.5% from last month</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-theme-text/70">Completed Transactions</p>
                <p className="text-2xl font-bold text-theme-text">{analyticsData.totalTransactions.toLocaleString()}</p>
                <p className="text-sm text-green-400 mt-1">+8.2% from yesterday</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-theme-text/70">Fraud Attempts</p>
                <p className="text-2xl font-bold text-theme-text">{analyticsData.fraudAttempts.toLocaleString()}</p>
                <p className="text-sm text-red-400 mt-1">{calculateFraudRate()}% fraud rate</p>
              </div>
              <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-theme-text/70">MFA Verifications</p>
                <p className="text-2xl font-bold text-theme-text">{analyticsData.mfaUsage.toLocaleString()}</p>
                <p className="text-sm text-purple-400 mt-1">{calculateMfaSuccessRate()}% success rate</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="space-y-6">
          {/* Transaction Trends - Full Width */}
          <div className="glass-panel">
            <h2 className="text-lg font-semibold text-theme-text mb-4 flex items-center gap-2">
              📈 Transaction Trends
            </h2>
            <TransactionChart data={analyticsData.dailyStats} />
          </div>

          {/* MFA and Fraud Detection - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel">
              <h2 className="text-lg font-semibold text-theme-text mb-4 flex items-center gap-2">
                🔐 MFA Analytics
              </h2>
              <MfaAnalytics 
                mfaUsage={analyticsData.mfaUsage}
                successRate={calculateMfaSuccessRate()}
              />
            </div>

            <div className="glass-panel">
              <h2 className="text-lg font-semibold text-theme-text mb-4 flex items-center gap-2">
                🚨 Fraud Detection
              </h2>
              <FraudDetectionPanel 
                fraudAttempts={analyticsData.fraudAttempts}
                patterns={analyticsData.fraudPatterns}
              />
            </div>
          </div>

          {/* Recent Transactions - Full Width */}
          <div className="glass-panel">
            <h2 className="text-lg font-semibold text-theme-text mb-4 flex items-center gap-2">
              📋 Recent Transactions & Blockchain Records
            </h2>
            <RecentTransactions 
              transactions={analyticsData.recentTransactions || []}
              blockchainTransactions={analyticsData.blockchainTransactions || []}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MerchantPortal