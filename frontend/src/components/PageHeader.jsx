import styles from './PageHeader.module.css';

const AVATARS = ['AC', 'SP', 'JM', 'NW', 'RK'];

export default function PageHeader({ memberCount = 0, taskCount = 0 }) {
  return (
    <header className={styles.header}>
      <div className={styles.greeting}>
        <h1 className={styles.title}>
          Hi, Team! <span className={styles.wave}>👋</span>
        </h1>
        <p className={styles.subtitle}>
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className={styles.meta}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{memberCount}</span>
          <span className={styles.statLabel}>Members</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{taskCount}</span>
          <span className={styles.statLabel}>Active Tasks</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.avatarStack}>
          {AVATARS.map((initials, i) => (
            <div
              key={initials}
              className={styles.avatar}
              style={{ '--delay': i }}
              title={`Team member ${i + 1}`}
            >
              {initials}
            </div>
          ))}
          <div className={`${styles.avatar} ${styles.overflow}`}>+6</div>
        </div>
      </div>
    </header>
  );
}
