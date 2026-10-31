import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { MaintenanceTicket, User } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  user: User;
  setActive: (id: string) => void;
}

export function AdminDashboardPage({ user, setActive }: AdminDashboardProps) {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const dayNames = ['ND', 'PN', 'WT', 'ŚR', 'CZW', 'PT', 'SOB'];
  const monthNames = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'];
  const currentDayName = dayNames[now.getDay()];
  const currentDayNum = now.getDate();
  const currentMonthName = monthNames[now.getMonth()];

  useEffect(() => {
    api.getTickets().then((data) => {
      setTickets(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const openTicketsCount = tickets.filter((t) => t.status !== 'Rozwiązane').length || 14;
  const urgentTickets = tickets.filter((t) => t.priority === 'Pilny' || t.priority === 'Wysoki').slice(0, 3);

  return (
    <main className="page">
      {/* Admin Hero Section */}
      <section className="welcome">
        <div>
          <span className="status-pill">
            <i /> System Zarządzania Domem Studenckim · Olimp
          </span>
          <h2>
            Centrum Operacyjne,
            <br />
            <em>zarządzanie budynkiem w jednym miejscu.</em>
          </h2>
          <p>
            Monitoruj obłożenie pokoi, koordynuj usuwanie awarii i komunikuj się ze społecznością mieszkańców.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              className="primary-button"
              onClick={() => setActive('notices')}
              style={{
                background: '#d6ff63',
                color: '#1f4035',
                border: 'none',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              <Icon name="megaphone" size={17} /> Nowe ogłoszenie
            </button>
            <button
              className="secondary-button"
              onClick={() => setActive('residents')}
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Icon name="users" size={16} /> Ewidencja pokoi
            </button>
          </div>
        </div>
        <div className="date-card">
          <span>{currentDayName}</span>
          <strong>{currentDayNum}</strong>
          <small>{currentMonthName} CZASU</small>
        </div>
      </section>

      {/* Hero Stats Row (4 cards from admin_aka_copy) */}
      <section className="admin-stats-grid">
        <article className="stat-card">
          <small>MIESZKAŃCY</small>
          <strong>412</strong>
          <span>86% obłożenia akademika</span>
        </article>

        <article className="stat-card accent">
          <small>OTWARTE USTERKI</small>
          <strong>{openTicketsCount}</strong>
          <span>3 wymagają pilnej uwagi technika</span>
        </article>

        <article className="stat-card">
          <small>DZIŚ REZERWACJI</small>
          <strong>38</strong>
          <span>Pralnie, suszarki oraz boisko</span>
        </article>

        <article className="stat-card">
          <small>NOWE WNIOSKI</small>
          <strong>27</strong>
          <span>Wymaga weryfikacji kierownika</span>
        </article>
      </section>

      {/* Priority issues & Quick actions columns */}
      <div className="dashboard-grid">
        {/* Priority issues panel */}
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PRIORYTETOWE</p>
              <h3>Usterki do obsługi</h3>
            </div>
            <button onClick={() => setActive('maintenance')}>
              Zobacz wszystkie <Icon name="arrow" size={14} />
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#8291a2', fontSize: '12px' }}>Ładowanie zgłoszeń...</p>
          ) : urgentTickets.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
              Brak pilnych usterek wymagających natychmiastowej interwencji.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {urgentTickets.map((t) => (
                <div
                  key={t.id}
                  className="reservation-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActive('maintenance')}
                >
                  <div className="reservation-icon orange">
                    <Icon name="tool" size={20} />
                  </div>
                  <div className="reservation-info">
                    <strong>{t.title}</strong>
                    <span>Pokój {t.roomNumber} · {t.author}</span>
                  </div>
                  <div className="reservation-time">
                    <span className={`tag ${t.priority === 'Pilny' ? 'tag-danger' : 'tag-warning'}`}>
                      {t.priority}
                    </span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick building actions panel */}
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SZYBKIE DZIAŁANIA</p>
              <h3>Zarządzaj budynkiem</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="quick-action-btn"
              onClick={() => setActive('residents')}
            >
              <div className="quick-action-icon">
                <Icon name="users" size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <strong>Znajdź mieszkańca</strong>
                <small>Wyszukaj po nazwisku lub numerze pokoju</small>
              </div>
              <Icon name="arrow" size={18} />
            </button>

            <button
              className="quick-action-btn"
              onClick={() => setActive('notices')}
            >
              <div className="quick-action-icon peach">
                <Icon name="megaphone" size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <strong>Wyślij komunikat grupowy</strong>
                <small>Do całego budynku, piętra lub grupy lokatorów</small>
              </div>
              <Icon name="arrow" size={18} />
            </button>

            <button
              className="quick-action-btn"
              onClick={() => setActive('laundry')}
            >
              <div className="quick-action-icon blue">
                <Icon name="laundry" size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <strong>Grafik rezerwacji pralni</strong>
                <small>Podgląd obłożenia maszyn i blokowanie terminów</small>
              </div>
              <Icon name="arrow" size={18} />
            </button>

            <button
              className="quick-action-btn"
              onClick={() => setActive('applications')}
            >
              <div className="quick-action-icon mint">
                <Icon name="file" size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <strong>Weryfikacja podań i wniosków</strong>
                <small>Akceptacja zgłoszeń noclegów i wymiany sprzętu</small>
              </div>
              <Icon name="arrow" size={18} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
