import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatInput({ onSend, disabled, placeholder = 'Ask your question...' }) {
  const textareaRef = useRef(null)
  const [value, setValue] = useState('')
  const [height, setHeight] = useState(48)

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160)
      setHeight(newHeight)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    setValue(newValue)
    setTimeout(adjustHeight, 0)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    const trimmed = value.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setValue('')
      setHeight(48)
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px'
      }
    }
  }

  return (
    <div style={{
      padding: 'var(--spacing-md)',
      background: 'var(--color-white)',
      borderTop: '1px solid var(--color-gray-200)',
      borderBottomLeftRadius: 'var(--radius-xl)',
      borderBottomRightRadius: 'var(--radius-xl)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 'var(--spacing-sm)',
        background: 'var(--color-gray-50)',
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          style={{
            flex: 1,
            minHeight: 48,
            maxHeight: 160,
            height: height,
            resize: 'none',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-gray-800)',
            fontSize: '0.9375rem',
            lineHeight: 1.5,
            fontFamily: 'inherit',
            padding: 0,
            '::placeholder': { color: 'var(--color-gray-400)' }
          }}
          aria-label="Chat message input"
        />
        <AnimatePresence mode="wait">
          {value.trim() && !disabled && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleSend}
              disabled={disabled}
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-teal)',
                color: 'var(--color-white)',
                borderRadius: 'var(--radius-full)',
                transition: 'background var(--transition-fast), transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => !disabled && (e.target.style.background = 'var(--color-teal-dark)')}
              onMouseLeave={(e) => !disabled && (e.target.style.background = 'var(--color-teal)')}
              onMouseDown={(e) => !disabled && (e.target.style.transform = 'scale(0.95)')}
              onMouseUp={(e) => !disabled && (e.target.style.transform = 'scale(1)')}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.7rem', color: 'var(--color-gray-500)', textAlign: 'center' }}>
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}