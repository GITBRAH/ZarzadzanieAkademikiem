#!/usr/bin/env bash
set -e

# ==============================================================================
# AKAnet v2 - Skrypt uruchomieniowy (One-Click Runner)
# Uruchamia bazę PostgreSQL, Backend (.NET 10 Web API) oraz Frontend (React 19)
# ==============================================================================

# Kolory do komunikatów
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Katalog główny projektu
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Środowisko i ścieżki
export HOME="${HOME:-/Users/jano}"
export DOTNET_CLI_HOME="${DOTNET_CLI_HOME:-$HOME}"
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/opt/homebrew/opt/postgresql@16/bin:/usr/local/bin:$PATH"

echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}   AKAnet v2 - System Zarządzania Domem Studenckim   ${NC}"
echo -e "${CYAN}====================================================${NC}"

# 1. Czyszczenie starych / wiszących procesów na portach 5100 i 3000
cleanup_ports() {
  local pids
  pids=$(lsof -ti :5100,3000 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo -e "${YELLOW}Czyszczenie starych procesów na portach 5100/3000...${NC}"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
}
cleanup_ports

# 2. Sprawdzenie i start PostgreSQL
echo -e "${CYAN}[1/4] Sprawdzanie bazy danych PostgreSQL...${NC}"
if ! pg_isready -q 2>/dev/null; then
  echo -e "${YELLOW}Uruchamianie usługi PostgreSQL...${NC}"
  brew services start postgresql@16 2>/dev/null || brew services start postgresql 2>/dev/null || true
  sleep 2
fi

if pg_isready -q 2>/dev/null; then
  echo -e "${GREEN}✓ Baza PostgreSQL działa poprawnie.${NC}"
else
  echo -e "${YELLOW}Uwaga: Usługa PostgreSQL nie odpowiada na porcie 5432, frontend może działać w trybie fallback.${NC}"
fi

# 3. Sprawdzenie zależności frontendu
if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
  echo -e "${YELLOW}[2/4] Instalowanie zależności frontendu (npm install)...${NC}"
  (cd "$ROOT_DIR/frontend" && npm install)
else
  echo -e "${GREEN}✓ Zależności frontendu są zainstalowane.${NC}"
fi

# 4. Uruchomienie Backendu (.NET Core API) w tle
echo -e "${CYAN}[3/4] Uruchamianie Backendu (.NET 10 API na http://localhost:5100)...${NC}"
(
  cd "$ROOT_DIR/backend/AkaNet.Api"
  exec dotnet run --launch-profile http
) &
BACKEND_PID=$!

# Funkcja czyszcząca przy wyjściu (Ctrl+C)
cleanup() {
  echo ""
  echo -e "${YELLOW}Zamykanie AKAnet...${NC}"
  if kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  cleanup_ports
  echo -e "${GREEN}Wszystkie procesy zostały zatrzymane. Do zobaczenia!${NC}"
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Czekanie na start backendu
echo -e "${CYAN}Oczekiwanie na start API...${NC}"
for i in {1..10}; do
  if curl -s http://localhost:5100/api/announcements >/dev/null 2>&1 || curl -s http://localhost:5100 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend API jest gotowy i odpowiada!${NC}"
    break
  fi
  sleep 1
done

# 5. Uruchomienie przeglądarki i Frontendu
echo -e "${CYAN}[4/4] Uruchamianie Frontendu (React / Vite na http://localhost:3000)...${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}  Aplikacja dostępna pod adresem: http://localhost:3000${NC}"
echo -e "${GREEN}  Backend API dostępny pod adresem: http://localhost:5100${NC}"
echo -e "${YELLOW}  Aby zatrzymać całą aplikację, naciśnij Ctrl + C w tym oknie.${NC}"
echo -e "${GREEN}====================================================${NC}"

# Otwórz przeglądarkę po sekundzie w tle (macOS)
(sleep 1 && open "http://localhost:3000" 2>/dev/null || true) &

# Uruchom Vite w pierwszym planie
cd "$ROOT_DIR/frontend"
exec npm run dev
