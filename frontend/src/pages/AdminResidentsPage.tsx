import { useState } from 'react';
import { Icon } from '../components/Icon';
import { RoomRecord } from '../types';
import { mockRooms } from '../services/api';

export function AdminResidentsPage() {
  const [roomQuery, setRoomQuery] = useState('B-214');
  const [residentQuery, setResidentQuery] = useState('');
  const [roomFilter, setRoomFilter] = useState<'all' | 'free' | 'full'>('all');
  const [rooms] = useState<RoomRecord[]>(mockRooms);

  const normalizedRoomQuery = roomQuery.trim().toLowerCase();
  const normalizedResidentQuery = residentQuery.trim().toLowerCase();

  const roomMatches = normalizedRoomQuery
    ? rooms.filter((r) => r.number.toLowerCase().includes(normalizedRoomQuery))
    : [];

  const residentMatches = normalizedResidentQuery
    ? rooms.flatMap((room) =>
        room.residents
          .filter((res) => res.name.toLowerCase().includes(normalizedResidentQuery))
          .map((resident) => ({ resident, room }))
      )
    : [];

  const filteredOverviewRooms = rooms.filter((r) => {
    if (roomFilter === 'free') return r.occupancyNum < r.capacityNum;
    if (roomFilter === 'full') return r.occupancyNum >= r.capacityNum;
    return true;
  });

  return (
    <main className="page">
      <div className="section-heading" style={{ marginBottom: '24px' }}>
        <div>
          <p className="eyebrow">MIESZKAŃCY I POKOJE</p>
          <h2 style={{ margin: 0, font: '700 28px/1.2 "Manrope", sans-serif', letterSpacing: '-.6px' }}>
            Pokoje i lokatorzy
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '12px' }}>
            Baza zakwaterowania: weryfikuj stan pokoi, wyszukuj studentów i sprawdzaj dostępność miejsc.
          </p>
        </div>
      </div>

      {/* Two Finder Cards Grid */}
      <section className="finder-grid">
        {/* Finder by Room Number */}
        <article className="finder-card">
          <div className="finder-heading">
            <span className="finder-icon">
              <Icon name="building" size={22} />
            </span>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>PO NUMERZE POKOJU</p>
              <h3>Sprawdź mieszkańców</h3>
            </div>
          </div>

          <div className="finder-search">
            <Icon name="search" size={18} />
            <input
              aria-label="Numer pokoju"
              value={roomQuery}
              onChange={(e) => setRoomQuery(e.target.value)}
              placeholder="Wpisz np. B-214, A-103..."
            />
            {roomQuery && (
              <button aria-label="Wyczyść numer pokoju" onClick={() => setRoomQuery('')}>
                <Icon name="close" size={15} />
              </button>
            )}
          </div>

          <div className="finder-results">
            {!roomQuery && (
              <p className="finder-hint">
                Wpisz numer pokoju, aby wyświetlić przypisanych do niego lokatorów.
              </p>
            )}

            {roomQuery && roomMatches.length === 0 && (
              <p className="finder-empty">
                Nie znaleziono pokoju o numerze "{roomQuery}".
              </p>
            )}

            {roomMatches.map((room) => (
              <div className="room-result" key={room.number}>
                <div className="result-title">
                  <div>
                    <strong>Pokój {room.number}</strong>
                    <small>
                      {room.floor} · {room.capacity} miejsc
                    </small>
                  </div>
                  <span className={`tag ${room.status === 'Zajęty' ? 'tag-warning' : 'tag-success'}`}>
                    {room.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {room.residents.map((res) => (
                    <div className="resident-list-row" key={res.name}>
                      <span className="resident-avatar-small">
                        {res.name
                          .split(' ')
                          .map((p) => p[0])
                          .join('')}
                      </span>
                      <div>
                        <strong style={{ fontSize: '11px', display: 'block' }}>{res.name}</strong>
                        <small style={{ fontSize: '9px', color: '#64748b' }}>
                          Nr indeksu: {res.indexNumber}
                        </small>
                      </div>
                    </div>
                  ))}
                  {room.residents.length === 0 && (
                    <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                      Pokój jest obecnie pusty.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Finder by Resident Name */}
        <article className="finder-card">
          <div className="finder-heading">
            <span className="finder-icon peach">
              <Icon name="users" size={22} />
            </span>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>PO IMIENIU I NAZWISKU</p>
              <h3>Znajdź pokój mieszkańca</h3>
            </div>
          </div>

          <div className="finder-search">
            <Icon name="search" size={18} />
            <input
              aria-label="Imię i nazwisko mieszkańca"
              value={residentQuery}
              onChange={(e) => setResidentQuery(e.target.value)}
              placeholder="Wpisz np. Adam Zając, Jan Makara..."
            />
            {residentQuery && (
              <button aria-label="Wyczyść nazwisko" onClick={() => setResidentQuery('')}>
                <Icon name="close" size={15} />
              </button>
            )}
          </div>

          <div className="finder-results">
            {!residentQuery && (
              <p className="finder-hint">
                Wpisz imię lub nazwisko, aby sprawdzić przypisany pokój lokatora.
              </p>
            )}

            {residentQuery && residentMatches.length === 0 && (
              <p className="finder-empty">
                Nie znaleziono mieszkańca "{residentQuery}".
              </p>
            )}

            {residentMatches.map(({ resident, room }) => (
              <div className="person-result" key={resident.name}>
                <span className="resident-avatar-small" style={{ width: '38px', height: '38px', fontSize: '12px' }}>
                  {resident.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')}
                </span>
                <div>
                  <strong>{resident.name}</strong>
                  <small>Indeks: {resident.indexNumber} · Aktywny mieszkaniec</small>
                </div>
                <div className="room-badge">
                  <span>POKÓJ</span>
                  <strong>{room.number}</strong>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Rooms Overview & Inventory Section */}
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EWIDENCJA I OBŁOŻENIE</p>
            <h3>Przegląd wszystkich pokoi</h3>
          </div>
        </div>

        <div className="filter-tabs">
          <button
            className={`tab-btn ${roomFilter === 'all' ? 'active' : ''}`}
            onClick={() => setRoomFilter('all')}
          >
            Wszystkie pokoje ({rooms.length})
          </button>
          <button
            className={`tab-btn ${roomFilter === 'free' ? 'active' : ''}`}
            onClick={() => setRoomFilter('free')}
          >
            Wolne miejsca ({rooms.filter((r) => r.occupancyNum < r.capacityNum).length})
          </button>
          <button
            className={`tab-btn ${roomFilter === 'full' ? 'active' : ''}`}
            onClick={() => setRoomFilter('full')}
          >
            Pełne pokoje ({rooms.filter((r) => r.occupancyNum >= r.capacityNum).length})
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>POKÓJ</th>
                <th>LOKALIZACJA</th>
                <th>MIESZKAŃCY</th>
                <th>OBŁOŻENIE</th>
                <th>STATUS</th>
                <th>AKCJA</th>
              </tr>
            </thead>
            <tbody>
              {filteredOverviewRooms.map((room) => (
                <tr key={room.number}>
                  <td>
                    <strong style={{ fontSize: '13px' }}>Pokój {room.number}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {room.building} · {room.floor}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '11px', color: '#1e293b' }}>
                      {room.residents.map((r) => r.name).join(', ') || (
                        <em style={{ color: '#94a3b8' }}>Brak mieszkańców</em>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="tag tag-lime">{room.capacity}</span>
                  </td>
                  <td>
                    <span className={`tag ${room.status === 'Zajęty' ? 'tag-warning' : 'tag-success'}`}>
                      {room.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn-small"
                      onClick={() => setRoomQuery(room.number)}
                      title="Pokaż w wyszukiwarce"
                    >
                      Szczegóły
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
