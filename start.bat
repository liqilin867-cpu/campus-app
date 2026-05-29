@echo off
chcp 65001 >nul
cd /d "D:\myproject\yidong111"

rem 添加 Node.js 所在目录到 PATH（安装在 D:\）
set "PATH=D:\;%PATH%"

:menu
cls
echo ============================================
echo   校园生活助手 - 启动脚本
echo ============================================
echo.
echo 选择启动模式：
echo.
echo  1. 本地启动（浏览器打开，仅本机访问）
echo  2. 内网穿透 - Pinggy（免费，无需注册）
echo  3. 内网穿透 - Natapp（国内服务，需下载客户端）
echo  4. 内网穿透 - 自定义命令（FRP/Ngrok 等）
echo  0. 退出
echo.
echo ============================================
set /p choice="请选择 [0-4]: "

if "%choice%"=="1" goto local
if "%choice%"=="2" goto tunnel_pinggy
if "%choice%"=="3" goto tunnel_natapp
if "%choice%"=="4" goto tunnel_custom
if "%choice%"=="0" exit /b
goto menu

rem ============ 构建并启动服务器 ============
:build_and_start
if not exist "node_modules" (
    echo [1/3] 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo 安装依赖失败，请检查网络后重试。
        pause
        exit /b 1
    )
) else (
    echo [1/3] 依赖已安装
)

echo [2/3] 正在构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败，请检查代码错误。
    pause
    exit /b 1
)

echo [3/3] 正在启动服务器...
start /B node server.cjs > server.log 2>&1
timeout /t 2 /nobreak >nul

powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 3; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %errorlevel% equ 0 (
    echo 服务器已成功启动！
) else (
    echo 警告：服务器可能未正常启动，请检查 server.log
)
echo.
exit /b 0

rem ============ 停止服务器 ============
:stop_server
echo 正在停止服务器...
taskkill /f /im node.exe >nul 2>&1
exit /b

rem ============ 选项 1: 本地启动 ============
:local
call :build_and_start
cls
echo ============================================
echo  校园生活助手 - 已启动
echo ============================================
echo.
echo  本地地址: http://localhost:3000
echo.
echo  按任意键关闭服务器...
echo ============================================
start "" http://localhost:3000
pause >nul
call :stop_server
exit /b

rem ============ 选项 2: Pinggy 隧道 ============
:tunnel_pinggy
call :build_and_start
cls
echo ============================================
echo  校园生活助手 - Pinggy 隧道
echo ============================================
echo.
echo  本地地址: http://localhost:3000
echo.
echo  正在连接 Pinggy 隧道，请稍候...
echo  连接成功后会出现一个公网网址（类似 https://xxx.pinggy.io）
echo  用手机或其它设备也可以访问该网址
echo.
echo  按 Ctrl+C 可关闭隧道
echo ============================================
echo.
start "" http://localhost:3000
ssh -o StrictHostKeyChecking=accept-new -p 443 -R 0:localhost:3000 a.pinggy.io
echo.
echo 隧道已断开
call :stop_server
pause
exit /b

rem ============ 选项 3: Natapp 隧道 ============
:tunnel_natapp
call :build_and_start
cls
echo ============================================
echo  校园生活助手 - Natapp 隧道
echo ============================================
echo.
echo  本地地址: http://localhost:3000
echo.
echo  使用步骤：
echo  1. 访问 https://natapp.cn 注册并登录
echo  2. 在网站左侧 "购买隧道" -> "免费/付费隧道"
echo  3. 创建隧道，本地端口填 3000
echo  4. 在 "客户端下载" 下载 natapp.exe
echo  5. 将 natapp.exe 放到本目录下
echo  6. 网站 "我的隧道" 中复制 authtoken
echo.
echo ============================================
if not exist "natapp.exe" (
    echo 未检测到 natapp.exe，请先下载并放到本目录
    echo 确认下载后按任意键继续，或关闭窗口退出
    pause >nul
    if not exist "natapp.exe" (
        echo 仍未检测到 natapp.exe，退出
        pause
        call :stop_server
        exit /b 1
    )
)
set /p authtoken="请输入 Authtoken: "
echo.
echo 正在启动 Natapp 隧道...
start "" http://localhost:3000
natapp -authtoken=%authtoken%
echo.
echo 隧道已断开
call :stop_server
pause
exit /b

rem ============ 选项 4: 自定义隧道 ============
:tunnel_custom
call :build_and_start
cls
echo ============================================
echo  校园生活助手 - 自定义隧道
echo ============================================
echo.
echo  本地地址: http://localhost:3000
echo.
echo  常见隧道工具：
echo    FRP:    frpc -c frpc.ini
echo    Ngrok:  ngrok http 3000
echo    cpolar: cpolar http 3000
echo.
echo  请输入完整隧道命令：
echo ============================================
echo.
set /p tunnel_cmd="命令: "
echo.
echo 正在执行...
start "" http://localhost:3000
%tunnel_cmd%
echo.
echo 隧道已断开
call :stop_server
pause
exit /b
