import { useEffect, useState } from 'react';
import { Sidebar, navItems } from './components/Sidebar';
import { Header } from './components/Header';
import { UserSwitcherModal } from './components/UserSwitcherModal';
import { DashboardPage } from './pages/DashboardPage';
import { BookingPage } from './pages/BookingPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { MyRoomPage } from './pages/MyRoomPage';
import { NoticesPage } from './pages/NoticesPage';
import { User } from './types';
import { api } from './services/api';

const defaultUser: User = {
  id: 1,
  email: 'jan.makara@student.pl',
  fullName: 'Jan Makara',
  phoneNumber: '+48 600 123 456',
  role: 'Resident',
  roomNumber: '202B',
  building: 'Budynek B'
};

export default function App() {
  const [active, setActive] = useState('home');
  const [user, setUser] = useState<User>(() => api.getCurrentStoredUser() || defaultUser);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  // Auto-login default user on startup if no token exists
  useEffect(() => {
    const initAuth = async () => {
      const stored = api.getCurrentStoredUser();
      const token = localStorage.getItem('akanet_token');
      if (!stored || !token) {
        try {
          const res = await api.login('jan.makara@student.pl', 'password123');
          setUser(res.user);
        } catch (e) {
          console.warn('Backend not ready for auto-login yet:', e);
        }
      }
    };
    initAuth();
  }, []);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'home':
        return `Dzień dobry, ${user.fullName.split(' ')[0]}`;
      case 'laundry':
        return 'Pralnie i suszarnie';
      case 'court':
        return 'Boiska sportowe';
      case 'maintenance':
        return 'Usterki i prace naprawcze';
      case 'applications':
        return 'Podania i wnioski';
      case 'rooms':
        return 'Mój pokój';
      case 'notices':
        return 'Tablica ogłoszeń';
      default:
        return 'AKAnet';
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        setActive={setActive}
        user={user}
        onSwitchUser={() => setIsSwitcherOpen(true)}
      />

      <div className="content">
        <Header
          title={getPageTitle(active)}
          user={user}
          onNotificationsClick={() => setActive('notices')}
          onProfileClick={() => setIsSwitcherOpen(true)}
        />

        {active === 'home' && <DashboardPage user={user} setActive={setActive} />}
        {active === 'laundry' && <BookingPage type="laundry" />}
        {active === 'court' && <BookingPage type="court" />}
        {active === 'maintenance' && <MaintenancePage user={user} />}
        {active === 'applications' && <ApplicationsPage user={user} />}
        {active === 'rooms' && <MyRoomPage user={user} setActive={setActive} />}
        {active === 'notices' && <NoticesPage user={user} />}
      </div>

      <UserSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
        currentUser={user}
        onUserChanged={(u) => setUser(u)}
      />
    </div>
  );
}
