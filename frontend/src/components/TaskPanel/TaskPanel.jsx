import { useState } from 'react';
import TaskRow from './TaskRow';
import styles from './TaskPanel.module.css';

export default function TaskPanel({ tasks = [], onUpdateTask }) {
  const [showAll, setShowAll] = useState(false);

  const visibleTasks = showAll ? tasks : tasks.slice(0, 5);
  const highCount = tasks.filter((t) => t.priority === 'high').length;

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionLabel}>Quick Management</p>
          <h2 className={styles.panelTitle}>Active Tasks</h2>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.badge}>
            <span className={styles.badgeNum}>{highCount}</span>
            <span className={styles.badgeLabel}>High Priority</span>
          </div>
          <div className={`${styles.badge} ${styles.badgeMuted}`}>
            <span className={styles.badgeNum}>{tasks.length - highCount}</span>
            <span className={styles.badgeLabel}>Low Priority</span>
          </div>
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span className={styles.th} style={{ flex: 1 }}>Task</span>
        <span className={styles.th} style={{ width: 140 }}>Progress</span>
        <span className={styles.th}>Time</span>
        <span className={styles.th}>Due</span>
        <span className={styles.th}>Status</span>
      </div>

      <div className={styles.taskList}>
        {visibleTasks.length === 0 && (
          <p className={styles.empty}>No active tasks. Create a task to get started.</p>
        )}
        {visibleTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
          />
        ))}
      </div>

      {tasks.length > 5 && (
        <button className={styles.showMore} onClick={() => setShowAll((v) => !v)}>
          {showAll ? '↑ Show less' : `↓ Show all ${tasks.length} tasks`}
        </button>
      )}
    </section>
  );
}
