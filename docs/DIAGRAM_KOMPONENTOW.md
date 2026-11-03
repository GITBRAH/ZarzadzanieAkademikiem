# Diagram Struktury: Widok Deweloperski (UML Component Diagram)
**Projekt:** AkaNet v2 – System Zarządzania Domem Studenckim  
**Data wygenerowania:** 2026-11-03  

---

## 1. Wizualizacja Mermaid (Podgląd w Markdown)

```mermaid
flowchart TD
    classDef comp fill:#F0F4F8,stroke:#2B579A,stroke-width:2px,color:#102A43,rx:4,ry:4;
    classDef pkg fill:#FAFAFC,stroke:#829AB1,stroke-width:1.5px,stroke-dasharray: 4 4,color:#334E68,font-weight:bold;
    classDef db fill:#EBF8FF,stroke:#3182CE,stroke-width:2px,color:#2B6CB0;
    classDef iface fill:#FFFFFF,stroke:#DD6B20,stroke-width:2px,color:#C05621,font-size:12px;

    subgraph PRESENTATION["«subsystem» Warstwa Prezentacji (Frontend SPA)"]
        UI_USER["«component»\nModuł Mieszkańca\n(Dashboard, Pokoje, Usterki)"]:::comp
        UI_ADMIN["«component»\nModuł Administratora\n(Ewidencja, Kreator, Raporty)"]:::comp
        API_CLIENT["«component»\nKlient Komunikacji API\n(api.ts / Axios)"]:::comp

        UI_USER -->|«use»| API_CLIENT
        UI_ADMIN -->|«use»| API_CLIENT
    end

    IFACE_REST(["( ) Interfejs REST API\n(JSON over HTTPS / JWT)"]):::iface

    subgraph SERVER["«subsystem» Warstwa Serwerowa (Backend .NET 10 API)"]
        CTRL["«component»\nKontrolery REST API\n(Auth, Rooms, Reservations, Maintenance...)"]:::comp
        AUTH["«component»\nModuł Bezpieczeństwa\n(JwtService)"]:::comp
        DATA_ACCESS["«component»\nWarstwa Mapowania ORM\n(AkaNetDbContext / EF Core 10)"]:::comp

        CTRL -.->|«use»| AUTH
        CTRL -->|«use»| DATA_ACCESS
    end

    IFACE_DB(["( ) Interfejs Bazy Danych\n(Npgsql / TCP 5432)"]):::iface

    subgraph PERSISTENCE["«subsystem» Warstwa Danych"]
        DB[("«database»\nPostgreSQL 16\n(Baza Relacyjna)")]:::db
    end

    API_CLIENT ==>|«call»| IFACE_REST
    IFACE_REST ==>|obsługuje| CTRL

    DATA_ACCESS ==>|«SQL Queries»| IFACE_DB
    IFACE_DB ==>|udostępnia| DB
```

---

## 2. Źródło PlantUML (.puml)

