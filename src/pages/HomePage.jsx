import { motion } from 'framer-motion'
import WelcomePanel from '../components/home/WelcomePanel'
import QuickActions from '../components/home/QuickActions'

export default function HomePage({ onStartChat }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-xl) var(--spacing-md)',
        background: 'var(--color-off-white)'
      }}
    >
      <header style={{
        width: '100%',
        maxWidth: 'var(--container-max)',
        marginBottom: 'var(--spacing-xl)',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            background: 'var(--color-white)',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-teal)" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-navy)' }}>
            SNJB College of Engineering
          </span>
        </motion.div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 'var(--container-max)'
      }}>
        <WelcomePanel />
        <QuickActions onActionClick={onStartChat} />
      </main>

      <footer style={{
        width: '100%',
        maxWidth: 'var(--container-max)',
        marginTop: 'var(--spacing-2xl)',
        padding: 'var(--spacing-lg)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
          This is a demonstration assistant. For official examination information,{' '}
          <a href="https://snjb.org/engineering/exam-cell/coe-desk" target="_blank" rel="noopener noreferrer">
            visit the SNJB Examination Cell
          </a>
        </p>
      </footer>
    </motion.div>
  )
}