import ChatInterface from './components/ChatInterface'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <ErrorBoundary>
        <ChatInterface />
      </ErrorBoundary>
    </div>
  )
}

export default App
