@echo off
:: Asegura que el script se ejecute en la carpeta donde está guardado
cd /d "%~dp0"
echo ============================================
echo [1/4] Ejecutando update.js con Node.js...
echo ============================================
node update.js

echo.
echo ============================================
echo [2/4] Sincronizando con GitHub (Pull)...
echo ============================================
:: Baja cambios de la nube para evitar errores de "rejected"
git pull origin main --rebase

echo.
echo [3/4] Preparando archivos...
echo ============================================
:: Agregamos todos los cambios (JSON, HTML, CSS)
git add .
git commit -m "Auto-update: %date% %time%"

echo.
echo ============================================
echo [4/4] Subiendo datos a la web...
echo ============================================
git push origin main

echo.
echo ============================================
echo      PROCESO COMPLETADO EXITOSAMENTE
echo ============================================
:: Espera 5 segundos y se cierra solo
timeout /t 5
