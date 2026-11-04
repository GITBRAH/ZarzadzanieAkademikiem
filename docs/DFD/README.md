# Diagramy Przepływu Danych (DFD Poziom 1) – AkaNet v2

Diagramy przepływu danych (**DFD Poziom 1**) zgodne ze ścisłą notacją **Gane-Sarson / Yourdon-DeMarco**, odzwierciedlające wygląd wzorcowego diagramu inżynierskiego ([`DFD.png`](../DFD.png)):
- **Procesy:** Zaokrąglone żółte bloki z górnym paskiem nagłówka i numerem procesu w lewym rogu (`1.0`, `2.0`...).
- **Magazyny Danych:** Bloki z szarym separatorem identyfikatora (`D1`–`D6`) i żółtą sekcją nazwy tabeli bazy PostgreSQL.
- **Encje Zewnętrzne:** Klasyczne żółte prostokąty z wyraźną czarną ramką.
- **Przepływy:** Prostopadłe (ortogonalne) linie ze strzałkami i czytelnymi etykietami.

---

## Spis Diagramów

1. [2.1 Główny Diagram DFD Poziomu 1 (Pełny)](#21-główny-diagram-poziomu-1-pełny) – plik graficzny: [`2.1_DFD_Poziom_1_Glowny.png`](2.1_DFD_Poziom_1_Glowny.png)
2. [2.2A Podsystem Mieszkańca i Zasobów Wspólnych](#22a-podsystem-mieszkańca-i-zasobów-wspólnych-student-view) – plik graficzny: [`2.2A_DFD_Poziom_1_Mieszkaniec.png`](2.2A_DFD_Poziom_1_Mieszkaniec.png)
3. [2.2B Podsystem Zarządcy, Administracji i Analityki](#22b-podsystem-zarządcy-administracji-i-analityki-admin-view) – plik graficzny: [`2.2B_DFD_Poziom_1_Zarzadca.png`](2.2B_DFD_Poziom_1_Zarzadca.png)

---

## 2.1 Główny Diagram Poziomu 1 (Pełny)

![2.1 Główny Diagram DFD Poziomu 1](2.1_DFD_Poziom_1_Glowny.png)

### Kod Mermaid (do edycji online / podglądu tekstowego)
```mermaid
flowchart LR
    classDef entity fill:#FDEAA8,stroke:#111111,stroke-width:1.6px,color:#000000,font-weight:bold;
    classDef proc fill:#FDEAA8,stroke:#111111,stroke-width:1.6px,color:#000000,font-weight:bold;
    classDef store fill:#FDEAA8,stroke:#111111,stroke-width:1.6px,color:#000000,font-weight:bold;

    subgraph ENCJE ["Encje Zewnętrzne"]
        direction TB
        GUEST["Gość / Nowy\n(Ekran Zero)"]:::entity
        STUDENT["Mieszkaniec\n(Jan Makara)"]:::entity
        ADMIN["Zarządca /\nAdministrator"]:::entity
    end

    subgraph PROCESY ["Procesy Logiczne (Poziom 1)"]
        direction TB
        P1(["1.0 | Uwierzytelnianie i JWT"]):::proc
        P2(["2.0 | Ewidencja Kwaterunku"]):::proc
        P3(["3.0 | Rezerwacje Obiektów"]):::proc
        P4(["4.0 | Obsługa Usterek i Napraw"]):::proc
        P5(["5.0 | Procesowanie Podań"]):::proc
        P6(["6.0 | Dystrybucja Ogłoszeń"]):::proc
        P7(["7.0 | Raportowanie i KPI (CSV)"]):::proc
    end

    subgraph BAZA ["Magazyny Danych (PostgreSQL)"]
        direction TB
        D1[("D1 | Użytkownicy i Konta")]:::store
        D2[("D2 | Kwaterunek i Pokoje")]:::store
        D3[("D3 | Obiekty i Rezerwacje")]:::store
        D4[("D4 | Zgłoszenia Usterek")]:::store
        D5[("D5 | Wnioski i Podania")]:::store
        D6[("D6 | Tablica Ogłoszeń")]:::store
    end

    GUEST -->|Formularz rejestracji| P1
    STUDENT -->|Email, Hasło| P1
    P1 -->|Token JWT| STUDENT
    P1 <-->|Weryfikacja BCrypt| D1

    STUDENT -->|Zapytanie o pokój| P2
    P2 -->|Dane pokoju B-214| STUDENT
    D2 -->|Parametry pokoju| P2
    D1 -.->|Współlokatorzy| P2

    STUDENT -->|Data, slot, obiekt| P3
    P3 -->|Potwierdzenie bilet| STUDENT
    P3 <-->|Zapis / Grafik slotów| D3

    STUDENT -->|Formularz usterki| P4
    P4 -->|Nr sprawy #0148| STUDENT
    P4 <-->|Zapis / Historia usterek| D4
    ADMIN -->|Status + Odpowiedź| P4

    STUDENT -->|Wniosek o pokój/gościa| P5
    P5 -->|Wynik rozpatrzenia| STUDENT
    ADMIN -->|Decyzja zarządcy| P5
    P5 <-->|Zapis / Lista wniosków| D5

    ADMIN -->|Nowe ogłoszenie / Usuń| P6
    P6 <-->|Zapis / Lista ogłoszeń| D6
    P6 -->|Tablica ogłoszeń i alerty| STUDENT

    ADMIN -->|Żądanie eksportu CSV| P7
    P7 -->|Plik Raport_Usterek.csv| ADMIN
    D2 -.->|Obłożenie 86%| P7
    D4 -.->|Otwarte awarie 14| P7
```

---

## 2.2A Podsystem Mieszkańca i Zasobów Wspólnych (Student View)

Dedykowany widok ścieżki studenta – kwaterunek, pralnie/boiska oraz zgłoszenia napraw.

![2.2A Podsystem Mieszkańca i Zasobów Wspólnych](2.2A_DFD_Poziom_1_Mieszkaniec.png)

Plik źródłowy PlantUML: [`2.2A_DFD_Poziom_1_Mieszkaniec.puml`](2.2A_DFD_Poziom_1_Mieszkaniec.puml)

---

## 2.2B Podsystem Zarządcy, Administracji i Analityki (Admin View)

Dedykowany widok centrum operacyjnego zarządcy – serwis techniczny, rozpatrywanie podań, tablica ogłoszeń oraz raportowanie.

![2.2B Podsystem Zarządcy, Administracji i Analityki](2.2B_DFD_Poziom_1_Zarzadca.png)

Plik źródłowy PlantUML: [`2.2B_DFD_Poziom_1_Zarzadca.puml`](2.2B_DFD_Poziom_1_Zarzadca.puml)
