import { useState, type ReactNode } from "react";

type IconName =
  | "home"
  | "laundry"
  | "court"
  | "tool"
  | "file"
  | "room"
  | "notice"
  | "bell"
  | "user"
  | "building"
  | "chevron"
  | "calendar"
  | "clock"
  | "check"
  | "arrow";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    laundry: <><rect x="4" y="2.5" width="16" height="19" rx="2" /><path d="M4 8h16M8 5.5h.01M12 5.5h4" /><circle cx="12" cy="14.5" r="4" /><path d="M9.2 14.4c1.2-1 2.3.8 4 .1.8-.3 1.3-.1 1.7.2" /></>,
    court: <><circle cx="12" cy="12" r="9" /><path d="M3.2 10h17.6M3.2 14h17.6M12 3c-2.3 2.5-3.5 5.5-3.5 9s1.2 6.5 3.5 9M12 3c2.3 2.5 3.5 5.5 3.5 9s-1.2 6.5-3.5 9" /></>,
    tool: <path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 9.6 6 7.3 3.7a4 4 0 0 0 5 5L5.2 15.8a2 2 0 1 0 3 3l7-7a4 4 0 0 0 5-5L18 9l-3-2.7Z" />,
    file: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M9 12h6M9 16h6" /></>,
    room: <><path d="M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17M2 21h20" /><path d="M8 6h3v3H8zM13 6h3v3h-3zM8 12h3v3H8zM13 12h3v3h-3zM10 21v-3h4v3" /></>,
    notice: <><path d="M4 5h16v13H7l-3 3z" /><path d="M8 9h8M8 13h5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    building: <><path d="M3 21h18M5 21V5l7-3 7 3v16" /><path d="M9 8h2M9 12h2M9 16h2M14 8h2M14 12h2M14 16h2" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <><path d="m15 18-6-6 6-6" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const navItems = [
  { id: "home", label: "Strona główna", icon: "home" },
  { id: "laundry", label: "Pralnie i suszarnie", icon: "laundry" },
  { id: "court", label: "Boiska sportowe", icon: "court" },
  { id: "maintenance", label: "Usterki", icon: "tool" },
  { id: "applications", label: "Podania i wnioski", icon: "file" },
  { id: "rooms", label: "Mój pokój", icon: "room" },
  { id: "notices", label: "Ogłoszenia", icon: "notice" },
] as const;

const schedule = [
  ["free", "free", "busy", "free", "free", "free", "busy"],
  ["free", "free", "selected", "busy", "free", "free", "busy"],
  ["free", "busy", "free", "free", "busy", "selected", "busy"],
  ["free", "free", "free", "busy", "selected", "free", "busy"],
  ["free", "free", "free", "busy", "busy", "free", "selected"],
];

function Sidebar({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Icon name="building" size={22} /></div>
        <div><strong>AKAnet</strong><span>PANEL UŻYTKOWNIKA</span></div>
      </div>
      <nav>
        <p className="nav-caption">MENU GŁÓWNE</p>
        {navItems.map((item) => (
          <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
            {item.id === "notices" && <b className="nav-dot">3</b>}
          </button>
        ))}
      </nav>
      <div className="support-card">
        <span className="support-icon"><Icon name="tool" size={18} /></span>
        <strong>Potrzebujesz pomocy?</strong>
        <p>Zespół akademika jest dostępny przez całą dobę.</p>
        <button onClick={() => setActive("maintenance")}>Skontaktuj się z nami</button>
      </div>
      <div className="profile">
        <div className="avatar">JM</div>
        <div><strong>Jan Makara</strong><span>Mieszkaniec · 202B</span></div>
        <Icon name="chevron" size={16} />
      </div>
    </aside>
  );
}

function Header({ title }: { title: string }) {
  return (
    <header>
      <div><p className="eyebrow">Panel Użytkownika AKAnet</p><h1>{title}</h1></div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Powiadomienia"><Icon name="bell" size={20} /><span /></button>
        <button className="header-avatar">JM</button>
      </div>
    </header>
  );
}

