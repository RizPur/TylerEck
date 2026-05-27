import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

const CARNIVAL_COLORS = ['#FF006E', '#FFBE0B', '#3A86FF', '#FB5607', '#06D6A0'];

function launchCelebration() {
  const burst = (angle, x, delay) =>
    setTimeout(
      () =>
        confetti({
          particleCount: 90,
          angle,
          spread: 65,
          origin: { x, y: 0.55 },
          colors: CARNIVAL_COLORS,
          scalar: 1.4,
        }),
      delay
    );
  burst(65, 0.1, 0);
  burst(115, 0.9, 160);
  burst(90, 0.5, 360);
}

// ─── SUSPENSE INTRO ───────────────────────────────────────────────────────────
function SuspenseIntro({ onComplete }) {
  const [dotCount, setDotCount] = useState(0);
  const [showSurprise, setShowSurprise] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setDotCount(1), 1300),
      setTimeout(() => setDotCount(2), 1750),
      setTimeout(() => setDotCount(3), 2200),
      setTimeout(() => setShowSurprise(true), 2900),
      setTimeout(() => setLeaving(true), 4600),
      setTimeout(onComplete, 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      style={styles.intro}
      animate={
        leaving
          ? { opacity: 0, filter: 'brightness(5) blur(6px)', scale: 1.06 }
          : { opacity: 1, filter: 'brightness(1) blur(0px)', scale: 1 }
      }
      transition={{ duration: 0.55, ease: [0.4, 0, 1, 1] }}
    >
      {/* Breathing glow behind everything */}
      <motion.div
        style={styles.introGlow}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div style={styles.introContent}>
        {/* "and now" with dots */}
        <motion.p
          style={styles.andNow}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          and now
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={styles.suspenseDot}
              initial={{ opacity: 0, scale: 3 }}
              animate={dotCount > i ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 3 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              .
            </motion.span>
          ))}
        </motion.p>

        {/* "THE SURPRISE." slams in */}
        <div style={styles.surpriseWrap}>
          <AnimatePresence>
            {showSurprise && (
              <motion.h1
                style={styles.surpriseText}
                initial={{ y: 100, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 250,
                  damping: 22,
                  mass: 0.8,
                }}
              >
                THE
                <br />
                SURPRISE.
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── TICKET REVEAL ────────────────────────────────────────────────────────────
function TicketReveal() {
  const launched = useRef(false);

  useEffect(() => {
    if (launched.current) return;
    launched.current = true;
    setTimeout(launchCelebration, 350);
  }, []);

  return (
    <motion.div
      style={styles.ticketScene}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        style={styles.ticket}
        initial={{ y: 110, opacity: 0, rotate: -5 }}
        animate={{ y: 0, opacity: 1, rotate: -2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {/* IOU stamp — pops in after ticket lands */}
        <motion.div
          style={styles.stamp}
          initial={{ scale: 4, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 14 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.75 }}
          aria-hidden="true"
        >
          IOU
        </motion.div>

        {/* Main body */}
        <div style={styles.body}>
          <motion.p
            style={styles.weOweYou}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.4 }}
          >
            We owe you
          </motion.p>

          <motion.h1
            style={styles.oneRun}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            1 RUN to Nice
          </motion.h1>
        </div>

        {/* Perforation line */}
        <div style={styles.perf}>
          <div style={{ ...styles.perfHole, left: '-11px' }} />
          <div style={{ ...styles.perfHole, right: '-11px' }} />
        </div>

        {/* Stub footer */}
        <motion.div
          style={styles.stub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <span style={styles.stubSig}>— The Crew</span>
          <span style={styles.stubDate}>Happy Birthday, Tyler</span>
        </motion.div>
      </motion.div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        <Link to="/" style={styles.back}>← Back to the tribute</Link>
      </motion.div>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function WinPage() {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'ticket'

  const handleIntroComplete = useCallback(() => {
    setPhase('ticket');
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.stripe} aria-hidden="true" />

      <AnimatePresence mode="wait">
        {phase === 'intro' ? (
          <SuspenseIntro key="intro" onComplete={handleIntroComplete} />
        ) : (
          <TicketReveal key="ticket" />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: '#0A0A0F',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  stripe: {
    position: 'absolute',
    inset: 0,
    background:
      'repeating-linear-gradient(125deg, rgba(255,190,11,0.04) 0px, rgba(255,190,11,0.04) 1px, transparent 1px, transparent 60px)',
    pointerEvents: 'none',
  },

  // ── Intro ──────────────────────────────────────────────────────────────────
  intro: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introGlow: {
    position: 'absolute',
    width: '80vmax',
    height: '80vmax',
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(212,148,10,0.2) 0%, rgba(232,0,95,0.1) 45%, transparent 70%)',
    pointerEvents: 'none',
  },
  introContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '0 1.5rem',
    textAlign: 'center',
  },
  andNow: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
    fontStyle: 'italic',
    fontWeight: 300,
    letterSpacing: '0.22em',
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.06em',
    margin: 0,
  },
  suspenseDot: {
    color: 'rgba(255,190,11,0.9)',
    display: 'inline-block',
    transformOrigin: 'center',
  },
  surpriseWrap: {
    minHeight: 'clamp(9rem, 22vw, 16rem)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surpriseText: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(4.5rem, 20vw, 10rem)',
    lineHeight: 0.88,
    letterSpacing: '0.03em',
    background: 'linear-gradient(135deg, #FFBE0B 0%, #FF006E 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    textAlign: 'center',
  },

  // ── Ticket scene ───────────────────────────────────────────────────────────
  ticketScene: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2.5rem',
    padding: '3rem 1.5rem',
    width: '100%',
  },
  ticket: {
    position: 'relative',
    background: '#FFF8EC',
    borderRadius: '6px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
  },
  stamp: {
    position: 'absolute',
    top: '1.4rem',
    right: '1.6rem',
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    letterSpacing: '0.12em',
    color: '#E8005F',
    border: '3px solid #E8005F',
    borderRadius: '3px',
    padding: '0.15rem 0.65rem',
    lineHeight: 1,
    userSelect: 'none',
    zIndex: 2,
    transformOrigin: 'center center',
  },
  body: {
    padding: '3rem 2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  weOweYou: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'rgba(10,10,15,0.4)',
    margin: 0,
  },
  oneRun: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(4rem, 16vw, 7rem)',
    lineHeight: 0.88,
    letterSpacing: '0.01em',
    color: '#0A0A0F',
    margin: 0,
  },
  perf: {
    position: 'relative',
    borderTop: '2px dashed rgba(10,10,15,0.15)',
    marginTop: '0.5rem',
  },
  perfHole: {
    position: 'absolute',
    top: '-11px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: '#0A0A0F',
    zIndex: 1,
  },
  stub: {
    padding: '1.1rem 2.5rem 1.6rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stubSig: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    fontStyle: 'italic',
    fontWeight: 300,
    color: 'rgba(10,10,15,0.5)',
  },
  stubDate: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.55rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(10,10,15,0.3)',
  },
  back: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.28)',
  },
};
