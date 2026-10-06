import { useState } from 'react'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatHistoryProps {
  messages: Message[]
  onClearHistory: () => void
}

const ChatHistory = ({ messages, onClearHistory }: ChatHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
        title="Chat History"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-80 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl z-50">
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Chat History</h3>
              <button
                onClick={onClearHistory}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-white/60 text-sm">No messages yet</p>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => (
                  <div key={message.id} className="text-sm">
                    <div className={`${message.isUser ? 'text-blue-300' : 'text-emerald-300'} font-medium`}>
                      {message.isUser ? 'You' : 'AI'}
                    </div>
                    <div className="text-white/80 truncate">
                      {message.content.substring(0, 50)}...
                    </div>
                    <div className="text-white/40 text-xs">
                      {message.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatHistory