import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { Announcement } from '../types';
import { api } from '../services/api';

interface GuestLandingPageProps {
  onOpenLogin: () => void;
}

export function GuestLandingPage({ onOpenLogin }: GuestLandingPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const now = new Date();
  const dayNames = ['ND', 'PN', 'WT', 'ŚR', 'CZW', 'PT', 'SOB'];
  const monthNames = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'];
  const currentDayName = dayNames[now.getDay()];
  const currentDayNum = now.getDate();
  const currentMonthName = monthNames[now.getMonth()];

  useEffect(() => {
    api.getAnnouncements().then(setAnnouncements).catch(() => {});
  }, []);

  return (
    <main className="page">
      {/* Hero Welcome Banner */}
      <section className="welcome">
        <div>
          <span className="status-pill">
            <i /> Witamy w Akademiku Olimp
          </span>
          <h2>
            AKAnet — Twój akademik,
            <br />
            <em>wszystko w jednym miejscu.</em>
          </h2>
          <p>
            Elektroniczny system obsługi domu studenckiego. Zaloguj się, aby zyskać dostęp do rezerwacji pralni,
            boisk sportowych, zgłaszania usterek i informacji o swoim pokoju.
          </p>
          <div style={{ marginTop: '22px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="primary-button"
              onClick={onOpenLogin}
              style={{
                background: 'white',
                color: '#0f2444',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                fontWeight: 800
              }}
            >
              <Icon name="user" size={17} /> Zaloguj się do systemu
            </button>
            <span style={{ fontSize: '11px', color: '#cce5f8' }}>
              Dostępne konta demo: Jan Makara (Student) oraz Administracja
            </span>
          </div>
        </div>
        <div className="date-card">
          <span>{currentDayName}</span>
          <strong>{currentDayNum}</strong>
          <small>{currentMonthName} CZASU</small>
        </div>
      </section>

      {/* Lock Notice Info Banner */}
      <section
        style={{
          background: 'white',
          border: '1px solid #e1e8ee',
          borderRadius: '14px',
          padding: '22px 26px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: '0 4px 16px rgba(19,54,87,.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'grid',
              placeItems: 'center',
              flex: 'none'
            }}
          >
            <Icon name="lock" size={24} />
          </div>
          <div>
            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '3px' }}>
              Jesteś w trybie przeglądania (Uczestnik niezalogowany)
            </strong>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>
              Wszystkie zakładki w menu bocznym są widoczne, lecz ich funkcjonalności (rezerwacje, zgłoszenia, pokój)
              są zablokowane do momentu zalogowania. Wybierz konto demo lub zaloguj się swoimi danymi.
            </p>
          </div>
        </div>
        <button
          className="primary-button"
          onClick={onOpenLogin}
          style={{ whiteSpace: 'nowrap' }}
        >
          Zaloguj się teraz
        </button>
      </section>

      {/* Dormitory Key Infrastructure / Stats */}
      <section style={{ marginBottom: '28px' }}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">INFRASTRUKTURA DOMU STUDENCKIEGO</p>
            <h3>Co oferuje Akademik Olimp?</h3>
          </div>
        </div>

        <div className="admin-stats-grid">
          <article className="stat-card">
            <small>POJEMNOŚĆ BUDYNKU</small>
            <strong>412 / 480</strong>
            <span>86% aktualnego obłożenia</span>
          </article>

          <article className="stat-card">
            <small>PRALNIE I SUSZARNIE</small>
            <strong>7 urządzeń</strong>
            <span>Poziom -1 · Budynki A, B, C</span>
          </article>

          <article className="stat-card">
            <small>STREFA SPORTOWA</small>
            <strong>2 boiska</strong>
            <span>Wielofunkcyjne & Piłkarskie</span>
          </article>

          <article className="stat-card accent">
            <small>DYŻUR I RECEPCJA</small>
            <strong>24/7</strong>
            <span>ul. Studencka 12, Kraków</span>
          </article>
        </div>
      </section>

      {/* Public Announcements Preview & Quick Rules */}
      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">KOMUNIKATY I AKTUALNOŚCI</p>
              <h3>Tablica ogłoszeń akademika</h3>
            </div>
            <button onClick={onOpenLogin}>Zaloguj się, aby zobaczyć więcej</button>
          </div>

          {announcements.slice(0, 3).map((notice) => (
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
          ))}
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">REGULAMIN I INFORMACJE</p>
              <h3>Zasady pobytu w akademiku</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '11px', color: '#475569' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#e0f2fe', color: '#0369a1', display: 'grid', placeItems: 'center', flex: 'none' }}>
                <Icon name="clock" size={16} />
              </span>
              <div>
                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '2px' }}>Cisza nocna</strong>
                Obowiązuje w godzinach od 22:00 do 06:00 rano we wszystkich budynkach.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', display: 'grid', placeItems: 'center', flex: 'none' }}>
                <Icon name="users" size={16} />
              </span>
              <div>
                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '2px' }}>Goście i noclegi</strong>
                Odwiedziny do 22:00 bez opłat. Nocleg gościa wymaga zgłoszenia wniosku w systemie AKAnet.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#dcfce7', color: '#15803d', display: 'grid', placeItems: 'center', flex: 'none' }}>
                <Icon name="tool" size={16} />
              </span>
              <div>
                <strong style={{ display: 'block', color: '#1e293b', marginBottom: '2px' }}>Usterki techniczne</strong>
                Zgłoszenia awarii przyjmowane są przez moduł Usterek. Czas reakcji konserwatora to zwykle 1-2h.
              </div>
            </div>

            <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #edf1f5' }}>
              <strong>Kontakt do recepcji:</strong> +48 12 617 00 00 · <span style={{ color: '#0284c7' }}>recepcja@olimp.akanet.pl</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
