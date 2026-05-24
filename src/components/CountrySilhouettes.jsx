import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ─── Geographic coordinates [lon, lat] — derived from Natural Earth data ──────
const COORDS = {
  belize: [
    // N border with Mexico (Rio Hondo), clockwise
    [-89.1, 18.5], [-88.6, 18.5], [-88.1, 18.5], [-87.8, 18.4],
    // Caribbean coast south
    [-87.5, 18.0], [-87.5, 17.6], [-87.6, 17.2], [-87.7, 16.9],
    [-87.8, 16.7], [-87.9, 16.4], [-88.0, 16.1], [-88.1, 15.9],
    // S & W border with Guatemala
    [-88.5, 15.9], [-89.0, 15.9], [-89.2, 16.0], [-89.2, 16.5],
    [-89.2, 17.2], [-89.2, 17.8], [-89.1, 18.1], [-89.1, 18.5],
  ],
  taiwan: [
    // N tip (Keelung), clockwise round the island
    [121.3, 25.3], [121.7, 25.1], [122.0, 24.9], [122.0, 24.5],
    [121.9, 24.2], [121.8, 24.0], [121.7, 23.7], [121.6, 23.3],
    [121.5, 23.0], [121.3, 22.7], [121.0, 22.4], [120.7, 22.1],
    [120.5, 22.0], // Kenting (south tip)
    [120.2, 22.4], [120.1, 22.8], [120.0, 23.2], [120.0, 23.7],
    [120.1, 24.1], [120.3, 24.5], [120.7, 24.9], [121.1, 25.1],
    [121.3, 25.3],
  ],
  finland: [
    // NW corner (Norway border), clockwise
    [21.0, 69.9], [22.0, 70.1], [24.0, 70.1], [25.5, 70.0],
    [27.0, 69.9], [28.0, 69.5], [28.5, 69.2], [29.5, 69.0],
    // NE Russia border going south
    [30.5, 68.5], [30.0, 68.0], [29.5, 67.5], [29.8, 67.0],
    [30.1, 66.5], [29.5, 65.8], [29.0, 65.5], [28.5, 65.0],
    [28.0, 64.7], [26.5, 64.9], [25.5, 65.0], [24.5, 64.7],
    [23.5, 63.9], [22.5, 63.2], [21.5, 62.5], [21.0, 61.5],
    // S coast (Gulf of Finland)
    [21.4, 60.8], [21.5, 60.5], [22.3, 60.1], [23.5, 60.0],
    [24.5, 60.1], [25.2, 60.2], [26.0, 60.2], [27.0, 60.2],
    [28.0, 60.4], [28.5, 60.4],
    // E Russia border going north
    [29.0, 61.0], [30.0, 61.5], [31.5, 62.5], [30.5, 63.5],
    [29.5, 63.8], [30.0, 64.5], [30.0, 65.5], [29.5, 66.2],
    [29.5, 67.5], [28.5, 69.2], [27.0, 69.9], [21.0, 69.9],
  ],
  france: [
    // Brittany west tip, then clockwise
    [-4.8, 48.1], [-4.5, 48.4], [-4.0, 48.6],
    // N Brittany coast east
    [-3.0, 48.6], [-2.0, 48.7], [-1.8, 48.7],
    // Cherbourg/Normandy
    [-1.5, 49.7], [-1.0, 49.5],
    [0.1, 49.7], [0.5, 49.8],
    // Seine estuary / Channel coast
    [1.0, 50.0], [1.5, 50.1], [1.8, 50.9], [2.0, 51.0],
    // Belgium border
    [2.5, 51.0], [3.0, 50.8], [3.5, 50.5], [4.2, 50.3],
    // Luxembourg / German border
    [5.8, 49.5], [6.2, 49.5], [6.4, 49.2], [7.0, 49.0],
    [7.5, 49.0],
    // Upper Rhine / Swiss border
    [8.2, 47.9], [7.7, 47.5], [7.6, 47.5],
    // Alps (Italy/Switzerland)
    [7.0, 46.4], [6.8, 46.0], [7.0, 45.0], [7.1, 44.3],
    // Mediterranean coast
    [7.5, 43.8], [6.5, 43.3], [5.1, 43.3], [4.6, 43.4],
    [3.8, 43.5], [3.3, 43.3], [3.0, 42.5],
    // Pyrenees / Spain border
    [1.5, 42.5], [0.3, 42.7], [-0.5, 43.0], [-1.8, 43.4],
    // Atlantic coast north
    [-1.5, 44.0], [-1.2, 44.7], [-1.1, 45.5],
    [-1.2, 46.2], [-1.5, 46.4], [-2.2, 47.3],
    // Loire / S Brittany
    [-2.5, 47.4], [-2.8, 47.6], [-3.5, 47.7],
    [-4.3, 47.9], [-4.8, 48.1],
  ],
};

