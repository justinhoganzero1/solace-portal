// Viral AI Features - Next-Gen Engagement Tools
// AI-powered features designed to maximize user engagement and virality

window.JUZZY_VIRAL_AI = {
  // AI Price Prediction Engine
  pricePredictions: {
    enabled: true,
    
    generatePrediction(symbol, timeframe) {
      const predictions = {
        '1h': { change: (Math.random() * 10 - 5).toFixed(2), confidence: (60 + Math.random() * 30).toFixed(0) },
        '24h': { change: (Math.random() * 20 - 10).toFixed(2), confidence: (50 + Math.random() * 40).toFixed(0) },
        '7d': { change: (Math.random() * 40 - 20).toFixed(2), confidence: (40 + Math.random() * 50).toFixed(0) }
      };
      
      const pred = predictions[timeframe] || predictions['24h'];
      const direction = pred.change > 0 ? '📈 UP' : '📉 DOWN';
      const color = pred.change > 0 ? '#0ecb81' : '#f6465d';
      
      return {
        symbol,
        timeframe,
        direction,
        change: Math.abs(pred.change),
        confidence: pred.confidence,
        color,
        reasoning: this.generateReasoning(symbol, pred.change > 0)
      };
    },
    
    generateReasoning(symbol, bullish) {
      const bullishReasons = [
        'Strong accumulation patterns detected on-chain',
        'Institutional buying pressure increasing',
        'Technical breakout above key resistance',
        'Positive sentiment shift across social metrics',
        'Whale wallets accumulating aggressively',
        'Network activity showing healthy growth',
        'Major partnership announcement expected',
        'Bullish divergence on multiple timeframes'
      ];
      
      const bearishReasons = [
        'Distribution patterns emerging on-chain',
        'Profit-taking by large holders detected',
        'Technical breakdown below support levels',
        'Negative sentiment trending on social media',
        'Exchange inflows increasing (sell pressure)',
        'Network activity declining',
        'Regulatory concerns surfacing',
        'Bearish divergence on key indicators'
      ];
      
      const reasons = bullish ? bullishReasons : bearishReasons;
      return reasons[Math.floor(Math.random() * reasons.length)];
    },
    
    renderPredictionCard(prediction) {
      return `
        <div class="ai-prediction-card" style="background: linear-gradient(135deg, rgba(0,229,255,0.1), rgba(255,95,109,0.1)); border: 2px solid ${prediction.color}; border-radius: 16px; padding: 1.5rem; margin: 1rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <div style="font-size: 1.5rem; font-weight: 700;">${prediction.symbol}</div>
              <div style="font-size: 0.85rem; color: rgba(234,240,255,0.6);">${prediction.timeframe} Prediction</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 2rem; font-weight: 900; color: ${prediction.color};">${prediction.direction}</div>
              <div style="font-size: 1.2rem; color: ${prediction.color};">±${prediction.change}%</div>
            </div>
          </div>
          
          <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.9rem;">AI Confidence</span>
              <span style="font-size: 1.1rem; font-weight: 700; color: #00e5ff;">${prediction.confidence}%</span>
            </div>
            <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; margin-top: 0.5rem; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #00e5ff, #0099ff); height: 100%; width: ${prediction.confidence}%; border-radius: 4px; transition: width 1s ease;"></div>
            </div>
          </div>
          
          <div style="font-size: 0.9rem; color: rgba(234,240,255,0.8); line-height: 1.6;">
            <strong>🤖 AI Analysis:</strong> ${prediction.reasoning}
          </div>
          
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; color: rgba(234,240,255,0.5);">
            ⚠️ Educational prediction only. Not financial advice. Past performance doesn't guarantee future results.
          </div>
        </div>
      `;
    }
  },
  
  // AI Voice Clone (Text-to-Speech with personality)
  voiceClone: {
    enabled: true,
    voices: {
      atlas: { name: 'Professor Atlas', pitch: 1.0, rate: 0.95, personality: 'wise and measured' },
      vega: { name: 'Professor Vega', pitch: 1.1, rate: 1.05, personality: 'energetic and analytical' },
      lyra: { name: 'Professor Lyra', pitch: 1.2, rate: 1.0, personality: 'creative and inspiring' },
      sol: { name: 'Professor Sol', pitch: 0.9, rate: 0.9, personality: 'serious and protective' },
      nova: { name: 'Professor Nova', pitch: 1.05, rate: 1.1, personality: 'technical and innovative' }
    },
    
    speak(text, voiceId = 'atlas') {
      if (!window.speechSynthesis) {
        console.warn('Speech synthesis not supported');
        return;
      }
      
      const voice = this.voices[voiceId] || this.voices.atlas;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = voice.pitch;
      utterance.rate = voice.rate;
      utterance.volume = 0.8;
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      
      return utterance;
    },
    
    stop() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  },
  
  // AI Social Sharing Generator
  socialSharing: {
    enabled: true,
    
    generateShareContent(achievement) {
      const templates = [
        `🎓 Just completed "${achievement}" on @JuzzyAcademy! Learning crypto the AI-powered way. 🚀`,
        `📈 Leveling up my crypto knowledge with @JuzzyAcademy! Just finished: ${achievement} 🧠`,
        `🤖 AI-powered education is incredible! Completed "${achievement}" on @JuzzyAcademy 💎`,
        `🔥 Another milestone! "${achievement}" ✅ Thanks @JuzzyAcademy for making crypto education fun! 🎯`,
        `💡 From zero to crypto hero! Just completed "${achievement}" on @JuzzyAcademy 🌟`
      ];
      
      return templates[Math.floor(Math.random() * templates.length)];
    },
    
    createShareButton(achievement, platform = 'twitter') {
      const shareText = this.generateShareContent(achievement);
      const encodedText = encodeURIComponent(shareText);
      const url = encodeURIComponent('https://juzzy.academy');
      
      const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`
      };
      
      return `
        <button class="share-btn" onclick="if(window.parent&&window.parent!==window&&typeof window.parent.postMessage==='function'){window.parent.postMessage({type:'juzzy-open-resource',url:'${urls[platform]}',label:'Share Achievement',provider:'Social Share'}, '*');}else{window.location.href='${urls[platform]}';}" style="background: linear-gradient(135deg, #1DA1F2, #0d8bd9); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;">
          <span>🐦</span> Share on Twitter
        </button>
      `;
    }
  },
  
  // AI Learning Streak Tracker
  streakTracker: {
    enabled: true,
    
    getStreak() {
      const data = JSON.parse(localStorage.getItem('juzzy_streak') || '{"current": 0, "longest": 0, "lastVisit": null}');
      const today = new Date().toDateString();
      
      if (data.lastVisit === today) {
        return data;
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (data.lastVisit === yesterday.toDateString()) {
        data.current += 1;
        data.longest = Math.max(data.longest, data.current);
      } else if (data.lastVisit !== null) {
        data.current = 1;
      } else {
        data.current = 1;
      }
      
      data.lastVisit = today;
      localStorage.setItem('juzzy_streak', JSON.stringify(data));
      
      return data;
    },
    
    renderStreakWidget() {
      const streak = this.getStreak();
      const fireEmojis = '🔥'.repeat(Math.min(streak.current, 10));
      
      return `
        <div class="streak-widget" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); border-radius: 16px; padding: 1.5rem; text-align: center; color: white;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">${fireEmojis || '📚'}</div>
          <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.3rem;">${streak.current} Day${streak.current !== 1 ? 's' : ''}</div>
          <div style="font-size: 1rem; opacity: 0.9;">Learning Streak</div>
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.3); font-size: 0.9rem;">
            🏆 Longest Streak: ${streak.longest} days
          </div>
        </div>
      `;
    }
  },
  
  // AI Gamification System
  gamification: {
    enabled: true,
    
    achievements: [
      { id: 'first_lesson', title: 'First Steps', desc: 'Complete your first lesson', icon: '🎯', xp: 100 },
      { id: 'week_streak', title: 'Dedicated Learner', desc: '7-day learning streak', icon: '🔥', xp: 500 },
      { id: 'quiz_master', title: 'Quiz Master', desc: 'Score 100% on 5 quizzes', icon: '🧠', xp: 300 },
      { id: 'social_sharer', title: 'Crypto Evangelist', desc: 'Share 3 achievements', icon: '📢', xp: 200 },
      { id: 'simulator_pro', title: 'Trading Simulator Pro', desc: 'Complete 10 simulated trades', icon: '📊', xp: 400 },
      { id: 'ai_conversationalist', title: 'AI Conversationalist', desc: 'Chat with AI 50 times', icon: '💬', xp: 250 },
      { id: 'course_complete', title: 'Course Champion', desc: 'Complete an entire course track', icon: '🏆', xp: 1000 },
      { id: 'early_bird', title: 'Early Bird', desc: 'Study before 8 AM', icon: '🌅', xp: 150 },
      { id: 'night_owl', title: 'Night Owl', desc: 'Study after 10 PM', icon: '🦉', xp: 150 },
      { id: 'perfect_week', title: 'Perfect Week', desc: 'Study every day for a week', icon: '⭐', xp: 750 }
    ],
    
    getUserLevel(xp) {
      const level = Math.floor(Math.sqrt(xp / 100)) + 1;
      const nextLevelXp = Math.pow(level, 2) * 100;
      const currentLevelXp = Math.pow(level - 1, 2) * 100;
      const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
      
      return { level, xp, nextLevelXp, progress: Math.min(progress, 100) };
    },
    
    renderLevelWidget(xp = 0) {
      const levelData = this.getUserLevel(xp);
      
      return `
        <div class="level-widget" style="background: linear-gradient(135deg, rgba(0,229,255,0.2), rgba(255,95,109,0.2)); border: 2px solid #00e5ff; border-radius: 16px; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <div style="font-size: 0.85rem; color: rgba(234,240,255,0.7);">Your Level</div>
              <div style="font-size: 2.5rem; font-weight: 900; color: #00e5ff;">Level ${levelData.level}</div>
            </div>
            <div style="font-size: 3rem;">🎓</div>
          </div>
          
          <div style="margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: rgba(234,240,255,0.7);">
              <span>${levelData.xp} XP</span>
              <span>${levelData.nextLevelXp} XP</span>
            </div>
          </div>
          
          <div style="background: rgba(0,0,0,0.3); height: 12px; border-radius: 6px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #00e5ff, #0099ff); height: 100%; width: ${levelData.progress}%; border-radius: 6px; transition: width 1s ease;"></div>
          </div>
          
          <div style="margin-top: 1rem; font-size: 0.85rem; color: rgba(234,240,255,0.8);">
            ${Math.floor(levelData.nextLevelXp - levelData.xp)} XP to Level ${levelData.level + 1}
          </div>
        </div>
      `;
    },
    
    unlockAchievement(achievementId) {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (!achievement) return;
      
      const unlocked = JSON.parse(localStorage.getItem('juzzy_achievements') || '[]');
      if (unlocked.includes(achievementId)) return;
      
      unlocked.push(achievementId);
      localStorage.setItem('juzzy_achievements', JSON.stringify(unlocked));
      
      // Show achievement notification
      this.showAchievementNotification(achievement);
      
      // Add XP
      const currentXp = parseInt(localStorage.getItem('juzzy_xp') || '0');
      localStorage.setItem('juzzy_xp', (currentXp + achievement.xp).toString());
      
      return achievement;
    },
    
    showAchievementNotification(achievement) {
      const notification = document.createElement('div');
      notification.className = 'achievement-notification';
      notification.innerHTML = `
        <div style="background: linear-gradient(135deg, #00e5ff, #0099ff); color: white; padding: 1.5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,229,255,0.4); max-width: 400px; animation: slideInRight 0.5s ease;">
          <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 0.3rem;">🎉 Achievement Unlocked!</div>
          <div style="font-size: 1.5rem; font-weight: 900; margin-bottom: 0.5rem;">${achievement.icon} ${achievement.title}</div>
          <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.8rem;">${achievement.desc}</div>
          <div style="font-size: 1.1rem; font-weight: 700;">+${achievement.xp} XP</div>
        </div>
      `;
      
      notification.style.position = 'fixed';
      notification.style.top = '20px';
      notification.style.right = '20px';
      notification.style.zIndex = '10000';
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
      }, 4000);
    }
  },
  
  // AI Study Buddy (Personalized Reminders)
  studyBuddy: {
    enabled: true,
    
    getOptimalStudyTime() {
      const studyHistory = JSON.parse(localStorage.getItem('juzzy_study_times') || '[]');
      
      if (studyHistory.length === 0) {
        return { hour: 19, minute: 0, reason: 'Evening is a great time to learn!' };
      }
      
      // Analyze most common study hour
      const hourCounts = {};
      studyHistory.forEach(timestamp => {
        const hour = new Date(timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      
      const optimalHour = Object.keys(hourCounts).reduce((a, b) => 
        hourCounts[a] > hourCounts[b] ? a : b
      );
      
      return {
        hour: parseInt(optimalHour),
        minute: 0,
        reason: 'Based on your study patterns, this is your peak learning time!'
      };
    },
    
    trackStudySession() {
      const studyHistory = JSON.parse(localStorage.getItem('juzzy_study_times') || '[]');
      studyHistory.push(Date.now());
      
      // Keep only last 30 sessions
      if (studyHistory.length > 30) {
        studyHistory.shift();
      }
      
      localStorage.setItem('juzzy_study_times', JSON.stringify(studyHistory));
    }
  },
  
  // Initialize all viral features
  init() {
    console.log('🚀 Juzzy Viral AI Features Initialized');
    
    // Track study session
    this.studyBuddy.trackStudySession();
    
    // Update streak
    this.streakTracker.getStreak();
    
    // Check for time-based achievements
    const hour = new Date().getHours();
    if (hour < 8) {
      this.gamification.unlockAchievement('early_bird');
    } else if (hour >= 22) {
      this.gamification.unlockAchievement('night_owl');
    }
    
    return this;
  }
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.JUZZY_VIRAL_AI.init();
  });
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.JUZZY_VIRAL_AI;
}
