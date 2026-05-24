import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ─── GAME DATA ────────────────────────────────────────────────────────────────
// Feel free to tweak category titles, words, or difficulty order.
const CATEGORIES = [
  {
    id: 'countries',
    title: 'Places Tyler called home',
    emoji: '🌍',
    color: '#FFBE0B',
    darkColor: '#1a1400',
    items: ['JAMAICA', 'BELIZE', 'TAIWAN', 'FINLAND'],
    difficulty: 1,
  },
  {
    id: 'peppers',
    title: 'Hotter than a Caribbean summer',
    emoji: '🌶',
    color: '#06D6A0',
    darkColor: '#001a14',
    items: ['SCOTCH BONNET', 'HABANERO', 'BWAI', 'CAROLINA REAPER'],
    difficulty: 2,
  },
  {
    id: 'languages',
    title: 'Tyler speaks…',
    emoji: '言',
    color: '#3A86FF',
    darkColor: '#00091a',
    items: ['ENGLISH', 'MANDARIN', 'SPANISH', 'CREOLE'],
    difficulty: 3,
  },
  {
    id: 'achievements',
    title: "Tyler's claim to fame",
    emoji: '⭐',
    color: '#FF006E',
    darkColor: '#1a0010',
    items: ['MARATHON', 'GUITAR', 'KANEKSHANS', 'AMADEUS'],
    difficulty: 4,
  },
];

// ─── BIRTHDAY VIDEO ───────────────────────────────────────────────────────────
// Replace VIDEO_URL with the actual YouTube video URL or hosted video file URL.
// Example YouTube embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
// Example video file: '/birthday-video.mp4'
const VIDEO_URL = ''; // ← paste video URL here
const VIDEO_IS_YOUTUBE = VIDEO_URL.includes('youtube') || VIDEO_URL.includes('youtu.be');
// ─────────────────────────────────────────────────────────────────────────────

const MAX_GUESSES = 4;
const CARNIVAL_COLORS = ['#FF006E', '#FFBE0B', '#3A86FF', '#FB5607', '#06D6A0'];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildTiles() {
  return shuffleArray(
    CATEGORIES.flatMap((cat) =>
      cat.items.map((word) => ({ word, categoryId: cat.id }))
    )
  );
}

function launchWinConfetti() {
  const fire = (angle, x) =>
    confetti({
      particleCount: 80,
      angle,
      spread: 60,
      origin: { x, y: 0.7 },
      colors: CARNIVAL_COLORS,
      scalar: 1.4,
    });
  fire(65, 0.1);
  setTimeout(() => fire(115, 0.9), 100);
  setTimeout(() => fire(90, 0.5), 250);
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { x: 0.5, y: 0.5 },
      colors: CARNIVAL_COLORS,
      scalar: 1.2,
    });
  }, 450);
}

