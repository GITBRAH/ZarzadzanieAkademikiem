import { Icon, IconName } from './Icon';
import { User } from '../types';

export interface NavItemConfig {
  id: string;
  label: string;
  icon: IconName;
}

export const residentNavItems: NavItemConfig[] = [
  { id: 'home', label: 'Strona główna', icon: 'home' },
  { id: 'laundry', label: 'Pralnie i suszarnie', icon: 'laundry' },
  { id: 'court', label: 'Boiska sportowe', icon: 'court' },
  { id: 'maintenance', label: 'Usterki', icon: 'tool' },
  { id: 'applications', label: 'Podania i wnioski', icon: 'file' },
  { id: 'rooms', label: 'Mój pokój', icon: 'room' },
  { id: 'notices', label: 'Ogłoszenia', icon: 'notice' },
];

export const adminNavItems: NavItemConfig[] = [
  { id: 'home', label: 'Centrum operacyjne', icon: 'grid' },
  { id: 'residents', label: 'Mieszkańcy i pokoje', icon: 'users' },
  { id: 'laundry', label: 'Pralnie i suszarnie', icon: 'laundry' },
  { id: 'court', label: 'Boiska sportowe', icon: 'court' },
  { id: 'maintenance', label: 'Zgłoszenia usterek', icon: 'tool' },
  { id: 'applications', label: 'Podania i wnioski', icon: 'file' },
  { id: 'notices', label: 'Ogłoszenia i alerty', icon: 'megaphone' },
];

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  noticeCount?: number;
}

export function Sidebar({
  active,
  setActive,
  user,
  onOpenLogin,
  onLogout,
  noticeCount = 3
}: SidebarProps) {
  const isGuest = !user;
  const isAdmin = user?.role === 'Admin';
  const navItems = isAdmin ? adminNavItems : residentNavItems;

  const initials = user
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '??';

  const handleNavClick = (item: NavItemConfig) => {
    if (isGuest && item.id !== 'home') {
      // Unauthenticated user clicking locked tabs
      onOpenLogin();
      return;
    }
    setActive(item.id);
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Icon name="building" size={22} />
        </div>
        <div>
          <strong>AKAnet</strong>
          <span>
            {isGuest
              ? 'AKADEMIK OLIMP'
              : isAdmin
              ? 'PANEL ADMINISTRATORA'
              : 'PANEL UŻYTKOWNIKA'}
          </span>
        </div>
      </div>

      <nav>
        <p className="nav-caption">
          {isAdmin ? 'ZARZĄDZANIE OBIEKTEM' : 'MENU GŁÓWNE'}
        </p>
        {navItems.map((item) => {
          const isLocked = isGuest && item.id !== 'home';
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
              onClick={() => handleNavClick(item)}
              title={isLocked ? 'Wymagane logowanie' : item.label}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>

              {isLocked ? (
                <span className="nav-lock-icon" title="Zaloguj się, aby odblokować">
                  <Icon name="lock" size={14} />
                </span>
              ) : (
                item.id === 'notices' && noticeCount > 0 && (
                  <b className="nav-dot">{noticeCount}</b>
                )
              )}
            </button>
          );
        })}
      </nav>

      <div className="support-card">
        <span className="support-icon">
          <Icon name={isAdmin ? 'megaphone' : 'tool'} size={18} />
        </span>
        <strong>{isAdmin ? 'Centrum Pomocy Zarządcy' : 'Potrzebujesz pomocy?'}</strong>
        <p>
          {isAdmin
            ? 'Dyżur techniczny oraz ochrona budynku dostępne 24/7.'
            : 'Zespół akademika i recepcja są dostępne przez całą dobę.'}
        </p>
        <button
          onClick={() => {
            if (isGuest) onOpenLogin();
            else setActive('maintenance');
          }}
        >
          {isAdmin ? 'Sprawdź stan zgłoszeń' : 'Skontaktuj się z nami'}
        </button>
      </div>

      {isGuest ? (
        <button
          className="profile"
          onClick={onOpenLogin}
          title="Kliknij, aby się zalogować"
          style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px' }}
        >
          <div className="avatar" style={{ background: '#3b82f6' }}>
            <Icon name="lock" size={16} />
          </div>
          <div>
            <strong>Niezalogowany</strong>
            <span>Kliknij, aby się zalogować</span>
          </div>
          <Icon name="arrow" size={16} />
        </button>
      ) : (
        <div className="profile" style={{ justifyContent: 'space-between' }}>
          <div
            onClick={onOpenLogin}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', flex: 1, minWidth: 0, cursor: 'pointer' }}
            title="Kliknij, aby przełączyć profil"
          >
            <div className="avatar">{initials}</div>
            <div style={{ minWidth: 0 }}>
              <strong>{user.fullName}</strong>
              <span>
                {isAdmin
                  ? 'Administrator'
                  : `Mieszkaniec · ${user.roomNumber || 'B-214'}`}
              </span>
            </div>
          </div>
          <button
            className="profile-logout-btn"
            onClick={onLogout}
            title="Wyloguj się"
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}
