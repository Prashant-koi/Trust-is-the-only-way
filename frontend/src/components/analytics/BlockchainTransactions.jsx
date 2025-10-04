import { useState, useEffect } from 'react'
import { ExternalLink, Database, Clock } from 'lucide-react'

function BlockchainTransactions({ backendUrl }) {
  const [blockchainTx, setBlockchainTx] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBlockchainData()
  }, [])

  const fetchBlockchainData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/merchant/analytics`)
      const data = await response.json()
      setBlockchainTx(data.blockchainTransactions || [])
    } catch (error) {
      console.error('Error fetching blockchain data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="blockchain-loading">
        <Database className="loading-icon" />
        <p>Loading blockchain transactions...</p>
      </div>
    )
  }

  return (
    <div className="blockchain-transactions">
      <div className="blockchain-header">
        <h3>⛓️ Blockchain Transactions</h3>
        <button onClick={fetchBlockchainData} className="refresh-blockchain">
          Refresh
        </button>
      </div>

      {blockchainTx.length === 0 ? (
        <div className="no-blockchain-data">
          <Database size={48} color="#ccc" />
          <p>No blockchain transactions found</p>
          <small>MFA approvals will appear here once recorded on-chain</small>
        </div>
      ) : (
        <div className="blockchain-list">
          {blockchainTx.map((tx, index) => (
            <div key={index} className="blockchain-item">
              <div className="tx-info">
                <div className="tx-hash">
                  <span className="hash-label">TX Hash:</span>
                  <code>{tx.transactionHash.substring(0, 20)}...</code>
                </div>
                <div className="tx-details">
                  <span className="block-number">Block #{tx.blockNumber}</span>
                  <span className="tx-time">
                    <Clock size={14} />
                    {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'Unknown time'}
                  </span>
                </div>
              </div>
              <div className="tx-actions">
                <a 
                  href={tx.explorerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-explorer"
                >
                  <ExternalLink size={16} />
                  View on Explorer
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlockchainTransactions