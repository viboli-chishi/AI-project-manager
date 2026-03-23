import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useMembers, useAddMember, useDeleteMember } from '../hooks/useMembers';
import { useAuth } from '../contexts/AuthContext';
import styles from './TeamPage.module.css';

const ROLES = ['Full Stack Dev', 'Frontend Dev', 'Backend Dev', 'UI Designer', 'ML Engineer', 'DevOps', 'Project Lead', 'Member'];

function avatarColor(name = '') {
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return `hsl(${hue}, 60%, 55%)`;
}

export default function TeamPage() {
  const { team, user } = useAuth();
  const { data: members = [], isLoading } = useMembers();
  const addMember    = useAddMember();
  const deleteMember = useDeleteMember();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'Member' });

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await addMember.mutateAsync(form);
    setForm({ name: '', role: 'Member' });
    setShowForm(false);
  }

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.pageLabel}>Project</p>
            <h1 className={styles.pageTitle}>{team?.name || 'Your Team'}</h1>
            <p className={styles.projectId}>Project ID: <code>{team?.project_id}</code></p>
          </div>
          <button className={styles.addBtn} onClick={() => setShowForm((v) => !v)}>
            {showForm ? '✕ Cancel' : '+ Add Member'}
          </button>
        </div>

        {showForm && (
          <div className={styles.formCard}>
            <form onSubmit={handleAdd} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Name *</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Alex Chen"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role</label>
                <select
                  className={styles.input}
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={addMember.isPending}>
                {addMember.isPending ? 'Adding…' : '+ Add Member'}
              </button>
            </form>
          </div>
        )}

        {isLoading && <p className={styles.muted}>Loading team…</p>}

        <div className={styles.grid}>
          {members.map((member) => (
            <div key={member.id} className={styles.card}>
              <button
                className={styles.delBtn}
                onClick={() => deleteMember.mutate(member.id)}
                title="Remove member"
              >✕</button>
              <div className={styles.avatar} style={{ background: `linear-gradient(135deg, ${avatarColor(member.name)}, ${avatarColor(member.name)}99)` }}>
                {member.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </div>
              <h3 className={styles.name}>{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
              <div className={styles.stats}>
                {[
                  { label: 'Activity',  val: `${member.monthly_activity}%` },
                  { label: 'KPI',       val: `${member.kpi_progress}%` },
                  { label: 'Done',      val: member.projects_done },
                ].map(({ label, val }) => (
                  <div key={label} className={styles.stat}>
                    <span className={styles.statVal}>{val}</span>
                    <span className={styles.statLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!isLoading && members.length === 0 && (
            <p className={styles.empty}>No team members yet. Add your first member above.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
