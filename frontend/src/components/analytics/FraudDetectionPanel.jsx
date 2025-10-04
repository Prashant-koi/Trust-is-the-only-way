import { AlertTriangle, Shield, Eye, Clock } from 'lucide-react'

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
      case 'high': return 'text-red-400 bg-red-400/20 border-red-400/30'
      case 'medium': return 'text-orange-400 bg-orange-400/20 border-orange-400/30'
      case 'low': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      default: return 'text-theme-text/60 bg-white/10 border-white/20'
    }
  }

  const getSeverityIconColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-orange-400'
      case 'low': return 'text-yellow-400'
      default: return 'text-theme-text/60'
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-red-400/10 rounded-lg border border-red-400/20">
          <div className="text-2xl font-bold text-theme-text">{fraudAttempts}</div>
          <div className="text-sm text-theme-text/60">Total Attempts Today</div>
        </div>
        <div className="text-center p-4 bg-orange-400/10 rounded-lg border border-orange-400/20">
          <div className="text-2xl font-bold text-theme-text">{displayPatterns.length}</div>
          <div className="text-sm text-theme-text/60">Active Patterns</div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-theme-text flex items-center gap-2">
          🔍 Detected Patterns
        </h4>
        {displayPatterns.map((pattern, index) => {
          const Icon = getSeverityIcon(pattern.severity)
          return (
            <div key={index} className="border border-white/20 rounded-lg p-4 space-y-2 bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={getSeverityIconColor(pattern.severity)}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-theme-text text-sm">{pattern.type}</div>
                    <div className="text-xs text-theme-text/60">{pattern.count} occurrences</div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium border rounded-full whitespace-nowrap ${getSeverityColor(pattern.severity)}`}>
                  {pattern.severity}
                </span>
              </div>
              <p className="text-xs text-theme-text/60 leading-relaxed">{pattern.description}</p>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
          <Shield className="h-4 w-4" />
          Update Rules
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-theme-text bg-white/10 border border-white/20 hover:bg-white/20 rounded-lg transition-colors">
          <Eye className="h-4 w-4" />
          View Details
        </button>
      </div>
    </div>
  )
}

export default FraudDetectionPanel