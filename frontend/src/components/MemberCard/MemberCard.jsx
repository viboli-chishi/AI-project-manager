import ProgressBars from '../ProgressBars';
import styles from './MemberCard.module.css';

// Generate colour from name string for avatar fallback
function avatarColor(name = '') {
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

const ROLE_TAGS = {
  'Full Stack Dev': ['Design', 'Full Time'],
  'UI Designer':   ['Design', 'Part Time'],
  'Backend Dev':   ['Dev', 'Full Time'],
  'ML Engineer':   ['AI', 'Full Time'],
};

export default function MemberCard({ member, isActive }) {
  const tags = ROLE_TAGS[member.role] ?? ['Dev', 'Full Time'];
  const bg   = avatarColor(member.name);

  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
      {/* Notched corner shape handled by clip-path in CSS */}
      <div className={styles.inner}>
        {/* Avatar */}
        <div className={styles.avatarWrap}>
          <div className={styles.avatar} style={{ background: `linear-gradient(135deg, ${bg}, ${bg}99)` }}>
            {member.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className={styles.onlineDot} />
        </div>

        {/* Name + Role + Tags */}
        <div className={styles.nameBlock}>
          <h3 className={styles.name}>{member.name}</h3>
          <p className={styles.role}>{member.role}</p>
          <div className={styles.tags}>
            {tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        </div>

        {/* Quick stats row */}
        <div className={styles.statRow}>
          {[
            { label: 'Activity',   value: `${member.monthly_activity}%` },
            { label: 'In Progress', value: member.in_progress },
            { label: 'Overtime',    value: `${member.overtime}h` },
          ].map(({ label, value }) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <ProgressBars member={member} />
      </div>
    </div>
  );
}
