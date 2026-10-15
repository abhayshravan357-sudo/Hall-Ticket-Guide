import { motion } from 'framer-motion'

const checklistItems = [
  { id: 1, text: 'Hall ticket downloaded and printed (two copies recommended)' },
  { id: 2, text: 'Valid photo ID (Aadhar, PAN, driving license, or college ID)' },
  { id: 3, text: 'Exam centre location and route confirmed' },
  { id: 4, text: 'Reporting time noted (arrive at least 30 minutes early)' },
  { id: 5, text: 'Permitted stationery: pens (blue/black), pencils, eraser, sharpener' },
  { id: 6, text: 'Calculator (if permitted for your subject) — check subject rules' },
  { id: 7, text: 'Water bottle (transparent, no labels)' },
  { id: 8, text: 'No electronic devices, smartwatches, or unauthorised materials' }
]

export default function ExamChecklist({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 33, 61, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-md)',
        zIndex: 'var(--z-modal)'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checklist-title"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: 'var(--spacing-lg)',
          background: 'var(--color-navy)',
          color: 'var(--color-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 id="checklist-title" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
            Exam Day Checklist
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-white)',
              transition: 'background var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            aria-label="Close checklist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div style={{ padding: 'var(--spacing-md)', maxHeight: '60vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-md)', padding: '0 var(--spacing-sm)' }}>
            General guidance — confirm specific requirements with your examination notice.
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {checklistItems.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.id * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--color-gray-50)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)', lineHeight: 1.5 }}>
                  {item.text}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
        
        <div style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          background: 'var(--color-gray-50)',
          borderTop: '1px solid var(--color-gray-200)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-xl)',
              background: 'var(--color-teal)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              transition: 'background var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--color-teal-dark)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--color-teal)'}
          >
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}