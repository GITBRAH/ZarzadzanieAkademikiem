import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { FacilityStatus, Reservation } from '../types';
import { api } from '../services/api';

interface BookingPageProps {
  type: 'laundry' | 'court';
}

const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

export function BookingPage({ type }: BookingPageProps) {
  const isLaundry = type === 'laundry';
  const apiType = isLaundry ? 'Laundry' : 'Court';

  // Generate 5 days starting from today
  const [dates, setDates] = useState<{ label: string; dateStr: string; day: string }[]>([]);
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);

  const [facilities, setFacilities] = useState<FacilityStatus[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // My reservations modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const list = [];
    const dayNames = ['Nd', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = i === 0 ? 'Dziś' : dayNames[d.getDay()];
      const dayNum = d.getDate();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const dateStr = `${year}-${month}-${String(dayNum).padStart(2, '0')}`;
      list.push({
        label: dayName,
        day: String(dayNum),
        dateStr
      });
    }
    setDates(list);
  }, []);

  const activeDate = dates[selectedDateIdx]?.dateStr || '';

  const loadFacilities = async () => {
    if (!activeDate) return;
    try {
      setLoading(true);
      const data = await api.getFacilities(apiType, activeDate);
      setFacilities(data);
      if (data.length > 0 && !selectedFacilityId) {
        setSelectedFacilityId(data[0].id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, [type, activeDate]);

  const loadMyReservations = async () => {
    try {
      const data = await api.getMyReservations();
      setMyReservations(data.filter((r) => r.facilityType === apiType && r.status === 'Confirmed'));
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleOpenMyReservations = () => {
    loadMyReservations();
    setIsModalOpen(true);
  };

  const handleCancelBooking = async (id: number) => {
    try {
      await api.cancelReservation(id);
      loadMyReservations();
      loadFacilities();
    } catch (err: any) {
      alert(err.message || 'Nie udało się anulować');
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedFacilityId || !selectedSlot) {
      alert('Proszę wybrać obiekt oraz wolną godzinę.');
      return;
    }

    try {
      setBookingInProgress(true);
      setFeedback(null);
      await api.createReservation(selectedFacilityId, activeDate, selectedSlot);
      setFeedback({
        type: 'success',
        message: `Pomyślnie zarezerwowano termin ${selectedSlot} na dzień ${activeDate}!`
      });
      setSelectedSlot(null);
      await loadFacilities();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Błąd rezerwacji'
      });
    } finally {
      setBookingInProgress(false);
    }
  };

  const currentFacility = facilities.find((f) => f.id === selectedFacilityId) || facilities[0];

  return (
    <main className="page booking-page">
      <div className="booking-intro">
        <div>
          <p className="eyebrow">REZERWACJE</p>
          <h2>{isLaundry ? 'Znajdź wolne urządzenie' : 'Wybierz godzinę gry'}</h2>
          <p>Wybierz dostępny termin, aby utworzyć nową rezerwację.</p>
        </div>
        <button className="primary-button" onClick={handleOpenMyReservations}>
          <Icon name="calendar" size={18} /> Moje rezerwacje
        </button>
      </div>

      {feedback && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 500,
            color: feedback.type === 'success' ? '#14532d' : '#991b1b',
            background: feedback.type === 'success' ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Date Switcher */}
      <div className="date-switcher">
        <button
          aria-label="Poprzedni dzień"
          disabled={selectedDateIdx === 0}
          onClick={() => setSelectedDateIdx((prev) => Math.max(0, prev - 1))}
        >
          <Icon name="arrow" size={18} />
        </button>

        {dates.map((d, i) => (
          <button
            key={d.dateStr}
            className={selectedDateIdx === i ? 'active' : ''}
            onClick={() => {
              setSelectedDateIdx(i);
              setSelectedSlot(null);
            }}
          >
            <small>{d.label}</small>
            <strong>{d.day}</strong>
          </button>
        ))}

        <button
          className="next"
          aria-label="Następny dzień"
          disabled={selectedDateIdx === dates.length - 1}
          onClick={() => setSelectedDateIdx((prev) => Math.min(dates.length - 1, prev + 1))}
        >
          <Icon name="chevron" size={18} />
        </button>
      </div>

      {/* Schedule Panel */}
      <section className="schedule-panel">
        <div className="places">
          <p className="table-label">{isLaundry ? 'LOKALIZACJA I URZĄDZENIE' : 'OBIEKT SPORTOWY'}</p>
          {loading && facilities.length === 0 ? (
            <p style={{ fontSize: '11px', color: '#7a8b9f', padding: '10px' }}>Ładowanie obiektów...</p>
          ) : (
            facilities.map((fac) => {
              const freeCount = timeSlots.filter((slot) => !fac.busySlots.includes(slot)).length;
              const isActive = (selectedFacilityId || facilities[0]?.id) === fac.id;
              return (
                <button
                  key={fac.id}
                  className={isActive ? 'active' : ''}
                  onClick={() => {
                    setSelectedFacilityId(fac.id);
                    setSelectedSlot(null);
                  }}
                >
                  <span className={`place-icon ${isLaundry ? 'blue' : 'mint'}`}>
                    <Icon name={isLaundry ? 'laundry' : 'court'} size={19} />
                  </span>
                  <span>
                    <strong>{fac.name}</strong>
                    <small>
                      <i /> {fac.location} · Wolne: {freeCount}
                    </small>
                  </span>
                  <Icon name="chevron" size={15} />
                </button>
              );
            })
          )}
        </div>

        <div className="time-grid">
          <div className="time-head">
            <span style={{ textAlign: 'left', paddingLeft: '8px' }}>URZĄDZENIE</span>
            {timeSlots.map((time) => (
              <span key={time}>{time}</span>
            ))}
          </div>

          {facilities.map((fac) => (
            <div className="time-row" key={fac.id}>
              <strong>{fac.name}</strong>
              {timeSlots.map((time) => {
                const isBusy = fac.busySlots.includes(time);
                const isSelected = selectedFacilityId === fac.id && selectedSlot === time;

                return (
                  <button
                    key={time}
                    aria-label={`Termin o ${time} na ${fac.name}`}
                    className={isSelected ? 'selected' : isBusy ? 'busy' : 'free'}
                    disabled={isBusy}
                    onClick={() => {
                      setSelectedFacilityId(fac.id);
                      setSelectedSlot(time);
                    }}
                  >
                    {isSelected && <Icon name="check" size={17} />}
                  </button>
                );
              })}
            </div>
          ))}

          <div className="legend">
            <span>
              <i className="free" /> Dostępne
            </span>
            <span>
              <i className="selected" /> Wybrane
            </span>
            <span>
              <i className="busy" /> Niedostępne / Zajęte
            </span>
          </div>
        </div>
      </section>

      {/* Selection Bar */}
      <div className="selection-bar">
        <div>
          <span className="selection-icon">
            <Icon name={isLaundry ? 'laundry' : 'court'} size={20} />
          </span>
          <div>
            <small>TWÓJ WYBÓR</small>
            <strong>
              {currentFacility ? currentFacility.name : 'Wybierz obiekt'} ·{' '}
              {selectedSlot ? `Godzina ${selectedSlot}` : 'Wybierz wolną godzinę'} ({activeDate})
            </strong>
          </div>
        </div>

        <button
          disabled={!selectedSlot || bookingInProgress}
          onClick={handleConfirmReservation}
          style={{ opacity: !selectedSlot ? 0.6 : 1 }}
        >
          {bookingInProgress ? 'Przetwarzanie...' : 'Potwierdź rezerwację'}{' '}
          <Icon name="chevron" size={17} />
        </button>
      </div>

      {/* Modal Moje Rezerwacje */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isLaundry ? 'Moje rezerwacje pralni' : 'Moje rezerwacje boisk'}
      >
        {myReservations.length === 0 ? (
          <p style={{ color: '#7a8b9f', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
            Nie masz obecnie aktywnych rezerwacji w tej kategorii.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myReservations.map((res) => (
              <div
                key={res.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #e1e8ee',
                  background: '#f8fafc'
                }}
              >
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#14243a' }}>
                    {res.facilityName}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {res.facilityLocation} · {res.date} o {res.timeSlot} (60 min)
                  </span>
                </div>
                <button
                  onClick={() => handleCancelBooking(res.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    border: '1px solid #fecaca',
                    background: '#fff1f2',
                    color: '#e11d48',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Anuluj
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </main>
  );
}
