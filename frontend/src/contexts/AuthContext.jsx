import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [team, setTeam]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchTeam(session.user.id);
      else setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchTeam(session.user.id);
      else { setTeam(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchTeam(userId) {
    const { data } = await supabase
      .from('teams')
      .select('*')
      .eq('owner_id', userId)
      .single();
    setTeam(data ?? null);
    setLoading(false);
  }

  async function signUp(email, password, teamName) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      // Create team on sign up
      const projectId = `team-${data.user.id.slice(0, 8)}`;
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({ name: teamName, project_id: projectId, owner_id: data.user.id })
        .select()
        .single();
      if (teamError) throw teamError;
      setTeam(teamData);
    }
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setTeam(null);
  }

  return (
    <AuthContext.Provider value={{ user, team, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
