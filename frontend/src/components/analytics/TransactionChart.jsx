import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

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
    <div className="space-y-4">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button className="px-3 py-1 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm">
          Transactions
        </button>
        <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
          Revenue
        </button>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'transactions') return [value, 'Transactions']
                if (name === 'fraudAttempts') return [value, 'Fraud Attempts']
                return [value, name]
              }}
              labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="transactions" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="fraudAttempts" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 3 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Successful Transactions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Fraud Attempts</span>
        </div>
      </div>
    </div>
  )
}

export default TransactionChart