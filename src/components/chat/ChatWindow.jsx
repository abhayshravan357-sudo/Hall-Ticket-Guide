import { useRef, useEffect, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import LoadingState from '../common/LoadingState'
import ErrorMessage from '../common/ErrorMessage'

export default function ChatWindow({ messages, isLoading, error, onSendMessage, onRetry, onNewChat, onSourceClick }) {
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useImperativeHandle(undefined, () => ({
    scrollToBottom
  }))

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      border: '1px solid var(--color-gray-200)'
    }}>
      <div style={{
        padding: 'var(--spacing-md) var(--spacing-lg)',
        background: 'var(--color-navy)',
        color: 'var(--color-white)',
        borderBottom: '1px solid var(--color-navy-light)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-md)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Hall Ticket Guide</h2>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>SNJB Student Help Centre</p>
          </div>
          <button
            onClick={onNewChat}
            style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              background: 'rgba(255,255,255,0.1)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 500,
              transition: 'background var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            aria-label="Start new chat"
          >
            New chat
          </button>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-lg)',
          background: 'var(--color-gray-50)'
        }}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--color-gray-500)'
            }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-gray-700)', marginBottom: 'var(--spacing-xs)' }}>
              How can I help you today?
            </p>
            <p style={{ fontSize: '0.875rem', maxWidth: 280 }}>
              Ask me about hall tickets, examination procedures, or common issues.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <MessageBubble
              key={msg.id || index}
              message={msg.content}
              isUser={msg.role === 'user'}
              sources={msg.sources}
              onSourceClick={onSourceClick}
            />
          ))}
        </AnimatePresence>

        {isLoading && <TypingIndicator />}

        {error && (
          <ErrorMessage
            message={error.message || 'An unexpected error occurred'}
            onRetry={onRetry}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={onSendMessage}
        disabled={isLoading || !!error}
        placeholder={messages.length === 0 ? 'Ask about hall tickets, exams, or procedures...' : 'Ask a follow-up question...'}
      />

      <div style={{
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--color-gray-50)',
        borderTop: '1px solid var(--color-gray-200)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.6875rem', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>
          This assistant provides guidance from available sources. Confirm important examination instructions with the official examination office.
        </p>
      </div>
    </div>
  )
}