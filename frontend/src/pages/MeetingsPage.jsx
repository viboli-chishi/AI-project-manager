import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useMeetings, useLogMeeting } from '../hooks/useMeetings';
import { useAuth } from '../contexts/AuthContext';
import styles from './MeetingsPage.module.css';

export default function MeetingsPage() {
  const { team } = useAuth();
  const { data: meetings = [], isLoading } = useMeetings();
  const logMeeting = useLogMeeting();

  const [transcript, setTranscript] = useState('');
  const [attendees, setAttendees]   = useState('');
  const [expanded, setExpanded]     = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!transcript.trim()) return;
    const attendeeList = attendees.split(',').map((a) => a.trim()).filter(Boolean);
    await logMeeting.mutateAsync({ transcript, attendees: attendeeList });
    setTranscript('');
    setAttendees('');
  }

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.pageLabel}>AI Memory</p>
            <h1 className={styles.pageTitle}>Meeting Log</h1>
          </div>
          <div className={styles.badge}>
            <span>{meetings.length}</span> meetings stored
          </div>
        </div>

        {/* Log a new meeting */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>📝 Log New Meeting</h2>
          <p className={styles.cardHint}>
            Paste your meeting notes or transcript below. The AI will summarise it and store it in Hindsight memory for future context.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Attendees <span className={styles.subtle}>(comma-separated)</span></label>
              <input
                type="text"
                className={styles.input}
                placeholder="Alex, Sara, Jake, Nina"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Meeting Transcript / Notes</label>
              <textarea
                className={styles.textarea}
                placeholder="We discussed the Hindsight integration. Alex will lead the backend. Sara will handle the UI. Decision: use Groq for LLM calls. Blocker: API key not ready yet..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={7}
                required
              />
            </div>
            <button
              type="submit"
              className={styles.btn}
              disabled={logMeeting.isPending || !team?.project_id}
            >
              {logMeeting.isPending
                ? <><span className={styles.spinner} /> Summarising with AI…</>
                : '⚡ Summarise & Store in Memory'}
            </button>
            {logMeeting.isSuccess && (
              <p className={styles.success}>✅ Meeting summarised and stored in Hindsight memory!</p>
            )}
            {logMeeting.isError && (
              <p className={styles.error}>❌ Failed: {logMeeting.error?.message}</p>
            )}
          </form>
        </div>

        {/* Meeting history */}
        <div className={styles.history}>
          <h2 className={styles.sectionTitle}>Meeting History</h2>
          {isLoading && <p className={styles.muted}>Loading…</p>}
          {!isLoading && meetings.length === 0 && (
            <p className={styles.muted}>No meetings logged yet. Log your first meeting above.</p>
          )}
          {meetings.map((m) => (
            <div key={m.id} className={styles.meetingCard}>
              <div className={styles.meetingHeader} onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                <div>
                  <p className={styles.meetingDate}>{new Date(m.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                  <p className={styles.meetingAttendees}>
                    {m.attendees?.join(', ') || 'No attendees recorded'}
                  </p>
                </div>
                <span className={styles.chevron}>{expanded === m.id ? '▲' : '▼'}</span>
              </div>
              {expanded === m.id && (
                <div className={styles.meetingBody}>
                  <p className={styles.summaryLabel}>AI Summary</p>
                  <p className={styles.summaryText}>{m.summary}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
