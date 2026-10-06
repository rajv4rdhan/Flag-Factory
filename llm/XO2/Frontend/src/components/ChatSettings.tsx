import { useState } from 'react'

interface ChatSettingsProps {
  onThemeChange?: (theme: string) => void
  onModelChange?: (model: string) => void
}

const ChatSettings = ({ onThemeChange, onModelChange }: ChatSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [model, setModel] = useState('gpt-4')

  const themes = [
    { id: 'dark', name: 'Dark Purple', gradient: 'from-slate-900 via-purple-900 to-slate-900' },
    { id: 'blue', name: 'Ocean Blue', gradient: 'from-blue-900 via-indigo-900 to-slate-900' },
    { id: 'green', name: 'Forest Green', gradient: 'from-emerald-900 via-teal-900 to-slate-900' },
    { id: 'sunset', name: 'Sunset', gradient: 'from-orange-900 via-red-900 to-pink-900' }
  ]

  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
    { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
    { id: 'claude', name: 'Claude', description: 'Anthropic\'s model' }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
        title="Settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-80 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl z-50">
          <div className="p-4 border-b border-white/20">
            <h3 className="text-white font-semibold">Settings</h3>
          </div>
          
          <div className="p-4 space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="text-white font-medium mb-3 block">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id)
                      onThemeChange?.(themeOption.id)
                    }}
                    className={`p-3 rounded-lg border text-left ${
                      theme === themeOption.id 
                        ? 'border-purple-400 bg-white/30' 
                        : 'border-white/30 bg-white/10 hover:bg-white/20'
                    } transition-all duration-200`}
                  >
                    <div className={`w-full h-4 rounded bg-gradient-to-r ${themeOption.gradient} mb-2`}></div>
                    <div className="text-white text-sm font-medium">{themeOption.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="text-white font-medium mb-3 block">AI Model</label>
              <div className="space-y-2">
                {models.map((modelOption) => (
                  <button
                    key={modelOption.id}
                    onClick={() => {
                      setModel(modelOption.id)
                      onModelChange?.(modelOption.id)
                    }}
                    className={`w-full p-3 rounded-lg border text-left ${
                      model === modelOption.id 
                        ? 'border-purple-400 bg-white/30' 
                        : 'border-white/30 bg-white/10 hover:bg-white/20'
                    } transition-all duration-200`}
                  >
                    <div className="text-white font-medium">{modelOption.name}</div>
                    <div className="text-white/60 text-sm">{modelOption.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Sound Effects</span>
                <button className="w-10 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatSettings