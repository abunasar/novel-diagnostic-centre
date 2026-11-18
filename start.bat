@echo off
setlocal
title LabFlow Pro - Diagnostic Laboratory Suite
cd /d "%~dp0"
set "PATH=%ProgramFiles%\nodejs;%PATH%"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm were not found. Installing a portable Node.js LTS runtime...
  set "NODE_HOME="
  for /f "usebackq delims=" %%i in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\ensure-node.ps1"`) do set "NODE_HOME=%%i"
  if not defined NODE_HOME (
    echo Could not install Node.js. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
if defined NODE_HOME set "PATH=%NODE_HOME%;%PATH%"
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js setup finished, but npm could not be found.
  pause
  exit /b 1
)

call npm ls --depth=0 >nul 2>nul
if errorlevel 1 (
  echo Required packages are missing. Installing application dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

call npm run dev -- --open

