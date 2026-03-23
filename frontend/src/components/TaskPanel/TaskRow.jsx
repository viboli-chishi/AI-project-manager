import styles from './TaskRow.module.css';

export default function TaskRow({ task, onUpdate }) {
  const isPriHigh = task.priority === 'high';

  const handleProgressClick = () => {
    if (!onUpdate) return;
    const next = Math.min(100, (task.progress || 0) + 10);
    onUpdate({ ...task, progress: next });
  };

  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <span className={`${styles.priority} ${isPriHigh ? styles.high : styles.low}`}>
          {isPriHigh ? '↑ High' : '↓ Low'}
        </span>
        <p className={styles.title}>{task.title}</p>
      </div>

      <div className={styles.center}>
        <div className={styles.progressWrap} onClick={handleProgressClick} title="Click to add 10%">
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ '--w': `${task.progress ?? 0}%`, '--color': isPriHigh ? 'var(--accent-pink)' : 'var(--accent-green)' }}
            />
          </div>
          <span className={styles.progressLabel}>{task.progress ?? 0}%</span>
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.meta}>{task.total_time ?? '0h'}</span>
        <span className={styles.meta}>{task.deadline}</span>
        <span className={`${styles.status} ${styles[task.status]}`}>
          {task.status?.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
