import { motion } from 'framer-motion'

export default function SourceList({ sources, onSourceClick, title = 'Sources', compact = false }) {
  if (!sources || sources.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{
        marginTop: compact ? 'var(--spacing-sm)' : 'var(--spacing-md)',
        paddingTop: compact ? 'var(--spacing-sm)' : 'var(--spacing-md)',
        borderTop: `1px solid var(--color-gray-200)`
      }}
    >
      <p style={{
        fontSize: '0.75rem',
        fontWeight: 500,
        color: 'var(--color-gray-500)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 'var(--spacing-sm)'
      }}>
        {title}
      </p>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)'
      }}>
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
              padding: compact ? 'var(--spacing-xs) var(--spacing-sm)' : 'var(--spacing-sm) var(--spacing-md)',
              background: 'var(--color-gray-50)',
              border: '1px solid var(--color-gray-200)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-gray-700)',
              fontSize: compact ? '0.75rem' : '0.8125rem',
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
            <svg width={compact ? 14 : 16} height={compact ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: 'var(--color-teal)' }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {source.title || source.url}
            </span>
            {source.url && (
              <svg width={compact ? 12 : 14} height={compact ? 12 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginLeft: 'auto', color: 'var(--color-gray-400)' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}