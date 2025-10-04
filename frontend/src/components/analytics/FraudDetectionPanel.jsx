import { AlertTriangle, Shield, Eye, Clock } from 'lucide-react'
import './analytics.css'

function FraudDetectionPanel({ fraudAttempts = 0, patterns = [] }) {
  const defaultPatterns = [
    { 
      type: 'Multiple Failed MFA', 
      count: 3, 
      severity: 'high',
      description: 'Same IP attempting multiple high-value transactions with failed MFA'
    },
    { 
      type: 'Unusual Location', 
      count: 1, 
      severity: 'medium',
      description: 'Transaction from geographically distant location'
    },
    { 
      type: 'Rapid Transactions', 
      count: 2, 
      severity: 'low',
      description: 'Multiple transactions in short time period'
    }
  ]

  const displayPatterns = patterns.length > 0 ? patterns : defaultPatterns

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc3545'
      case 'medium': return '#fd7e14'
      case 'low': return '#ffc107'
      default: return '#6c757d'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return AlertTriangle
      case 'medium': return Eye
      case 'low': return Clock
      default: return Shield
    }
  }

  return (
    <div className="fraud-panel">
      <div className="fraud-summary">
        <div className="fraud-stat">
          <div className="stat-number">{fraudAttempts}</div>
          <div className="stat-label">Total Attempts Today</div>
        </div>
        <div className="fraud-stat">
          <div className="stat-number">{displayPatterns.length}</div>
          <div className="stat-label">Active Patterns</div>
        </div>
      </div>

      <div className="fraud-patterns">
        <h4>🔍 Detected Patterns</h4>
        {displayPatterns.map((pattern, index) => {
          const Icon = getSeverityIcon(pattern.severity)
          return (
            <div key={index} className="fraud-pattern">
              <div className="pattern-header">
                <div className="pattern-icon" style={{ color: getSeverityColor(pattern.severity) }}>
                  <Icon size={16} />
                </div>
                <div className="pattern-info">
                  <div className="pattern-type">{pattern.type}</div>
                  <div className="pattern-count">{pattern.count} occurrences</div>
                </div>
                <div 
                  className="pattern-severity" 
                  style={{ backgroundColor: getSeverityColor(pattern.severity) }}
                >
                  {pattern.severity}
                </div>
              </div>
              <div className="pattern-description">{pattern.description}</div>
            </div>
          )
        })}
      </div>

      <div className="fraud-actions">
        <button className="action-btn primary">
          <Shield size={16} />
          Update Rules
        </button>
        <button className="action-btn secondary">
          <Eye size={16} />
          View Details
        </button>
      </div>
    </div>
  )
}

export default FraudDetectionPanel