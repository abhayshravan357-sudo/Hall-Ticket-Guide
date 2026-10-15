import { motion } from 'framer-motion'

export default function LoadingState({ message = 'Loading...', size = 'md' }) {
  const sizes = {
    sm: { spinner: 20, gap: 'var(--spacing-sm)', fontSize: '0.75rem' },
    md: { spinner: 32, gap: 'var(--spacing-md)', fontSize: '0.875rem' },
    lg: { spinner: 48, gap: 'var(--spacing-lg)', fontSize: '1rem' }
  }
  
  const { spinner, gap, fontSize } = sizes[size]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="loading-state"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap,
        padding: 'var(--spacing-xl)',
        color: 'var(--color-gray-500)',
        fontSize
      }}
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="spinner"
        style={{
          width: spinner,
          height: spinner,
          border: '3px solid var(--color-gray-200)',
          borderTopColor: 'var(--color-teal)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
        aria-hidden="true"
      />
      <p>{message}</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}