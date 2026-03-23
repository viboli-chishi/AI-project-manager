import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { logMeeting, getMeetingHistory } from '../services/api';

export function useMeetings() {
  const { team } = useAuth();
  return useQuery({
    queryKey: ['meetings', team?.id],
    enabled: !!team?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('team_id', team.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useLogMeeting() {
  const { team } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ transcript, attendees }) => {
      // 1. Send to FastAPI AI endpoint → Groq summarises + stores in Hindsight
      const aiRes = await logMeeting({
        project_id: team.project_id,
        transcript,
        attendees,
      });
      const summary = aiRes.data?.data?.summary ?? 'No summary generated.';
      // 2. Also persist to Supabase for display
      const { data, error } = await supabase
        .from('meetings')
        .insert({ team_id: team.id, transcript, summary, attendees })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings', team?.id] }),
  });
}
