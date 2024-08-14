@echo off
setlocal enabledelayedexpansion

:input_chrome_path
set /p "chrome_path=请输入Chrome执行文件的完整路径: "
if not exist "%chrome_path%" (
    echo 错误: Chrome执行文件不存在，请重新输入。
    goto :input_chrome_path
)

:input_check_interval
set /p "check_interval=请输入检查时间间隔（秒）: "
echo %check_interval%| findstr /r "^[1-9][0-9]*$" >nul
if errorlevel 1 (
    echo 错误: 检查时间间隔必须是正整数，请重新输入。
    goto :input_check_interval
)

:input_debug_port
set /p "debug_port=请输入远程调试端口（1024-65535）: "
echo %debug_port%| findstr /r "^[1-9][0-9]*$" >nul
if errorlevel 1 (
    echo 错误: 调试端口必须是正整数，请重新输入。
    goto :input_debug_port
)
if %debug_port% LSS 1024 (
    echo 警告: 建议使用1024以上的端口号，但将继续执行。
)
if %debug_port% GTR 65535 (
    echo 错误: 端口号不能大于65535，请重新输入。
    goto :input_debug_port
)

echo.
echo 您输入的参数如下：
echo Chrome路径: %chrome_path%
echo 检查间隔: %check_interval%秒
echo 调试端口: %debug_port%
echo.

set /p "confirm=以上信息正确吗？(Y/N): "
if /i "%confirm%" neq "Y" goto :input_chrome_path

echo 参数确认完毕，开始守护Chrome进程...

:loop
REM 检查Chrome进程和指定端口是否存在
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo Chrome未运行,正在启动...
    start "" "%chrome_path%" --remote-debugging-port=%debug_port%
) else (
    netstat -ano | findstr ":%debug_port%" | findstr "LISTENING" >nul
    if "%ERRORLEVEL%"=="1" (
        echo Chrome正在运行，但调试端口%debug_port%未开启，正在重新启动Chrome...
        taskkill /F /IM chrome.exe >nul
        start "" "%chrome_path%" --remote-debugging-port=%debug_port%
    ) else (
        echo Chrome正在运行，且调试端口%debug_port%已开启。
    )
)

REM 等待指定的时间间隔
timeout /t %check_interval% /nobreak > nul
goto loop
