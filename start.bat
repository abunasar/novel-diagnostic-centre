@echo off
setlocal
title LabFlow Pro - Diagnostic Laboratory Suite
cd /d "%~dp0"
set "PATH=%ProgramFiles%\nodejs;%PATH%"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm are required. Install Node.js 20 or later, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing application dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

call npm run dev -- --open

