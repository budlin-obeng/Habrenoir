@echo off
title Habrenoir Luxury E-Commerce Launcher
echo ========================================================
echo   Launching Maison Habrenoir (Ghana Luxury E-Commerce)
echo ========================================================
echo.
echo 1. Starting Backend API on http://localhost:5000 ...
start "Habrenoir Backend API" cmd /k "cd /d %~dp0server && npm run dev"

echo 2. Starting Frontend Storefront on http://localhost:5173 ...
start "Habrenoir Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo All services are running! You can keep this window or close it.
echo Backend:  http://localhost:5000/api/products
echo Frontend: http://localhost:5173
echo.
pause

