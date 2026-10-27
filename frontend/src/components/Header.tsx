import { Icon } from './Icon';
import { User } from '../types';

interface HeaderProps {
  title: string;
  user: User;
  onNotificationsClick: () => void;
  onProfileClick: () => void;
}

export function Header({ title, user, onNotificationsClick, onProfileClick }: HeaderProps) {
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header>
      <div>
        <p className="eyebrow">
          {user.role === 'Admin' ? 'Panel Administracyjny AKAnet' : 'Panel Użytkownika AKAnet'}
        </p>
        <h1>{title}</h1>
      </div>
      <div className="header-actions">
        <button
          className="icon-button"
          aria-label="Powiadomienia"
          onClick={onNotificationsClick}
          title="Zobacz ogłoszenia i powiadomienia"
        >
          <Icon name="bell" size={20} />
          <span />
        </button>
        <button
          className="header-avatar"
          onClick={onProfileClick}
          title={`Zalogowano: ${user.fullName} (${user.role}). Kliknij, aby zmienić konto.`}
        >
          {initials}
        </button>
      </div>
    </header>
  );
}
