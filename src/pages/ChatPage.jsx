import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import ChatWindow from '../components/chat/ChatWindow'
import ExamChecklist from '../components/checklist/ExamChecklist'
import LoadingState from '../components/common/LoadingState'
import ErrorMessage from '../components/common/ErrorMessage'

const MOCK_RESPONSES = {
  download: {
    content: `To download your hall ticket, follow the official process:

1. Visit the official SNJB examination portal (the exact URL will be announced by the Examination Cell)
2. Log in using your student credentials (PRN/seat number and password)
3. Navigate to the "Hall Ticket" or "Download Hall Ticket" section
4. Verify your details are correct
5. Download and print at least two copies

**Important**: The hall ticket portal link and release dates are published through official examination notices. Always check the latest notice from the Examination Cell for the correct portal and timeline.

If you cannot access the portal, contact the Examination Cell at principalcoe@snjb.org or +91 2556 253750.`,
    sources: [
      { id: 'source-001', title: 'SNJB Examination Cell / COE Desk', url: 'https://snjb.org/engineering/exam-cell/coe-desk' }
    ],
    followUp: ['What if I cannot log in?', 'When will hall tickets be released?', 'What documents do I need?']
  },
  troubleshoot: {
    content: `If your hall ticket is unavailable, try these steps:

1. **Check the release notice** — Confirm that hall tickets have been released for your examination. Release dates are announced via official notices.

2. **Verify examination form status** — Ensure your examination form was submitted and fees were paid. Pending forms or unpaid fees can block hall ticket generation.

3. **Clear browser cache** — Try a different browser or incognito mode.

4. **Check credentials** — Use your correct PRN/seat number and password.

5. **Contact the Examination Office** — If the issue persists, reach out to the Examination Cell directly.

**Do not** share your login credentials with anyone. The college will never ask for your password via email or phone.`,
    sources: [
      { id: 'source-001', title: 'SNJB Examination Cell / COE Desk', url: 'https://snjb.org/engineering/exam-cell/coe-desk' }
    ],
    followUp: ['How do I check my examination form status?', 'What if my details are wrong on the hall ticket?', 'Can someone else collect my hall ticket?']
  },
  checklist: {
    content: `Here's your exam day checklist:

✅ **Hall ticket** — Downloaded and printed (two copies recommended)
✅ **Valid photo ID** — Aadhar, PAN, driving license, or college ID
✅ **Exam centre** — Location and route confirmed
✅ **Reporting time** — Arrive at least 30 minutes early
✅ **Stationery** — Blue/black pens, pencils, eraser, sharpener
✅ **Calculator** — Only if permitted for your subject (check subject rules)
✅ **Water bottle** — Transparent, no labels
❌ **No electronics** — No phones, smartwatches, or unauthorised materials

**Important**: This is general guidance. Always confirm specific requirements with your official examination notice and hall ticket instructions.`,
    sources: [
      { id: 'source-001', title: 'SNJB Examination Cell / COE Desk', url: 'https://snjb.org/engineering/exam-cell/coe-desk' }
    ],
    followUp: ['What if I lose my hall ticket on exam day?', 'Are calculators allowed for all subjects?', 'What is the dress code?']
  },
  help: {
    content: `For official help with hall ticket and examination issues:

**SNJB Examination Cell / COE Desk**
- **Email**: principalcoe@snjb.org
- **Phone**: +91 2556 253750
- **Office**: SNJB College of Engineering, Examination Cell
- **Website**: https://snjb.org/engineering/exam-cell/coe-desk

**When to contact them:**
- Hall ticket not available after official release date
- Incorrect personal details (name, photograph, subjects) on hall ticket
- Examination form or fee payment issues
- Exam centre or timetable queries
- Any grievance related to examinations

**Office hours**: Typically Monday–Friday, 10:00 AM – 5:00 PM (confirm current hours)

Keep your PRN/seat number ready when contacting them.`,
    sources: [
      { id: 'source-001', title: 'SNJB Examination Cell / COE Desk', url: 'https://snjb.org/engineering/exam-cell/coe-desk' }
    ],
    followUp: ['What is the process for correcting my name on the hall ticket?', 'How do I report a grievance?', 'What are the office hours?']
  },
  default: {
    content: `I can help you with hall ticket procedures, examination processes, and common issues. 

Try asking about:
- How to download your hall ticket
- Troubleshooting unavailable hall tickets
- Exam day preparation checklist
- Contacting the examination office

What would you like to know?`,
    sources: [],
    followUp: ['How do I download my hall ticket?', 'My hall ticket is unavailable', 'What documents do I need?', 'How do I contact the examination office?']
  }
}

