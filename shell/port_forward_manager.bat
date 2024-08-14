@echo off
:: autor: claude
:: designer: liukl
chcp 936 >nul
setlocal enabledelayedexpansion

:: ������ԱȨ��
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo �˽ű���Ҫ����ԱȨ�޲������С�
    echo ���Ҽ�����˽ű���ѡ��"�Թ���Ա�������"��
    pause
    exit /b 1
)

:menu
echo ��ѡ�������
echo 1. ���ö˿�ת��
echo 2. ����˿�ת��
echo 3. �鿴��ǰת������
echo 4. �˳�
choice /c 1234 /n /m "����������ѡ�� (1/2/3/4): "

if errorlevel 4 exit
if errorlevel 3 goto showRules
if errorlevel 2 goto clearForward
if errorlevel 1 goto setForward
goto menu

:setForward
:inputA
set /p "portA=������Ҫ���ŵĶ˿� A (1-65535): "
call :checkPort %portA%
if errorlevel 1 (
    echo ��Ч�Ķ˿ںţ����������롣
    goto inputA
)

:inputB
set /p "portB=������Ҫת�����ı��ض˿� B (1-65535): "
call :checkPort %portB%
if errorlevel 1 (
    echo ��Ч�Ķ˿ںţ����������롣
    goto inputB
)

:: ��ӷ���ǽ���򣬿��Ŷ˿� A
netsh advfirewall firewall add rule name="���Ŷ˿� %portA%" dir=in action=allow protocol=TCP localport=%portA%

:: ���ö˿�ת��
netsh interface portproxy add v4tov4 listenport=%portA% listenaddress=0.0.0.0 connectport=%portB% connectaddress=127.0.0.1

echo �˿�ת�������ã�%portA% -^> 127.0.0.1:%portB%
echo �˿� %portA% ���ڷ���ǽ�п���
goto end

:clearForward
:inputClear
set /p "portA=������Ҫ����Ķ˿� A (1-65535): "
call :checkPort %portA%
if errorlevel 1 (
    echo ��Ч�Ķ˿ںţ����������롣
    goto inputClear
)

:: ɾ������ǽ����
netsh advfirewall firewall delete rule name="���Ŷ˿� %portA%" protocol=TCP localport=%portA%

:: ɾ���˿�ת��
netsh interface portproxy delete v4tov4 listenport=%portA% listenaddress=0.0.0.0

echo �˿� %portA% ��ת������ͷ���ǽ���������
goto end

:showRules
echo ��ǰ�Ķ˿�ת������
netsh interface portproxy show all
goto end

:checkPort
set "port=%~1"
if "%port%"=="" exit /b 1
set /a "port_num=port"
if %port_num% lss 1 exit /b 1
if %port_num% gtr 65535 exit /b 1
exit /b 0

:end
pause
goto menu