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
      case 'high': return 'text-red-600 bg-red-100 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getSeverityIconColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-orange-600'
      case 'low': return 'text-yellow-600'
      default: return 'text-gray-600'
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
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{fraudAttempts}</div>
          <div className="text-sm text-gray-600">Total Attempts Today</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{displayPatterns.length}</div>
          <div className="text-sm text-gray-600">Active Patterns</div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          🔍 Detected Patterns
        </h4>
        {displayPatterns.map((pattern, index) => {
          const Icon = getSeverityIcon(pattern.severity)
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={getSeverityIconColor(pattern.severity)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{pattern.type}</div>
                    <div className="text-xs text-gray-600">{pattern.count} occurrences</div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getSeverityColor(pattern.severity)}`}>
                  {pattern.severity}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{pattern.description}</p>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <Shield className="h-4 w-4" />
          Update Rules
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
          <Eye className="h-4 w-4" />
          View Details
        </button>
      </div>
    </div>
  )
}

export default FraudDetectionPanel