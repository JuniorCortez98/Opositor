@echo off
rem Arranque de la plataforma Opositor · AGE en Windows.
rem Doble clic en este archivo o ejecuta: .\start.cmd
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js no esta instalado. Descargalo en https://nodejs.org
  pause
  exit /b 1
)

node server.js --open
pause
