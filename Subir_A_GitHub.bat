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
echo.
echo Subiendo rama main a GitHub...
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
