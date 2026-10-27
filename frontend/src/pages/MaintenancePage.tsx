import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { MaintenanceTicket, User } from '../types';
import { api } from '../services/api';

interface MaintenancePageProps {
  user: User;
}

export function MaintenancePage({ user }: MaintenancePageProps) {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hydraulika');
  const [priority, setPriority] = useState('Średni');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Admin Response Modal State
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [adminStatus, setAdminStatus] = useState('W trakcie');
  const [adminResponse, setAdminResponse] = useState('');

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await api.getTickets();
      setTickets(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Proszę wypełnić wszystkie pola formularza.');
      return;
    }

    try {
      setSubmitting(true);
      await api.createTicket({ title, category, priority, description });
      setTitle('');
      setDescription('');
      setIsModalOpen(false);
      await loadTickets();
    } catch (err: any) {
      alert(err.message || 'Błąd przy zgłaszaniu usterki');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await api.updateTicketStatus(selectedTicket.id, adminStatus, adminResponse);
      setSelectedTicket(null);
      await loadTickets();
    } catch (err: any) {
      alert(err.message || 'Błąd aktualizacji statusu');
    }
  };

  const totalCount = tickets.length;
  const inProgressCount = tickets.filter((t) => t.status === 'W trakcie').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Rozwiązane').length;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Rozwiązane':
        return 'tag-success';
      case 'W trakcie':
        return 'tag-warning';
      case 'Odrzucone':
        return 'tag-danger';
      default:
        return 'tag-info';
    }
  };

  const getPriorityClass = (pri: string) => {
    switch (pri) {
      case 'Pilny':
        return 'text-red';
      case 'Wysoki':
        return 'text-orange';
      default:
        return 'text-muted';
    }
  };

  return (
    <main className="page">
      <div className="booking-intro">
        <div>
          <p className="eyebrow">ZGŁASZANIE AWARII</p>
          <h2>Usterki i prace naprawcze</h2>
          <p>Zgłoś problem techniczny w swoim pokoju lub częściach wspólnych akademika.</p>
        </div>
        <button className="primary-button" onClick={() => setIsModalOpen(true)}>
          <Icon name="plus" size={17} /> Zgłoś nową usterkę
        </button>
      </div>

      {/* Stats Cards */}
      <div className="action-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <small>WSZYSTKIE ZGŁOSZENIA</small>
          <strong>{totalCount}</strong>
          <span>Rejestr w AKAnet</span>
        </div>
        <div className="stat-card">
          <small>W TRAKCIE REALIZACJI</small>
          <strong style={{ color: '#d97706' }}>{inProgressCount}</strong>
          <span>Konserwator powiadomiony</span>
        </div>
        <div className="stat-card">
          <small>ROZWIĄZANE</small>
          <strong style={{ color: '#16a34a' }}>{resolvedCount}</strong>
          <span>Pomyślnie naprawione</span>
        </div>
        <div className="stat-card">
          <small>ŚREDNI CZAS REAKCJI</small>
          <strong style={{ color: '#2563eb' }}>~1.5 h</strong>
          <span>Dział techniczny</span>
        </div>
      </div>

      {/* Tickets List */}
      <section className="panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #edf1f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '15px' }}>Lista zgłoszeń serwisowych</h3>
          <button
            onClick={loadTickets}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#126dad', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
          >
            <Icon name="refresh" size={14} /> Odśwież
          </button>
        </div>

        {loading && tickets.length === 0 ? (
          <p style={{ padding: '30px', textAlign: 'center', color: '#7a8b9f', fontSize: '12px' }}>
            Ładowanie zgłoszeń...
          </p>
        ) : tickets.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ color: '#7a8b9f', fontSize: '13px' }}>Brak zarejestrowanych zgłoszeń.</p>
            <button
              className="primary-button"
              style={{ margin: '14px auto 0' }}
              onClick={() => setIsModalOpen(true)}
            >
              Utwórz pierwsze zgłoszenie
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>STATUS</th>
                  <th>TYTUŁ I OPIS</th>
                  <th>KATEGORIA</th>
                  <th>POKÓJ</th>
                  <th>PRIORYTET</th>
                  <th>DATA</th>
                  {user.role === 'Admin' && <th>AKCJA</th>}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className={`tag ${getStatusClass(t.status)}`}>{t.status}</span>
                    </td>
                    <td style={{ maxWidth: '320px' }}>
                      <strong style={{ display: 'block', fontSize: '12px', color: '#14243a' }}>
                        {t.title}
                      </strong>
                      <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#64748b', lineHeight: 1.35 }}>
                        {t.description}
                      </p>
                      {t.adminResponse && (
                        <div className="admin-response-box">
                          <strong>Odpowiedź administracji:</strong> {t.adminResponse}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="category-chip">{t.category}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '12px' }}>{t.roomNumber}</span>
                    </td>
                    <td>
                      <span className={`priority-indicator ${getPriorityClass(t.priority)}`}>
                        ● {t.priority}
                      </span>
                    </td>
                    <td style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(t.createdAt).toLocaleDateString('pl-PL')}
                    </td>
                    {user.role === 'Admin' && (
                      <td>
                        <button
                          className="action-btn-small"
                          onClick={() => {
                            setSelectedTicket(t);
                            setAdminStatus(t.status);
                            setAdminResponse(t.adminResponse || '');
                          }}
                        >
                          Zarządzaj
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal Nowe Zgłoszenie */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Zgłoś nową usterkę">
        <form onSubmit={handleSubmitTicket} className="modal-form">
          <div className="form-group">
            <label>Kategoria problemu</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Hydraulika">Hydraulika (cieknący kran, odpływ, toaleta)</option>
              <option value="Elektryka">Elektryka (oświetlenie, gniazdko, bezpiecznik)</option>
              <option value="Meble">Meble / Stolarka (szafa, zamek w drzwiach, rolety, okno)</option>
              <option value="Internet / Sieć">Internet / Sieć przewodowa i Wi-Fi</option>
              <option value="Sprzęt AGD">Sprzęt AGD (lodówka, kuchenka, mikrofalówka)</option>
              <option value="Inne">Inne usterki</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priorytet zgłoszenia</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Niski">Niski (drobna usterka, nie przeszkadza w codziennym życiu)</option>
              <option value="Średni">Średni (wymaga naprawy w standardowym terminie)</option>
              <option value="Wysoki">Wysoki (znaczne utrudnienie w korzystaniu z pokoju)</option>
              <option value="Pilny">Pilny / Awaria (zalanie, zwarcie, brak prądu/ogrzewania)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tytuł usterki</label>
            <input
              type="text"
              placeholder="np. Nieszczelny kran w łazience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Dokładny opis usterki</label>
            <textarea
              rows={4}
              placeholder="Opisz dokładnie na czym polega problem oraz kiedy wystąpił..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => setIsModalOpen(false)}>
              Anuluj
            </button>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Zarządzanie Usterką (Admin) */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={`Zarządzanie zgłoszeniem #${selectedTicket?.id}`}
      >
        <form onSubmit={handleUpdateStatus} className="modal-form">
          <div className="form-group">
            <label>Zmiana statusu</label>
            <select value={adminStatus} onChange={(e) => setAdminStatus(e.target.value)}>
              <option value="Nowe">Nowe</option>
              <option value="W trakcie">W trakcie realizacji</option>
              <option value="Rozwiązane">Rozwiązane / Naprawione</option>
              <option value="Odrzucone">Odrzucone</option>
            </select>
          </div>

          <div className="form-group">
            <label>Komentarz / Odpowiedź dla mieszkańca</label>
            <textarea
              rows={3}
              placeholder="np. Część zamówiona, konserwator naprawi jutro o 10:00."
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => setSelectedTicket(null)}>
              Zamknij
            </button>
            <button type="submit" className="primary-button">
              Zapisz zmiany
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