Plik źródłowy znajduje się w: [`docs/diagram_komponentow.puml`](file:///Users/jano/ai/git_repos/ZarzAka_v2/docs/diagram_komponentow.puml)

```plantuml
@startuml Diagram_Komponentow_AkaNet
!theme plain
skinparam componentStyle uml2
skinparam shadowing false
skinparam roundCorner 8
skinparam defaultFontName "Segoe UI", Arial, sans-serif

skinparam package {
  BackgroundColor #F8FAFC
  BorderColor #64748B
  FontColor #1E293B
  FontStyle bold
}

skinparam component {
  BackgroundColor #F1F5F9
  BorderColor #2563EB
  FontColor #0F172A
}

skinparam interface {
  BackgroundColor #FFFFFF
  BorderColor #EA580C
  FontColor #C2410C
}

skinparam database {
  BackgroundColor #EFF6FF
  BorderColor #1D4ED8
  FontColor #1E3A8A
}

skinparam arrow {
  Color #334155
  FontColor #475569
}

package "Warstwa Prezentacji (Frontend SPA - React 19 / Vite)" as PkgFrontend {
  [Moduł Interfejsu Mieszkańca\n(Dashboard, Pokoje, Rezerwacje)] as UI_Resident
  [Moduł Zarządcy i Administracji\n(Ewidencja, Kreator Ogłoszeń, Raporty)] as UI_Admin
  [Klient Komunikacji API\n(api.ts / Axios Client)] as API_Client

  UI_Resident ..> API_Client : <<use>>
  UI_Admin ..> API_Client : <<use>>
}

interface "REST API (HTTPS / JSON + JWT)" as I_REST

package "Warstwa Serwerowa (Backend - .NET 10 Web API)" as PkgBackend {
  [Kontrolery REST API\n(AuthController, RoomsController,\nMaintenanceController, etc.)] as Controllers
  [Moduł Bezpieczeństwa i Tokenów\n(JwtService)] as AuthService
  [Warstwa Mapowania Obiektowego\n(AkaNetDbContext / EF Core 10)] as DataAccess

  Controllers -up- I_REST : udostępnia
  Controllers ..> AuthService : <<use>>
  Controllers ..> DataAccess : <<use>>
}

interface "Npgsql Driver (TCP 5432)" as I_DB

package "Warstwa Danych (PostgreSQL Database)" as PkgDB {
  database "PostgreSQL 16\n(Baza Relacyjna)" as DB
  DB -up- I_DB : udostępnia
}

API_Client ..( I_REST : <<call>>
DataAccess ..( I_DB : <<query>>

@enduml
```

---

## 3. Opis architektoniczny do sprawozdania / pracy dyplomowej

### Cel i widok architektoniczny
Diagram przedstawia **Widok deweloperski (Development View)** zgodnie z modelem widoków architektonicznych Kruchtena 4+1, wykonany w notacji **UML 2.5 Component Diagram**. Koncentruje się na organizacji modułów oprogramowania, pakietów oraz interfejsów łączących poszczególne warstwy.

### Opis warstw i komponentów:
1. **Warstwa Prezentacji (Frontend SPA):**
   - Zrealizowana w bibliotece **React 19** przy użyciu narzędzia **Vite** i stylizacji **Tailwind CSS**.
   - Składa się z modułów widoków dedykowanych mieszkańcom (pulpit lokatora, rezerwacje, zgłoszenia usterek) oraz zarządcy (panel administracyjny, wyszukiwarka pokoi i mieszkańców, kreator ogłoszeń).
   - Wszystkie moduły korzystają z centralnego komponentu komunikacyjnego **`api.ts`**, realizującego żądania asynchroniczne HTTP oraz zarządzanie tokenem autoryzacyjnym.
2. **Warstwa Serwerowa (Backend Web API):**
   - Oparta na frameworku **.NET 10 Core**.
   - Wystawia interfejs **REST API** zabezpieczony nagłówkami `Authorization: Bearer <JWT>`.
   - Moduł **Kontrolerów REST** odbiera żądania, weryfikuje uprawnienia w porozumieniu z usługą **`JwtService`**, a następnie operuje na logice biznesowej i danych.
   - Komponent mapowania obiektowo-relacyjnego **`AkaNetDbContext` (Entity Framework Core 10)** tłumaczy operacje domenowe na zapytania SQL.
3. **Warstwa Danych (Baza Danych):**
   - Silnik bazy relacyjnej **PostgreSQL 16**.
   - Połączenie realizowane jest z wykorzystaniem oficjalnego sterownika **Npgsql** poprzez bezpieczny port TCP 5432.

---

## 4. Jak wygenerować plik graficzny (PNG / SVG / PDF)?

- **Sposób 1 (Najszybszy online - PlantUML):**
  1. Wejdź na [https://www.planttext.com](https://www.planttext.com).
  2. Wklej zawartość pliku [`docs/diagram_komponentow.puml`](file:///Users/jano/ai/git_repos/ZarzAka_v2/docs/diagram_komponentow.puml).
  3. Kliknij **PNG** lub **SVG** aby pobrać gotowy obraz w wysokiej rozdzielczości.
- **Sposób 2 (Mermaid Live Editor):**
  1. Wejdź na [https://mermaid.live](https://mermaid.live).
  2. Wklej blok kodu Mermaid z sekcji 1.
  3. Pobierz plik klikając przycisk **Download PNG** lub **Download SVG**.
