import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

import tylerHero from '../assets/tyler/tylereck.png';

const CARNIVAL_COLORS = ['#FF006E', '#FFBE0B', '#3A86FF', '#FB5607', '#06D6A0'];

function launchCarnivalConfetti() {
  const burst = (angle, x) =>
    confetti({
      particleCount: 60,
      angle,
      spread: 55,
      origin: { x, y: 0.65 },
      colors: CARNIVAL_COLORS,
      scalar: 1.3,
      gravity: 0.9,
      drift: 0,
    });
  burst(60, 0.2);
  setTimeout(() => burst(120, 0.8), 150);
  setTimeout(() => burst(90, 0.5), 300);
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};

const slideUp = {
  hidden: { y: 80, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden: { scale: 1.08, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
};

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const hasLaunched = useRef(false);

  useEffect(() => {
    if (hasLaunched.current) return;
    hasLaunched.current = true;
    const timer = setTimeout(launchCarnivalConfetti, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section" style={styles.section}>
      {/* Background animated gradient orbs */}
      <div style={styles.orbMagenta} aria-hidden="true" />
      <div style={styles.orbGold} aria-hidden="true" />
      <div style={styles.orbBlue} aria-hidden="true" />

      <motion.div
        className="hero-inner"
        style={styles.inner}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Image */}
        <motion.div style={styles.imageWrap} variants={scaleIn}>
          {tylerHero ? (
            <img src={tylerHero} alt="Tyler Eck illustration" style={styles.heroImg} />
          ) : (
            <PlaceholderIllustration />
          )}
        </motion.div>

        {/* Text stack */}
        <div style={styles.textBlock}>
          <motion.div variants={slideUp} style={styles.eyebrow}>
            <span style={styles.eyebrowDot} />
            Happy Birthday
            <span style={styles.eyebrowDot} />
          </motion.div>

          <motion.h1 style={styles.name} variants={slideUp}>
            TYLER<br />ECK
          </motion.h1>

          <motion.div style={styles.ruleLine} variants={lineReveal} />

          <motion.p style={styles.subtitle} variants={slideUp}>
            The Caribbean's Most<br />
            <em>Interesting Man.</em>
          </motion.p>

          <motion.div style={styles.tagRow} variants={slideUp}>
            {['Belize', 'Taiwan', 'Helsinki', 'Nice'].map((place, i) => (
              <span key={place} style={{ ...styles.tag, animationDelay: `${i * 0.1}s` }}>
                {place}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient bleed into next section */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(to bottom, transparent 0%, #FFF8F0 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Scroll cue */}
      <motion.div
        style={styles.scrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          style={styles.scrollArrow}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          ↓
        </motion.div>
        <span style={styles.scrollLabel}>Scroll to explore</span>
      </motion.div>
    </section>
  );
}

function PlaceholderIllustration() {
  return (
    <div style={styles.placeholder}>
      <div style={styles.placeholderInner}>
        <svg viewBox="0 0 200 280" style={{ width: '100%', height: '100%' }}>
          {/* Stylized silhouette */}
          <defs>
            <linearGradient id="figGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF006E" />
              <stop offset="50%" stopColor="#FFBE0B" />
              <stop offset="100%" stopColor="#3A86FF" />
            </linearGradient>
          </defs>
          {/* Head */}
          <ellipse cx="100" cy="55" rx="38" ry="42" fill="url(#figGrad)" opacity="0.9" />
          {/* Body */}
          <path d="M 55 110 Q 100 95 145 110 L 155 220 Q 100 235 45 220 Z" fill="url(#figGrad)" opacity="0.85" />
          {/* Arms */}
          <path d="M 55 120 Q 20 145 15 175" stroke="url(#figGrad)" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M 145 120 Q 180 145 185 175" stroke="url(#figGrad)" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.8" />
          {/* Legs */}
          <path d="M 75 218 Q 70 255 65 275" stroke="url(#figGrad)" strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M 125 218 Q 130 255 135 275" stroke="url(#figGrad)" strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.85" />
        </svg>
        <p style={styles.placeholderNote}>
          Drop <code>tyler-hero.png</code> in <code>src/assets/</code> to reveal the illustration
        </p>
      </div>
    </div>
  );
}

const styles = {
  section: {
    position: 'relative',
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    background: 'linear-gradient(160deg, #FFF8F0 0%, #FFF3E8 50%, #FFFAF5 100%)',
    padding: '0 1.5rem 5rem',
  },
  orbMagenta: {
    position: 'absolute',
    width: '60vmax',
    height: '60vmax',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(232,0,95,0.12) 0%, transparent 70%)',
    top: '-20vmax',
    left: '-10vmax',
    pointerEvents: 'none',
    animation: 'drift1 12s ease-in-out infinite alternate',
  },
  orbGold: {
    position: 'absolute',
    width: '50vmax',
    height: '50vmax',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,148,10,0.14) 0%, transparent 70%)',
    bottom: '-15vmax',
    right: '-10vmax',
    pointerEvents: 'none',
    animation: 'drift2 15s ease-in-out infinite alternate',
  },
  orbBlue: {
    position: 'absolute',
    width: '40vmax',
    height: '40vmax',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(29,111,232,0.1) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    animation: 'drift3 18s ease-in-out infinite alternate',
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    maxWidth: '900px',
    width: '100%',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
    },
  },
  imageWrap: {
    width: '100%',
    maxWidth: '340px',
    flexShrink: 0,
  },
  heroImg: {
    width: '100%',
    height: 'auto',
    display: 'block',
    // maskImage: 'radial-gradient(ellipse 68% 72% at 50% 35%, black 40%, transparent 88%)',
    // WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, black 0%, black 55%, transparent 95%)',
    maskImage: 'radial-gradient(ellipse 68% 72% at 50% 35%, black 40%, transparent 88%)',                                   
    WebkitMaskImage: 'radial-gradient(ellipse 58% 62% at 50% 45%, black 40%, transparent 88%)',
  
  },
  placeholder: {
    width: '100%',
    aspectRatio: '3/4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderInner: {
    textAlign: 'center',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    border: '2px dashed rgba(255,190,11,0.3)',
    borderRadius: '12px',
    padding: '1rem',
  },
  placeholderNote: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },
  textBlock: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  eyebrow: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  },
  eyebrowDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--magenta)',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(5rem, 20vw, 11rem)',
    lineHeight: 0.88,
    letterSpacing: '0.02em',
    background: 'linear-gradient(135deg, #E8005F 0%, #0A0A0F 45%, #D4940A 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  ruleLine: {
    width: '80px',
    height: '3px',
    background: 'linear-gradient(90deg, var(--magenta), var(--gold))',
    transformOrigin: 'left',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
    fontWeight: 300,
    lineHeight: 1.4,
    color: 'var(--text-light)',
    letterSpacing: '0.01em',
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
    marginTop: '0.4rem',
  },
  tag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '0.3rem 0.7rem',
    border: '1px solid rgba(10,10,15,0.15)',
    borderRadius: '2px',
    color: 'var(--text-muted)',
  },
  scrollCue: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    zIndex: 1,
  },
  scrollArrow: {
    fontSize: '1.4rem',
    color: 'var(--gold)',
  },
  scrollLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
};
