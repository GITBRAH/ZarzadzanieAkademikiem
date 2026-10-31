import { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { User } from '../types';

interface HeaderProps {
  title: string;
  user: User | null;
  onNotificationsClick: () => void;
  onProfileClick: () => void;
  onSearchClick: () => void;
  onLogoutClick?: () => void;
}

export function Header({
  title,
  user,
  onNotificationsClick,
  onProfileClick,
  onSearchClick,
  onLogoutClick
}: HeaderProps) {
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));
  const [lang, setLang] = useState<'PL' | 'EN'>('PL');

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'PL' ? 'EN' : 'PL'));
  };

  const initials = user
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '??';

  const getEyebrow = () => {
    if (!user) return 'System Akademika Olimp';
    if (user.role === 'Admin') return 'Panel Administracyjny AKAnet · Zarządca';
    return 'Panel Mieszkańca AKAnet · Budynek B';
  };

  return (
    <header>
      <div>
        <p className="eyebrow">{getEyebrow()}</p>
        <h1>{title}</h1>
      </div>

      <div className="header-actions">
        {/* Global Search Box (opens search modal) */}
        <div
          className="searchbox"
          onClick={onSearchClick}
          title="Kliknij lub wciśnij ⌘ K, aby szukać"
        >
          <Icon name="search" size={16} />
          <input
            placeholder="Szukaj (pokój, lokator, usterka)..."
            readOnly
          />
          <kbd>⌘ K</kbd>
        </div>

        {/* Language selector */}
        <button
          className="header-control"
          onClick={toggleLang}
          aria-label="Zmień język"
          title="Zmień język (PL / EN)"
        >
          <span>{lang}</span>
          <Icon name="chevron" size={12} />
        </button>

        {/* Night mode toggle */}
        <button
          className="header-control"
          onClick={toggleDarkMode}
          aria-label="Tryb nocny"
          title={isDark ? 'Włącz tryb dzienny' : 'Włącz tryb nocny'}
        >
          <Icon name={isDark ? 'sun' : 'moon'} size={15} />
          <span style={{ fontSize: '10px' }}>{isDark ? 'Jasny' : 'Ciemny'}</span>
        </button>

        {/* Notifications button */}
        <button
          className="icon-button"
          aria-label="Powiadomienia"
          onClick={onNotificationsClick}
          title="Ogłoszenia i powiadomienia"
        >
          <Icon name="bell" size={18} />
          <span />
        </button>

        {/* Profile / Login Avatar */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="header-avatar"
              onClick={onProfileClick}
              title={`Zalogowano jako: ${user.fullName} (${user.role}). Kliknij, aby przełączyć profil.`}
            >
              {initials}
            </button>
            {onLogoutClick && (
              <button
                className="icon-button"
                onClick={onLogoutClick}
                title="Wyloguj się"
                style={{ width: '36px', height: '36px' }}
              >
                <Icon name="logout" size={16} />
              </button>
            )}
          </div>
        ) : (
          <button
            className="primary-button"
            onClick={onProfileClick}
            style={{ height: '38px', padding: '0 16px', fontSize: '11px' }}
          >
            <Icon name="user" size={16} />
            <span>Zaloguj się</span>
          </button>
        )}
      </div>
    </header>
  );
}
