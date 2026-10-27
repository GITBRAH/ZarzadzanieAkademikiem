import { useState } from 'react';
import { Modal } from './Modal';
import { User } from '../types';
import { api } from '../services/api';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserChanged: (user: User) => void;
}

export function UserSwitcherModal({
  isOpen,
  onClose,
  currentUser,
  onUserChanged
}: UserSwitcherModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchAccount = async (targetEmail: string, targetPass: string) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.login(targetEmail, targetPass);
      onUserChanged(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Nie udało się zalogować.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await switchAccount(email, password);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zarządzanie profilem i przełączanie konta">
      <div style={{ marginBottom: '18px' }}>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px' }}>
          Obecnie zalogowany jako: <strong>{currentUser.fullName}</strong> ({currentUser.role})
        </p>

        <p style={{ fontSize: '11px', fontWeight: 700, color: '#0c477e', margin: '0 0 8px' }}>
          SZYBKI WYBÓR KONTA DEMO:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            className="action-card"
            style={{
              padding: '10px',
              border: currentUser.role === 'Resident' ? '2px solid #1671c5' : '1px solid #e1e8ee'
            }}
            onClick={() => switchAccount('jan.makara@student.pl', 'password123')}
            disabled={loading}
          >
            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '10px' }}>
              JM
            </div>
            <div>
              <strong style={{ fontSize: '12px' }}>Jan Makara</strong>
              <small>Mieszkaniec · 202B</small>
            </div>
          </button>

          <button
            type="button"
            className="action-card"
            style={{
              padding: '10px',
              border: currentUser.role === 'Admin' ? '2px solid #1671c5' : '1px solid #e1e8ee'
            }}
            onClick={() => switchAccount('admin@akanet.pl', 'admin123')}
            disabled={loading}
          >
            <div
              className="avatar"
              style={{
                width: '32px',
                height: '32px',
                fontSize: '10px',
                background: 'linear-gradient(145deg, #f59e0b, #d97706)'
              }}
            >
              AD
            </div>
            <div>
              <strong style={{ fontSize: '12px' }}>Administracja</strong>
              <small>Panel Zarządcy</small>
            </div>
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: '0 0 10px' }}>
          LUB ZALOGUJ SIĘ NA INNE KONTO:
        </p>

        {error && (
          <p style={{ color: '#ef4444', fontSize: '11px', margin: '0 0 8px', fontWeight: 500 }}>
            {error}
          </p>
        )}

        <form onSubmit={handleCustomLogin} className="modal-form">
          <div className="form-group">
            <label>Adres e-mail</label>
            <input
              type="email"
              value={email}
              placeholder="np. email@student.pl"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Anuluj
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
