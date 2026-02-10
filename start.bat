@echo off
echo ====================================
echo Book Management System - Quick Start
echo ====================================
echo.

echo Starting Backend (Spring Boot)...
echo.
cd backend
start "Backend Server" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo Starting Frontend (Next.js)...
echo.
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ====================================
echo Both servers are starting...
echo ====================================
echo.
echo Backend: http://localhost:8080/api/books
echo Frontend: http://localhost:3000
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:3000

echo.
echo ====================================
echo Application Started Successfully!
echo ====================================
echo.
echo To stop the servers, close the terminal windows
echo or press Ctrl+C in each terminal
echo.
pause
