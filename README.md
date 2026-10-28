# AKAnet - System Zarządzania Akademikiem

Nowoczesny, kompleksowy system zarządzania domem studenckim zrealizowany na podstawie prototypu interfejsu z Figmy w technologiach:
- **Backend:** C# / .NET 10 Core Web API
- **Baza danych:** PostgreSQL 16 (Entity Framework Core 10 + Npgsql)
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS

---

## 🏛️ Architektura i Funkcjonalności

### 1. Panel Użytkownika & Dashboard
- **Karty szybkiego dostępu:** Przejście do rezerwacji pralni, obiektów sportowych, zgłaszania usterek oraz składania podań.
- **Harmonogram mieszkańca:** Podgląd nadchodzących rezerwacji z możliwością ich natychmiastowego odwołania.
- **Tablica ogłoszeń:** Najświeższe komunikaty od administracji z wyróżnieniem ważnych alertów.

### 2. Moduł Rezerwacji (Pralnie & Boiska)
- Dynamiczny wybór daty (kalendarz dni).
- Wybór lokalizacji i urządzeń (Pralnie w budynkach A, B, C; Boiska wielofunkcyjne, piłkarskie, koszykarskie).
- Interaktywna siatka godzinowa w czasie rzeczywistym blokująca zajęte terminy.
- Podsumowanie wyboru i natychmiastowe potwierdzenie rezerwacji.
- Przegląd historii i aktywnych rezerwacji mieszkańca.

### 3. Zgłaszanie Usterek i Konserwacji
- Zgłaszanie problemów technicznych z podziałem na kategorie (*Hydraulika*, *Elektryka*, *Meble / Stolarka*, *Internet / Sieć*, *Inne*).
- Określanie priorytetu (*Niski*, *Średni*, *Wysoki*, *Pilny / Awaria*).
- Śledzenie statusu naprawy (*Nowe*, *W trakcie*, *Rozwiązane*, *Odrzucone*).
- Narzędzia dla administracji do aktualizacji statusu i dodawania odpowiedzi konserwatora.

### 4. Podania i Wnioski
- Elektroniczny obieg podań (np. *Zmiana pokoju*, *Zgłoszenie noclegu gościa*, *Przedłużenie pobytu*, *Wymiana wyposażenia*, *Wymeldowanie*).
- Śledzenie decyzji kierownictwa akademika i uzasadnień.

### 5. Mój Pokój
- Szczegółowe dane o zakwaterowaniu (numer pokoju, budynek, piętro, status).
- Informacje o współlokatorach i dane kontaktowe.
- Stan rozliczeń finansowych (czynsz miesięczny, kaucja gwarancyjna, status opłat).
- Protokół zdawczo-odbiorczy inwentarza i wyposażenia.
- Podstawowe zasady regulaminu domów studenckich (cisza nocna, goście).

### 6. Autoryzacja i Role
- Uwierzytelnianie oparte o **JWT (JSON Web Tokens)** i haszowanie haseł **BCrypt**.
- Role: **Resident** (Mieszkaniec) oraz **Admin** (Administracja akademika).
- Wbudowany przełącznik kont w interfejsie umożliwiający błyskawiczne testowanie obu ról.

---

## 🔑 Domyślne Konta Testowe (Seed Data)

| Rola | Imię i Nazwisko | E-mail | Hasło | Przypisany Pokój |
| :--- | :--- | :--- | :--- | :--- |
| **Mieszkaniec** | Jan Makara | `jan.makara@student.pl` | `password123` | Pokój 202B (Budynek B) |
| **Mieszkaniec** | Piotr Nowak | `piotr.nowak@student.pl` | `password123` | Pokój 202B (Współlokator) |
| **Administrator** | Administracja Akademika | `admin@akanet.pl` | `admin123` | Dział Administracji |

---

## 🚀 Uruchomienie Projektu

### Wymagania
- .NET 10 SDK
- Node.js (>= 20)
- PostgreSQL 16 (uruchomiony na porcie 5432)

### 1. Baza Danych i Backend (.NET Core)
Baza danych tworzy się i seeduje automatycznie przy pierwszym uruchomieniu backendu.
```bash
cd backend/AkaNet.Api
dotnet run --launch-profile http
```
Backend wystartuje pod adresem: `http://localhost:5100`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend wystartuje pod adresem: `http://localhost:3000` (z proxy do API).

---

## 📂 Struktura Projektu

```
ZarzadzanieAkademikiem/
├── backend/
│   ├── AkaNet.Api/
│   │   ├── Controllers/     # Kontrolery API (Auth, Reservations, Maintenance, Applications, Rooms, Announcements)
│   │   ├── Data/            # DbContext oraz DbInitializer z danymi początkowymi
│   │   ├── DTOs/            # Modele wymiany danych
│   │   ├── Models/          # Encje domenowe bazy PostgreSQL
│   │   ├── Services/        # Serwis tokenów JWT
│   │   └── Program.cs       # Konfiguracja DI, EF Core, CORS i Auth
│   └── AkaNet.sln
├── frontend/
│   ├── src/
│   │   ├── components/      # Sidebar, Header, Modal, Icon, UserSwitcher
│   │   ├── pages/           # Dashboard, Booking, Maintenance, Applications, MyRoom, Notices
│   │   ├── services/        # Klient API (fetch + JWT)
│   │   ├── types/           # Definicje typów TypeScript
│   │   ├── App.tsx          # Główny szkielet aplikacji
│   │   └── index.css        # Kompletny styl (Figma UI Design System + Tailwind)
│   ├── package.json
│   └── vite.config.ts
└── README.md
```
