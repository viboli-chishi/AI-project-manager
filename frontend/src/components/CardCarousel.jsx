import { useState, useRef } from 'react';
import MemberCard from './MemberCard/MemberCard';
import styles from './CardCarousel.module.css';

export default function CardCarousel({ members = [] }) {
  const [activeIdx, setActiveIdx] = useState(Math.floor(members.length / 2));
  const trackRef  = useRef(null);
  const dragStart = useRef(null);

  // ── Keyboard navigation ──────────────────────────────
  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(members.length - 1, i + 1));

  // ── Drag / pointer scroll ────────────────────────────
  const onPointerDown = (e) => { dragStart.current = e.clientX; };
  const onPointerUp   = (e) => {
    if (dragStart.current === null) return;
    const delta = dragStart.current - e.clientX;
    if (delta > 40)       next();
    else if (delta < -40) prev();
    dragStart.current = null;
  };

  if (!members.length) {
    return <p className={styles.empty}>No team members yet. Initialise the project to get started.</p>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.sectionTitle}>Team Members</h2>
        <div className={styles.controls}>
          <button className={styles.arrowBtn} onClick={prev} disabled={activeIdx === 0}>‹</button>
          <span className={styles.counter}>{activeIdx + 1} / {members.length}</span>
          <button className={styles.arrowBtn} onClick={next} disabled={activeIdx === members.length - 1}>›</button>
        </div>
      </div>

      <div
        className={styles.track}
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={() => { dragStart.current = null; }}
      >
        <div
          className={styles.inner}
          style={{ '--offset': activeIdx }}
        >
          {members.map((member, i) => (
            <div
              key={member.id}
              className={styles.slide}
              onClick={() => setActiveIdx(i)}
              style={{ '--i': i, '--active': activeIdx }}
            >
              <MemberCard member={member} isActive={i === activeIdx} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className={styles.dots}>
        {members.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ''}`}
            onClick={() => setActiveIdx(i)}
          />
        ))}
      </div>
    </section>
  );
}
