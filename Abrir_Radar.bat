@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Radar - Plataforma Oficial
cd /d "%~dp0"

echo ===============================================================================
echo   ██████╗  █████╗ ██████╗  █████╗ ██████╗ 
echo   ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗
echo   ██████╔╝███████║██║  ██║███████║██████╔╝
echo   ██╔══██╗██╔══██║██║  ██║██╔══██║██╔══██╗
echo   ██║  ██║██║  ██║██████╔╝██║  ██║██║  ██║
echo   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
echo ===============================================================================
echo                         RADAR - PLATAFORMA OFICIAL
echo               Iniciando plataforma web en http://localhost:3000
echo ===============================================================================
echo.

:: 1. Comprobar si node_modules existe
if not exist "%~dp0node_modules\" (
    echo [*] Instalando dependencias del proyecto por primera vez...
    call npm.cmd install --legacy-peer-deps
    if errorlevel 1 (
        echo [ERROR] No se pudieron instalar las dependencias. Verifica Node.js.
        pause
        exit /b 1
    )
)

:: 2. Asegurar que .env exista
if not exist "%~dp0.env" (
    if exist "%~dp0.env.example" (
        copy "%~dp0.env.example" "%~dp0.env" >nul
    )
)

:: 3. Comprobar si el servidor ya está activo en puerto 3000
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo [OK] El servidor Radar ya está activo en el puerto 3000.
) else (
    echo [*] Iniciando servidor Radar (Vite + Express)...
    start "Servidor Radar (http://localhost:3000)" /D "%~dp0" cmd /k "npx.cmd tsx server.ts"
    timeout /t 3 /nobreak >nul
)

:: 4. Abrir la web en el navegador
echo.
echo [🚀] Abriendo Radar en tu navegador: http://localhost:3000
start http://localhost:3000

echo.
echo ===============================================================================
echo  La plataforma web Radar ya está cargando en tu navegador.
echo  Puedes minimizar esta ventana. Para cerrar el servidor cuando termines,
echo  simplemente cierra la ventana de la consola del servidor.
echo ===============================================================================
echo.
timeout /t 5 >nul
exit /b 0