function ActionCard({ icon, title, text, tint, onClick }: { icon: IconName; title: string; text: string; tint: string; onClick: () => void }) {
  return (
    <button className="action-card" onClick={onClick}>
      <span className={`action-icon ${tint}`}><Icon name={icon} size={24} /></span>
      <span><strong>{title}</strong><small>{text}</small></span>
      <span className="action-arrow"><Icon name="chevron" size={18} /></span>
    </button>
  );
}

function Dashboard({ setActive }: { setActive: (id: string) => void }) {
  return (
    <>
      <Header title="Dzień dobry, Jan" />
      <main className="page">
        <section className="welcome">
          <div>
            <span className="status-pill"><i /> Wszystkie systemy działają prawidłowo</span>
            <h2>Twój akademik,<br /><em>wszystko w jednym miejscu.</em></h2>
            <p>Zarządzaj rezerwacjami, bądź na bieżąco i korzystaj ze wsparcia.</p>
          </div>
          <div className="date-card"><span>ŚR</span><strong>16</strong><small>PAŹDZIERNIKA</small></div>
        </section>

        <section>
          <div className="section-heading"><div><p className="eyebrow">SZYBKI DOSTĘP</p><h3>W czym możemy pomóc?</h3></div></div>
          <div className="action-grid">
            <ActionCard icon="laundry" title="Zarezerwuj pralkę" text="Dostępne 3 urządzenia" tint="blue" onClick={() => setActive("laundry")} />
            <ActionCard icon="court" title="Zarezerwuj boisko" text="Najbliższy termin o 16:00" tint="mint" onClick={() => setActive("court")} />
            <ActionCard icon="tool" title="Zgłoś usterkę" text="Odpowiadamy zwykle w godzinę" tint="orange" onClick={() => setActive("maintenance")} />
            <ActionCard icon="file" title="Złóż wniosek" text="Formularze i podania" tint="violet" onClick={() => setActive("applications")} />
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="panel reservations">
            <div className="section-heading"><div><p className="eyebrow">TWÓJ HARMONOGRAM</p><h3>Nadchodzące rezerwacje</h3></div><button onClick={() => setActive("laundry")}>Zobacz wszystkie</button></div>
            <div className="reservation-card">
              <div className="reservation-icon blue"><Icon name="laundry" size={21} /></div>
              <div className="reservation-info"><strong>Pralka 04</strong><span>Pralnia · Budynek B</span></div>
              <div className="reservation-time"><strong>14:00</strong><span>Dzisiaj · 60 min</span></div>
              <span className="confirmed"><Icon name="check" size={13} /> Potwierdzona</span>
            </div>
            <div className="reservation-card">
              <div className="reservation-icon mint"><Icon name="court" size={21} /></div>
              <div className="reservation-info"><strong>Boisko wielofunkcyjne</strong><span>Centrum sportowe · Boisko 2</span></div>
              <div className="reservation-time"><strong>17:00</strong><span>Jutro · 60 min</span></div>
              <span className="confirmed"><Icon name="check" size={13} /> Potwierdzona</span>
            </div>
          </section>

          <section className="panel notices">
            <div className="section-heading"><div><p className="eyebrow">NAJNOWSZE INFORMACJE</p><h3>Tablica ogłoszeń</h3></div><button onClick={() => setActive("notices")}>Zobacz wszystkie</button></div>
            <article className="notice"><span className="notice-date"><b>18</b>PAŹ</span><div><strong>Wieczór integracyjny mieszkańców</strong><p>Spotkajmy się o 18:00 w sali wspólnej.</p></div></article>
            <article className="notice"><span className="notice-date coral"><b>21</b>PAŹ</span><div><strong>Planowana przerwa w dostawie wody</strong><p>Dostawa wody zostanie wstrzymana od 9:00 do 11:00.</p></div></article>
          </section>
        </div>
      </main>
    </>
  );
}

