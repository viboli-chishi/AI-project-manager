import { useState } from 'react';
import { recommendTasks, getReminders } from '../../services/api';
import styles from './AIPanel.module.css';

export default function AIPanel({ projectId }) {
  const [recText, setRecText]           = useState('');
  const [remindText, setRemindText]     = useState('');
  const [recLoading, setRecLoading]     = useState(false);
  const [remindLoading, setRemindLoading] = useState(false);
  const [activeTab, setActiveTab]       = useState('rec');

  async function handleRecommend() {
    if (!projectId) return;
    setRecLoading(true);
    setRecText('');
    try {
      const res = await recommendTasks(projectId);
      setRecText(res.data?.data?.recommendations || 'No recommendations generated.');
    } catch { setRecText('Failed to generate recommendations. Check that the backend is running.'); }
    finally { setRecLoading(false); }
  }

  async function handleReminders() {
    if (!projectId) return;
    setRemindLoading(true);
    setRemindText('');
    try {
      const res = await getReminders(projectId);
      setRemindText(res.data?.data?.reminders || 'No reminders generated.');
    } catch { setRemindText('Failed to generate reminders. Check that the backend is running.'); }
    finally { setRemindLoading(false); }
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.icon}>⚡</span>
        <div>
          <p className={styles.label}>Hindsight AI</p>
          <h2 className={styles.title}>Smart Insights</h2>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'rec' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('rec')}
        >Recommendations</button>
        <button
          className={`${styles.tab} ${activeTab === 'rem' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('rem')}
        >Reminders</button>
      </div>

      {activeTab === 'rec' && (
        <div className={styles.section}>
          <p className={styles.hint}>AI reads past task performance from Hindsight memory to recommend who should own each task.</p>
          <button
            className={styles.actionBtn}
            onClick={handleRecommend}
            disabled={recLoading || !projectId}
          >
            {recLoading ? <><span className={styles.spinner} /> Analysing…</> : '🧠 Generate Recommendations'}
          </button>
          {recText && <pre className={styles.result}>{recText}</pre>}
          {!projectId && <p className={styles.warn}>⚠ No project found. Set up your team first.</p>}
        </div>
      )}

      {activeTab === 'rem' && (
        <div className={styles.section}>
          <p className={styles.hint}>AI scans past delay patterns from Hindsight to generate targeted deadline reminders.</p>
          <button
            className={styles.actionBtn}
            onClick={handleReminders}
            disabled={remindLoading || !projectId}
          >
            {remindLoading ? <><span className={styles.spinner} /> Analysing…</> : '⏰ Generate Reminders'}
          </button>
          {remindText && <pre className={styles.result}>{remindText}</pre>}
          {!projectId && <p className={styles.warn}>⚠ No project found. Set up your team first.</p>}
        </div>
      )}
    </aside>
  );
}
