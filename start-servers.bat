@echo off
echo Starting AI Conglomerate Servers...
echo.

echo Starting 3 Amigos Academy on port 8000...
start "Academy Server" cmd /c "python -m http.server 8000"

echo Starting Portfolio Website on port 8080...
start "Portfolio Server" cmd /c "python -m http.server 8080"

echo.
echo Servers are starting...
echo.
echo Access URLs:
echo - 3 Amigos Academy: http://localhost:8000
echo - Portfolio Website: http://localhost:8080/conglomerate.html
echo - Server Status: http://localhost:8080/server-status.html
echo.
echo Press any key to stop servers...
pause > nul

echo Stopping servers...
taskkill /f /im python.exe > nul 2>&1
echo Servers stopped.
pause
