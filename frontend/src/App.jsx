import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LoginPage     from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MeetingsPage  from './pages/MeetingsPage';
import TasksPage     from './pages/TasksPage';
import TeamPage      from './pages/TeamPage';

import './styles/global.css';

const queryClient = new QueryClient();

/** Redirects unauthenticated users to /login */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-shell)' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(180,122,252,0.3)', borderTopColor: 'var(--accent-purple)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/tasks"    element={<PrivateRoute><TasksPage /></PrivateRoute>} />
      <Route path="/meetings" element={<PrivateRoute><MeetingsPage /></PrivateRoute>} />
      <Route path="/team"     element={<PrivateRoute><TeamPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
