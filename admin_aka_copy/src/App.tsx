import { useState, type ReactNode } from "react"

type Role = "student" | "admin"
type IconName = "home" | "calendar" | "wrench" | "building" | "megaphone" | "users" | "grid" | "washer" | "dryer" | "ball" | "chevron" | "clock" | "plus" | "bell" | "search" | "check" | "close" | "arrow" | "moon"

const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3.5 10.5 12 3l8.5 7.5" />
      <path d="M5.5 9v11h13V9M9 20v-6h6v6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4m8-4v4M3 10h18" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4l-3 3-3-3 3-3Z" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5l8-3 8 3v16M2 21h20M8 7h2m4 0h2M8 11h2m4 0h2M8 15h2m4 0h2M10 21v-3h4v3" />
    </>
  ),
  megaphone: (
    <>
      <path d="m4 13-1-1v-2l1-1 13-5v14L4 13Z" />
      <path d="M8 14v5a2 2 0 0 0 2 2h1v-7m8-6a4 4 0 0 1 0 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0m1-16a4 4 0 0 1 0 7m2 3a6 6 0 0 1 3 6" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  washer: (
    <>
      <rect x="4" y="2.5" width="16" height="19" rx="3" />
      <path d="M4 7.5h16M8 5h.01M11 5h.01" />
      <circle cx="12" cy="14.5" r="5" />
      <path d="M9 14c2-2 4 2 6 0" />
    </>
  ),
  dryer: (
    <>
      <rect x="4" y="2.5" width="16" height="19" rx="3" />
      <path d="M4 7.5h16M8 5h.01" />
      <circle cx="12" cy="14.5" r="5" />
      <path d="M10 12.5c3 0 1 4 4 4" />
    </>
  ),
  ball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7 4 3-1.5 5h-5L8 10l4-3ZM3.5 10l4.5.1m8 0 4.5-.1M7 19l2.5-4m7.5 4-2.5-4M12 3v4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  moon: <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />,
}

function Icon({ name, size = 20 }: { name: IconName size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  )
}

const studentNav = [
  { id: "start", label: "Pulpit", icon: "home" as IconName },
  { id: "bookings", label: "Rezerwacje", icon: "calendar" as IconName },
  { id: "faults", label: "Usterki", icon: "wrench" as IconName },
  { id: "application", label: "Mój akademik", icon: "building" as IconName },
]

const adminNav = [
  { id: "admin", label: "Centrum operacyjne", icon: "grid" as IconName },
  { id: "issues", label: "Zgłoszenia usterek", icon: "wrench" as IconName },
  { id: "residents", label: "Mieszkańcy i pokoje", icon: "users" as IconName },
  { id: "announcements", label: "Ogłoszenia", icon: "megaphone" as IconName },
]

const resources = [
  {
    name: "Pralka",
    detail: "Pralnia · poziom -1",
    free: "3 wolne",
    icon: "washer" as IconName,
    tone: "lime",
  },
  {
    name: "Suszarka",
    detail: "Pralnia · poziom -1",
    free: "2 wolne",
    icon: "dryer" as IconName,
    tone: "peach",
  },
  {
    name: "Boisko",
    detail: "Strefa sportowa",
    free: "18:30 dziś",
    icon: "ball" as IconName,
    tone: "blue",
  },
]

function Header() {
  return (
    <header className="topbar">
      <div className="top-brand">
        <span className="brand-mark">
          <Icon name="building" size={18} />
        </span>
        <div>
          <strong>AKAnet</strong>
          <small>Akademik Olimp</small>
        </div>
      </div>
      <label className="searchbox">
        <Icon name="search" size={18} />
        <input aria-label="Szukaj" placeholder="Szukaj..." />
        <kbd>⌘ K</kbd>
      </label>
      <div className="header-actions">
        <button
          className="header-control language-control"
          aria-label="Zmień język"
          title="Zmiana języka — funkcja demonstracyjna"
        >
          <span>PL</span>
          <Icon name="chevron" size={14} />
        </button>
        <button
          className="header-control theme-control"
          aria-label="Włącz tryb nocny"
          title="Tryb nocny — funkcja demonstracyjna"
        >
          <Icon name="moon" size={17} />
          <span>Tryb nocny</span>
        </button>
        <button
          className="icon-button notification-button"
          aria-label="Powiadomienia"
        >
          <Icon name="bell" size={19} />
          <span />
        </button>
        <div className="user-mini">
          <div className="avatar">WL</div>
          <div>
            <strong>Wiktor Linek</strong>
            <small>Administracja</small>
          </div>
        </div>
      </div>
    </header>
  )
}

