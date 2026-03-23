import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Tasks',     path: '/tasks' },
  { label: 'Meetings',  path: '/meetings' },
  { label: 'Team',      path: '/team' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, team, signOut } = useAuth();

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <span className={styles.logoIcon}>⬡</span>
        <span className={styles.logoText}>Nexus<span className={styles.logoAccent}>PM</span></span>
      </div>

      <ul className={styles.links}>
        {NAV_LINKS.map(({ label, path }) => (
          <li key={label}>
            <button
              className={`${styles.link} ${location.pathname === path ? styles.active : ''}`}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.right}>
        {team && (
          <div className={styles.teamBadge}>
            <span className={styles.teamIcon}>⬡</span>
            <span className={styles.teamName}>{team.name}</span>
          </div>
        )}
        <button className={styles.signOutBtn} onClick={signOut} title="Sign out">
          Sign out
        </button>
        <div className={styles.avatar} title={user?.email}>{initials}</div>
      </div>
    </nav>
  );
}
