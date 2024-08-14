@echo off
setlocal enabledelayedexpansion

:input_chrome_path
set /p "chrome_path=������Chromeִ���ļ�������·��: "
if not exist "%chrome_path%" (
    echo ����: Chromeִ���ļ������ڣ����������롣
    goto :input_chrome_path
)

:input_check_interval
set /p "check_interval=��������ʱ�������룩: "
echo %check_interval%| findstr /r "^[1-9][0-9]*$" >nul
if errorlevel 1 (
    echo ����: ���ʱ���������������������������롣
    goto :input_check_interval
)

:input_debug_port
set /p "debug_port=������Զ�̵��Զ˿ڣ�1024-65535��: "
echo %debug_port%| findstr /r "^[1-9][0-9]*$" >nul
if errorlevel 1 (
    echo ����: ���Զ˿ڱ����������������������롣
    goto :input_debug_port
)
if %debug_port% LSS 1024 (
    echo ����: ����ʹ��1024���ϵĶ˿ںţ���������ִ�С�
)
if %debug_port% GTR 65535 (
    echo ����: �˿ںŲ��ܴ���65535�����������롣
    goto :input_debug_port
)

echo.
echo ������Ĳ������£�
echo Chrome·��: %chrome_path%
echo �����: %check_interval%��
echo ���Զ˿�: %debug_port%
echo.

set /p "confirm=������Ϣ��ȷ��(Y/N): "
if /i "%confirm%" neq "Y" goto :input_chrome_path

echo ����ȷ����ϣ���ʼ�ػ�Chrome����...

:loop
REM ���Chrome���̺�ָ���˿��Ƿ����
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo Chromeδ����,��������...
    start "" "%chrome_path%" --remote-debugging-port=%debug_port%
) else (
    netstat -ano | findstr ":%debug_port%" | findstr "LISTENING" >nul
    if "%ERRORLEVEL%"=="1" (
        echo Chrome�������У������Զ˿�%debug_port%δ������������������Chrome...
        taskkill /F /IM chrome.exe >nul
        start "" "%chrome_path%" --remote-debugging-port=%debug_port%
    ) else (
        echo Chrome�������У��ҵ��Զ˿�%debug_port%�ѿ�����
    )
)

REM �ȴ�ָ����ʱ����
timeout /t %check_interval% /nobreak > nul
goto loop
