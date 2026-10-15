import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'

export default function App() {
  const [view, setView] = useState('home')

  return (
    <AnimatePresence mode="wait">
      {view === 'home' && (
        <HomePage
          key="home"
          onStartChat={(question) => {
            setView('chat')
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('chat-start', { detail: question }))
            }, 0)
          }}
        />
      )}
      {view === 'chat' && (
        <ChatPage
          key="chat"
          onBackToHome={() => setView('home')}
        />
      )}
    </AnimatePresence>
  )
}