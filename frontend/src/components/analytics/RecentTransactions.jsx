import { CheckCircle, XCircle, AlertTriangle, Clock, ExternalLink } from 'lucide-react'

function RecentTransactions({ transactions = [], blockchainTransactions = [] }) {
  // Combine real transactions with blockchain data
  const displayTransactions = transactions.length > 0 ? transactions : []

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'fraud_blocked': return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'fraud_blocked': return 'bg-red-100 text-red-800 border-red-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (timestamp) => {
    // Ensure timestamp is a Date object
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 rounded-full">
            All
          </button>
          <button className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded-full hover:bg-gray-200">
            Completed
          </button>
          <button className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded-full hover:bg-gray-200">
            Fraud Blocked
          </button>
          <button className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded-full hover:bg-gray-200">
            High Risk
          </button>
        </div>
        <input 
          type="text" 
          placeholder="Search transactions..." 
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div>Transaction ID</div>
            <div>Amount</div>
            <div>Status</div>
            <div>MFA</div>
            <div>Risk</div>
            <div>Time</div>
            <div>Actions</div>
          </div>

          {displayTransactions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50">
              <p className="text-gray-600 font-medium">No transactions yet</p>
              <p className="text-gray-500 text-sm mt-1">Transactions will appear here after customers make purchases</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayTransactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-7 gap-4 p-3 bg-white border-b border-gray-200 hover:bg-gray-50">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900 text-sm">{transaction.id}</div>
                    <div className="text-xs text-gray-500">{transaction.customerInfo}</div>
                  </div>
                  
                  <div className="font-medium text-gray-900">
                    ${transaction.amount.toLocaleString()}
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${getStatusBadgeColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span>{transaction.status.replace('_', ' ')}</span>
                    </div>
                    {transaction.reason && (
                      <div className="text-xs text-gray-500">{transaction.reason}</div>
                    )}
                  </div>
                  
                  <div>
                    {transaction.mfaUsed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 border border-green-200 rounded-full">
                        ✅ {transaction.method.toUpperCase()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 rounded-full">
                        ➖ None
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${getRiskBadgeColor(transaction.riskScore)}`}>
                      {transaction.riskScore}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {formatTime(transaction.timestamp)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors" 
                      title="View Details"
                    >
                      👁️
                    </button>
                    {transaction.blockchainTx && (
                      <a 
                        href={`https://amoy.polygonscan.com/tx/${transaction.blockchainTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                        title="View on Polygon Explorer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {displayTransactions.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            ← Previous
          </button>
          <span className="text-sm text-gray-600">
            Showing {displayTransactions.length} transactions
          </span>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default RecentTransactions