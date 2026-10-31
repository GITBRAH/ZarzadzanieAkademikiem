# AKAnet v2 - System Zarządzania Domem Studenckim

Projekt **ZarzAka_v2** to kompleksowy, nowoczesny system zarządzania akademikiem (*Akademik Olimp*) łączący pierwotną funkcjonalność `ZarzadzanieAkademikiem` z ulepszeniami prototypu zarządcy `admin_aka_copy`.

System zrealizowany w technologiach:
- **Backend:** C# / .NET 10 Core Web API
- **Baza danych:** PostgreSQL 16 (Entity Framework Core 10 + Npgsql)
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS

---

## 🌟 Najważniejsze Ulepszenia w Wersji v2

### 1. Ekran Główny dla Niezalogowanego Uczestnika (Ekran Zero)
- Po załadowaniu strony użytkownik trafia na **Ekran Główny** jako niezalogowany gość.
- **Wszystkie zakładki w menu bocznym są widoczne**, lecz pozostają **niedostępne / zablokowane** (z oznaczeniem kłódki) do czasu zalogowania.
- Kliknięcie w dowolną zablokowaną zakładkę natychmiast wyświetla modal logowania z czytelnym komunikatem.
- Ekran powitalny zawiera podsumowanie infrastruktury akademika (412/480 miejsc, pralnie, boiska, recepcja 24/7), aktualności oraz regulamin.
- Przycisk **"Zaloguj się do systemu"** otwiera szybkie logowanie 1-klikiem na konta demo lub formularz autoryzacji.
- Po zalogowaniu lub przełączeniu konta użytkownik **zawsze automatycznie ląduje w menu głównym (pulpicie)**.
- Przycisk **"Wyloguj się"** natychmiast przywraca stan ekranu zero z zablokowanymi zakładkami.

### 2. Spójny Styl z Dynamicznym Rozróżnieniem Kolorystycznym
Układ, proporcje, typografia (Manrope / DM Sans), zaokrąglenia i architektura komponentów pozostają w 100% spójne. Panele różnią się wyłącznie dedykowaną paletą kolorów:
- **Panel Użytkownika / Mieszkańca (Niebieski):** Klasyczny, głęboki granat i błękit (`linear-gradient(165deg, #0d3768, #092b55, #071f40)`), błękitne akcenty i przyciski.
- **Panel Administratora (Zielony / Forest Ink + Lime):** Prestiżowa paleta głębokiej zieleni leśnej i limonki (`linear-gradient(165deg, #1f4035, #16362c, #0d241c)`), limonkowy akcent (`#d6ff63`), przyciski z cieniem z prototypu `admin_aka_copy`.
- **Tryb Nocny (Dark Mode):** Dedykowany przełącznik w nagłówku umożliwiający pracę w warunkach nocnych.

### 3. Nowe Funkcjonalności Administratora (z prototypu `admin_aka_copy`)
- **Centrum Operacyjne (Dashboard Zarządcy):**
  - Statystyki na żywo: *Mieszkańcy (412, 86% obłożenia)*, *Otwarte usterki (14)*, *Dziś rezerwacji (38)*, *Nowe wnioski (27)*.
  - Sekcja priorytetowych usterek do natychmiastowej obsługi.
  - Szybkie akcje: *Znajdź mieszkańca*, *Wyślij komunikat*, *Grafik rezerwacji*, *Weryfikacja podań*.
- **Moduł Mieszkańcy i Pokoje (Finder & Ewidencja):**
  - **Wyszukiwanie po numerze pokoju:** Natychmiastowe filtrowanie (np. `B-214`, `A-103`), podgląd obłożenia, piętra, listy lokatorów z awatarami i numerami indeksu.
  - **Wyszukiwanie po nazwisku mieszkańca:** Szybkie przypisanie studenta do pokoju z plakietką pokoju.
  - **Ewidencja pokoi:** Filtry (*Wszystkie pokoje*, *Wolne miejsca*, *Pełne*) wraz z tabelą stanu zakwaterowania.
- **Kreator Ogłoszeń z Podglądem Mobilnym (Live Phone Preview):**
  - Formularz z wyborem grupy docelowej (*Wszyscy mieszkańcy*, *Budynek A/B/C*, *Piętro 1/2/3*) oraz priorytetu.
  - **Interaktywny podgląd na smartfonie na żywo** — treść i tytuł aktualizują się w czasie rzeczywistym podczas pisania.
  - Publikowanie ogłoszeń na tablicy oraz możliwość ich usuwania przez administratora.
