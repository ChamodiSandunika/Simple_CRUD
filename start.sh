#!/bin/bash

echo "===================================="
echo "Book Management System - Quick Start"
echo "===================================="
echo

echo "Starting Backend (Spring Boot)..."
echo
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

echo "Waiting 15 seconds for backend to start..."
sleep 15

echo
echo "Starting Frontend (Next.js)..."
echo
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "===================================="
echo "Both servers are starting..."
echo "===================================="
echo
echo "Backend: http://localhost:8080/api/books"
echo "Frontend: http://localhost:3000"
echo
echo "Opening browser..."
sleep 3

# Open browser based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000
fi

echo
echo "===================================="
echo "Application Started Successfully!"
echo "===================================="
echo
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo
echo "To stop the servers, run:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
