import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

function Message({ type, message, onClose }) {
  const getMessageIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5" />
      case 'error': return <XCircle className="h-5 w-5" />
      case 'warning': return <AlertTriangle className="h-5 w-5" />
      default: return <Info className="h-5 w-5" />
    }
  }

  const getMessageStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-400/20 text-green-400 border-green-400/30'
      case 'error': return 'bg-red-400/20 text-red-400 border-red-400/30'
      case 'warning': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
      default: return 'bg-cyan-400/20 text-cyan-400 border-cyan-400/30'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`glass-panel ${getMessageStyles()} border p-4 rounded-lg shadow-2xl max-w-sm`}>
        <div className="flex items-start gap-3">
          {getMessageIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-current hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Message