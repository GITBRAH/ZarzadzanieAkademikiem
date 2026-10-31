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

  // Admin Compose Form State with live preview
  const [title, setTitle] = useState('Przegląd instalacji przeciwpożarowej');
  const [content, setContent] = useState(
    'W czwartek w godzinach 9:00–12:00 odbędzie się planowy przegląd instalacji. Prosimy o umożliwienie dostępu do pokoi.'
  );
  const [targetAudience, setTargetAudience] = useState('Wszyscy mieszkańcy · 412 osób');
  const [category, setCategory] = useState('Techniczne');
  const [priority, setPriority] = useState<'normal' | 'coral'>('normal');
  const [submitting, setSubmitting] = useState(false);
  const [showAdminComposer, setShowAdminComposer] = useState(user.role === 'Admin');

  const isAdmin = user.role === 'Admin';

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

  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);
      const now = new Date();
      const monthNames = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'];
      const dayStr = String(now.getDate()).padStart(2, '0');
      const monthStr = monthNames[now.getMonth()];

      await api.createAnnouncement({
        title,
        content,
        category,
        priority,
        dayBadge: dayStr,
        monthBadge: monthStr,
        targetAudience
      });

      // Clear or set new draft
      setTitle('');
      setContent('');
      await loadAnnouncements();
      alert('Ogłoszenie zostało pomyślnie opublikowane!');
    } catch (err: any) {
      alert(err.message || 'Błąd dodawania ogłoszenia');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return;
    try {
      await api.deleteAnnouncement(id);
      await loadAnnouncements();
    } catch (err: any) {
      alert(err.message || 'Błąd usuwania');
    }
  };

  const categories = ['Wszystkie', 'Techniczne', 'Wydarzenia', 'Organizacyjne', 'Awarie', 'Ogólne'];
  const filtered =
    filterCategory === 'Wszystkie'
      ? announcements
      : announcements.filter((a) => a.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <main className="page">
      <div className="booking-intro">
        <div>
          <p className="eyebrow">{isAdmin ? 'KOMUNIKACJA I DYSTRYBUCJA' : 'TABLICA OGŁOSZEŃ'}</p>
          <h2>{isAdmin ? 'Ogłoszenia grupowe i komunikaty' : 'Ogłoszenia akademika'}</h2>
          <p>
            {isAdmin
              ? 'Docieraj do właściwych mieszkańców we właściwym czasie z natychmiastowym podglądem.'
              : 'Bieżące komunikaty od administracji, planowane prace techniczne i wydarzenia.'}
          </p>
        </div>

        {isAdmin && (
          <button
            className="secondary-button"
            onClick={() => setShowAdminComposer(!showAdminComposer)}
          >
            <Icon name="megaphone" size={16} />
            {showAdminComposer ? 'Ukryj kreator wiadomości' : 'Nowe ogłoszenie (Kreator)'}
          </button>
        )}
      </div>

      {/* Admin Announcement Creator with Live Phone Preview (from admin_aka_copy) */}
      {isAdmin && showAdminComposer && (
        <section className="compose-card">
          <form className="compose-form" onSubmit={handleSendAnnouncement}>
            <div>
              <p className="eyebrow" style={{ margin: '0 0 4px', color: '#1f4035' }}>
                KREATOR KOMUNIKATU
              </p>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Wyślij nowe ogłoszenie</h3>
            </div>

            <label>
              <span>Tytuł ogłoszenia</span>
              <input
                placeholder="Wpisz krótki i rzeczowy tytuł..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Treść wiadomości</span>
              <textarea
                placeholder="Wpisz treść komunikatu dla mieszkańców..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label>
                <span>Grupa odbiorców</span>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                >
                  <option value="Wszyscy mieszkańcy · 412 osób">Wszyscy mieszkańcy · 412 osób</option>
                  <option value="Budynek A">Budynek A</option>
                  <option value="Budynek B">Budynek B</option>
                  <option value="Budynek C">Budynek C</option>
                  <option value="Piętro 1">Piętro 1 (Wszystkie budynki)</option>
                  <option value="Piętro 2">Piętro 2 (Wszystkie budynki)</option>
                  <option value="Piętro 3">Piętro 3 (Wszystkie budynki)</option>
                </select>
              </label>

              <label>
                <span>Priorytet</span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="normal">Standardowy</option>
                  <option value="coral">Pilny / Ważny alert</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
              style={{ alignSelf: 'flex-start', marginTop: '6px' }}
            >
              <Icon name="megaphone" size={17} />
              {submitting ? 'Wysyłanie...' : 'Wyślij ogłoszenie'}
            </button>
          </form>

          {/* Live Phone Mockup Preview */}
          <div className="message-preview">
            <span className="message-preview-title">PODGLĄD WIADOMOŚCI (SMARTFON)</span>
            <div className="phone-message">
              <div className="phone-message-header">
                <div className="phone-brand">
                  <div className="phone-brand-mark">
                    <Icon name="building" size={15} />
                  </div>
                  <strong>AKAnet Olimp</strong>
                </div>
                <span className="phone-time">TERAZ</span>
              </div>
              <h4>{title || 'Tytuł Twojego ogłoszenia'}</h4>
              <p>
                {content ||
                  'Tutaj pojawi się treść wiadomości, którą zobaczą mieszkańcy w aplikacji mobilnej i na tablicy ogłoszeń...'}
              </p>
              <div style={{ marginTop: '12px', fontSize: '9px', color: '#94a3b8' }}>
                Odbiorcy: <b>{targetAudience}</b>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Announcements Filter Tabs */}
      <div className="filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${filterCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <section className="panel">
        {loading ? (
          <p style={{ color: '#8291a2', fontSize: '13px', padding: '20px 0' }}>Ładowanie ogłoszeń...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#8291a2', fontSize: '13px', padding: '20px 0' }}>Brak ogłoszeń w tej kategorii.</p>
        ) : (
          filtered.map((item) => (
            <article className="notice" key={item.id}>
              <span className={`notice-date ${item.priority === 'coral' ? 'coral' : ''}`}>
                <b>{item.dayBadge}</b>
                {item.monthBadge}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="category-chip blue">{item.category}</span>
                  {item.priority === 'coral' && (
                    <span className="tag tag-danger">Ważny komunikat</span>
                  )}
                  {item.targetAudience && (
                    <span style={{ fontSize: '9px', color: '#64748b' }}>
                      · Odbiorcy: {item.targetAudience}
                    </span>
                  )}
                </div>
                <strong>{item.title}</strong>
                <p style={{ marginTop: '6px' }}>{item.content}</p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDeleteAnnouncement(item.id)}
                  className="icon-button"
                  style={{ width: '32px', height: '32px', color: '#dc2626' }}
                  title="Usuń ogłoszenie"
                >
                  <Icon name="close" size={15} />
                </button>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
