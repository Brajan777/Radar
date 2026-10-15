@echo off
title Subir Radar a GitHub
color 0B
echo ========================================================
echo         SUBIENDO RADAR A GITHUB (Brajan777/Radar)
echo ========================================================
echo.
cd /d "C:\Proyectos\Radar"
echo Verificando estado local...
git status
echo Preparando y agregando archivos modificados...
git add .
echo Guardando version de Radar Sur...
git commit -m "feat: expansion a Radar Sur (Villa Nueva, Petapa, Canales), cupones QR y asistente IA"
echo.
echo Subiendo a GitHub...
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo      SUBIDA COMPLETADA CON EXITO A GITHUB!
    echo ========================================================
    echo Tu codigo ya esta en la nube:
    echo https://github.com/Brajan777/Radar
) else (
    echo ========================================================
    echo   Hubo un problema o se cancelo la autorizacion.
    echo ========================================================
)
echo.
pause
