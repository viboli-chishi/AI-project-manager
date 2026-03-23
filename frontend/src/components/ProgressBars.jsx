import styles from './ProgressBars.module.css';

const BARS = [
  { label: 'Plan Completion',  key: 'plan_completion', color: 'var(--accent-green)' },
  { label: 'Extra Goals',      key: 'extra_goals',     color: 'var(--accent-purple)' },
  { label: 'Projects Done',    key: 'projects_done',   color: 'var(--accent-yellow)', max: 20 },
  { label: 'KPI Progress',     key: 'kpi_progress',    color: 'var(--accent-blue)' },
];

export default function ProgressBars({ member }) {
  return (
    <div className={styles.bars}>
      {BARS.map(({ label, key, color, max = 100 }) => {
        const raw = member?.[key] ?? 0;
        const pct = Math.min(100, Math.round((raw / max) * 100));
        return (
          <div key={key} className={styles.bar}>
            <div className={styles.barHeader}>
              <span className={styles.barLabel}>{label}</span>
              <span className={styles.barValue}>{raw}{max === 100 ? '%' : ''}</span>
            </div>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ '--width': `${pct}%`, '--color': color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
