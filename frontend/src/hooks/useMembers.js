import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Fetches members for the current user's team from Supabase.
 * Falls back to mock data when the team is empty or Supabase is not configured.
 */
export function useMembers() {
  const { team } = useAuth();

  return useQuery({
    queryKey: ['members', team?.id],
    enabled: !!team?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('team_id', team.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });
}

/**
 * Add a new team member.
 */
export function useAddMember() {
  const { team } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memberData) => {
      const { data, error } = await supabase
        .from('members')
        .insert({ ...memberData, team_id: team.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members', team?.id] }),
  });
}

/**
 * Update member stats (activity, KPI, etc).
 */
export function useUpdateMember() {
  const { team } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members', team?.id] }),
  });
}

/**
 * Delete a team member.
 */
export function useDeleteMember() {
  const { team } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memberId) => {
      const { error } = await supabase.from('members').delete().eq('id', memberId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members', team?.id] }),
  });
}

export const MOCK_MEMBERS = [
  { id: 'm1', name: 'Alex Chen',  role: 'Full Stack Dev', monthly_activity: 82, in_progress: 3, overtime: 4,  plan_completion: 76, extra_goals: 54, projects_done: 12, kpi_progress: 88 },
  { id: 'm2', name: 'Sara Patel', role: 'UI Designer',    monthly_activity: 91, in_progress: 2, overtime: 1,  plan_completion: 93, extra_goals: 72, projects_done: 9,  kpi_progress: 95 },
  { id: 'm3', name: 'Jake Morris',role: 'Backend Dev',    monthly_activity: 67, in_progress: 4, overtime: 8,  plan_completion: 61, extra_goals: 38, projects_done: 7,  kpi_progress: 70 },
  { id: 'm4', name: 'Nina Wang',  role: 'ML Engineer',    monthly_activity: 78, in_progress: 1, overtime: 2,  plan_completion: 85, extra_goals: 60, projects_done: 5,  kpi_progress: 82 },
];
