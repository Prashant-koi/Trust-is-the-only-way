import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react'
import './analytics.css'

function MfaAnalytics({ mfaUsage = 0, successRate = 0 }) {
  const mfaData = [
    { name: 'SMS Success', value: 68, color: '#28a745' },
    { name: 'SMS Failed', value: 12, color: '#dc3545' },
    { name: 'Email Success', value: 15, color: '#17a2b8' },
    { name: 'Email Failed', value: 5, color: '#fd7e14' }
  ]

  const methodStats = [
    { method: 'SMS', attempts: 80, success: 68, failure: 12 },
    { method: 'Email', attempts: 20, success: 15, failure: 5 }
  ]

  return (
    <div className="mfa-analytics">
      <div className="mfa-overview">
        <div className="mfa-metric">
          <div className="metric-icon success">
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="metric-number">{successRate}%</div>
            <div className="metric-label">Success Rate</div>
          </div>
        </div>
        
        <div className="mfa-metric">
          <div className="metric-icon info">
            <Shield size={20} />
          </div>
          <div>
            <div className="metric-number">{mfaUsage}</div>
            <div className="metric-label">Total MFA</div>
          </div>
        </div>
      </div>

      <div className="mfa-chart-section">
        <h5>MFA Method Performance</h5>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={mfaData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              dataKey="value"
            >
              {mfaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mfa-methods">
        <h5>Method Breakdown</h5>
        {methodStats.map((method, index) => {
          const successPercent = (method.success / method.attempts) * 100
          return (
            <div key={index} className="method-stat">
              <div className="method-header">
                <span className="method-name">{method.method}</span>
                <span className="method-rate">{successPercent.toFixed(1)}%</span>
              </div>
              <div className="method-bar">
                <div 
                  className="method-progress" 
                  style={{ width: `${successPercent}%` }}
                ></div>
              </div>
              <div className="method-details">
                <span>✅ {method.success} success</span>
                <span>❌ {method.failure} failed</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mfa-insights">
        <div className="insight-item">
          <Clock size={16} />
          <span>Average verification time: 45s</span>
        </div>
        <div className="insight-item">
          <Shield size={16} />
          <span>Peak MFA usage: 2-4 PM</span>
        </div>
      </div>
    </div>
  )
}

export default MfaAnalytics