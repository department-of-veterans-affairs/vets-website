#!/bin/bash

# Script to start mock API with auto-port selection
# Automatically finds the next available port starting from 3000
# Usage: ./start-mock-api.sh [starting_port]

# Default starting port (3000 is default for mock API, 3001 is for watch server)
STARTING_PORT=${1:-3000}
PORT=$STARTING_PORT

# Function to check if a port is available
is_port_available() {
  ! lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

echo "🔍 Auto-port: Checking for available port starting from $STARTING_PORT..."

# Find next available port
while ! is_port_available $PORT; do
  echo "   Port $PORT is already in use, trying next port..."
  PORT=$((PORT + 1))
done

echo "✅ Found available port: $PORT"
echo "🚀 Starting mock API server..."
echo ""
yarn mock-api --responses src/applications/survivors-benefits/tests/fixtures/mocks/local-mock-responses.js --port $PORT
