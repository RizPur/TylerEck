import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── FRIEND PHOTOS ────────────────────────────────────────────────────────────
// Drop square or portrait-cropped photos into src/assets/people/ and import
// them here, then set the `photo` field on each quote entry.
//
// import friend1Photo from '../assets/people/friend1.jpg';
// import friend2Photo from '../assets/people/friend2.jpg';
import chapati from '../assets/people/chapati.png'
// etc.
// ─────────────────────────────────────────────────────────────────────────────

// ─── QUOTES ───────────────────────────────────────────────────────────────────
// Replace placeholder text and names with real quotes from Tyler's people.
// ─────────────────────────────────────────────────────────────────────────────
const QUOTES = [
  {
    quote:
      'Tyler walks into a room and the temperature changes. Not the kind that burns you — the kind that makes everything feel possible.',
    name: 'Friend 1',
    photo: null, // ← friend1Photo
    accent: '#E8005F',
  },
  {
    quote:
      "He's my favorite customer.",
    name: 'Juan les Pins Chapati Guy',
    photo: chapati,
    accent: '#D4940A',
  },
  {
    quote:
      "He moved to Taiwan, learned Mandarin, got a degree, then came back and built a game. All while being the most fun person at every party.",
    name: 'Friend 3',
    photo: null,
    accent: '#059669',
  },
  {
    quote:
      "Family is everything to him. You can see it in the way he talks, the way he works, the way he celebrates.",
    name: 'Friend 4',
    photo: null,
    accent: '#1D6FE8',
  },
  {
    quote:
      "Most people who can do half of what Tyler does would never let you forget it. Tyler somehow makes you feel like you're the impressive one.",
    name: 'Friend 5',
    photo: null,
    accent: '#E84A00',
  },
  {
    quote:
      "There is genuinely no bad day when Tyler is around. He is the antidote to everything that goes wrong.",
    name: 'Friend 6',
    photo: null,
    accent: '#7C3AED',
  },
];

// Distinct gradient fallbacks per card (used when no photo is provided)
const FALLBACK_GRADIENTS = [
  'linear-gradient(145deg, #1a0010 0%, #E8005F 100%)',
  'linear-gradient(145deg, #1a0e00 0%, #D4940A 100%)',
  'linear-gradient(145deg, #001a0e 0%, #059669 100%)',
  'linear-gradient(145deg, #000d1a 0%, #1D6FE8 100%)',
  'linear-gradient(145deg, #1a0500 0%, #E84A00 100%)',
  'linear-gradient(145deg, #0d001a 0%, #7C3AED 100%)',
];

export default function FriendQuotes() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section style={styles.section}>
      <motion.div
        ref={headerRef}
        style={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span style={styles.sectionLabel}>What his people say</span>
        <h2 style={styles.heading}>
          Straight from<br />
          <em>the crew.</em>
        </h2>
      </motion.div>

      <div className="quotes-grid" style={styles.grid}>
        {QUOTES.map((q, i) => (
          <QuoteCard key={i} quote={q} index={i} fallbackGradient={FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]} />
        ))}
      </div>
    </section>
  );
}

function QuoteCard({ quote, index, fallbackGradient }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      style={styles.card}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      {/* Background: photo or gradient fallback */}
      {quote.photo ? (
        <img
          src={quote.photo}
          alt={quote.name}
          style={styles.bgImage}
          loading="lazy"
        />
      ) : (
        <div style={{ ...styles.bgFallback, background: fallbackGradient }} />
      )}

      {/* Grain texture on top of image/gradient */}
      <div style={styles.grain} />

      {/* Dark gradient overlay — stronger at bottom */}
      <div style={styles.overlay} />

      {/* Accent top border */}
      <div style={{ ...styles.topBar, background: quote.accent }} />

      {/* Content */}
      <div style={styles.content}>
        <span style={{ ...styles.quoteGlyph, color: quote.accent }}>"</span>
        <p style={styles.quoteText}>{quote.quote}</p>
        <div style={styles.attribution}>
          <div style={{ ...styles.dash, background: quote.accent }} />
          <span style={styles.name}>{quote.name}</span>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  section: {
    background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF3E8 100%)',
    padding: '8rem 1.5rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  sectionLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  heading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(2.2rem, 7vw, 4rem)',
    fontWeight: 700,
    lineHeight: 1.1,
    color: 'var(--dark)',
    letterSpacing: '-0.01em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  card: {
    position: 'relative',
    aspectRatio: '3/4',
    borderRadius: '6px',
    overflow: 'hidden',
    cursor: 'default',
  },
  bgImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  bgFallback: {
    position: 'absolute',
    inset: 0,
  },
  grain: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
    pointerEvents: 'none',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.88) 100%)',
    zIndex: 2,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    zIndex: 3,
    opacity: 0.85,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '2rem 1.8rem 2rem',
    zIndex: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  quoteGlyph: {
    fontFamily: 'var(--font-body)',
    fontSize: '3rem',
    lineHeight: 0.6,
    fontWeight: 700,
    display: 'block',
    opacity: 0.7,
    userSelect: 'none',
  },
  quoteText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    fontWeight: 300,
    fontStyle: 'italic',
    lineHeight: 1.65,
    color: 'rgba(255,255,255,0.92)',
  },
  attribution: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginTop: '0.2rem',
  },
  dash: {
    width: '18px',
    height: '2px',
    flexShrink: 0,
  },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.65)',
  },
};