function BookingView({ type }: { type: "laundry" | "court" }) {
  const isLaundry = type === "laundry";
  const [selected, setSelected] = useState("2-5");
  const places = isLaundry
    ? ["Pralnia · Budynek A", "Pralnia · Budynek B", "Pralnia · Budynek C"]
    : ["Boisko wielofunkcyjne", "Boisko do piłki nożnej", "Boisko do koszykówki"];
  return (
    <>
      <Header title={isLaundry ? "Pralnie i suszarnie" : "Boiska sportowe"} />
      <main className="page booking-page">
        <div className="booking-intro">
          <div><p className="eyebrow">REZERWACJE</p><h2>{isLaundry ? "Znajdź wolne urządzenie" : "Wybierz godzinę gry"}</h2><p>Wybierz dostępny termin, aby utworzyć nową rezerwację.</p></div>
          <button className="primary-button"><Icon name="calendar" size={18} /> Moje rezerwacje</button>
        </div>
        <div className="date-switcher">
          <button aria-label="Poprzedni dzień"><Icon name="arrow" size={18} /></button>
          {["Wt 15", "Śr 16", "Czw 17", "Pt 18", "Sob 19"].map((date, i) => <button key={date} className={i === 1 ? "active" : ""}><small>{date.split(" ")[0]}</small><strong>{date.split(" ")[1]}</strong></button>)}
          <button className="next" aria-label="Następny dzień"><Icon name="chevron" size={18} /></button>
        </div>
        <section className="schedule-panel">
          <div className="places">
            <p className="table-label">{isLaundry ? "LOKALIZACJA" : "OBIEKT"}</p>
            {places.map((place, i) => <button key={place} className={i === 0 ? "active" : ""}><span className={`place-icon ${isLaundry ? "blue" : "mint"}`}><Icon name={isLaundry ? "laundry" : "court"} size={19} /></span><span><strong>{place}</strong><small><i /> Wolne miejsca: {3 - i}</small></span><Icon name="chevron" size={15} /></button>)}
          </div>
          <div className="time-grid">
            <div className="time-head"><span /><span>10:00</span><span>11:00</span><span>12:00</span><span>13:00</span><span>14:00</span><span>15:00</span><span>16:00</span></div>
            {schedule.map((row, rowIndex) => (
              <div className="time-row" key={rowIndex}>
                <strong>{isLaundry ? `Pralka 0${rowIndex + 1}` : `Boisko ${rowIndex + 1}`}</strong>
                {row.map((state, colIndex) => {
                  const key = `${rowIndex}-${colIndex}`;
                  const current = selected === key ? "selected" : state === "selected" ? "free" : state;
                  return <button aria-label={`Termin o ${colIndex + 10}:00`} key={key} className={current} disabled={current === "busy"} onClick={() => setSelected(key)}>{current === "selected" && <Icon name="check" size={17} />}</button>;
                })}
              </div>
            ))}
            <div className="legend"><span><i className="free" /> Dostępne</span><span><i className="selected" /> Wybrane</span><span><i className="busy" /> Niedostępne</span></div>
          </div>
        </section>
        <div className="selection-bar">
          <div><span className="selection-icon"><Icon name={isLaundry ? "laundry" : "court"} size={20} /></span><div><small>TWÓJ WYBÓR</small><strong>{isLaundry ? "Pralka 03" : "Boisko 3"} · Dzisiaj, 14:00</strong></div></div>
          <button>Potwierdź rezerwację <Icon name="chevron" size={17} /></button>
        </div>
      </main>
    </>
  );
}

function Placeholder({ active }: { active: string }) {
  const item = navItems.find((nav) => nav.id === active)!;
  return (
    <>
      <Header title={item.label} />
      <main className="page">
        <section className="empty-state">
          <span><Icon name={item.icon} size={34} /></span>
          <p className="eyebrow">USŁUGI DLA MIESZKAŃCÓW</p>
          <h2>{item.label}</h2>
          <p>Ta sekcja jest gotowa do dalszej rozbudowy prototypu.</p>
          <button className="primary-button">Utwórz nowe zgłoszenie</button>
        </section>
      </main>
    </>
  );
}

export default function App() {
  const [active, setActive] = useState("home");
  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} />
      <div className="content">
        {active === "home" ? <Dashboard setActive={setActive} /> : active === "laundry" || active === "court" ? <BookingView type={active} /> : <Placeholder active={active} />}
      </div>
    </div>
  );
}
