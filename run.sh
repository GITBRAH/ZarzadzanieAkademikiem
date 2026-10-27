#!/usr/bin/env bash

echo "=== Uruchamianie AKAnet System Zarządzania Akademikiem ==="

# Uruchomienie PostgreSQL jeśli nie działa
if ! pg_isready -q; then
  echo "Uruchamianie PostgreSQL..."
  brew services start postgresql@16
fi

# Uruchomienie Backendu (.NET) w tle
echo "Uruchamianie Backendu C# (.NET Core Web API)..."
cd backend/AkaNet.Api && dotnet run --launch-profile http &
BACKEND_PID=$!

# Uruchomienie Frontendu (React Vite)
echo "Uruchamianie Frontendu (React Vite)..."
cd ../../frontend && npm run dev

# Sprzątanie po wyjściu
kill $BACKEND_PID
