import { useState, useCallback } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { motion, AnimatePresence } from 'framer-motion';

// ─── SKILL PHOTOS ─────────────────────────────────────────────────────────────
// All imports must use RELATIVE paths (starting with ../ not src/).
// Drop any image into src/assets/tyler/ then import it here like:
//   import myPhoto from '../assets/tyler/myPhoto.png';
// Then set photo: myPhoto on the matching skill below.
//
// Currently wired up from src/assets/tyler/:
import sharkie   from '../assets/tyler/sharkie.png';
import beach     from '../assets/tyler/beach.png';
import gym       from '../assets/tyler/gym.png';
import chinese   from '../assets/tyler/chinese.png';
import chef from '../assets/tyler/chef.png'
import guitar from '../assets/tyler/guitar.png'
import cloud from '../assets/tyler/cloud.png'
import family from '../assets/tyler/family.png'
// import cat   from '../assets/tyler/cat.png';   // ← available, uncomment to use
// ─────────────────────────────────────────────────────────────────────────────

const SKILLS = [
  {
    id: 'athlete',
    label: 'Athlete',
    photo: gym,       // beach.png — swap for a running/race photo
    emoji: '🏃',
    headline: 'Ran to the end of the world.',
    caption:
      'And back. Tyler doesn\'t just sign up for marathons — he signs up for the one nicknamed "End of the World." That\'s not stubbornness, that\'s just Tyler being Tyler: finding the hardest version of something and doing it with a smile.',
    accent: '#E84A00',
  },
  {
    id: 'linguist',
    label: 'Linguist',
    photo: chinese,     // chinese.png — swap for a Taiwan/Mandarin photo
    emoji: '言',
    headline: 'Went to Taiwan. Learned in Mandarin.',
    caption:
      'Most people move abroad and take English-taught programs. Tyler moved to Taiwan and got his entire Bachelor\'s degree in Mandarin Chinese. That\'s not studying a language — that\'s living inside one.',
    accent: '#D4940A',
  },
  {
    id: 'musician',
    label: 'Musician',
    photo: guitar,        // drop a guitar photo in src/assets/tyler/ and import it
    emoji: '🎸',
    headline: 'Six strings, one vibe.',
    caption:
      'Whether it\'s a late-night jam session or something he picked up quietly between marathons and certifications, Tyler plays guitar the way he does everything else — with heart and without much fuss about it.',
    accent: '#059669',
  },
  {
    id: 'cloud',
    label: 'Cloud Architect',
    photo: cloud,        // drop a cloud/tech photo in src/assets/tyler/ and import it
    emoji: '☁',
    headline: 'AWS. Azure. He speaks cloud.',
    caption:
      'Certified across multiple cloud platforms, Tyler has been building in the sky before it was fashionable. He also interned at Amadeus, one of the most critical tech infrastructures in global travel.',
    accent: '#1D6FE8',
  },
  {
    id: 'chef',
    label: 'Chef',
    photo: chef,        // drop a food/cooking photo in src/assets/tyler/ and import it
    emoji: '🌶',
    headline: 'Scotch bonnet or nothing.',
    caption:
      'Tyler\'s kitchen is not for the faint of tongue. Raised on Caribbean heat, he considers scotch bonnet pepper a baseline. Food, to Tyler, is culture — Jamaica in a bowl, Belize on a plate.',
    accent: '#E8005F',
  },
  {
    id: 'Marine Biologist',
    label: 'Marine Biologist',
    photo: sharkie,     // sharkie.png
    emoji: '🦈',
    headline: 'Tamed a whole shark. Twice.',
    caption:
      'Tyler built his own Connections-style game — Kanekshans — from scratch. Because when you love wordplay and your friends love you, you build the thing and share it. Simple as that.',
    accent: '#7C3AED',
  },
  {
    id: 'familyman',
    label: 'Family Man',
    photo: family,         // gym.png — swap for a family photo
    emoji: '❤',
    headline: 'Family first. Full stop.',
    caption:
      'Everything Tyler does, he does with his people in mind. The travel, the degrees, the hustle — it all traces back to the people he loves. In a world that glorifies independence, Tyler chooses roots.',
    accent: '#D4940A',
  },

];