function projectToPath(rawCoords, w = 200, h = 200, pad = 14) {
  const lons = rawCoords.map(c => c[0]);
  const lats = rawCoords.map(c => c[1]);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const lonRange = maxLon - minLon || 1;
  const latRange = maxLat - minLat || 1;
  const scale = Math.min((w - pad * 2) / lonRange, (h - pad * 2) / latRange);
  const xOff = pad + ((w - pad * 2) - lonRange * scale) / 2;
  const yOff = pad + ((h - pad * 2) - latRange * scale) / 2;
  return rawCoords
    .map(([lon, lat], i) => {
      const x = (xOff + (lon - minLon) * scale).toFixed(1);
      const y = (yOff + (maxLat - lat) * scale).toFixed(1);
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ') + ' Z';
}

const COUNTRIES = [
  {
    id: 'belize',
    name: 'Belize',
    color: '#059669',
    abstract: 'Raised here. Still carries it everywhere.',
    caption:
      'Belize gave Tyler his Caribbean soul — jungles, coast, community, heat. Born in Jamaica and raised in Belize, the warmth and the spirit of the region are woven into everything about him. This is where the story begins.',
    coords: COORDS.belize,
  },
  {
    id: 'taiwan',
    name: 'Taiwan',
    color: '#E8005F',
    abstract: 'A whole degree. In Mandarin Chinese.',
    caption:
      'Tyler moved to Taiwan and completed his entire Bachelor\'s degree in Mandarin Chinese. Not studied in Mandarin — earned in it, lived in it. An island of 23 million people and he learned to belong there.',
    coords: COORDS.taiwan,
  },
  {
    id: 'finland',
    name: 'Finland',
    color: '#0891B2',
    abstract: 'Arctic cold, warm friendship, half a Master\'s.',
    caption:
      'Helsinki, Finland — the first half of Tyler\'s split Master\'s. From Caribbean sun to Nordic frost, Tyler arrived, adapted, and thrived. That\'s the only mode he knows.',
    coords: COORDS.finland,
  },
  {
    id: 'france',
    name: 'France',
    color: '#1D6FE8',
    abstract: 'Mediterranean sun finished the Master\'s.',
    caption:
      'Nice, France — the final chapter of postgraduate life, on the French Riviera. From Helsinki cold to Côte d\'Azur warmth: Tyler finished his Master\'s where the sea meets the mountain, because why not.',
    coords: COORDS.france,
  },
];

export default function CountrySilhouettes() {
  const [expandedId, setExpandedId] = useState(null);
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
        <span style={styles.sectionLabel}>The World Map of Tyler</span>
        <h2 style={styles.heading}>Four Countries.<br />One Story.</h2>
      </motion.div>

      <div className="country-grid" style={styles.grid}>
        {COUNTRIES.map((country, i) => (
          <CountryCard
            key={country.id}
            country={country}
            index={i}
            isExpanded={expandedId === country.id}
            onToggle={() =>
              setExpandedId(expandedId === country.id ? null : country.id)
            }
          />
        ))}
      </div>
    </section>
  );
}

function CountryCard({ country, index, isExpanded, onToggle }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const path = projectToPath(country.coords);

  return (
    <motion.div
      ref={ref}
      style={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* SVG Silhouette */}
      <motion.div
        style={styles.svgWrap}
        animate={isInView ? { opacity: [0, 1], scale: [0.88, 1] } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          viewBox="0 0 200 200"
          style={{
            ...styles.svg,
            filter: `drop-shadow(0 4px 16px ${country.color}40)`,
          }}
          aria-label={`Silhouette of ${country.name}`}
        >
          <path d={path} fill={country.color} opacity="0.9" />
          <path d={path} fill="none" stroke={country.color} strokeWidth="1.5" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Info */}
      <div style={styles.info}>
        <h3 style={{ ...styles.countryName, color: country.color }}>{country.name}</h3>
        <p style={styles.abstract}>{country.abstract}</p>

        <button
          style={{ ...styles.expandBtn, color: country.color, borderColor: `${country.color}40` }}
          onClick={onToggle}
        >
          {isExpanded ? 'Close ↑' : 'The story →'}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.p
              style={styles.caption}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '0.8rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {country.caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const styles = {
  section: {
    background: '#F5EFE6',
    padding: '8rem 1.5rem',
    borderTop: '1px solid rgba(10,10,15,0.08)',
    borderBottom: '1px solid rgba(10,10,15,0.08)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  sectionLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    lineHeight: 0.95,
    letterSpacing: '0.02em',
    background: 'linear-gradient(135deg, #0A0A0F, #2D1A00 50%, #D4940A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '2px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  card: {
    background: 'rgba(255,255,255,0.7)',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.2rem',
    border: '1px solid rgba(10,10,15,0.06)',
    backdropFilter: 'blur(8px)',
  },
  svgWrap: {
    width: '100%',
    height: '130px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  svg: {
    height: '100%',
    width: 'auto',
    maxWidth: '130px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
  },
  countryName: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.2rem',
    letterSpacing: '0.04em',
    lineHeight: 1,
  },
  abstract: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
  expandBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    background: 'none',
    border: '1px solid',
    borderRadius: '2px',
    padding: '0.35rem 0.8rem',
    cursor: 'pointer',
    marginTop: '0.3rem',
    transition: 'opacity 0.2s',
    alignSelf: 'flex-start',
  },
  caption: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.92rem',
    fontWeight: 300,
    lineHeight: 1.7,
    color: 'var(--text-light)',
    overflow: 'hidden',
  },
};
