import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Icon, IconName } from './Icon';
import { mockRooms } from '../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  isAdmin: boolean;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onNavigate,
  isAdmin
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Searchable navigation modules
  const navModules = [
    { id: 'home', title: isAdmin ? 'Centrum operacyjne' : 'Strona główna (Pulpit)', icon: 'home' as IconName, desc: 'Pulpit główny akademika' },
    { id: 'laundry', title: 'Pralnie i suszarnie', icon: 'laundry' as IconName, desc: 'Rezerwacja urządzeń piorących' },
    { id: 'court', title: 'Boiska sportowe', icon: 'court' as IconName, desc: 'Rezerwacja boiska wielofunkcyjnego' },
    { id: 'maintenance', title: 'Usterki i naprawy', icon: 'tool' as IconName, desc: 'Zgłaszanie awarii i konserwacja' },
    { id: 'applications', title: 'Podania i wnioski', icon: 'file' as IconName, desc: 'Elektroniczny obieg dokumentów' },
    { id: isAdmin ? 'residents' : 'rooms', title: isAdmin ? 'Mieszkańcy i pokoje' : 'Mój pokój', icon: isAdmin ? 'users' as IconName : 'room' as IconName, desc: 'Wyszukiwanie lokatorów i ewidencja' },
    { id: 'notices', title: 'Ogłoszenia i alerty', icon: 'notice' as IconName, desc: 'Komunikaty administracji akademika' }
  ];

  const matchedModules = q
    ? navModules.filter((m) => m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q))
    : navModules;

  // Searchable rooms & residents
  const matchedRooms = q
    ? mockRooms.filter(
        (r) =>
          r.number.toLowerCase().includes(q) ||
          r.residents.some((res) => res.name.toLowerCase().includes(q) || res.indexNumber.includes(q))
      )
    : [];

  const handleSelect = (tabId: string) => {
    onNavigate(tabId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Szybkie wyszukiwanie AKAnet">
      <div>
        <div className="finder-search" style={{ marginBottom: '18px' }}>
          <Icon name="search" size={18} />
          <input
            autoFocus
            placeholder="Szukaj zakładki, pokoju (np. B-214) lub mieszkańca..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Wyczyść">
              <Icon name="close" size={14} />
            </button>
          )}
        </div>

        {/* Matched Rooms & Residents (if searched) */}
        {matchedRooms.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '1px', margin: '0 0 8px' }}>
              POKOJE I MIESZKAŃCY
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {matchedRooms.map((room) => (
                <div
                  key={room.number}
                  className="room-result"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelect(isAdmin ? 'residents' : 'rooms')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Pokój {room.number} ({room.floor})</strong>
                    <span className="tag tag-lime">{room.status}</span>
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#475569' }}>
                    Lokatorzy: {room.residents.map((r) => `${r.name} (#${r.indexNumber})`).join(', ') || 'Brak'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modules */}
        <div>
          <p style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '1px', margin: '0 0 8px' }}>
            {q ? 'DOPASOWANE MODUŁY' : 'NAJPOPULARNIEJSZE ZAKŁADKI'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {matchedModules.map((item) => (
              <button
                key={item.id}
                className="action-card"
                style={{ padding: '10px 14px', width: '100%', minHeight: 'auto' }}
                onClick={() => handleSelect(item.id)}
              >
                <span className="action-icon blue" style={{ width: '34px', height: '34px' }}>
                  <Icon name={item.icon} size={18} />
                </span>
                <div>
                  <strong style={{ fontSize: '12px' }}>{item.title}</strong>
                  <small style={{ fontSize: '10px' }}>{item.desc}</small>
                </div>
                <span className="action-arrow">
                  <Icon name="arrow" size={16} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
