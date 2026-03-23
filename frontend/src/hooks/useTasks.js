import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Fetches all tasks for the current team from Supabase.
 */
export function useTasks() {
  const { team } = useAuth();

  return useQuery({
    queryKey: ['tasks', team?.id],
    enabled: !!team?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('team_id', team.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 15_000,
  });
}

/**
 * Create a new task.
 */
export function useCreateTask() {
  const { team } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskData) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...taskData, team_id: team.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', team?.id] }),
  });
}

/**
 * Update an existing task (progress, status, etc.).
 */
export function useUpdateTask() {
  const { team } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', team?.id] }),
  });
}

/**
 * Delete a task.
 */
export function useDeleteTask() {
  const { team } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId) => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', team?.id] }),
  });
}

export const MOCK_TASKS = [
  { id: 't1', title: 'Hindsight Memory Integration', assigned_to: 'Jake',  status: 'in_progress', deadline: '2024-04-20', progress: 68, priority: 'high', total_time: '14h' },
  { id: 't2', title: 'Dashboard UI Components',       assigned_to: 'Sara',  status: 'in_progress', deadline: '2024-04-18', progress: 45, priority: 'high', total_time: '9h'  },
  { id: 't3', title: 'Groq LLM Prompt Tuning',        assigned_to: 'Nina',  status: 'in_progress', deadline: '2024-04-25', progress: 30, priority: 'low',  total_time: '6h'  },
  { id: 't4', title: 'API Router Restructuring',      assigned_to: 'Alex',  status: 'in_progress', deadline: '2024-04-15', progress: 90, priority: 'low',  total_time: '11h' },
  { id: 't5', title: 'Meeting Summarization Flow',    assigned_to: 'Alex',  status: 'in_progress', deadline: '2024-04-22', progress: 55, priority: 'high', total_time: '8h'  },
];
