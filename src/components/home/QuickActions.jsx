import { motion } from 'framer-motion'

const quickActions = [
  {
    id: 'download',
    title: 'Download guide',
    description: 'Learn the official process',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    question: 'How do I download my hall ticket?'
  },
  {
    id: 'troubleshoot',
    title: 'Fix an issue',
    description: 'Get troubleshooting steps',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    question: 'My hall ticket is unavailable. What should I do?'
  },
  {
    id: 'checklist',
    title: 'Exam checklist',
    description: 'Prepare before exam day',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    question: 'What documents do I need for the exam?'
  },
  {
    id: 'help',
    title: 'Official help',
    description: 'Find the right office',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    question: 'How do I contact the examination office?'
  }
]

export default function QuickActions({ onActionClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 'var(--spacing-md)',
        maxWidth: 640,
        margin: '0 auto',
        padding: '0 var(--spacing-md)'
      }}
      role="list"
      aria-label="Quick actions"
    >
      {quickActions.map((action, index) => (
        <motion.button
          key={action.id}
          onClick={() => onActionClick(action.question)}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-lg)',
            background: 'var(--color-white)',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-normal)',
            boxShadow: 'var(--shadow-sm)'
          }}
          role="listitem"
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            background: 'var(--color-navy)',
            color: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)'
          }}>
            {action.icon}
          </div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-navy)' }}>
            {action.title}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
            {action.description}
          </p>
        </motion.button>
      ))}
    </motion.div>
  )
}