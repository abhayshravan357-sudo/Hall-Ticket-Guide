import { motion } from 'framer-motion'

export default function WelcomePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        textAlign: 'center',
        padding: 'var(--spacing-2xl) var(--spacing-lg)',
        maxWidth: 560,
        margin: '0 auto'
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, var(--color-teal), var(--color-teal-dark))',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--spacing-lg)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <polyline points="17 14 21 18 23 12" />
        </svg>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 700,
          color: 'var(--color-navy)',
          lineHeight: 1.2,
          marginBottom: 'var(--spacing-md)'
        }}
      >
        Your exam, made simpler.
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{
          fontSize: '1.125rem',
          color: 'var(--color-gray-600)',
          lineHeight: 1.6,
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        Ask questions about hall tickets, examination procedures, or common issues. 
        Get guidance based on official SNJB sources.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-xs) var(--spacing-md)',
          background: 'var(--color-warning-light)',
          border: '1px solid var(--color-warning)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          color: 'var(--color-warning)',
          fontWeight: 500
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Demo mode — responses use sample data
      </motion.div>
    </motion.div>
  )
}