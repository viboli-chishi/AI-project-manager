import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import CardCarousel from '../components/CardCarousel';
import TaskPanel from '../components/TaskPanel/TaskPanel';
import AIPanel from '../components/AIPanel/AIPanel';
import { useMembers, MOCK_MEMBERS } from '../hooks/useMembers';
import { useTasks, useUpdateTask, MOCK_TASKS } from '../hooks/useTasks';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { team } = useAuth();
  const { data: membersRaw = [], isLoading: membersLoading } = useMembers();
  const { data: tasksRaw   = [], isLoading: tasksLoading }   = useTasks();
  const updateTask = useUpdateTask();

  // Use real data or fall back to mocks while loading
  const members = membersRaw.length > 0 ? membersRaw : (membersLoading ? [] : MOCK_MEMBERS);
  const tasks   = tasksRaw.length   > 0 ? tasksRaw   : (tasksLoading   ? [] : MOCK_TASKS);

  const activeTasks = tasks.filter((t) => t.status !== 'done');

  function handleUpdateTask(task) {
    if (!task.id?.startsWith('t')) {  // skip mock IDs that start with 't'
      updateTask.mutate({ id: task.id, progress: task.progress, status: task.status });
    }
  }

  return (
    <DashboardLayout>
      <PageHeader memberCount={members.length} taskCount={activeTasks.length} teamName={team?.name} />
      <CardCarousel members={members} />
      <div className={styles.bottomGrid}>
        <TaskPanel tasks={activeTasks} onUpdateTask={handleUpdateTask} />
        <AIPanel projectId={team?.project_id} />
      </div>
    </DashboardLayout>
  );
}
