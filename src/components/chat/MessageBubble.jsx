import { motion } from 'framer-motion'

export default function MessageBubble({ message, isUser, sources, onSourceClick }) {
  const bubbleStyle = {
    maxWidth: '85%',
    padding: 'var(--spacing-md) var(--spacing-lg)',
    borderRadius: 'var(--radius-xl)',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    ...(isUser ? {
      alignSelf: 'flex-end',
      background: 'var(--color-navy)',
      color: 'var(--color-white)',
      borderBottomRightRadius: 'var(--radius-sm)'
    } : {
      alignSelf: 'flex-start',
      background: 'var(--color-white)',
      color: 'var(--color-gray-800)',
      borderBottomLeftRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--color-gray-100)'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        ...(isUser ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' })
      }}
    >
      <div style={bubbleStyle}>
        <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{message}</p>
      </div>
      
      {!isUser && sources && sources.length > 0 && (
        <SourceList sources={sources} onSourceClick={onSourceClick} />
      )}
    </motion.div>
  )
}

function SourceList({ sources, onSourceClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
        width: '100%',
        maxWidth: '85%'
      }}
    >
      <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Sources
      </p>
      {sources.map((source, index) => (
        <motion.button
          key={source.id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSourceClick?.(source)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            background: 'var(--color-gray-50)',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-gray-700)',
            fontSize: '0.8125rem',
            textAlign: 'left',
            width: '100%',
            transition: 'all var(--transition-fast)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--color-gray-100)'
            e.target.style.borderColor = 'var(--color-teal)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--color-gray-50)'
            e.target.style.borderColor = 'var(--color-gray-200)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: 'var(--color-teal)' }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          </svg>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {source.title || source.url}
          </span>
        </motion.button>
      ))}
    </motion.div>
  )
}