function TopNavigation({
  active,
  setActive,
}: {
  active: string
  setActive: (id: string) => void
}) {
  return (
    <nav className="top-navigation" aria-label="Główna nawigacja">
      <div className="top-navigation-inner">
        {adminNav.map((item) => (
          <button
            className={
              active === item.id ? "top-nav-item active" : "top-nav-item"
            }
            key={item.id}
            onClick={() => setActive(item.id)}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

function Sidebar({
  role,
  setRole,
  active,
  setActive,
}: {
  role: Role
  setRole: (role: Role) => void
  active: string
  setActive: (id: string) => void
}) {
  const nav = role === "student" ? studentNav : adminNav
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="building" size={20} />
        </span>
        <span>Domu</span>
      </div>
      <div className="role-switch">
        <button
          className={role === "student" ? "active" : ""}
          onClick={() => setRole("student")}
        >
          Student
        </button>
        <button
          className={role === "admin" ? "active" : ""}
          onClick={() => setRole("admin")}
        >
          Administracja
        </button>
      </div>
      <nav className="main-nav">
        <p>PRZESTRZEŃ</p>
        {nav.map((item) => (
          <button
            className={active === item.id ? "nav-item active" : "nav-item"}
            key={item.id}
            onClick={() => setActive(item.id)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-card">
        <span className="eyebrow">TWÓJ BUDYNEK</span>
        <strong>Akademik Olimp</strong>
        <small>ul. Studencka 12, Kraków</small>
        <div className="capacity">
          <span style={{ width: "86%" }} />
        </div>
        <p>
          <b>412</b> / 480 miejsc
        </p>
      </div>
      <button className="profile-row">
        <div className="avatar">{role === "student" ? "MK" : "AN"}</div>
        <div>
          <strong>
            {role === "student" ? "Maja Kowalska" : "Wiktor Linek"}
          </strong>
          <small>Ustawienia konta</small>
        </div>
        <Icon name="chevron" size={17} />
      </button>
    </aside>
  )
}

function Stat({
  label,
  value,
  detail,
  accent,
}: {
  label: string
  value: string
  detail: string
  accent?: boolean
}) {
  return (
    <article className={accent ? "stat-card accent" : "stat-card"}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  )
}

function AdminDashboard({ navigate }: { navigate: (id: string) => void }) {
  return (
    <>
      <section className="hero-row">
        <div>
          <span className="eyebrow dark">
            SYSTEM ZARZĄDZANIA DOMEM STUDENCKIM
          </span>
          <p>Najważniejsze informacje z budynku w jednym miejscu.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => navigate("announcements")}
        >
          <Icon name="megaphone" size={18} /> Nowe ogłoszenie
        </button>
      </section>
      <section className="stats-row">
        <Stat label="MIESZKAŃCY" value="412" detail="86% obłożenia" />
        <Stat
          label="OTWARTE USTERKI"
          value="14"
          detail="3 wymagają uwagi"
          accent
        />
        <Stat
          label="DZIŚ REZERWACJI"
          value="38"
          detail="pralki, suszarki, boisko"
        />
        <Stat label="NOWE WNIOSKI" value="27" detail="do weryfikacji" />
      </section>
      <section className="dashboard-columns admin-columns">
        <div className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow dark">PRIORYTETOWE</span>
              <h2>Usterki do obsługi</h2>
            </div>
            <button className="text-button" onClick={() => navigate("issues")}>
              Zobacz wszystkie <Icon name="arrow" size={16} />
            </button>
          </div>
          {[
            ["Brak ciepłej wody", "A-103", "Pilne", "urgent"],
            ["Zablokowane drzwi", "C-221", "Wysoki", "progress"],
            ["Awaria oświetlenia", "Korytarz B-2", "Nowe", "new"],
          ].map((item) => (
            <button className="issue-row admin-issue" key={item[0]}>
              <span className="issue-icon">
                <Icon name="wrench" size={18} />
              </span>
              <div>
                <strong>{item[0]}</strong>
                <small>{item[1]} · zgłoszono dziś</small>
              </div>
              <span className={`status ${item[3]}`}>{item[2]}</span>
              <Icon name="chevron" size={17} />
            </button>
          ))}
        </div>
      </section>
      <section className="panel quick-panel">
        <div>
          <span className="eyebrow dark">SZYBKIE DZIAŁANIA</span>
          <h2>Zarządzaj budynkiem</h2>
        </div>
        <div className="quick-actions">
          <button onClick={() => navigate("residents")}>
            <span>
              <Icon name="users" size={21} />
            </span>
            <div>
              <strong>Znajdź mieszkańca</strong>
              <small>Wyszukaj po nazwisku lub pokoju</small>
            </div>
            <Icon name="chevron" size={18} />
          </button>
          <button onClick={() => navigate("announcements")}>
            <span>
              <Icon name="megaphone" size={21} />
            </span>
            <div>
              <strong>Wyślij komunikat</strong>
              <small>Do budynku, piętra lub grupy</small>
            </div>
            <Icon name="chevron" size={18} />
          </button>
        </div>
      </section>
    </>
  )
}

function AdminSection({ type }: { type: string }) {
  const [roomQuery, setRoomQuery] = useState("B-214")
  const [residentQuery, setResidentQuery] = useState("")
  const rooms = [
    {
      number: "B-214",
      floor: "Piętro 2",
      capacity: "2 / 2",
      residents: ["Maja Kowalska", "Julia Lis"],
    },
    {
      number: "B-215",
      floor: "Piętro 2",
      capacity: "1 / 2",
      residents: ["Adam Zając"],
    },
    {
      number: "C-103",
      floor: "Piętro 1",
      capacity: "2 / 2",
      residents: ["Ola Król", "Emilia Wójcik"],
    },
    {
      number: "A-307",
      floor: "Piętro 3",
      capacity: "1 / 3",
      residents: ["Kacper Mazur"],
    },
  ]
  const normalizedRoomQuery = roomQuery.trim().toLocaleLowerCase("pl")
  const normalizedResidentQuery = residentQuery.trim().toLocaleLowerCase("pl")
  const roomMatches = normalizedRoomQuery
    ? rooms.filter((room) =>
        room.number.toLocaleLowerCase("pl").includes(normalizedRoomQuery),
      )
    : []
  const residentMatches = normalizedResidentQuery
    ? rooms.flatMap((room) =>
        room.residents
          .filter((resident) =>
            resident.toLocaleLowerCase("pl").includes(normalizedResidentQuery),
          )
          .map((resident) => ({ resident, room })),
      )
    : []

  const config: Record<string, {
    eyebrow: string
    title: string
    subtitle: string
  }> = {
    issues: {
      eyebrow: "ZGŁOSZENIA",
      title: "Usterki i naprawy.",
      subtitle: "Priorytetyzuj zgłoszenia i przydzielaj je technikom.",
    },
    residents: {
      eyebrow: "MIESZKAŃCY",
      title: "Pokoje i lokatorzy.",
      subtitle: "Sprawdź skład pokoju oraz dane mieszkańców.",
    },
    announcements: {
      eyebrow: "KOMUNIKACJA",
      title: "Ogłoszenia grupowe.",
      subtitle: "Docieraj do właściwych osób we właściwym czasie.",
    },
  }
  const copy = config[type] ?? config.issues
  if (type === "residents") {
    return (
      <>
        <section className="hero-row compact">
          <div>
            <span className="eyebrow dark">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
        </section>
        <section className="finder-grid">
          <article className="finder-card">
            <div className="finder-heading">
              <span className="finder-icon">
                <Icon name="building" size={21} />
              </span>
              <div>
                <span className="eyebrow dark">PO NUMERZE POKOJU</span>
                <h2>Sprawdź mieszkańców</h2>
              </div>
            </div>
            <label className="finder-search">
              <Icon name="search" size={18} />
              <input
                aria-label="Numer pokoju"
                value={roomQuery}
                onChange={(event) => setRoomQuery(event.target.value)}
                placeholder="Np. B-214"
              />
              {roomQuery && (
                <button
                  aria-label="Wyczyść numer pokoju"
                  onClick={() => setRoomQuery("")}
                >
                  <Icon name="close" size={15} />
                </button>
              )}
            </label>
            <div className="finder-results">
              {!roomQuery && (
                <p className="finder-hint">
                  Wpisz numer, aby zobaczyć lokatorów pokoju.
                </p>
              )}
              {roomQuery && roomMatches.length === 0 && (
                <p className="finder-empty">Nie znaleziono takiego pokoju.</p>
              )}
              {roomMatches.map((room) => (
                <div className="room-result" key={room.number}>
                  <div className="result-title">
                    <div>
                      <strong>Pokój {room.number}</strong>
                      <small>
                        {room.floor} · {room.capacity} miejsc
                      </small>
                    </div>
                    <span className="status accepted">Zajęty</span>
                  </div>
                  <div className="resident-list">
                    {room.residents.map((resident, index) => (
                      <div key={resident}>
                        <span className="resident-avatar">
                          {resident
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </span>
                        <div>
                          <strong>{resident}</strong>
                          <small>
                            Indeks: {index === 0 ? "420184" : "421037"}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="finder-card">
            <div className="finder-heading">
              <span className="finder-icon peach">
                <Icon name="users" size={21} />
              </span>
              <div>
                <span className="eyebrow dark">PO IMIENIU I NAZWISKU</span>
                <h2>Znajdź pokój mieszkańca</h2>
              </div>
            </div>
            <label className="finder-search">
              <Icon name="search" size={18} />
              <input
                aria-label="Imię i nazwisko mieszkańca"
                value={residentQuery}
                onChange={(event) => setResidentQuery(event.target.value)}
                placeholder="Np. Adam Zając"
              />
              {residentQuery && (
                <button
                  aria-label="Wyczyść nazwisko"
                  onClick={() => setResidentQuery("")}
                >
                  <Icon name="close" size={15} />
                </button>
              )}
            </label>
            <div className="finder-results">
              {!residentQuery && (
                <p className="finder-hint">
                  Wpisz imię lub nazwisko, aby sprawdzić przypisany pokój.
                </p>
              )}
              {residentQuery && residentMatches.length === 0 && (
                <p className="finder-empty">Nie znaleziono mieszkańca.</p>
              )}
              {residentMatches.map(({ resident, room }) => (
                <div className="person-result" key={resident}>
                  <span className="resident-avatar">
                    {resident
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{resident}</strong>
                    <small>Aktywny mieszkaniec</small>
                  </div>
                  <div className="room-badge">
                    <span>POKÓJ</span>
                    <strong>{room.number}</strong>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="panel large-panel rooms-overview">
          <div className="panel-title">
            <div>
              <span className="eyebrow dark">EWIDENCJA</span>
              <h2>Przegląd pokoi</h2>
            </div>
          </div>
          <div className="room-tabs">
            <button className="active">Wszystkie pokoje</button>
            <button>Wolne miejsca</button>
            <button>Pełne</button>
          </div>
          {rooms.map((room) => (
            <button className="room-row" key={room.number}>
              <strong>{room.number}</strong>
              <div>
                <span>{room.residents.join(", ")}</span>
                <small>{room.floor}</small>
              </div>
              <span className="occupants">{room.capacity}</span>
              <Icon name="chevron" size={18} />
            </button>
          ))}
        </section>
      </>
    )
  }
  if (type === "announcements") {
    return (
      <>
        <section className="hero-row compact">
          <div>
            <span className="eyebrow dark">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
        </section>
        <section className="compose-card">
          <div className="compose-form">
            <span className="eyebrow dark">NOWE OGŁOSZENIE</span>
            <label>
              <span>Tytuł</span>
              <input defaultValue="Przegląd instalacji przeciwpożarowej" />
            </label>
            <label>
              <span>Treść wiadomości</span>
              <textarea defaultValue="W czwartek w godzinach 9:00–12:00 odbędzie się planowy przegląd instalacji. Prosimy o umożliwienie dostępu do pokoi." />
            </label>
            <label>
              <span>Odbiorcy</span>
              <select defaultValue="all">
                <option value="all">Wszyscy mieszkańcy · 412 osób</option>
                <option>Piętro 2</option>
                <option>Budynek B</option>
              </select>
            </label>
            <button className="primary-button">
              <Icon name="megaphone" size={18} /> Wyślij ogłoszenie
            </button>
          </div>
          <div className="message-preview">
            <span className="eyebrow light">PODGLĄD WIADOMOŚCI</span>
            <div className="phone-message">
              <div className="message-logo">
                <span className="brand-mark">
                  <Icon name="building" size={17} />
                </span>
                <strong>Domu</strong>
              </div>
              <small>TERAZ</small>
              <h3>Przegląd instalacji przeciwpożarowej</h3>
              <p>
                W czwartek w godzinach 9:00–12:00 odbędzie się planowy przegląd
                instalacji...
              </p>
            </div>
          </div>
        </section>
      </>
    )
  }
  return (
    <>
      <section className="hero-row compact">
        <div>
          <span className="eyebrow dark">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <button className="secondary-button">Eksportuj raport</button>
      </section>
      <section className="panel large-panel">
        <div className="room-tabs">
          <button className="active">Otwarte 14</button>
          <button>W realizacji 8</button>
          <button>Zamknięte</button>
        </div>
        {[
          ["#0148", "Brak ciepłej wody", "A-103 · Lena Bąk", "Pilne", "urgent"],
          [
            "#0147",
            "Zablokowane drzwi balkonowe",
            "C-221 · Jan Nowak",
            "Wysoki",
            "progress",
          ],
          ["#0146", "Nie działa lodówka", "B-309 · Iga Wilk", "Nowe", "new"],
          [
            "#0145",
            "Pęknięta półka w szafie",
            "A-118 · Maciej Kot",
            "Nowe",
            "new",
          ],
        ].map((item) => (
          <button className="ticket-row" key={item[0]}>
            <span className="ticket-number">{item[0]}</span>
            <div>
              <strong>{item[1]}</strong>
              <small>{item[2]}</small>
            </div>
            <span className={`status ${item[4]}`}>{item[3]}</span>
            <Icon name="chevron" size={18} />
          </button>
        ))}
      </section>
    </>
  )
}

function ReportModal({ close }: { close: () => void }) {
  const [sent, setSent] = useState(false)
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={close} aria-label="Zamknij">
          <Icon name="close" size={19} />
        </button>
        {sent ? (
          <div className="success-state">
            <span>
              <Icon name="check" size={28} />
            </span>
            <h2 id="modal-title">Zgłoszenie wysłane</h2>
            <p>
              Administrator otrzymał Twoją wiadomość. Numer sprawy: <b>#0149</b>
              .
            </p>
            <button className="primary-button" onClick={close}>
              Gotowe
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow dark">NOWE ZGŁOSZENIE</span>
            <h2 id="modal-title">Co wymaga naprawy?</h2>
            <p className="modal-intro">
              Opisz problem, a administracja skieruje go do odpowiedniej osoby.
            </p>
            <div className="modal-form">
              <label>
                <span>Kategoria</span>
                <select>
                  <option>Instalacja wodna</option>
                  <option>Elektryka</option>
                  <option>Wyposażenie pokoju</option>
                  <option>Inne</option>
                </select>
              </label>
              <label>
                <span>Miejsce</span>
                <input defaultValue="Pokój B-214" />
              </label>
              <label>
                <span>Opis problemu</span>
                <textarea placeholder="Napisz, co się dzieje..." />
              </label>
              <button className="primary-button" onClick={() => setSent(true)}>
                Wyślij zgłoszenie <Icon name="arrow" size={18} />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState("admin")
  const content =
    active === "admin" ? (
      <AdminDashboard navigate={setActive} />
    ) : (
      <AdminSection type={active} />
    )

  return (
    <div className="app-shell">
      <div className="app-main">
        <div className="admin-header">
          <Header />
          <TopNavigation active={active} setActive={setActive} />
        </div>
        <main>{content}</main>
      </div>
    </div>
  )
}
