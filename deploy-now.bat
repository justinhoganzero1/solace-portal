@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo 🚀 AI Conglomerate - GitHub Deployment
echo =====================================
echo.

:: Set up Git with token
set GIT_TOKEN=YOUR_GITHUB_TOKEN_HERE

:: Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git config user.name "AI Conglomerate"
    git config user.email "noreply@aiconglomerate.com"
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

:: Add all files
echo 📁 Adding files to Git...
git add .

:: Commit changes
echo 💾 Committing changes...
git commit -m "Initial commit - AI Conglomerate Platform with Owner Features and Futuristic Design"

:: Get GitHub username
set /p username="👤 Enter your GitHub username: "

if not "!username!"=="" (
    echo.
    echo 🔗 Connecting to GitHub repository...
    
    :: Remove existing remote if any
    git remote remove origin >nul 2>&1
    
    :: Add remote with token
    git remote add origin https://!GIT_TOKEN!@github.com/!username!/ai-conglomerate.git
    
    echo.
    echo 📤 Pushing to GitHub...
    git branch -M main
    git push -u origin main
    
    if !errorlevel! equ 0 (
        echo.
        echo 🎉 DEPLOYMENT SUCCESSFUL!
        echo.
        echo 📱 Your apps are now available at:
        echo    • All-in-One Platform: https://!username!.github.io/ai-conglomerate/all-in-one.html
        echo    • 3 Amigos Academy: https://!username!.github.io/ai-conglomerate/index.html
        echo    • Portfolio Website: https://!username!.github.io/ai-conglomerate/conglomerate.html
        echo    • Server Status: https://!username!.github.io/ai-conglomerate/server-status.html
        echo.
        echo ⚙️  ENABLE GITHUB PAGES:
        echo    1. Go to: https://github.com/!username!/ai-conglomerate/settings/pages
        echo    2. Source: Deploy from a branch
        echo    3. Branch: main
        echo    4. Folder: /root
        echo    5. Click Save
        echo.
        echo 🔄 Your site will be live in 2-5 minutes!
        echo.
        echo 🌐 Opening GitHub Pages settings...
        start https://github.com/!username!/ai-conglomerate/settings/pages
        echo.
        echo 👑 OWNER FEATURES:
        echo    • Login with: owner@juzzy.local
        echo    • Glowing gold owner plaque appears
        echo    • All modules unlocked for free
        echo    • Grant user access via Owner Access tab
        echo    • Full admin controls
        echo.
        echo 🎯 NEXT STEPS:
        echo    1. Enable GitHub Pages (link above)
        echo    2. Wait 2-5 minutes for deployment
        echo    3. Visit your live sites
        echo    4. Test owner features
        echo.
        echo 🌟 Your AI Conglomerate is running 24/7! 🚀
    ) else (
        echo.
        echo ❌ Deployment failed. Please check:
        echo    • Repository name is correct
        echo    • Token has proper permissions
        echo    • Repository exists on GitHub
    )
) else (
    echo ❌ No username provided.
)

echo.
pause
