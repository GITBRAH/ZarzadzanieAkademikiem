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

  // Form
  const [type, setType] = useState('Zmiana pokoju');
  const [title, setTitle] = useState('');
  const [justification, setJustification] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Admin Modal
  const [selectedApp, setSelectedApp] = useState<ApplicationRequest | null>(null);
  const [adminStatus, setAdminStatus] = useState('Zaakceptowane');
  const [adminComment, setAdminComment] = useState('');

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
      const res = await fetch(`/api/applications/${selectedApp.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('akanet_token')}`
        },
        body: JSON.stringify({ status: adminStatus, adminComment })
      });
      if (!res.ok) throw new Error('Błąd aktualizacji statusu wniosku');
      setSelectedApp(null);
      await loadApplications();
    } catch (err: any) {
      alert(err.message || 'Nie udało się zaktualizować wniosku');
    }
  };

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
          <p className="eyebrow">SPRAWY FORMALNE</p>
          <h2>Podania i wnioski mieszkańców</h2>
          <p>
            Elektroniczny obieg podań – wnioskuj o zmianę pokoju, zgłaszaj gości lub procedurę
            wymeldowania.
          </p>
        </div>
        <button className="primary-button" onClick={() => setIsModalOpen(true)}>
          <Icon name="plus" size={17} /> Złóż nowy wniosek
        </button>
      </div>

      <section className="panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #edf1f5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '15px' }}>Złożone dokumenty i wnioski</h3>
          <button
            onClick={loadApplications}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#126dad',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            <Icon name="refresh" size={14} /> Odśwież
          </button>
        </div>

        {loading && applications.length === 0 ? (
          <p style={{ padding: '30px', textAlign: 'center', color: '#7a8b9f', fontSize: '12px' }}>
            Ładowanie wniosków...
          </p>
        ) : applications.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ color: '#7a8b9f', fontSize: '13px' }}>Brak złożonych podań.</p>
            <button
              className="primary-button"
              style={{ margin: '14px auto 0' }}
              onClick={() => setIsModalOpen(true)}
            >
              Złóż pierwsze podanie
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>STATUS</th>
                  <th>TYP WNIOSKU</th>
                  <th>TYTUŁ I UZASADNIENIE</th>
                  <th>WNIOSKODAWCA</th>
                  <th>DATA ZŁOŻENIA</th>
                  {user.role === 'Admin' && <th>DECYZJA</th>}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span className={`tag ${getStatusClass(app.status)}`}>{app.status}</span>
                    </td>
                    <td>
                      <span className="category-chip blue">{app.type}</span>
                    </td>
                    <td style={{ maxWidth: '360px' }}>
                      <strong style={{ display: 'block', fontSize: '12px', color: '#14243a' }}>
                        {app.title}
                      </strong>
                      <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#64748b', lineHeight: 1.35 }}>
                        {app.justification}
                      </p>
                      {app.adminComment && (
                        <div className="admin-response-box">
                          <strong>Komentarz administracji:</strong> {app.adminComment}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', fontWeight: 500 }}>{app.applicant}</td>
                    <td style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(app.createdAt).toLocaleDateString('pl-PL')}
                    </td>
                    {user.role === 'Admin' && (
                      <td>
                        <button
                          className="action-btn-small"
                          onClick={() => {
                            setSelectedApp(app);
                            setAdminStatus(app.status);
                            setAdminComment(app.adminComment || '');
                          }}
                        >
                          Rozpatrz
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

      {/* Modal Nowe Podanie */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Złóż nowy wniosek">
        <form onSubmit={handleSubmitApplication} className="modal-form">
          <div className="form-group">
            <label>Rodzaj wniosku</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Zmiana pokoju">Zmiana pokoju / przeniesienie</option>
              <option value="Zgłoszenie gościa">Zgłoszenie noclegu gościa</option>
              <option value="Przedłużenie pobytu">Przedłużenie zakwaterowania</option>
              <option value="Wymiana wyposażenia">Wymiana wyposażenia / mebli</option>
              <option value="Wymeldowanie">Wymeldowanie i rozliczenie kaucji</option>
              <option value="Inne">Inne podanie do kierownictwa</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tytuł wniosku</label>
            <input
              type="text"
              placeholder="np. Nocleg brata w weekend 2-3 listopada"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Szczegółowe uzasadnienie</label>
            <textarea
              rows={4}
              placeholder="Przedstaw powód wniosku oraz istotne informacje (np. dane gościa, zgoda współlokatora)..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => setIsModalOpen(false)}>
              Anuluj
            </button>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Składanie...' : 'Złóż wniosek'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Decyzja Admina */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Decyzja administracyjna: ${selectedApp?.title}`}
      >
        <form onSubmit={handleUpdateStatus} className="modal-form">
          <div className="form-group">
            <label>Decyzja kierownika akademika</label>
            <select value={adminStatus} onChange={(e) => setAdminStatus(e.target.value)}>
              <option value="Zaakceptowane">Zaakceptuj wniosek</option>
              <option value="Odrzucone">Odrzuć wniosek</option>
              <option value="Oczekujące">Wstrzymaj do wyjaśnienia</option>
            </select>
          </div>

          <div className="form-group">
            <label>Uzasadnienie decyzji / Informacja dla mieszkańca</label>
            <textarea
              rows={3}
              placeholder="np. Przepustka wydana w portierni / Brak wolnych pokoi w wybranym segmencie."
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => setSelectedApp(null)}>
              Zamknij
            </button>
            <button type="submit" className="primary-button">
              Zatwierdź decyzję
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
