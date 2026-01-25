@echo off
echo Syncing with GitHub...
git add .
set /p msg="Enter commit message (default: Auto sync): "
if "%msg%"=="" set msg="Auto sync %date% %time%"
git commit -m "%msg%"
git push
echo Done!
pause
