import { DEFAULT_SUGGESTIONS } from '../utils/constants'

interface WelcomeMessageProps {
  onSuggestionClick?: (suggestion: string) => void
}

const WelcomeMessage = ({ onSuggestionClick }: WelcomeMessageProps) => {
  return (
    <div className="text-center py-16 px-4">
      {/* Hero Section */}
      <div className="space-y-6 mb-12">
        <div className="w-12 h-12 bg-neutral-900 rounded-lg mx-auto mb-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-3">Welcome</h2>
          <p className="text-neutral-600 max-w-md mx-auto">
            Start a conversation with AI. Ask questions, get help, or explore ideas.
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-6">
        <p className="text-sm text-neutral-500 font-medium">Try these prompts</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {DEFAULT_SUGGESTIONS.slice(0, 4).map((suggestion, index) => (
            <button
              key={index}
              className="text-left p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-sm text-neutral-700"
              onClick={() => {
                onSuggestionClick?.(suggestion)
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WelcomeMessage