@echo off
chcp 65001 >nul
cd /d D:\myproject\yidong111

rem 添加 Git 路径
set "PATH=D:\PortableGit\Git\bin;D:\PortableGit\Git\cmd;%PATH%"

echo ============================================
echo  校园生活助手 - 一键部署到 Railway
echo ============================================
echo.
echo 请提前在 https://github.com/new 创建仓库
echo 仓库名填 campus-app，不要点其他选项
echo 创建后复制仓库地址（https://github.com/用户名/campus-app）
echo.
set /p repo="GitHub 仓库地址: "
if "%repo%"=="" exit /b

echo.
echo 正在推送到 GitHub...
echo.

git remote add origin "%repo%" 2>nul
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo 推送失败，可能原因：
    echo 1. 仓库地址不对
    echo 2. 没有登录 GitHub（需要先登录）
    echo 3. 推送前需要先配置 GitHub 登录
    echo.
    echo 请手动执行：git push -u origin main
    pause
    exit /b
)

echo.
echo ✓ 代码已推送到 GitHub！
echo.
echo 现在打开 https://railway.app
echo 用 GitHub 登录 → New Project → Deploy from GitHub repo
echo 选择 campus-app → 自动部署完成
echo.
echo 部署后 Railway 会给你一个域名，手机也能直接访问
echo.
pause
