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
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'progress' | 'resolved'>('all');

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

  const isAdmin = user.role === 'Admin';

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
      alert('Usterka została pomyślnie zgłoszona!');
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

  // Export report to CSV
  const handleExportReport = () => {
    const headers = ['ID', 'Nr sprawy', 'Pokój', 'Zgłaszający', 'Tytuł', 'Kategoria', 'Priorytet', 'Status', 'Data', 'Odpowiedź'];
    const rows = tickets.map((t) => [
      t.id,
      t.ticketNumber || `#0${t.id}`,
      t.roomNumber,
      `"${t.author}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.status,
      t.createdAt ? new Date(t.createdAt).toLocaleDateString('pl-PL') : '',
      `"${(t.adminResponse || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Raport_Usterek_AKAnet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openCount = tickets.filter((t) => t.status === 'Nowe').length;
  const inProgressCount = tickets.filter((t) => t.status === 'W trakcie').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Rozwiązane').length;

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === 'new') return t.status === 'Nowe';
    if (statusFilter === 'progress') return t.status === 'W trakcie';
    if (statusFilter === 'resolved') return t.status === 'Rozwiązane';
    return true;
  });

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
          <p className="eyebrow">{isAdmin ? 'CENTRUM NAPRAW I TECHNIKI' : 'ZGŁASZANIE AWARII'}</p>
          <h2>{isAdmin ? 'Usterki i prace naprawcze' : 'Usterki w pokoju i akademiku'}</h2>
          <p>
            {isAdmin
              ? 'Priorytetyzuj zgłoszenia, przydzielaj je technikom i informuj mieszkańców o postępach.'
              : 'Zgłoś problem techniczny do konserwatora akademika. Odpowiadamy zwykle w ciągu 1-2 godzin.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isAdmin && (
            <button className="secondary-button" onClick={handleExportReport} title="Pobierz raport w formacie CSV">
              <Icon name="download" size={16} /> Eksportuj raport
            </button>
          )}

          <button className="primary-button" onClick={() => setIsModalOpen(true)}>
            <Icon name="plus" size={17} /> Zgłoś nową usterkę
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="admin-stats-grid">
        <article className="stat-card">
          <small>WSZYSTKIE SPRAWY</small>
          <strong>{tickets.length}</strong>
          <span>W ewidencji systemu</span>
        </article>

        <article className="stat-card accent">
          <small>NOWE ZGŁOSZENIA</small>
          <strong>{openCount}</strong>
          <span>Oczekują na weryfikację</span>
        </article>

        <article className="stat-card">
          <small>W REALIZACJI</small>
          <strong>{inProgressCount}</strong>
          <span>Konserwator w toku prac</span>
        </article>

        <article className="stat-card">
          <small>ROZWIĄZANE</small>
          <strong>{resolvedCount}</strong>
          <span>Zakończone pomyślnie</span>
        </article>
      </section>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          Wszystkie ({tickets.length})
        </button>
        <button
          className={`tab-btn ${statusFilter === 'new' ? 'active' : ''}`}
          onClick={() => setStatusFilter('new')}
        >
          Otwarte / Nowe ({openCount})
        </button>
        <button
          className={`tab-btn ${statusFilter === 'progress' ? 'active' : ''}`}
          onClick={() => setStatusFilter('progress')}
        >
          W realizacji ({inProgressCount})
        </button>
        <button
          className={`tab-btn ${statusFilter === 'resolved' ? 'active' : ''}`}
          onClick={() => setStatusFilter('resolved')}
        >
          Rozwiązane ({resolvedCount})
        </button>
      </div>

      {/* Ticket Table */}
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">REJESTR ZGŁOSZEŃ</p>
            <h3>Lista awarii i stan realizacji</h3>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#8291a2', fontSize: '13px', padding: '20px 0' }}>Ładowanie usterek...</p>
        ) : filteredTickets.length === 0 ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: '#7a8b9f', fontSize: '12px' }}>
            <p>Brak zgłoszeń w wybranej kategorii.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>NR SPRAWY</th>
                  <th>POKÓJ / MIEJSCE</th>
                  <th>TYTUŁ I OPIS</th>
                  <th>KATEGORIA</th>
                  <th>PRIORYTET</th>
                  <th>STATUS</th>
                  <th>ZGŁOSZONO</th>
                  {isAdmin && <th>AKCJA ZARZĄDCY</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong style={{ fontSize: '12px', color: '#64748b' }}>
                        {t.ticketNumber || `#0${t.id}`}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ fontSize: '12px' }}>Pokój {t.roomNumber}</strong>
                      <span style={{ display: 'block', fontSize: '9px', color: '#64748b' }}>
                        {t.author}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '12px' }}>{t.title}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#64748b', maxWidth: '300px' }}>
                        {t.description}
                      </p>
                      {t.adminResponse && (
                        <div className="admin-response-box">
                          <strong>Odpowiedź technika:</strong> {t.adminResponse}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="category-chip">{t.category}</span>
                    </td>
                    <td>
                      <span className={`priority-indicator ${getPriorityClass(t.priority)}`}>
                        ● {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`tag ${getStatusClass(t.status)}`}>{t.status}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString('pl-PL') : 'Dzisiaj'}
                      </span>
                    </td>
                    {isAdmin && (
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

      {/* Modal Zgłoszenia Usterki */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Zgłoś nową usterkę">
        <form onSubmit={handleSubmitTicket} className="modal-form">
          <div className="form-group">
            <label>Krótki tytuł problemu</label>
            <input
              type="text"
              placeholder="np. Brak ciepłej wody w łazience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Kategoria usterki</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Hydraulika">Hydraulika / Woda</option>
                <option value="Elektryka">Elektryka / Oświetlenie</option>
                <option value="Meble">Meble / Wyposażenie</option>
                <option value="Stolarka">Stolarka drzwiowa i okienna</option>
                <option value="Internet">Internet / Sieć LAN</option>
                <option value="Inne">Inne zgłoszenie</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priorytet naprawy</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Niski">Niski (standardowy przegląd)</option>
                <option value="Średni">Średni (zalecana naprawa)</option>
                <option value="Wysoki">Wysoki (utrudnia funkcjonowanie)</option>
                <option value="Pilny">Pilny (awaria, zagrożenie zalaniem)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Szczegółowy opis problemu</label>
            <textarea
              rows={4}
              placeholder="Opisz dokładnie, co nie działa i kiedy usterka wystąpiła..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Anuluj
            </button>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Zarządzanie Usterką (Admin) */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Zarządzanie usterką: ${selectedTicket.ticketNumber || `#0${selectedTicket.id}`}`}
        >
          <form onSubmit={handleUpdateStatus} className="modal-form">
            <div>
              <strong style={{ fontSize: '13px' }}>{selectedTicket.title}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b' }}>
                Pokój {selectedTicket.roomNumber} · Zgłaszający: {selectedTicket.author}
              </p>
            </div>

            <div className="form-group">
              <label>Zmień status zgłoszenia</label>
              <select value={adminStatus} onChange={(e) => setAdminStatus(e.target.value)}>
                <option value="Nowe">Nowe (w kolejce)</option>
                <option value="W trakcie">W trakcie (przydzielono konserwatorowi)</option>
                <option value="Rozwiązane">Rozwiązane (naprawa wykonana)</option>
                <option value="Odrzucone">Odrzucone (poza zakresem akademika)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Odpowiedź / notatka dla mieszkańca</label>
              <textarea
                rows={3}
                placeholder="np. Konserwator dokonał wymiany zaworu. Sprawa zamknięta."
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSelectedTicket(null)}
              >
                Anuluj
              </button>
              <button type="submit" className="primary-button">
                Zapisz zmiany
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
}
