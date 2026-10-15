import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        background: 'var(--color-white)',
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-xl)',
        borderBottomLeftRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-sm)',
        maxWidth: '85%',
        alignSelf: 'flex-start'
      }}
      role="status"
      aria-live="polite"
      aria-label="Assistant is typing"
    >
      <div style={{
        display: 'flex',
        gap: 4,
        padding: 'var(--spacing-xs) var(--spacing-sm)'
      }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: 8,
              height: 8,
              background: 'var(--color-gray-400)',
              borderRadius: '50%'
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      <span style={{
        fontSize: '0.8125rem',
        color: 'var(--color-gray-500)',
        alignSelf: 'center',
        paddingRight: 'var(--spacing-sm)'
      }}>
        Assistant is typing...
      </span>
    </motion.div>
  )
}