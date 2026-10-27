import { Icon, IconName } from './Icon';
import { User } from '../types';

export const navItems: { id: string; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Strona główna', icon: 'home' },
  { id: 'laundry', label: 'Pralnie i suszarnie', icon: 'laundry' },
  { id: 'court', label: 'Boiska sportowe', icon: 'court' },
  { id: 'maintenance', label: 'Usterki', icon: 'tool' },
  { id: 'applications', label: 'Podania i wnioski', icon: 'file' },
  { id: 'rooms', label: 'Mój pokój', icon: 'room' },
  { id: 'notices', label: 'Ogłoszenia', icon: 'notice' },
];

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  user: User;
  onSwitchUser: () => void;
  noticeCount?: number;
}

export function Sidebar({ active, setActive, user, onSwitchUser, noticeCount = 3 }: SidebarProps) {
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isResident = user.role === 'Resident';

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Icon name="building" size={22} />
        </div>
        <div>
          <strong>AKAnet</strong>
          <span>{user.role === 'Admin' ? 'PANEL ADMINISTRATORA' : 'PANEL UŻYTKOWNIKA'}</span>
        </div>
      </div>

      <nav>
        <p className="nav-caption">MENU GŁÓWNE</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
            {item.id === 'notices' && noticeCount > 0 && <b className="nav-dot">{noticeCount}</b>}
          </button>
        ))}
      </nav>

      <div className="support-card">
        <span className="support-icon">
          <Icon name="tool" size={18} />
        </span>
        <strong>Potrzebujesz pomocy?</strong>
        <p>Zespół akademika jest dostępny przez całą dobę.</p>
        <button onClick={() => setActive('maintenance')}>Skontaktuj się z nami</button>
      </div>

      <div className="profile" onClick={onSwitchUser} title="Kliknij, aby przełączyć użytkownika (Mieszkaniec / Admin)" style={{ cursor: 'pointer' }}>
        <div className="avatar">{initials}</div>
        <div>
          <strong>{user.fullName}</strong>
          <span>
            {isResident ? `Mieszkaniec · ${user.roomNumber || '202B'}` : 'Administrator systemu'}
          </span>
        </div>
        <Icon name="chevron" size={16} />
      </div>
    </aside>
  );
}
