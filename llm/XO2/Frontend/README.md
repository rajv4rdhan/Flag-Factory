# Minimal Chat Interface

A clean, minimal chat interface built with React, TypeScript, Vite, and Tailwind CSS. Features a modern, responsive design with real-time AI conversation capabilities.

## 🚀 Features

- **Minimal UI/UX**: Clean design with base colors and simple layouts
- **Real-time Chat**: Instant messaging with typing indicators
- **AI Integration**: Connects to AI API for intelligent responses
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Error Handling**: Robust error boundaries and user-friendly error messages
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with Rolldown experimental features
- **Styling**: Tailwind CSS with minimal design approach
- **State Management**: React hooks (useState, useEffect, useRef)
- **API Integration**: Fetch API with error handling
- **Development**: Hot Module Replacement (HMR) for fast development

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:

   ```text
   http://localhost:5173
   ```

## 🎨 Design Features

### Minimal UI

- Clean white backgrounds with subtle gray accents
- Simple borders and subtle shadows
- Blue accent color for interactive elements

### Responsive Layout

- Mobile-first design approach
- Flexible grid system for different screen sizes
- Touch-friendly interface elements

## 🔗 API Integration

The chat interface connects to an AI API endpoint:

```typescript
API_ENDPOINT: https://artistic-reprint-gis-sunglasses.trycloudflare.com/ask
```

### Request Format

```json
{
  "prompt": "Your message here"
}
```

### Response Format

```json
{
  "output": "AI response text"
}
```

## 🎯 Key Components

### ChatInterface

Main container component that manages the chat state and API calls.

### ChatMessage

Individual message component with user/AI differentiation and timestamps.

### ChatInput

Input component with send button, character count, and keyboard shortcuts.

### TypingIndicator

Animated indicator shown while AI is generating a response.

### WelcomeMessage

Clean welcome screen with quick suggestions.

### ErrorBoundary

Error boundary component for handling runtime errors.

## 🚀 Performance Optimizations

- Optimized bundle size with Vite's tree shaking
- Efficient re-renders with proper React hooks usage
- CSS animations using transform for better performance

## 🔒 Security Features

- Input validation and sanitization
- Error boundary protection
- CORS-compliant API requests

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Project Structure

```text
src/
├── components/
│   ├── ChatInterface.tsx      # Main chat container
│   ├── ChatMessage.tsx        # Individual message
│   ├── ChatInput.tsx          # Message input
│   ├── TypingIndicator.tsx    # Typing animation
│   ├── WelcomeMessage.tsx     # Welcome screen
│   ├── ErrorBoundary.tsx     # Error handling
│   └── LoadingSpinner.tsx    # Loading component
├── utils/
│   └── constants.ts           # App constants
├── App.tsx                    # Root component
├── main.tsx                   # App entry point
└── index.css                  # Global styles
```

## 🎨 Customization

### Colors

Modify the color classes in components to match your brand colors.

### API Endpoint

Update the `API_CONFIG` in `src/utils/constants.ts` to change the API endpoint.

### Styling

Customize the Tailwind configuration in `tailwind.config.js` for brand-specific styling.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Clean, minimal, and effective.** 🚀
