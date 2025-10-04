import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import './analytics.css'

function TransactionChart({ data = [] }) {
  // Default data if none provided
  const defaultData = [
    { date: '2025-10-01', transactions: 45, revenue: 3200, fraudAttempts: 2 },
    { date: '2025-10-02', transactions: 52, revenue: 4100, fraudAttempts: 1 },
    { date: '2025-10-03', transactions: 38, revenue: 2800, fraudAttempts: 4 },
    { date: '2025-10-04', transactions: 61, revenue: 5200, fraudAttempts: 0 }
  ]

  const chartData = data.length > 0 ? data : defaultData

  return (
    <div className="chart-container">
      <div className="chart-tabs">
        <button className="chart-tab active">Transactions</button>
        <button className="chart-tab">Revenue</button>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'transactions') return [value, 'Transactions']
              if (name === 'fraudAttempts') return [value, 'Fraud Attempts']
              return [value, name]
            }}
            labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
          />
          <Line 
            type="monotone" 
            dataKey="transactions" 
            stroke="#667eea" 
            strokeWidth={3}
            dot={{ fill: '#667eea', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="fraudAttempts" 
            stroke="#dc3545" 
            strokeWidth={2}
            dot={{ fill: '#dc3545', r: 3 }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#667eea' }}></div>
          <span>Successful Transactions</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#dc3545' }}></div>
          <span>Fraud Attempts</span>
        </div>
      </div>
    </div>
  )
}

export default TransactionChart