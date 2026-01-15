@echo off
cd /d "%~dp0"
title Actualizador Automatico

echo [1/4] Actualizando JSON...
node update_ladder.js

echo.
echo [2/4] Sincronizando (Pull)...
git pull origin main --rebase

echo.
echo [3/4] Preparando archivos...
:: Usar "git add ." obliga a Git a incluir TODO lo modificado
git add .

:: Esto evita que el script se detenga si no hay cambios reales
git commit -m "Auto-update: %date% %time%"

echo.
echo [4/4] Subiendo a GitHub...
git push origin main

echo.
echo === PROCESO FINALIZADO ===
timeout /t 5
