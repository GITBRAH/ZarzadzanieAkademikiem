import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { Announcement, User } from '../types';
import { api } from '../services/api';

interface NoticesPageProps {
  user: User;
}

export function NoticesPage({ user }: NoticesPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Wszystkie');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Ogólne');
  const [priority, setPriority] = useState<'normal' | 'coral'>('normal');
  const [dayBadge, setDayBadge] = useState('28');
  const [monthBadge, setMonthBadge] = useState('PAŹ');
  const [submitting, setSubmitting] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      setSubmitting(true);
      await api.createAnnouncement({
        title,
        content,
        category,
        priority,
        dayBadge,
        monthBadge
      });
      setTitle('');
      setContent('');
      setIsModalOpen(false);
      await loadAnnouncements();
    } catch (err: any) {
      alert(err.message || 'Błąd dodawania ogłoszenia');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('akanet_token')}`
        }
      });
      if (!res.ok) throw new Error('Błąd usuwania');
      await loadAnnouncements();
    } catch (err: any) {
      alert(err.message || 'Błąd usuwania');
    }
  };

  const categories = ['Wszystkie', 'Wydarzenia', 'Awarie', 'Ogólne'];
  const filtered =
    filterCategory === 'Wszystkie'
      ? announcements
      : announcements.filter((a) => a.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <main className="page">
      <div className="booking-intro">
        <div>
          <p className="eyebrow">KOMUNIKATY I WIADOMOŚCI</p>
          <h2>Tablica ogłoszeń akademika</h2>
          <p>Bieżące informacje od administracji, planowane przerwy techniczne i wydarzenia.</p>
        </div>
        {user.role === 'Admin' && (
          <button className="primary-button" onClick={() => setIsModalOpen(true)}>
            <Icon name="plus" size={17} /> Dodaj ogłoszenie
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="panel" style={{ marginTop: '16px' }}>
        {loading && announcements.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#7a8b9f', fontSize: '13px' }}>
            Ładowanie ogłoszeń...
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '30px', textAlign: 'center', color: '#7a8b9f', fontSize: '13px' }}>
            Brak ogłoszeń w wybranej kategorii.
          </p>
        ) : (
          filtered.map((item) => (
            <article className="notice" key={item.id} style={{ alignItems: 'flex-start' }}>
              <span className={`notice-date ${item.priority === 'coral' ? 'coral' : ''}`}>
                <b>{item.dayBadge}</b>
                {item.monthBadge}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '13px' }}>{item.title}</strong>
                  <span className={`tag ${item.priority === 'coral' ? 'tag-danger' : 'tag-info'}`}>
                    {item.category}
                  </span>
                </div>
                <p style={{ fontSize: '11px', lineHeight: 1.5, marginTop: '4px' }}>{item.content}</p>
                <small style={{ color: '#94a3b8', fontSize: '9px', marginTop: '6px', display: 'block' }}>
                  Opublikowano: {new Date(item.createdAt).toLocaleDateString('pl-PL')}
                </small>
              </div>

              {user.role === 'Admin' && (
                <button
                  onClick={() => handleDeleteAnnouncement(item.id)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    fontSize: '11px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Usuń ogłoszenie"
                >
                  <Icon name="x" size={16} />
                </button>
              )}
            </article>
          ))
        )}
      </section>

      {/* Modal Dodaj Ogłoszenie */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dodaj nowe ogłoszenie">
        <form onSubmit={handleCreateAnnouncement} className="modal-form">
          <div className="form-group">
            <label>Tytuł ogłoszenia</label>
            <input
              type="text"
              placeholder="np. Przerwa w dostawie ciepłej wody"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Kategoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Ogólne">Ogólne</option>
                <option value="Awarie">Awarie i przerwy</option>
                <option value="Wydarzenia">Wydarzenia</option>
              </select>
            </div>
            <div className="form-group">
              <label>Waga / Kolor</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'normal' | 'coral')}
              >
                <option value="normal">Standardowy (niebieski)</option>
                <option value="coral">Ważny / Pilny (czerwony)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Dzień na plakietce</label>
              <input
                type="text"
                placeholder="np. 28"
                value={dayBadge}
                onChange={(e) => setDayBadge(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Miesiąc na plakietce</label>
              <input
                type="text"
                placeholder="np. PAŹ"
                value={monthBadge}
                onChange={(e) => setMonthBadge(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Treść komunikatu</label>
            <textarea
              rows={4}
              placeholder="Wpisz treść komunikatu dla mieszkańców..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => setIsModalOpen(false)}>
              Anuluj
            </button>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Dodawanie...' : 'Opublikuj ogłoszenie'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
