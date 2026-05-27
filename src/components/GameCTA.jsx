import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function GameCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} style={styles.section}>
      {/* Decorative diagonal stripe */}
      <div style={styles.stripe} aria-hidden="true" />

      <motion.div
        style={styles.inner}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span style={styles.eyebrow}>
          <span style={styles.dot} />
          You think you know Tyler?
          <span style={styles.dot} />
        </span>

        <h2 style={styles.headline}>Play<br />Kanekshans.</h2>

        <p style={styles.body}>
          He built his own Connections-style Belize ripoff.
          Now it's time to beat him at his own game.
          Group the 16 words into 4 categories. Get it right, and something special unlocks.
        </p>

        <div style={styles.clues}>
          {['4 categories', '4 words each', '4 chances', '1 surprise'].map((clue) => (
            <span key={clue} style={styles.clue}>{clue}</span>
          ))}
        </div>

        <Link to="/game" style={styles.ctaLink}>
          <motion.button
            style={styles.cta}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <span style={styles.ctaText}>Let's play →</span>
          </motion.button>
        </Link>

        <p style={styles.hint}>Made by his crew. Just for him.</p>
      </motion.div>
    </section>
  );
}

const styles = {
  section: {
    position: 'relative',
    background: '#0A0A0F',
    padding: '8rem 1.5rem',
    overflow: 'hidden',
    borderTop: '1px solid rgba(232,0,95,0.2)',
  },
  stripe: {
    position: 'absolute',
    inset: 0,
    background:
      'repeating-linear-gradient(125deg, rgba(232,0,95,0.06) 0px, rgba(232,0,95,0.06) 1px, transparent 1px, transparent 60px)',
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '640px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.8rem',
  },
  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  },
  dot: {
    display: 'inline-block',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: 'var(--gold)',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(4rem, 14vw, 8rem)',
    lineHeight: 0.88,
    letterSpacing: '0.02em',
    background: 'linear-gradient(135deg, #FFBE0B, #FF006E)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  body: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
    fontWeight: 300,
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.75)',
    maxWidth: '480px',
  },
  clues: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  clue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    padding: '0.4rem 0.8rem',
    border: '1px solid rgba(255,190,11,0.3)',
    borderRadius: '2px',
    color: 'var(--gold)',
  },
  ctaLink: {
    display: 'block',
  },
  cta: {
    background: 'linear-gradient(135deg, #FF006E, #FFBE0B)',
    border: 'none',
    borderRadius: '4px',
    padding: '1.1rem 3.5rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem',
    letterSpacing: '0.06em',
    color: 'white',
    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
    boxShadow: '0 8px 40px rgba(255,0,110,0.4), 0 2px 0 rgba(255,190,11,0.5) inset',
    position: 'relative',
  },
  ctaText: {
    position: 'relative',
    zIndex: 1,
  },
  hint: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.35)',
  },
};
