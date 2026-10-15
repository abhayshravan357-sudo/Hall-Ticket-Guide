import { motion } from 'framer-motion'

export default function ErrorMessage({ message, onRetry, retryLabel = 'Try again' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="error-message"
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        background: 'var(--color-error-light)',
        border: '1px solid var(--color-error)',
        borderRadius: 'var(--radius-lg)',
        color: 'var(--color-error)'
      }}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div>
        <p style={{ fontWeight: 500, marginBottom: 'var(--spacing-xs)' }}>Something went wrong</p>
        <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            background: 'var(--color-error)',
            color: 'var(--color-white)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            transition: 'background var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--color-error)'}
          onMouseLeave={(e) => e.target.style.background = 'var(--color-error)'}
        >
          {retryLabel}
        </button>
      )}
    </motion.div>
  )
}