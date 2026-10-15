@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Radar - Acceso al Panel de Administración
cd /d "%~dp0"

echo ===============================================================================
echo      RADAR - ACCESO EXCLUSIVO AL PANEL DE ADMINISTRACIÓN
echo ===============================================================================
echo.
echo [*] Este panel está protegido con contraseña de seguridad.
echo [*] Contraseña inicial predeterminada: radar2026
echo.

:: Comprobar si el servidor ya está activo en puerto 3000
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %errorlevel% neq 0 (
    echo [*] Iniciando servidor Radar en segundo plano...
    start "Servidor Radar (http://localhost:3000)" /D "%~dp0" cmd /k "npx.cmd tsx server.ts"
    timeout /t 3 /nobreak >nul
)

echo [🚀] Abriendo Panel de Administración en tu navegador...
start http://localhost:3000/#admin

echo.
echo ===============================================================================
echo  Acceso cargado en tu navegador: http://localhost:3000/#admin
echo  Introduce tu contraseña en la pantalla de seguridad para desbloquearlo.
echo ===============================================================================
echo.
timeout /t 4 >nul
exit /b 0
