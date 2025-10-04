import { CheckCircle, XCircle, AlertTriangle, Clock, ExternalLink } from 'lucide-react'
import './analytics.css'

function RecentTransactions({ transactions = [], blockchainTransactions = [] }) {
  // Combine real transactions with blockchain data
  const displayTransactions = transactions.length > 0 ? transactions : []

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="status-icon success" size={16} />
      case 'fraud_blocked': return <XCircle className="status-icon error" size={16} />
      case 'pending': return <Clock className="status-icon warning" size={16} />
      default: return <AlertTriangle className="status-icon" size={16} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'fraud_blocked': return 'error'
      case 'pending': return 'warning'
      default: return 'neutral'
    }
  }

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'low': return '#28a745'
      case 'medium': return '#fd7e14'
      case 'high': return '#dc3545'
      default: return '#6c757d'
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
    <div className="recent-transactions">
      <div className="transactions-header">
        <div className="transactions-filters">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Completed</button>
          <button className="filter-btn">Fraud Blocked</button>
          <button className="filter-btn">High Risk</button>
        </div>
        <div className="transactions-search">
          <input type="text" placeholder="Search transactions..." className="search-input" />
        </div>
      </div>

      <div className="transactions-table">
        <div className="table-header">
          <div>Transaction ID</div>
          <div>Amount</div>
          <div>Status</div>
          <div>MFA</div>
          <div>Risk</div>
          <div>Time</div>
          <div>Actions</div>
        </div>

        {displayTransactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions yet</p>
            <small>Transactions will appear here after customers make purchases</small>
          </div>
        ) : (
          displayTransactions.map((transaction) => (
          <div key={transaction.id} className={`table-row ${getStatusColor(transaction.status)}`}>
            <div className="transaction-id">
              <span className="id-text">{transaction.id}</span>
              <span className="customer-info">{transaction.customerInfo}</span>
            </div>
            
            <div className="amount">
              ${transaction.amount.toLocaleString()}
            </div>
            
            <div className="status">
              {getStatusIcon(transaction.status)}
              <span className="status-text">
                {transaction.status.replace('_', ' ')}
              </span>
              {transaction.reason && (
                <div className="status-reason">{transaction.reason}</div>
              )}
            </div>
            
            <div className="mfa-info">
              {transaction.mfaUsed ? (
                <span className="mfa-badge used">
                  ✅ {transaction.method.toUpperCase()}
                </span>
              ) : (
                <span className="mfa-badge not-used">➖ None</span>
              )}
            </div>
            
            <div className="risk-score">
              <span 
                className="risk-badge"
                style={{ backgroundColor: getRiskBadgeColor(transaction.riskScore) }}
              >
                {transaction.riskScore}
              </span>
            </div>
            
            <div className="timestamp">
              {formatTime(transaction.timestamp)}
            </div>
            
            <div className="actions">
              <button className="action-btn view" title="View Details">
                👁️
              </button>
              {transaction.blockchainTx && (
                <a 
                  href={`https://amoy.polygonscan.com/tx/${transaction.blockchainTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn blockchain"
                  title="View on Polygon Explorer"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
          ))
        )}
      </div>

      {displayTransactions.length > 0 && (
        <div className="transactions-pagination">
          <button className="pagination-btn">← Previous</button>
          <span className="pagination-info">Showing {displayTransactions.length} transactions</span>
          <button className="pagination-btn">Next →</button>
        </div>
      )}
    </div>
  )
}

export default RecentTransactions