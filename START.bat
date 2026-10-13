@echo off
title ESAMS - School Management System
cd /d "%~dp0"

echo ===================================================================
echo   ESAMS: Enterprise School Administration Management System
echo ===================================================================
echo.
echo Starting application server...
echo Local Address: http://localhost:3000/
echo.

:: Ensure build exists if fallback is needed
if not exist "%~dp0dist\index.html" (
    call npm.cmd run build
)

:: Launch Vite dev server, with automatic fallback to node serve.cjs
start "ESAMS Server" cmd /k "cd /d ""%~dp0"" && (npm.cmd run dev || node serve.cjs)"

:: Open default web browser
timeout /t 2 /nobreak > nul
start "" "http://localhost:3000/"

echo ===================================================================
echo   Application launched in your default browser!
echo   Local Address: http://localhost:3000/
echo   Leave the "ESAMS Server" window open while using the app.
echo ===================================================================
timeout /t 4 > nul
exit
