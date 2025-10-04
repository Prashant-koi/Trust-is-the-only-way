import { CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react'

function RecentTransactions({ transactions = [], blockchainTransactions = [] }) {
  // Combine real transactions with blockchain data
  const displayTransactions = transactions.length > 0 ? transactions : []

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'fraud_blocked': return <XCircle className="h-4 w-4 text-red-400" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />
      default: return <AlertTriangle className="h-4 w-4 text-theme-text/40" />
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-400/20 text-green-400 border-green-400/30'
      case 'fraud_blocked': return 'bg-red-400/20 text-red-400 border-red-400/30'
      case 'pending': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
      default: return 'bg-white/10 text-theme-text/60 border-white/20'
    }
  }

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-400/20 text-green-400 border-green-400/30'
      case 'medium': return 'bg-orange-400/20 text-orange-400 border-orange-400/30'
      case 'high': return 'bg-red-400/20 text-red-400 border-red-400/30'
      default: return 'bg-white/10 text-theme-text/60 border-white/20'
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
          <button className="px-3 py-1 text-sm font-medium bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 rounded-full">
            All
          </button>
          <button className="px-3 py-1 text-sm font-medium bg-white/10 text-theme-text/70 border border-white/20 rounded-full hover:bg-white/20">
            Completed
          </button>
          <button className="px-3 py-1 text-sm font-medium bg-white/10 text-theme-text/70 border border-white/20 rounded-full hover:bg-white/20">
            Fraud Blocked
          </button>
          <button className="px-3 py-1 text-sm font-medium bg-white/10 text-theme-text/70 border border-white/20 rounded-full hover:bg-white/20">
            High Risk
          </button>
        </div>
        <input 
          type="text" 
          placeholder="Search transactions..." 
          className="w-full sm:w-64 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-theme-text placeholder-theme-text/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-7 gap-4 p-3 bg-white/5 border-b border-white/20 text-xs font-medium text-theme-text/70 uppercase tracking-wider">
            <div>Transaction ID</div>
            <div>Amount</div>
            <div>Status</div>
            <div>MFA</div>
            <div>Risk</div>
            <div>Time</div>
            <div>Actions</div>
          </div>

          {displayTransactions.length === 0 ? (
            <div className="text-center py-12 bg-white/5">
              <p className="text-theme-text/60 font-medium">No transactions yet</p>
              <p className="text-theme-text/40 text-sm mt-1">Transactions will appear here after customers make purchases</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayTransactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-7 gap-4 p-3 bg-white/5 border-b border-white/10 hover:bg-white/10 transition-colors">
                  <div className="space-y-1">
                    <div className="font-medium text-theme-text text-sm">{transaction.id}</div>
                    <div className="text-xs text-theme-text/50">{transaction.customerInfo}</div>
                  </div>
                  
                  <div className="font-medium text-theme-text">
                    ${transaction.amount?.toLocaleString() || '0'}
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${getStatusBadgeColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span>{transaction.status?.replace('_', ' ') || 'Unknown'}</span>
                    </div>
                    {transaction.reason && (
                      <div className="text-xs text-theme-text/50">{transaction.reason}</div>
                    )}
                  </div>
                  
                  <div>
                    {transaction.mfaUsed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-400/20 text-green-400 border border-green-400/30 rounded-full">
                        ✅ {transaction.method?.toUpperCase() || 'OTP'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white/10 text-theme-text/60 border border-white/20 rounded-full">
                        ➖ None
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${getRiskBadgeColor(transaction.riskScore)}`}>
                      {transaction.riskScore || 'low'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-theme-text/60">
                    {formatTime(transaction.timestamp)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      className="p-1 text-theme-text/40 hover:text-theme-text/60 transition-colors" 
                      title="View Details"
                    >
                      👁️
                    </button>
                    {transaction.blockchainTx && (
                      <a 
                        href={`https://amoy.polygonscan.com/tx/${transaction.blockchainTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
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
          <button className="glass-button text-sm">
            ← Previous
          </button>
          <span className="text-sm text-theme-text/60">
            Showing {displayTransactions.length} transactions
          </span>
          <button className="glass-button text-sm">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default RecentTransactions