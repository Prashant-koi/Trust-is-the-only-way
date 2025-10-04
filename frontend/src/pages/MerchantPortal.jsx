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
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading merchant analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchAnalytics} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                📊 Merchant Analytics Portal
              </h1>
              <p className="text-gray-600 mt-1">Real-time fraud detection and transaction analytics</p>
            </div>
            <button 
              onClick={fetchAnalytics} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Activity className="h-4 w-4" />
              Refresh Data
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analyticsData.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.successfulTransactions.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">
                  {analyticsData.totalTransactions > 0 ? 
                    ((analyticsData.successfulTransactions / analyticsData.totalTransactions) * 100).toFixed(1) : 0}% success rate
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraud Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.fraudAttempts.toLocaleString()}</p>
                <p className="text-sm text-red-600 mt-1">{calculateFraudRate()}% fraud rate</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MFA Verifications</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.mfaUsage.toLocaleString()}</p>
                <p className="text-sm text-blue-600 mt-1">{calculateMfaSuccessRate()}% success rate</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📈 Transaction Trends
            </h2>
            <TransactionChart data={analyticsData.dailyStats} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🚨 Fraud Detection
            </h2>
            <FraudDetectionPanel 
              fraudAttempts={analyticsData.fraudAttempts}
              patterns={analyticsData.fraudPatterns}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🔐 MFA Analytics
            </h2>
            <MfaAnalytics 
              mfaUsage={analyticsData.mfaUsage}
              successRate={calculateMfaSuccessRate()}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📋 Recent Transactions & Blockchain Records
            </h2>
            <RecentTransactions 
              transactions={analyticsData.recentTransactions}
              blockchainTransactions={analyticsData.blockchainTransactions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MerchantPortal