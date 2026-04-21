@echo off
echo [HongPro] Starting Dashboard Activation...
cd /d "%~dp0"
npm install && npm run dev
pause
