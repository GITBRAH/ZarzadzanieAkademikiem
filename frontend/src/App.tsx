import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { UserSwitcherModal } from './components/UserSwitcherModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Pages
import { GuestLandingPage } from './pages/GuestLandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminResidentsPage } from './pages/AdminResidentsPage';
import { BookingPage } from './pages/BookingPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { MyRoomPage } from './pages/MyRoomPage';
import { NoticesPage } from './pages/NoticesPage';

import { User } from './types';
import { api } from './services/api';

export default function App() {
  const [active, setActive] = useState('home');
  // Initial state: Unauthenticated guest on page load as requested:
  // "po zaladowaniu strony pojawi mi sie ekran glowny, nie zalogowany uczestnik"
  const [user, setUser] = useState<User | null>(null);

  // Modals state
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lockedTabNotice, setLockedTabNotice] = useState<string | null>(null);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenLogin = (reason?: string) => {
    setLockedTabNotice(reason || null);
    setIsSwitcherOpen(true);
  };

  const handleUserChanged = (newUser: User) => {
    setUser(newUser);
    setLockedTabNotice(null);
    // User requirement: "podczas zmiany uzytkownika zawsze po zalogowaniu uzytkownik ma przed soba main menu"
    setActive('home');
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setActive('home');
    setLockedTabNotice(null);
  };

  // Determine active theme class
  const themeClass = !user
    ? 'theme-guest'
    : user.role === 'Admin'
    ? 'theme-admin'
    : 'theme-resident';

  const getPageTitle = (tab: string) => {
    if (!user) {
      return 'Akademik Olimp — Witamy w AKAnet';
    }

    if (user.role === 'Admin') {
      switch (tab) {
        case 'home':
          return 'Centrum operacyjne';
        case 'residents':
          return 'Mieszkańcy i pokoje';
        case 'laundry':
          return 'Grafik pralni i suszarni';
        case 'court':
          return 'Obiekty sportowe';
        case 'maintenance':
          return 'Zgłoszenia usterek';
        case 'applications':
          return 'Podania i wnioski';
        case 'notices':
          return 'Ogłoszenia i komunikaty';
        default:
          return 'AKAnet · Panel Administratora';
      }
    }

    // Resident
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
        return 'AKAnet · Panel Mieszkańca';
    }
  };

  return (
    <div className={`app-shell ${themeClass}`}>
      <Sidebar
        active={active}
        setActive={setActive}
        user={user}
        onOpenLogin={() => handleOpenLogin('Ta zakładka wymaga zalogowania. Wybierz konto demo lub wpisz dane.')}
        onLogout={handleLogout}
      />

      <div className="content">
        <Header
          title={getPageTitle(active)}
          user={user}
          onNotificationsClick={() => {
            if (!user) handleOpenLogin('Zaloguj się, aby przejść do ogłoszeń.');
            else setActive('notices');
          }}
          onProfileClick={() => handleOpenLogin()}
          onSearchClick={() => setIsSearchOpen(true)}
          onLogoutClick={user ? handleLogout : undefined}
        />

        {/* Content routing */}
        {!user && active === 'home' && (
          <GuestLandingPage onOpenLogin={() => handleOpenLogin()} />
        )}

        {user && user.role === 'Admin' && (
          <>
            {active === 'home' && <AdminDashboardPage user={user} setActive={setActive} />}
            {active === 'residents' && <AdminResidentsPage />}
            {active === 'laundry' && <BookingPage type="laundry" />}
            {active === 'court' && <BookingPage type="court" />}
            {active === 'maintenance' && <MaintenancePage user={user} />}
            {active === 'applications' && <ApplicationsPage user={user} />}
            {active === 'notices' && <NoticesPage user={user} />}
          </>
        )}

        {user && user.role !== 'Admin' && (
          <>
            {active === 'home' && <DashboardPage user={user} setActive={setActive} />}
            {active === 'laundry' && <BookingPage type="laundry" />}
            {active === 'court' && <BookingPage type="court" />}
            {active === 'maintenance' && <MaintenancePage user={user} />}
            {active === 'applications' && <ApplicationsPage user={user} />}
            {active === 'rooms' && <MyRoomPage user={user} setActive={setActive} />}
            {active === 'notices' && <NoticesPage user={user} />}
          </>
        )}
      </div>

      <UserSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => {
          setIsSwitcherOpen(false);
          setLockedTabNotice(null);
        }}
        currentUser={user}
        onUserChanged={handleUserChanged}
        onLogout={handleLogout}
        lockedReason={lockedTabNotice}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          if (!user && tab !== 'home') {
            handleOpenLogin('Ta zakładka wymaga zalogowania.');
          } else {
            setActive(tab);
          }
        }}
        isAdmin={user?.role === 'Admin'}
      />
    </div>
  );
}
