export const API_CONFIG = {
  BASE_URL: 'https://alike-ordered-prisoner-spin.trycloudflare.com',
  ENDPOINTS: {
    ASK: '/ask'
  }
} as const

export const UI_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  TYPING_DELAY: 1000,
  SCROLL_BEHAVIOR: 'smooth' as const,
  ANIMATION_DURATION: 200
} as const

export const THEMES = {
  DARK: 'from-slate-900 via-purple-900 to-slate-900',
  BLUE: 'from-blue-900 via-indigo-900 to-slate-900',
  GREEN: 'from-emerald-900 via-teal-900 to-slate-900',
  SUNSET: 'from-orange-900 via-red-900 to-pink-900'
} as const

export const DEFAULT_SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Help me write a professional email",
  "Create a workout plan for beginners",
  "Suggest ideas for a weekend project",
  "How can I improve my productivity?",
  "What are the latest tech trends?"
] as const