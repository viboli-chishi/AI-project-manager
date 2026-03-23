import Navbar from '../components/Navbar';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children, activeView, onViewChange }) {
  return (
    <div className={styles.shell}>
      {/* Animated blob background */}
      <div className="bg-blobs" />

      <Navbar activeView={activeView} onViewChange={onViewChange} />

      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
    </div>
  );
}
