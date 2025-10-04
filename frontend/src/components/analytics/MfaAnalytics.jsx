import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react'

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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 bg-green-400/10 rounded-lg border border-green-400/20">
          <div className="h-10 w-10 bg-green-400/20 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-theme-text">{successRate}%</div>
            <div className="text-sm text-theme-text/60">Success Rate</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-blue-400/10 rounded-lg border border-blue-400/20">
          <div className="h-10 w-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-theme-text">{mfaUsage}</div>
            <div className="text-sm text-theme-text/60">Total MFA</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="text-sm font-semibold text-theme-text">MFA Method Performance</h5>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
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
      </div>

      <div className="space-y-3">
        <h5 className="text-sm font-semibold text-theme-text">Method Breakdown</h5>
        <div className="space-y-4">
          {methodStats.map((method, index) => {
            const successPercent = (method.success / method.attempts) * 100
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-theme-text">{method.method}</span>
                  <span className="text-sm text-theme-text/70">{successPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${successPercent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-theme-text/60">
                  <span>✅ {method.success} success</span>
                  <span>❌ {method.failure} failed</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-theme-text/60">
          <Clock className="h-4 w-4" />
          <span>Average verification time: 45s</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-theme-text/60">
          <Shield className="h-4 w-4" />
          <span>Peak MFA usage: 2-4 PM</span>
        </div>
      </div>
    </div>
  )
}

export default MfaAnalytics