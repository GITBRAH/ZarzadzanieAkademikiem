import { useEffect, useState } from 'react';
import { Icon, IconName } from '../components/Icon';
import { Reservation, Announcement, User } from '../types';
import { api } from '../services/api';

interface DashboardProps {
  user: User;
  setActive: (id: string) => void;
}

function ActionCard({
  icon,
  title,
  text,
  tint,
  onClick
}: {
  icon: IconName;
  title: string;
  text: string;
  tint: string;
  onClick: () => void;
}) {
  return (
    <button className="action-card" onClick={onClick}>
      <span className={`action-icon ${tint}`}>
        <Icon name={icon} size={24} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <span className="action-arrow">
        <Icon name="chevron" size={18} />
      </span>
    </button>
  );
}

export function DashboardPage({ user, setActive }: DashboardProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user.fullName.split(' ')[0] || 'Użytkowniku';

  // Format today's date for display
  const now = new Date();
  const dayNames = ['ND', 'PN', 'WT', 'ŚR', 'CZW', 'PT', 'SOB'];
  const monthNames = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'];
  const currentDayName = dayNames[now.getDay()];
  const currentDayNum = now.getDate();
  const currentMonthName = monthNames[now.getMonth()];

  const loadData = async () => {
    try {
      setLoading(true);
      const [resData, annData] = await Promise.all([
        api.getMyReservations().catch(() => []),
        api.getAnnouncements().catch(() => [])
      ]);
      setReservations(resData.filter((r) => r.status === 'Confirmed').slice(0, 3));
      setAnnouncements(annData.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelReservation = async (id: number) => {
    if (!window.confirm('Czy na pewno chcesz anulować tę rezerwację?')) return;
    try {
      await api.cancelReservation(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Błąd podczas anulowania');
    }
  };

  return (
    <main className="page">
      <section className="welcome">
        <div>
          <span className="status-pill">
            <i /> Wszystkie systemy działają prawidłowo
          </span>
          <h2>
            Twój akademik,
            <br />
            <em>wszystko w jednym miejscu.</em>
          </h2>
          <p>Zarządzaj rezerwacjami, bądź na bieżąco i korzystaj ze wsparcia.</p>
        </div>
        <div className="date-card">
          <span>{currentDayName}</span>
          <strong>{currentDayNum}</strong>
          <small>{currentMonthName} CZASU</small>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">SZYBKI DOSTĘP</p>
            <h3>W czym możemy pomóc?</h3>
          </div>
        </div>
        <div className="action-grid">
          <ActionCard
            icon="laundry"
            title="Zarezerwuj pralkę"
            text="Dostępne urządzenia w Budynkach A, B, C"
            tint="blue"
            onClick={() => setActive('laundry')}
          />
          <ActionCard
            icon="court"
            title="Zarezerwuj boisko"
            text="Centrum sportowe i rekreacji"
            tint="mint"
            onClick={() => setActive('court')}
          />
          <ActionCard
            icon="tool"
            title="Zgłoś usterkę"
            text="Odpowiadamy zwykle w godzinę"
            tint="orange"
            onClick={() => setActive('maintenance')}
          />
          <ActionCard
            icon="file"
            title="Złóż wniosek"
            text="Podania, goście, meldunki"
            tint="violet"
            onClick={() => setActive('applications')}
          />
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel reservations">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TWÓJ HARMONOGRAM</p>
              <h3>Nadchodzące rezerwacje</h3>
            </div>
            <button onClick={() => setActive('laundry')}>Zobacz wszystkie</button>
          </div>

          {loading ? (
            <p style={{ color: '#8291a2', fontSize: '13px', padding: '15px 0' }}>Ładowanie rezerwacji...</p>
          ) : reservations.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', color: '#7a8b9f', fontSize: '12px' }}>
              <p>Brak zaplanowanych rezerwacji na najbliższe dni.</p>
              <button
                className="primary-button"
                style={{ margin: '10px auto 0', height: '34px', fontSize: '10px' }}
                onClick={() => setActive('laundry')}
              >
                Zarezerwuj teraz
              </button>
            </div>
          ) : (
            reservations.map((res) => {
              const isLaundry = res.facilityType === 'Laundry';
              return (
                <div className="reservation-card" key={res.id}>
                  <div className={`reservation-icon ${isLaundry ? 'blue' : 'mint'}`}>
                    <Icon name={isLaundry ? 'laundry' : 'court'} size={21} />
                  </div>
                  <div className="reservation-info">
                    <strong>{res.facilityName}</strong>
                    <span>{res.facilityLocation}</span>
                  </div>
                  <div className="reservation-time">
                    <strong>{res.timeSlot}</strong>
                    <span>{res.date} · {res.durationMinutes} min</span>
                  </div>
                  <div style={{ gridColumn: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="confirmed">
                      <Icon name="check" size={13} /> Potwierdzona
                    </span>
                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#d66c5d',
                        fontSize: '9px',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>

        <section className="panel notices">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NAJNOWSZE INFORMACJE</p>
              <h3>Tablica ogłoszeń</h3>
            </div>
            <button onClick={() => setActive('notices')}>Zobacz wszystkie</button>
          </div>

          {loading ? (
            <p style={{ color: '#8291a2', fontSize: '13px', padding: '15px 0' }}>Ładowanie ogłoszeń...</p>
          ) : announcements.length === 0 ? (
            <p style={{ color: '#8291a2', fontSize: '12px', padding: '15px 0' }}>Brak nowych ogłoszeń.</p>
          ) : (
            announcements.map((notice) => (
              <article className="notice" key={notice.id}>
                <span className={`notice-date ${notice.priority === 'coral' ? 'coral' : ''}`}>
                  <b>{notice.dayBadge}</b>
                  {notice.monthBadge}
                </span>
                <div>
                  <strong>{notice.title}</strong>
                  <p>{notice.content}</p>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