function getMockResponse(message) {
  const lower = message.toLowerCase()
  if (lower.includes('download') || lower.includes('get') || lower.includes('hall ticket')) {
    return MOCK_RESPONSES.download
  }
  if (lower.includes('unavailable') || lower.includes('not available') || lower.includes('issue') || lower.includes('problem') || lower.includes('fix') || lower.includes('troubleshoot')) {
    return MOCK_RESPONSES.troubleshoot
  }
  if (lower.includes('checklist') || lower.includes('document') || lower.includes('prepare') || lower.includes('exam day') || lower.includes('what do i need')) {
    return MOCK_RESPONSES.checklist
  }
  if (lower.includes('contact') || lower.includes('help') || lower.includes('office') || lower.includes('phone') || lower.includes('email')) {
    return MOCK_RESPONSES.help
  }
  return MOCK_RESPONSES.default
}

export default function ChatPage({ onBackToHome }) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showChecklist, setShowChecklist] = useState(false)
  const chatWindowRef = useRef(null)

  const handleSendMessage = useCallback(async (text) => {
    const userMessage = { id: Date.now(), role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
      
      const response = getMockResponse(text)
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.content,
        sources: response.sources,
        followUp: response.followUp
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError({ message: 'Failed to get response. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRetry = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (lastUserMessage) {
      setMessages(prev => prev.filter(m => m.id !== lastUserMessage.id))
      handleSendMessage(lastUserMessage.content)
    }
  }, [messages, handleSendMessage])

  const handleNewChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const handleSourceClick = useCallback((source) => {
    if (source.url) {
      window.open(source.url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  const handleQuickAction = useCallback((question) => {
    handleSendMessage(question)
  }, [handleSendMessage])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-off-white)'
      }}
    >
      <header style={{
        padding: 'var(--spacing-md) var(--spacing-lg)',
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-gray-200)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-dropdown)'
      }}>
        <div style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)'
        }}>
          <button
            onClick={onBackToHome}
            style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              color: 'var(--color-gray-600)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => { e.target.style.background = 'var(--color-gray-100)'; e.target.style.color = 'var(--color-navy)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-gray-600)'; }}
            aria-label="Back to home"
          >
            ← Back
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-navy)' }}>Hall Ticket Guide</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>SNJB Student Help Centre · Demo</p>
          </div>
          <button
            onClick={() => setShowChecklist(true)}
            style={{
              padding: 'var(--spacing-xs) var(--spacing-md)',
              background: 'var(--color-navy)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              transition: 'background var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--color-navy-light)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--color-navy)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Checklist
          </button>
        </div>
      </header>

      <main style={{
        flex: 1,
        maxWidth: 'var(--container-max)',
        width: '100%',
        margin: '0 auto',
        padding: 'var(--spacing-lg) var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 80px)'
      }}>
        <ChatWindow
          ref={chatWindowRef}
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={handleSendMessage}
          onRetry={handleRetry}
          onNewChat={handleNewChat}
          onSourceClick={handleSourceClick}
        />
      </main>

      {showChecklist && (
        <ExamChecklist onClose={() => setShowChecklist(false)} />
      )}
    </motion.div>
  )
}