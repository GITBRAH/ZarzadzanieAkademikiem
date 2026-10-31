import { useState } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { User } from '../types';
import { api } from '../services/api';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChanged: (user: User) => void;
  onLogout?: () => void;
  lockedReason?: string | null;
}

export function UserSwitcherModal({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  onLogout,
  lockedReason
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

  const isGuest = !currentUser;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isGuest ? 'Logowanie do systemu AKAnet' : 'Przełącz konto / Twój profil'}
    >
      <div>
        {/* Locked tab prompt */}
        {lockedReason && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              color: '#b45309',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}
          >
            <Icon name="lock" size={18} />
            <span>{lockedReason}</span>
          </div>
        )}

        {currentUser && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                OBECNIE ZALOGOWANY:
              </p>
              <strong style={{ fontSize: '13px', color: '#1e293b' }}>
                {currentUser.fullName}
              </strong>{' '}
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                ({currentUser.role === 'Admin' ? 'Administrator' : `Mieszkaniec · ${currentUser.roomNumber || 'B-214'}`})
              </span>
            </div>
            {onLogout && (
              <button
                type="button"
                className="secondary-button"
                style={{ height: '32px', padding: '0 10px', fontSize: '10px' }}
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <Icon name="logout" size={14} /> Wyloguj
              </button>
            )}
          </div>
        )}

        <p style={{ fontSize: '10px', fontWeight: 800, color: '#0c477e', letterSpacing: '1px', margin: '0 0 10px' }}>
          SZYBKI WYBÓR KONTA DEMO:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
          <button
            type="button"
            className="action-card"
            style={{
              padding: '12px',
              border: currentUser?.role === 'Resident' ? '2px solid #1671c5' : '1px solid #e1e8ee'
            }}
            onClick={() => switchAccount('jan.makara@student.pl', 'password123')}
            disabled={loading}
          >
            <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '11px', background: 'linear-gradient(145deg, #2e94eb, #1671c5)' }}>
              JM
            </div>
            <div>
              <strong style={{ fontSize: '12px' }}>Jan Makara</strong>
              <small>Mieszkaniec · B-214</small>
            </div>
          </button>

          <button
            type="button"
            className="action-card"
            style={{
              padding: '12px',
              border: currentUser?.role === 'Admin' ? '2px solid #1f4035' : '1px solid #e1e8ee'
            }}
            onClick={() => switchAccount('admin@akanet.pl', 'admin123')}
            disabled={loading}
          >
            <div
              className="avatar"
              style={{
                width: '36px',
                height: '36px',
                fontSize: '11px',
                background: 'linear-gradient(145deg, #d6ff63, #b8ea3b)',
                color: '#1f4035'
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

        <div style={{ position: 'relative', textAlign: 'center', margin: '18px 0' }}>
          <div style={{ height: '1px', background: '#edf1f5' }} />
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '0 10px',
              fontSize: '10px',
              color: '#94a3b8',
              fontWeight: 700
            }}
          >
            LUB ZALOGUJ SIĘ DANYMI
          </span>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: '#fee2e2',
              color: '#b91c1c',
              fontSize: '11px',
              marginBottom: '14px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleCustomLogin} className="modal-form">
          <div className="form-group">
            <label>Adres e-mail</label>
            <input
              type="email"
              placeholder="np. jan.makara@student.pl lub admin@akanet.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-actions" style={{ marginTop: '14px' }}>
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
