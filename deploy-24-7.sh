#!/bin/bash

# AI Conglomerate - 24/7 Deployment Script
# This script helps you deploy your platform to run 24/7 without being logged in

echo "🚀 AI Conglomerate - 24/7 Deployment Setup"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - AI Conglomerate Platform"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote is set up
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "🌐 To deploy to GitHub Pages, you need to:"
    echo "1. Create a new repository on GitHub: https://github.com/new"
    echo "2. Name it: ai-conglomerate"
    echo "3. Make it Public"
    echo "4. Click 'Create repository'"
    echo ""
    read -p "🔗 Enter your GitHub username: " username
    
    if [ -n "$username" ]; then
        git remote add origin "https://github.com/$username/ai-conglomerate.git"
        echo "✅ Remote added: https://github.com/$username/ai-conglomerate.git"
        
        echo ""
        echo "📤 Pushing to GitHub..."
        git branch -M main
        git push -u origin main
        
        echo ""
        echo "🎉 Your platform is deployed!"
        echo ""
        echo "📱 Your apps will be available at:"
        echo "   • Main Platform: https://$username.github.io/ai-conglomerate/all-in-one.html"
        echo "   • 3 Amigos Academy: https://$username.github.io/ai-conglomerate/index.html"
        echo "   • Portfolio: https://$username.github.io/ai-conglomerate/conglomerate.html"
        echo ""
        echo "⚙️  To enable GitHub Pages:"
        echo "   1. Go to: https://github.com/$username/ai-conglomerate/settings/pages"
        echo "   2. Source: Deploy from a branch"
        echo "   3. Branch: main"
        echo "   4. Folder: /root"
        echo "   5. Click Save"
        echo ""
        echo "🔄 After 2-5 minutes, your site will be live 24/7!"
    else
        echo "❌ No username provided. Please run the script again."
    fi
else
    echo "✅ Remote already configured"
    
    echo ""
    echo "📤 Pushing latest changes..."
    git add .
    git commit -m "Update - $(date)"
    git push origin main
    
    echo ""
    echo "✅ Changes pushed to GitHub"
    echo "🔄 Your site will update in 2-5 minutes"
fi

echo ""
echo "📊 Alternative Deployment Options:"
echo "=================================="
echo ""
echo "🔥 Netlify (Recommended for full features):"
echo "   1. Go to https://netlify.com"
echo "   2. Drag & drop this folder"
echo "   3. Get instant deployment with custom domain"
echo ""
echo "⚡ Vercel (Developer friendly):"
echo "   1. Go to https://vercel.com"
echo "   2. Import your GitHub repository"
echo "   3. Automatic deployments on push"
echo ""
echo "🎯 Railway (Backend features):"
echo "   1. Go to https://railway.app"
echo "   2. Connect GitHub repository"
echo "   3. Deploy as web service"
echo ""
echo "📱 Firebase Hosting (Google ecosystem):"
echo "   1. Install: npm install -g firebase-tools"
echo "   2. Run: firebase init"
echo "   3. Deploy: firebase deploy"
echo ""

echo "💡 Pro Tips:"
echo "============"
echo "• GitHub Pages: Free, easy, reliable"
echo "• Netlify: Forms, functions, better performance"
echo "• Vercel: Best for modern web apps"
echo "• Railway: Full backend capabilities"
echo "• All options provide HTTPS and global CDN"
echo ""

echo "🔔 Monitoring & Uptime:"
echo "======================"
echo "• Set up UptimeRobot (free) to monitor your site"
echo "• Get email alerts for downtime"
echo "• Track performance and analytics"
echo ""

echo "🎉 Your AI Conglomerate is ready for 24/7 deployment!"
echo "🌍 Choose any platform above and deploy in minutes!"
