import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { ApplicationRequest, User } from '../types';
import { api } from '../services/api';

interface ApplicationsPageProps {
  user: User;
}

export function ApplicationsPage({ user }: ApplicationsPageProps) {
  const [applications, setApplications] = useState<ApplicationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // Form
  const [type, setType] = useState('Zmiana pokoju');
  const [title, setTitle] = useState('');
  const [justification, setJustification] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Admin Modal
  const [selectedApp, setSelectedApp] = useState<ApplicationRequest | null>(null);
  const [adminStatus, setAdminStatus] = useState('Zaakceptowane');
  const [adminComment, setAdminComment] = useState('');

  const isAdmin = user.role === 'Admin';

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getApplications();
      setApplications(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !justification) {
      alert('Proszę wypełnić wszystkie pola formularza.');
      return;
    }

    try {
      setSubmitting(true);
      await api.createApplication({ type, title, justification });
      setTitle('');
      setJustification('');
      setIsModalOpen(false);
      await loadApplications();
      alert('Wniosek został pomyślnie złożony!');
    } catch (err: any) {
      alert(err.message || 'Błąd przy składaniu wniosku');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await api.updateApplicationStatus(selectedApp.id, adminStatus, adminComment);
      setSelectedApp(null);
      await loadApplications();
      alert('Status wniosku został zaktualizowany.');
    } catch (err: any) {
      alert(err.message || 'Nie udało się zaktualizować wniosku');
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'Oczekujące').length;
  const acceptedCount = applications.filter((a) => a.status === 'Zaakceptowane').length;
  const rejectedCount = applications.filter((a) => a.status === 'Odrzucone').length;

  const filteredApps = applications.filter((a) => {
    if (statusFilter === 'pending') return a.status === 'Oczekujące';
    if (statusFilter === 'accepted') return a.status === 'Zaakceptowane';
    if (statusFilter === 'rejected') return a.status === 'Odrzucone';
    return true;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Zaakceptowane':
        return 'tag-success';
      case 'Odrzucone':
        return 'tag-danger';
      default:
        return 'tag-warning';
    }
  };

  return (
    <main className="page">
      <div className="booking-intro">
        <div>
          <p className="eyebrow">{isAdmin ? 'OBIEG DOKUMENTÓW' : 'SPRAWY FORMALNE'}</p>
          <h2>{isAdmin ? 'Podania i wnioski mieszkańców' : 'Podania i wnioski online'}</h2>
          <p>
            {isAdmin
              ? 'Weryfikacja elektronicznych wniosków o zameldowanie gości, wymianę sprzętu i zmiany pokoi.'
              : 'Wygodny obieg dokumentów bez konieczności wizyty w biurze administracji.'}
          </p>
        </div>

        <button className="primary-button" onClick={() => setIsModalOpen(true)}>
          <Icon name="plus" size={17} /> Złóż nowy wniosek
        </button>
      </div>

      {/* Stats Cards */}
      <section className="admin-stats-grid">
        <article className="stat-card">
          <small>WSZYSTKIE WNIOSKI</small>
          <strong>{applications.length}</strong>
          <span>W bieżącym semestrze</span>
        </article>

        <article className="stat-card accent">
          <small>DO ROZPATRZENIA</small>
          <strong>{pendingCount}</strong>
          <span>Oczekują na decyzję kierownika</span>
        </article>

        <article className="stat-card">
          <small>ZAAKCEPTOWANE</small>
          <strong>{acceptedCount}</strong>
          <span>Wydano zgodę</span>
        </article>

        <article className="stat-card">
          <small>ODRZUCONE</small>
          <strong>{rejectedCount}</strong>
          <span>Wymagają uzupełnienia</span>
        </article>
      </section>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          Wszystkie ({applications.length})
        </button>
        <button
          className={`tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter('pending')}
        >
          Oczekujące ({pendingCount})
        </button>
        <button
          className={`tab-btn ${statusFilter === 'accepted' ? 'active' : ''}`}
          onClick={() => setStatusFilter('accepted')}
        >
          Zaakceptowane ({acceptedCount})
        </button>
        <button
          className={`tab-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => setStatusFilter('rejected')}
        >
          Odrzucone ({rejectedCount})
        </button>
      </div>

      {/* Table */}
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">REJESTR PODAŃ</p>
            <h3>Złożone wnioski i decyzje</h3>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#8291a2', fontSize: '13px', padding: '20px 0' }}>Ładowanie podań...</p>
        ) : filteredApps.length === 0 ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: '#7a8b9f', fontSize: '12px' }}>
            <p>Brak podań w wybranej kategorii.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>TYP WNIOSKU</th>
                  <th>TYTUŁ I UZASADNIENIE</th>
                  <th>WNIOSKODAWCA</th>
                  <th>STATUS</th>
                  <th>DATA ZŁOŻENIA</th>
                  {isAdmin && <th>DECYZJA ZARZĄDCY</th>}
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span className="category-chip blue">{app.type}</span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '12px' }}>{app.title}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#64748b', maxWidth: '340px' }}>
                        {app.justification}
                      </p>
                      {app.adminComment && (
                        <div className="admin-response-box">
                          <strong>Uzasadnienie administracji:</strong> {app.adminComment}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{app.applicant}</span>
                    </td>
                    <td>
                      <span className={`tag ${getStatusClass(app.status)}`}>{app.status}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString('pl-PL') : 'Dzisiaj'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <button
                          className="action-btn-small"
                          onClick={() => {
                            setSelectedApp(app);
                            setAdminStatus(app.status);
                            setAdminComment(app.adminComment || '');
                          }}
                        >
                          Rozpatrz wniosek
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

      {/* Modal Złóż wniosek */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Złóż nowy wniosek do administracji">
        <form onSubmit={handleSubmitApplication} className="modal-form">
          <div className="form-group">
            <label>Rodzaj podania</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Zmiana pokoju">Wniosek o zmianę pokoju</option>
              <option value="Goście">Zgłoszenie noclegu gościa</option>
              <option value="Przedłużenie">Przedłużenie okresu zakwaterowania</option>
              <option value="Inwentarz">Wymiana / pobranie wyposażenia</option>
              <option value="Wymeldowanie">Zgłoszenie wcześniejszego wymeldowania</option>
              <option value="Inne">Inna sprawa formalna</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tytuł wniosku</label>
            <input
              type="text"
              placeholder="np. Zgłoszenie noclegu gościa na weekend"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Uzasadnienie wniosku</label>
            <textarea
              rows={4}
              placeholder="Podaj szczegóły (daty pobytu gościa, powód zmiany pokoju itp.)..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
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
              {submitting ? 'Przesyłanie...' : 'Złóż wniosek'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Decyzja Admina */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Rozpatrywanie wniosku: ${selectedApp.title}`}
        >
          <form onSubmit={handleUpdateStatus} className="modal-form">
            <div>
              <strong style={{ fontSize: '13px' }}>{selectedApp.title}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b' }}>
                Wnioskodawca: {selectedApp.applicant} · Typ: {selectedApp.type}
              </p>
              <div style={{ marginTop: '8px', padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '11px', color: '#334155' }}>
                <strong>Treść:</strong> {selectedApp.justification}
              </div>
            </div>

            <div className="form-group">
              <label>Decyzja kierownika</label>
              <select value={adminStatus} onChange={(e) => setAdminStatus(e.target.value)}>
                <option value="Zaakceptowane">Zaakceptowane (Zgoda udzielona)</option>
                <option value="Odrzucone">Odrzucone (Brak możliwości realizacji)</option>
                <option value="Oczekujące">Wstrzymane (Do ponownego rozpatrzenia)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Uzasadnienie decyzji dla studenta</label>
              <textarea
                rows={3}
                placeholder="np. Wyrażam zgodę na nocleg w dniach 2-4 listopada pod warunkiem zgłoszenia w recepcji."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSelectedApp(null)}
              >
                Anuluj
              </button>
              <button type="submit" className="primary-button">
                Zapisz decyzję
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
}
