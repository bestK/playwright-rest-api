@echo off
:: autor: claude
:: designer: liukl
chcp 936 >nul
setlocal enabledelayedexpansion

:: 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo 此脚本需要管理员权限才能运行。
    echo 请右键点击此脚本，选择"以管理员身份运行"。
    pause
    exit /b 1
)

:menu
echo 请选择操作：
echo 1. 设置端口转发
echo 2. 清除端口转发
echo 3. 查看当前转发规则
echo 4. 退出
choice /c 1234 /n /m "请输入您的选择 (1/2/3/4): "

if errorlevel 4 exit
if errorlevel 3 goto showRules
if errorlevel 2 goto clearForward
if errorlevel 1 goto setForward
goto menu

:setForward
:inputA
set /p "portA=请输入要开放的端口 A (1-65535): "
call :checkPort %portA%
if errorlevel 1 (
    echo 无效的端口号，请重新输入。
    goto inputA
)

:inputB
set /p "portB=请输入要转发到的本地端口 B (1-65535): "
call :checkPort %portB%
if errorlevel 1 (
    echo 无效的端口号，请重新输入。
    goto inputB
)

:: 添加防火墙规则，开放端口 A
netsh advfirewall firewall add rule name="开放端口 %portA%" dir=in action=allow protocol=TCP localport=%portA%

:: 设置端口转发
netsh interface portproxy add v4tov4 listenport=%portA% listenaddress=0.0.0.0 connectport=%portB% connectaddress=127.0.0.1

echo 端口转发已设置：%portA% -^> 127.0.0.1:%portB%
echo 端口 %portA% 已在防火墙中开放
goto end

:clearForward
:inputClear
set /p "portA=请输入要清除的端口 A (1-65535): "
call :checkPort %portA%
if errorlevel 1 (
    echo 无效的端口号，请重新输入。
    goto inputClear
)

:: 删除防火墙规则
netsh advfirewall firewall delete rule name="开放端口 %portA%" protocol=TCP localport=%portA%

:: 删除端口转发
netsh interface portproxy delete v4tov4 listenport=%portA% listenaddress=0.0.0.0

echo 端口 %portA% 的转发规则和防火墙规则已清除
goto end

:showRules
echo 当前的端口转发规则：
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