export default function KanekshansGame() {
  const [tiles, setTiles] = useState(buildTiles);
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState([]);
  const [guessesLeft, setGuessesLeft] = useState(MAX_GUESSES);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [shakeRow, setShakeRow] = useState(false);
  const [message, setMessage] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [oneAway, setOneAway] = useState(false);

  const toggleTile = useCallback(
    (word) => {
      if (gameState !== 'playing') return;
      setSelected((prev) => {
        if (prev.includes(word)) return prev.filter((w) => w !== word);
        if (prev.length >= 4) return prev;
        return [...prev, word];
      });
    },
    [gameState]
  );

  const submitGuess = useCallback(() => {
    if (selected.length !== 4) return;

    const categoryCounts = {};
    selected.forEach((word) => {
      const tile = tiles.find((t) => t.word === word);
      if (tile) {
        categoryCounts[tile.categoryId] = (categoryCounts[tile.categoryId] || 0) + 1;
      }
    });

    const maxCount = Math.max(...Object.values(categoryCounts));
    const matchedCategoryId = Object.entries(categoryCounts).find(([, v]) => v === 4)?.[0];

    if (matchedCategoryId) {
      const category = CATEGORIES.find((c) => c.id === matchedCategoryId);
      setSolved((prev) => [...prev, matchedCategoryId]);
      setTiles((prev) => prev.filter((t) => !selected.includes(t.word)));
      setSelected([]);
      setOneAway(false);

      const newSolvedCount = solved.length + 1;
      if (newSolvedCount === CATEGORIES.length) {
        setMessage('You got them all! 🎉');
        setGameState('won');
        setTimeout(launchWinConfetti, 300);
        setTimeout(() => setShowVideo(true), 1200);
      } else {
        setMessage(`✓ ${category.title}`);
        setTimeout(() => setMessage(null), 2500);
      }
    } else {
      const isOneAway = maxCount === 3;
      setOneAway(isOneAway);
      setGuessesLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setGameState('lost');
          setMessage("Tough one — but the video's still yours.");
          setTimeout(() => setShowVideo(true), 1000);
        } else {
          setMessage(isOneAway ? 'One away!' : 'Not quite…');
          setTimeout(() => {
            setMessage(null);
            setOneAway(false);
          }, 1800);
        }
        return next;
      });
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 600);
    }
  }, [selected, tiles, solved]);

  const resetGame = useCallback(() => {
    setTiles(buildTiles());
    setSelected([]);
    setSolved([]);
    setGuessesLeft(MAX_GUESSES);
    setGameState('playing');
    setShakeRow(false);
    setMessage(null);
    setShowVideo(false);
    setOneAway(false);
  }, []);

  const solvedCategories = CATEGORIES.filter((c) => solved.includes(c.id)).sort(
    (a, b) => a.difficulty - b.difficulty
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <a href="/" style={styles.backLink}>← Back to Tyler</a>
        <div style={styles.titleBlock}>
          <h1 style={styles.title}>KANEKSHANS</h1>
          <p style={styles.subtitle}>Group the words into four categories.</p>
        </div>
        <div style={styles.lives}>
          {Array.from({ length: MAX_GUESSES }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.life,
                background: i < guessesLeft ? 'var(--gold)' : 'rgba(255,248,240,0.1)',
                boxShadow: i < guessesLeft ? '0 0 8px rgba(255,190,11,0.5)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Game board */}
      <div style={styles.board}>
        {/* Solved categories */}
        <AnimatePresence>
          {solvedCategories.map((cat) => (
            <motion.div
              key={cat.id}
              style={{ ...styles.solvedRow, background: cat.color, borderColor: cat.color }}
              initial={{ opacity: 0, scaleY: 0.5 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={styles.solvedEmoji}>{cat.emoji}</span>
              <div style={styles.solvedText}>
                <span style={styles.solvedTitle}>{cat.title}</span>
                <span style={styles.solvedWords}>{cat.items.join(' · ')}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Active tiles */}
        <motion.div
          className="tile-grid"
          style={styles.tileGrid}
          animate={shakeRow ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {tiles.map((tile) => {
            const isSelected = selected.includes(tile.word);
            return (
              <motion.button
                key={tile.word}
                style={{
                  ...styles.tile,
                  background: isSelected
                    ? 'linear-gradient(135deg, #E8005F, #D4940A)'
                    : '#F0EAE0',
                  border: isSelected
                    ? '2px solid rgba(212,148,10,0.5)'
                    : '2px solid rgba(10,10,15,0.08)',
                  color: isSelected ? 'white' : 'var(--dark)',
                  boxShadow: isSelected
                    ? '0 4px 24px rgba(255,0,110,0.35)'
                    : 'none',
                }}
                onClick={() => toggleTile(tile.word)}
                whileTap={{ scale: 0.93 }}
                disabled={gameState !== 'playing'}
              >
                {tile.word}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <AnimatePresence>
          {message && (
            <motion.div
              style={{
                ...styles.message,
                color: oneAway ? '#D4940A' : message.startsWith('✓') ? '#059669' : 'var(--dark)',
                borderColor: oneAway ? '#D4940A' : 'rgba(10,10,15,0.15)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === 'playing' && (
          <div style={styles.buttonRow}>
            <button style={styles.secondaryBtn} onClick={() => setSelected([])}>
              Deselect all
            </button>
            <motion.button
              style={{
                ...styles.submitBtn,
                opacity: selected.length === 4 ? 1 : 0.35,
                cursor: selected.length === 4 ? 'pointer' : 'not-allowed',
              }}
              onClick={submitGuess}
              disabled={selected.length !== 4}
              whileHover={selected.length === 4 ? { scale: 1.04 } : {}}
              whileTap={selected.length === 4 ? { scale: 0.96 } : {}}
            >
              Submit
            </motion.button>
          </div>
        )}

        {gameState !== 'playing' && (
          <button style={styles.resetBtn} onClick={resetGame}>
            Play again
          </button>
        )}
      </div>

      {/* Win / Lose overlay */}
      <AnimatePresence>
        {showVideo && (
          <VideoReveal
            won={gameState === 'won'}
            onClose={() => setShowVideo(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoReveal({ won, onClose }) {
  return (
    <motion.div
      style={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
    >
      <motion.div
        style={styles.overlayCard}
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        <div style={styles.revealHeader}>
          {won ? (
            <>
              <span style={styles.revealEmoji}>🎉</span>
              <h2 style={styles.revealTitle}>You know Tyler.</h2>
              <p style={styles.revealSub}>Happy Birthday, brother. This one's for you.</p>
            </>
          ) : (
            <>
              <span style={styles.revealEmoji}>💛</span>
              <h2 style={styles.revealTitle}>Tyler's still Tyler.</h2>
              <p style={styles.revealSub}>Hard to put him in a box. Here's what really matters —</p>
            </>
          )}
        </div>

        <div style={styles.videoWrap}>
          {VIDEO_URL ? (
            VIDEO_IS_YOUTUBE ? (
              <iframe
                src={VIDEO_URL + '?autoplay=0&rel=0'}
                title="Birthday video for Tyler"
                style={styles.videoFrame}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={VIDEO_URL}
                controls
                playsInline
                style={styles.videoElement}
              />
            )
          ) : (
            <div style={styles.videoPlaceholder}>
              <span style={styles.playIcon}>▶</span>
              <p style={styles.videoPlaceholderText}>
                Birthday video goes here.<br />
                Set <code>VIDEO_URL</code> in <code>KanekshansGame.jsx</code>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  container: {
    minHeight: '100svh',
    background: 'linear-gradient(160deg, #FFF8F0 0%, #FFF3E8 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 1rem 4rem',
    gap: '2rem',
  },
  header: {
    width: '100%',
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  backLink: {
    alignSelf: 'flex-start',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  titleBlock: {
    textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2.8rem, 10vw, 5rem)',
    letterSpacing: '0.06em',
    background: 'linear-gradient(135deg, #FF006E, #FFBE0B)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1,
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    fontWeight: 300,
    color: 'var(--text-muted)',
    marginTop: '0.4rem',
    letterSpacing: '0.02em',
  },
  lives: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  life: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'all 0.4s ease',
  },
  board: {
    width: '100%',
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  solvedRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.2rem',
    borderRadius: '4px',
    border: '2px solid',
  },
  solvedEmoji: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  solvedText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  solvedTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#080810',
  },
  solvedWords: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    color: 'rgba(8,8,16,0.65)',
  },
  tileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.4rem',
  },
  tile: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(0.55rem, 2.5vw, 0.78rem)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: 'clamp(0.7rem, 2vw, 1rem) 0.3rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
    lineHeight: 1.3,
    minHeight: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  controls: {
    width: '100%',
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    minHeight: '80px',
  },
  message: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0.6rem 1.2rem',
    border: '1px solid',
    borderRadius: '2px',
  },
  buttonRow: {
    display: 'flex',
    gap: '0.8rem',
  },
  secondaryBtn: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '0.8rem 1.4rem',
    background: 'transparent',
    border: '1px solid rgba(10,10,15,0.15)',
    borderRadius: '2px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  },
  submitBtn: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    letterSpacing: '0.08em',
    padding: '0.8rem 2.5rem',
    background: 'linear-gradient(135deg, #FF006E, #FFBE0B)',
    border: 'none',
    borderRadius: '2px',
    color: 'white',
    boxShadow: '0 4px 20px rgba(255,0,110,0.3)',
    transition: 'opacity 0.2s, box-shadow 0.2s',
  },
  resetBtn: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '0.8rem 2rem',
    background: 'transparent',
    border: '1px solid rgba(10,10,15,0.2)',
    borderRadius: '2px',
    color: 'var(--dark)',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(240,234,224,0.85)',
    backdropFilter: 'blur(8px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  overlayCard: {
    position: 'relative',
    background: '#FFFFFF',
    border: '1px solid rgba(10,10,15,0.08)',
    borderRadius: '12px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    boxShadow: '0 40px 100px rgba(10,10,15,0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '0.3rem',
    lineHeight: 1,
  },
  revealHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.6rem',
  },
  revealEmoji: {
    fontSize: '3rem',
  },
  revealTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    background: 'linear-gradient(135deg, #D4940A, #E8005F)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1,
  },
  revealSub: {
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    fontWeight: 300,
    fontStyle: 'italic',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
  videoWrap: {
    position: 'relative',
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    aspectRatio: '16/9',
    background: '#F0EAE0',
  },
  videoFrame: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  videoElement: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    border: '2px dashed rgba(255,190,11,0.2)',
    borderRadius: '8px',
  },
  playIcon: {
    fontSize: '3rem',
    color: 'rgba(255,190,11,0.4)',
  },
  videoPlaceholderText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: 1.7,
  },
};
