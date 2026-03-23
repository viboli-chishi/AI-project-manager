import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useMembers } from '../hooks/useMembers';
import styles from './TasksPage.module.css';

const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['high', 'low'];

export default function TasksPage() {
  const { data: tasks   = [] } = useTasks();
  const { data: members = [] } = useMembers();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', assigned_to: '', status: 'todo', priority: 'low', deadline: '', total_time: '0h', progress: 0 });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    await createTask.mutateAsync(form);
    setForm({ title: '', assigned_to: '', status: 'todo', priority: 'low', deadline: '', total_time: '0h', progress: 0 });
    setShowForm(false);
  }

  function handleProgressChange(task, delta) {
    const next = Math.min(100, Math.max(0, (task.progress || 0) + delta));
    const status = next === 100 ? 'done' : next > 0 ? 'in_progress' : 'todo';
    updateTask.mutate({ id: task.id, progress: next, status });
  }

  const grouped = {
    todo:        tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done:        tasks.filter((t) => t.status === 'done'),
  };

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.pageLabel}>Project Management</p>
            <h1 className={styles.pageTitle}>Tasks</h1>
          </div>
          <button className={styles.addBtn} onClick={() => setShowForm((v) => !v)}>
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>

        {showForm && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Create Task</h2>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Title *</label>
                  <input className={styles.input} name="title" value={form.title} onChange={handleChange} placeholder="e.g. Integrate Hindsight API" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Assigned To</label>
                  <select className={styles.input} name="assigned_to" value={form.assigned_to} onChange={handleChange}>
                    <option value="">Unassigned</option>
                    {members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Status</label>
                  <select className={styles.input} name="status" value={form.status} onChange={handleChange}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Priority</label>
                  <select className={styles.input} name="priority" value={form.priority} onChange={handleChange}>
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Deadline</label>
                  <input className={styles.input} type="date" name="deadline" value={form.deadline} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Est. Time</label>
                  <input className={styles.input} name="total_time" value={form.total_time} onChange={handleChange} placeholder="e.g. 8h" />
                </div>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={createTask.isPending}>
                {createTask.isPending ? 'Creating…' : '+ Create Task'}
              </button>
            </form>
          </div>
        )}

        {/* Kanban columns */}
        <div className={styles.kanban}>
          {[
            { key: 'todo',        label: '📋 To Do',      color: 'var(--text-muted)' },
            { key: 'in_progress', label: '⚡ In Progress', color: 'var(--accent-yellow)' },
            { key: 'done',        label: '✅ Done',        color: 'var(--accent-green)' },
          ].map(({ key, label, color }) => (
            <div key={key} className={styles.column}>
              <div className={styles.columnHeader}>
                <span className={styles.columnLabel} style={{ color }}>{label}</span>
                <span className={styles.columnCount}>{grouped[key].length}</span>
              </div>
              <div className={styles.columnCards}>
                {grouped[key].length === 0 && (
                  <p className={styles.empty}>No tasks here</p>
                )}
                {grouped[key].map((task) => (
                  <div key={task.id} className={styles.taskCard}>
                    <div className={styles.taskTop}>
                      <span className={`${styles.prio} ${task.priority === 'high' ? styles.high : styles.low}`}>
                        {task.priority === 'high' ? '↑ High' : '↓ Low'}
                      </span>
                      <button className={styles.del} onClick={() => deleteTask.mutate(task.id)}>✕</button>
                    </div>
                    <p className={styles.taskTitle}>{task.title}</p>
                    {task.assigned_to && <p className={styles.assignee}>👤 {task.assigned_to}</p>}
                    {task.deadline && <p className={styles.deadline}>📅 {task.deadline}</p>}

                    <div className={styles.progressRow}>
                      <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${task.progress || 0}%`, background: task.priority === 'high' ? 'var(--accent-pink)' : 'var(--accent-green)' }} />
                      </div>
                      <span className={styles.progressPct}>{task.progress || 0}%</span>
                    </div>
                    <div className={styles.progressBtns}>
                      <button onClick={() => handleProgressChange(task, -10)}>−10%</button>
                      <button onClick={() => handleProgressChange(task, +10)}>+10%</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