export default function SkillsScroll() {
  const [currentSkillId, setCurrentSkillId] = useState(SKILLS[0].id);

  const currentSkill = SKILLS.find((s) => s.id === currentSkillId) || SKILLS[0];

  const onStepEnter = useCallback(({ data }) => {
    setCurrentSkillId(data);
  }, []);

  return (
    <section style={styles.section}>
      <div style={styles.sectionLabel}>
        <span style={styles.labelText}>Skills &amp; Chapters</span>
      </div>

      <div className="skills-layout" style={styles.layout}>
        {/* Sticky visual panel */}
        <div className="skills-sticky-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSkill.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={styles.card}
            >
              <div
                style={{
                  ...styles.cardGlow,
                  background: currentSkill.photo
                    ? 'none'
                    : `radial-gradient(circle at 50% 50%, ${currentSkill.accent}25, transparent 70%)`,
                }}
              />

              {/* Photo or emoji */}
              {currentSkill.photo ? (
                <div style={styles.photoWrap}>
                  <img
                    src={currentSkill.photo}
                    alt={currentSkill.label}
                    style={styles.photo}
                  />
                  <div style={{ ...styles.photoOverlay, background: `linear-gradient(to top, ${currentSkill.accent}CC 0%, transparent 60%)` }} />
                </div>
              ) : (
                <div style={styles.emojiWrap}>
                  <span
                    style={{
                      ...styles.emoji,
                      color: currentSkill.accent,
                    }}
                  >
                    {currentSkill.emoji}
                  </span>
                </div>
              )}

              <h3 style={{ ...styles.cardTitle, color: currentSkill.accent }}>
                {currentSkill.label}
              </h3>
              <p style={styles.cardHeadline}>"{currentSkill.headline}"</p>

              {/* Progress dots */}
              <div style={styles.dots}>
                {SKILLS.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      ...styles.dot,
                      background: s.id === currentSkill.id ? currentSkill.accent : 'rgba(10,10,15,0.15)',
                      transform: s.id === currentSkill.id ? 'scale(1.4)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scrollable steps */}
        <div className="skills-steps-panel" style={styles.stepsPanel}>
          <Scrollama onStepEnter={onStepEnter} offset={0.5}>
            {SKILLS.map((skill, idx) => (
              <Step key={skill.id} data={skill.id}>
                <div style={styles.step}>
                  {/* Mobile-only thumbnail */}
                  <div className="skills-mobile-card" style={styles.mobileCard}>
                    {skill.photo ? (
                      <div style={styles.mobileThumb}>
                        <img src={skill.photo} alt={skill.label} style={styles.mobileThumbImg} />
                        <div style={{ ...styles.mobileThumbOverlay, background: `linear-gradient(to top, ${skill.accent}DD 0%, transparent 55%)` }} />
                        <span style={styles.mobileThumbLabel}>{skill.label}</span>
                      </div>
                    ) : (
                      <div style={{ ...styles.mobileThumb, background: `${skill.accent}18`, border: `1px solid ${skill.accent}30` }}>
                        <span style={{ ...styles.mobileEmoji, color: skill.accent }}>{skill.emoji}</span>
                        <span style={styles.mobileThumbLabel}>{skill.label}</span>
                      </div>
                    )}
                  </div>

                  <div style={styles.stepContent}>
                    <p style={styles.stepCaption}>{skill.caption}</p>
                  </div>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    position: 'relative',
    background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF3E8 100%)',
    paddingTop: '2rem',
    paddingBottom: '4rem',
  },
  sectionLabel: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    padding: '0 1.5rem',
  },
  labelText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    borderBottom: '1px solid rgba(10,10,15,0.12)',
    paddingBottom: '0.5rem',
  },
  layout: {
    display: 'flex',
    position: 'relative',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1.5rem',
    gap: '3rem',
  },
  stickyPanel: {
    position: 'sticky',
    top: '0',
    height: '100vh',
    width: '420px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.92)',
    border: '1px solid rgba(10,10,15,0.08)',
    boxShadow: '0 8px 40px rgba(10,10,15,0.08)',
    borderRadius: '20px',
    padding: '3rem 2.5rem',
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
  },
  cardGlow: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: '20px',
  },
  photoWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4/3',
    borderRadius: '12px',
    overflow: 'hidden',
    zIndex: 1,
    marginBottom: '0.5rem',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  photoOverlay: {
    position: 'absolute',
    inset: 0,
  },
  emojiWrap: {
    position: 'relative',
    zIndex: 1,
    padding: '0.5rem 0',
  },
  emoji: {
    fontSize: '4.5rem',
    lineHeight: 1,
    display: 'block',
    fontFamily: 'var(--font-heading)',
    fontWeight: 800,
  },
  cardTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    position: 'relative',
    zIndex: 1,
  },
  cardHeadline: {
    fontFamily: 'var(--font-body)',
    fontSize: '1.1rem',
    fontStyle: 'italic',
    fontWeight: 300,
    color: 'var(--text-light)',
    textAlign: 'center',
    lineHeight: 1.5,
    position: 'relative',
    zIndex: 1,
  },
  dots: {
    display: 'flex',
    gap: '0.4rem',
    marginTop: '0.8rem',
    position: 'relative',
    zIndex: 1,
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  stepsPanel: {
    flex: 1,
    minWidth: 0,
  },
  step: {
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '2rem 0',
  },
  mobileCard: {
    marginBottom: '1.5rem',
  },
  mobileEmoji: {
    fontSize: '3.5rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 800,
    position: 'relative',
    zIndex: 1,
  },
  mobileThumb: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: '14px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileThumbImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  mobileThumbOverlay: {
    position: 'absolute',
    inset: 0,
  },
  mobileThumbLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    fontFamily: 'var(--font-heading)',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#fff',
    padding: '0.7rem 1rem',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  stepCaption: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
    fontWeight: 300,
    lineHeight: 1.7,
    color: 'var(--text-light)',
    maxWidth: '520px',
  },
};