- **Zarządzanie Usterkami i Eksport Raportu:**
  - Numery spraw w formacie `#0148`, `#0147`...
  - Filtry statusu (*Wszystkie*, *Otwarte*, *W realizacji*, *Rozwiązane*).
  - Przycisk **"Eksportuj raport"** generujący kompletny plik raportu w formacie **CSV**.
  - Okno aktualizacji statusu z dodawaniem oficjalnej odpowiedzi technika.
- **Globalna Wyszukiwarka (⌘ K / Ctrl+K):**
  - Skrót klawiszowy otwierający szybkie przeszukiwanie modułów, pokoi, studentów i komunikatów.

---

## 🏛️ Pełna Lista Funkcjonalności

1. **Rezerwacje (Pralnie i Suszarnie oraz Boiska sportowe):**
   - Wybór daty z kalendarza 5-dniowego.
   - Siatka godzinowa w czasie rzeczywistym z blokowaniem zajętych terminów.
   - Odwoływanie własnych rezerwacji i podgląd harmonogramu.
2. **Usterki i Naprawy:**
   - Zgłaszanie problemów z kategoryzacją (*Hydraulika*, *Elektryka*, *Meble*, *Stolarka*, *Internet*).
   - Śledzenie postępów i odpowiedzi konserwatora.
3. **Podania i Wnioski:**
   - Składanie podań o zmianę pokoju, nocleg gościa, przedłużenie pobytu itp.
   - Podejmowanie wiążących decyzji przez zarządcę z uzasadnieniem.
4. **Mój Pokój:**
   - Dane o numerze, budynku, współlokatorach, opłatach, kaucji i inwentarzu pokoju.
5. **Ogłoszenia:**
   - Tablica ogłoszeń z odznakami dat i podziałem na kategorie.

---

## 🔑 Konta Testowe (Szybki Wybór Demo)

| Rola | Imię i Nazwisko | E-mail | Hasło | Dostęp / Uprawnienia |
| :--- | :--- | :--- | :--- | :--- |
| **Mieszkaniec** | Jan Makara | `jan.makara@student.pl` | `password123` | Rezerwacje, usterki, wgląd w pokój B-214 |
| **Administrator** | Administracja Akademika | `admin@akanet.pl` | `admin123` | Centrum operacyjne, mieszkańcy i pokoje, kreator ogłoszeń, raporty |

---

## 🚀 Uruchomienie Projektu

### 1. Frontend (React + Vite)
```bash
cd /Users/jano/ai/git_repos/ZarzAka_v2/frontend
npm run dev
```
Aplikacja wystartuje pod adresem: `http://localhost:3000` (lub `http://localhost:5173`).

### 2. Backend (.NET 10 API — opcjonalny, frontend posiada pełny fallback)
```bash
cd /Users/jano/ai/git_repos/ZarzAka_v2/backend/AkaNet.Api
dotnet run --launch-profile http
```
Backend wystartuje pod adresem: `http://localhost:5100`.

---

## 📂 Struktura ZarzAka_v2

```
ZarzAka_v2/
├── admin_aka_copy/          # Oryginalny prototyp panelu zarządcy
├── figma_copy/              # Oryginalny prototyp Figma panelu studenta
├── backend/
│   ├── AkaNet.Api/          # Kontrolery API, DbContext, JWT, Modele
│   └── AkaNet.sln
├── frontend/
│   ├── src/
│   │   ├── components/      # Sidebar, Header, GlobalSearchModal, UserSwitcherModal, Modal, Icon
│   │   ├── pages/
│   │   │   ├── GuestLandingPage.tsx    # Ekran główny niezalogowanego użytkownika
│   │   │   ├── DashboardPage.tsx       # Pulpit mieszkańca (Jan Makara)
│   │   │   ├── AdminDashboardPage.tsx  # Centrum operacyjne zarządcy
│   │   │   ├── AdminResidentsPage.tsx  # Mieszkańcy i pokoje (Finder z prototypu)
│   │   │   ├── BookingPage.tsx         # Pralnie i boiska
│   │   │   ├── MaintenancePage.tsx     # Usterki z eksportem CSV
│   │   │   ├── ApplicationsPage.tsx    # Podania i decyzje
│   │   │   ├── MyRoomPage.tsx          # Mój pokój
│   │   │   └── NoticesPage.tsx         # Ogłoszenia z podglądem mobilnym
│   │   ├── services/api.ts  # Klient API z pełnym fallbackiem offline
│   │   ├── types/index.ts   # Typy TypeScript
│   │   ├── App.tsx          # Główny szkielet i routing stanów
│   │   └── index.css        # Style, motywy: .theme-resident, .theme-admin, .theme-guest, .dark
│   └── package.json
└── README.md
```
