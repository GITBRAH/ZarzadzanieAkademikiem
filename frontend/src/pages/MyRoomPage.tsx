import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { RoomDetails, User } from '../types';
import { api } from '../services/api';

interface MyRoomPageProps {
  user: User;
  setActive: (id: string) => void;
}

export function MyRoomPage({ user, setActive }: MyRoomPageProps) {
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getMyRoom();
        setRoom(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="page">
      <div className="booking-intro">
        <div>
          <p className="eyebrow">ZAKWATEROWANIE I MELDUNEK</p>
          <h2>Pokój {room?.roomNumber || user.roomNumber || '202B'}</h2>
          <p>
            {room?.building || user.building || 'Budynek B'} · Piętro {room?.floor || 2} · Segment
            mieszkalny
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="secondary-button" onClick={() => setActive('maintenance')}>
            <Icon name="tool" size={16} /> Zgłoś usterkę
          </button>
          <button className="primary-button" onClick={() => setActive('applications')}>
            <Icon name="file" size={16} /> Wniosek o zmianę
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#7a8b9f', fontSize: '13px' }}>Ładowanie danych pokoju...</p>
      ) : (
        <>
          {/* Quick Metrics */}
          <div className="action-grid" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <small>OPŁATA MIESIĘCZNA</small>
              <strong style={{ color: '#0c477e' }}>{room?.monthlyRent || 650} PLN</strong>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>● Opłacone na bieżący miesiąc</span>
            </div>

            <div className="stat-card">
              <small>STATUS KAUCJI</small>
              <strong>{room?.deposit || 1000} PLN</strong>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>● Kaucja zdeponowana</span>
            </div>

            <div className="stat-card">
              <small>ZAJĘTOŚĆ POKOJU</small>
              <strong>
                {room?.currentOccupancy || 2} / {room?.capacity || 2} osoby
              </strong>
              <span>Pokój 2-osobowy z łazienką</span>
            </div>

            <div className="stat-card">
              <small>CISZA NOCNA</small>
              <strong>22:00 - 06:00</strong>
              <span>Goście do godz. 22:00</span>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Left Panel: Roommates & Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <section className="panel">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">MIESZKAŃCY</p>
                    <h3>Współlokatorzy w pokoju</h3>
                  </div>
                </div>

                {/* You */}
                <div className="roommate-card">
                  <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '12px' }}>
                    {user.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px' }}>{user.fullName} (Ty)</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {user.email} · {user.phoneNumber || '+48 600 123 456'}
                    </span>
                  </div>
                  <span className="tag tag-info" style={{ marginLeft: 'auto' }}>
                    Mieszkaniec
                  </span>
                </div>

                {/* Other Roommates */}
                {room?.roommates && room.roommates.length > 0 ? (
                  room.roommates.map((mate) => (
                    <div className="roommate-card" key={mate.id}>
                      <div
                        className="avatar"
                        style={{
                          width: '40px',
                          height: '40px',
                          fontSize: '12px',
                          background: 'linear-gradient(145deg, #10b981, #059669)'
                        }}
                      >
                        {mate.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong style={{ fontSize: '13px' }}>{mate.fullName}</strong>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {mate.email} · {mate.phoneNumber || '+48 501 234 567'}
                        </span>
                      </div>
                      <span className="tag tag-info" style={{ marginLeft: 'auto' }}>
                        Współlokator
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
                    Brak innych zarejestrowanych współlokatorów w tym pokoju.
                  </p>
                )}
              </section>

              <section className="panel">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">WYPOSAŻENIE</p>
                    <h3>Protokół zdawczo-odbiorczy wyposażenia</h3>
                  </div>
                </div>
                <ul className="inventory-list">
                  <li>
                    <Icon name="check" size={15} /> 2x Łóżko ze stelażem i materacem sprężynowym
                  </li>
                  <li>
                    <Icon name="check" size={15} /> 2x Biurko do nauki + fotel ergonomiczny
                  </li>
                  <li>
                    <Icon name="check" size={15} /> 2x Szafa ubraniowa dwudrzwiowa
                  </li>
                  <li>
                    <Icon name="check" size={15} /> 1x Lodówka podblatowa z zamrażalnikiem
                  </li>
                  <li>
                    <Icon name="check" size={15} /> 1x Łazienka prywatna (kabina prysznicowa, WC, umywalka)
                  </li>
                  <li>
                    <Icon name="check" size={15} /> Zestaw kluczy i karta dostępowa RFID
                  </li>
                </ul>
              </section>
            </div>

            {/* Right Panel: Payments & Rules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <section className="panel">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">ROZLICZENIA</p>
                    <h3>Historia płatności</h3>
                  </div>
                </div>
                <div className="payment-row">
                  <div>
                    <strong>Czynsz za bieżący miesiąc</strong>
                    <small>Termin: 10 każdego miesiąca</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>650,00 PLN</strong>
                    <span className="tag tag-success">Opłacono</span>
                  </div>
                </div>
                <div className="payment-row">
                  <div>
                    <strong>Kaucja gwarancyjna</strong>
                    <small>Wpłacona przy zakwaterowaniu</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>1000,00 PLN</strong>
                    <span className="tag tag-success">Zdeponowano</span>
                  </div>
                </div>
                <div className="payment-info-box">
                  <p>
                    Wszelkie wpłaty prosimy kierować na indywidualny rachunek bankowy podany w umowie
                    mieszkaniowej z dopiskiem: <em>„Czynsz [Miesiąc] - Pokój 202B”</em>.
                  </p>
                </div>
              </section>

              <section className="panel">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">REGULAMIN</p>
                    <h3>Ważne zasady akademika</h3>
                  </div>
                </div>
                <div className="rules-box">
                  <p>
                    <strong>Cisza nocna:</strong> Obowiązuje od 22:00 do 6:00 rano.
                  </p>
                  <p>
                    <strong>Odwiedziny gości:</strong> Osoby spoza akademika mogą przebywać do godz.
                    22:00. Nocleg wymaga wcześniejszego zgłoszenia w zakładce <em>Podania</em>.
                  </p>
                  <p>
                    <strong>Segregacja odpadów:</strong> Punkty selektywnej zbiórki znajdują się na
                    każdym półpiętrze.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
