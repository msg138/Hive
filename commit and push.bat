@echo off
set /p message=Enter message:%=%
git add *
git commit -a -m "%message%"
git push https://gitlab.com/msg138/hive.git
pause