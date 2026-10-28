#!/usr/bin/env bash

# Ustalenie katalogu głównego projektu
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Dodanie ścieżek Homebrew do PATH (dla Apple Silicon i Intel)
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/opt/homebrew/opt/postgresql@16/bin:/usr/local/bin:$PATH"

echo "=== Uruchamianie AKAnet System Zarządzania Akademikiem ==="

# 1. Sprawdzenie i uruchomienie bazy PostgreSQL
if ! pg_isready -q 2>/dev/null; then
  echo "Uruchamianie usługi PostgreSQL..."
  brew services start postgresql@16 2>/dev/null || true
  sleep 2
fi

# 2. Uruchomienie Backendu (.NET Core)
echo "Uruchamianie Backendu C# (.NET Core Web API na porcie 5000)..."
(
  cd "$ROOT_DIR/backend/AkaNet.Api" && dotnet run --launch-profile http
) &
BACKEND_PID=$!

# Obsługa zamknięcia skryptu (Ctrl+C) - zabicie procesu backendu
cleanup() {
  echo ""
  echo "Zamykanie AKAnet..."
  if kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Krótkie odczekanie na start backendu
sleep 2

# 3. Uruchomienie Frontendu (React Vite na porcie 3000)
echo "Uruchamianie Frontendu (React Vite na porcie 3000)..."
cd "$ROOT_DIR/frontend" && npm run dev
