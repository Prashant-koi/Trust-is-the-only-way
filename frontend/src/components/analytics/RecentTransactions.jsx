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

      <div className="overflow-x-auto -mx-2">
        <div className="min-w-[900px] px-2">
          <div className="grid grid-cols-7 gap-3 p-3 bg-white/5 border-b border-white/20 text-xs font-medium text-theme-text/70 uppercase tracking-wider">
            <div className="min-w-[120px]">Transaction ID</div>
            <div className="min-w-[80px]">Amount</div>
            <div className="min-w-[120px]">Status</div>
            <div className="min-w-[100px]">MFA</div>
            <div className="min-w-[80px]">Risk</div>
            <div className="min-w-[80px]">Time</div>
            <div className="min-w-[80px]">Actions</div>
          </div>

          {displayTransactions.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-b-lg">
              <p className="text-theme-text/60 font-medium">No transactions yet</p>
              <p className="text-theme-text/40 text-sm mt-1">Transactions will appear here after customers make purchases</p>
            </div>
          ) : (
            <div className="space-y-0">
              {displayTransactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-7 gap-3 p-3 bg-white/5 border-b border-white/10 hover:bg-white/10 transition-colors items-center">
                  <div className="space-y-1 min-w-[120px]">
                    <div className="font-medium text-theme-text text-sm truncate">{transaction.id}</div>
                    <div className="text-xs text-theme-text/50 truncate">{transaction.customerInfo}</div>
                  </div>
                  
                  <div className="font-medium text-theme-text min-w-[80px]">
                    ${transaction.amount?.toLocaleString() || '0'}
                  </div>
                  
                  <div className="space-y-1 min-w-[120px]">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full whitespace-nowrap ${getStatusBadgeColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="truncate">{transaction.status?.replace('_', ' ') || 'Unknown'}</span>
                    </div>
                    {transaction.reason && (
                      <div className="text-xs text-theme-text/50 truncate">{transaction.reason}</div>
                    )}
                  </div>
                  
                  <div className="min-w-[100px]">
                    {transaction.mfaUsed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-400/20 text-green-400 border border-green-400/30 rounded-full whitespace-nowrap">
                        ✅ {transaction.method?.toUpperCase() || 'OTP'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white/10 text-theme-text/60 border border-white/20 rounded-full whitespace-nowrap">
                        ➖ None
                      </span>
                    )}
                  </div>
                  
                  <div className="min-w-[80px]">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full whitespace-nowrap ${getRiskBadgeColor(transaction.riskScore)}`}>
                      {transaction.riskScore || 'low'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-theme-text/60 min-w-[80px] whitespace-nowrap">
                    {formatTime(transaction.timestamp)}
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-[80px]">
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
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
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

      {blockchainTransactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-sm font-semibold text-theme-text mb-3 flex items-center gap-2">
            ⛓️ Blockchain Records ({blockchainTransactions.length})
          </h3>
          <div className="space-y-2">
            {blockchainTransactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-cyan-400">Block #{tx.blockNumber}</span>
                    <span className="text-xs text-theme-text/50">•</span>
                    <span className="text-xs text-theme-text/50">{new Date(tx.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-theme-text/60 font-mono truncate">
                    Hash: {tx.approvalHash?.slice(0, 20)}...
                  </div>
                </div>
                <a 
                  href={tx.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 rounded-full hover:bg-cyan-400/30 transition-colors whitespace-nowrap ml-3"
                >
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentTransactions