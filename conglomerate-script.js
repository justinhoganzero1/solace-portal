// AI Conglomerate Website JavaScript
class AIAssistant {
    constructor() {
        this.responses = {
            'portfolio': 'Our portfolio includes 4 main applications: 3 Amigos Academy (crypto education), Crypto Wealth Builder (investment tools), Health AI Assistant (medical insights), and Creative Studio AI (design tools). Each app is powered by advanced AI technology!',
            'amigos': '3 Amigos Academy is our flagship crypto education platform. Born from collaboration between three visionaries across continents, it offers comprehensive blockchain education with AI-powered learning paths. Currently serving 5,824+ students with 490 modules!',
            'technology': 'We use cutting-edge AI technologies including neural networks, natural language processing, predictive analytics, and real-time data processing. All our applications prioritize ethical AI development and user privacy.',
            'contact': 'You can reach us through our AI assistant (available 24/7), email support for complex inquiries, or subscribe to our newsletter for updates. Our AI assistant can help you with most questions instantly!',
            'features': 'Our apps feature AI-powered personalization, real-time analytics, predictive modeling, automated workflows, intelligent chatbots, and seamless user experiences across all platforms.',
            'security': 'Security is our top priority. We use enterprise-grade encryption, ethical AI practices, regular security audits, and comply with data protection regulations including GDPR and CCPA.',
            'pricing': 'Each application has its own pricing model. 3 Amigos Academy offers free introductory courses with paid advanced modules. Other apps have subscription-based pricing with free trials available.',
            'future': 'We\'re constantly developing new AI-powered applications. Our roadmap includes expansions into smart home automation, agricultural tech, and sustainable energy solutions.'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAnimations();
        this.initializeAIChat();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.navigateToSection(section);
            });
        });
        
        // AI Assistant
        const aiAssistant = document.getElementById('aiAssistant');
        const aiModal = document.getElementById('aiModal');
        const closeModal = document.getElementById('closeModal');
        
        aiAssistant?.addEventListener('click', () => {
            aiModal.classList.add('active');
        });
        
        closeModal?.addEventListener('click', () => {
            aiModal.classList.remove('active');
        });
        
        // App Details Modal
        const closeAppModal = document.getElementById('closeAppModal');
        closeAppModal?.addEventListener('click', () => {
            document.getElementById('appModal').classList.remove('active');
        });
        
        // AI Tour
        document.getElementById('startAiTour')?.addEventListener('click', () => {
            this.startAITour();
        });
        
        // Contact AI
        document.getElementById('contactAi')?.addEventListener('click', () => {
            aiModal.classList.add('active');
        });
        
        // Chat functionality
        this.setupChat();
        
        // Smooth scrolling for navigation
        document.querySelectorAll('button[data-section]').forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.navigateToSection(section);
            });
        });
        
        // Close modals on background click
        [aiModal, document.getElementById('appModal')].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }
    
    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');
        }
    }
    
    setupChat() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendMessage');
        
        const sendMessage = () => {
            const message = chatInput?.value?.trim();
            if (!message) return;
            
            this.addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate AI thinking
            setTimeout(() => {
                const response = this.generateAIResponse(message);
                this.addMessage(response, 'ai');
            }, 1000 + Math.random() * 1000);
        };
        
        sendButton?.addEventListener('click', sendMessage);
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<span class="message-text">${text}</span>`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords in predefined responses
        for (const [keyword, response] of Object.entries(this.responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        
        // Generate contextual responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! Welcome to AI Conglomerate. I\'m here to help you explore our innovative applications. What would you like to know about our portfolio?';
        }
        
        if (lowerMessage.includes('thank')) {
            return 'You\'re welcome! Is there anything else you\'d like to know about our AI-powered applications?';
        }
        
        if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            return 'Thank you for visiting AI Conglomerate! Feel free to return anytime. Have a great day!';
        }
        
        if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
            return 'Our applications use advanced AI algorithms to provide intelligent solutions. Each app is designed with machine learning models that adapt to user needs and provide personalized experiences.';
        }
        
        if (lowerMessage.includes('when') && lowerMessage.includes('launch')) {
            return '3 Amigos Academy is currently live and serving thousands of students! Our other applications are in various stages of development, with some in beta and others coming soon. Subscribe to our newsletter for launch updates!';
        }
        
        if (lowerMessage.includes('why') || lowerMessage.includes('mission')) {
            return 'Our mission is to harness the power of artificial intelligence to solve real-world problems across education, finance, health, and creative industries. We believe AI can enhance human capabilities and improve lives globally.';
        }
        
        // Default intelligent response
        const defaultResponses = [
            'That\'s an interesting question! Our AI systems are designed to provide comprehensive solutions. Would you like to know more about our specific applications?',
            'I\'d be happy to help you explore our innovative ecosystem. Our portfolio includes education, finance, health, and creative applications. Which area interests you most?',
            'Great question! Our AI-powered applications are built with cutting-edge technology. You can learn more about each one in our portfolio section.',
            'Thank you for your inquiry! Our AI assistant is here to help you discover the perfect solution for your needs. What specific features are you looking for?'
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    initializeAIChat() {
        // Add welcome message
        setTimeout(() => {
            this.addMessage('Welcome to AI Conglomerate! I\'m your AI assistant. Feel free to ask me about our applications, technology, or anything else you\'re curious about!', 'ai');
        }, 500);
    }
    
    startAITour() {
        const tourSteps = [
            {
                element: '.hero-title',
                message: 'Welcome to AI Conglomerate! This is where innovation meets intelligence.'
            },
            {
                element: '.app-showcase',
                message: 'Here you can see some of our featured applications floating in our ecosystem.'
            },
            {
                element: '.portfolio-section',
                message: 'Our portfolio showcases all AI-powered applications, each designed to transform industries.'
            },
            {
                element: '.ai-lab-section',
                message: 'In our AI Lab, we develop cutting-edge technologies that power all our applications.'
            }
        ];
        
        let currentStep = 0;
        
        const showTourStep = () => {
            if (currentStep >= tourSteps.length) {
                this.addMessage('Tour completed! Feel free to explore our applications or ask me any questions.', 'ai');
                return;
            }
            
            const step = tourSteps[currentStep];
            const element = document.querySelector(step.element);
            
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.style.animation = 'pulse 2s ease-in-out';
                
                // Open AI modal to show tour message
                document.getElementById('aiModal').classList.add('active');
                this.addMessage(step.message, 'ai');
                
                setTimeout(() => {
                    element.style.animation = '';
                    currentStep++;
                    setTimeout(showTourStep, 3000);
                }, 2000);
            }
        };
        
        showTourStep();
    }
    
    startAnimations() {
        // Animate portfolio cards on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.portfolio-card, .lab-card, .contact-card').forEach(card => {
            observer.observe(card);
        });
        
        // Add floating animation to app cards
        document.querySelectorAll('.app-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.5}s`;
        });
    }
}

// Launch Academy Function
function launchAcademy() {
    const academyUrl = 'http://localhost:8000';
    const fallbackUrl = 'http://127.0.0.1:8000';
    const openAcademyUrl = (url) => {
        if (window.parent && window.parent !== window && typeof window.parent.postMessage === 'function') {
            window.parent.postMessage({
                type: 'juzzy-open-resource',
                url,
                label: '3 Amigos Academy',
                provider: 'Local Academy'
            }, '*');
            return true;
        }
        window.location.href = url;
        return true;
    };
    
    // Try primary URL first
    Promise.resolve(openAcademyUrl(academyUrl)).catch(() => {
        // Fallback to alternative URL
        Promise.resolve(openAcademyUrl(fallbackUrl)).catch(() => {
            // If both fail, show error message
            alert('3 Amigos Academy is starting up. Please wait a moment and try again.\n\nMake sure the academy server is running on port 8000.');
            
            // Try to open after a short delay
            setTimeout(() => {
                openAcademyUrl(academyUrl);
            }, 2000);
        });
    });
}

// App Details Function
function showAppDetails(appId) {
    const modal = document.getElementById('appModal');
    const title = document.getElementById('appModalTitle');
    const body = document.getElementById('appModalBody');
    
    const appDetails = {
        amigos: {
            title: '3 Amigos Academy',
            content: `
                <div class="app-detail-content">
                    <div class="app-hero">
                        <div class="three-circles large">
                            <div class="circle main"></div>
                            <div class="circle top-left"></div>
                            <div class="circle bottom-right"></div>
                        </div>
                        <h2>3 Amigos Academy</h2>
                        <p>Revolutionary Crypto Education Platform</p>
                    </div>
                    
                    <div class="app-description">
                        <h3>The Story</h3>
                        <p>Born from extraordinary collaboration across continents, 3 Amigos Academy represents the pinnacle of crypto education. Three visionary minds - one from the Americas, one from Europe, and one from Asia - united to create the world's most comprehensive blockchain learning ecosystem.</p>
                        
                        <h3>Key Features</h3>
                        <ul>
                            <li>🤖 AI-powered adaptive learning paths</li>
                            <li>🎓 490 comprehensive modules</li>
                            <li>🌍 Global community of 5,824+ learners</li>
                            <li>📊 Real-time market integration</li>
                            <li>🏆 Hall of Fame and achievement system</li>
                            <li>💬 24/7 AI tutor support</li>
                            <li>🎥 YouTube-integrated video lessons</li>
                            <li>🔒 Owner-only advanced features</li>
                        </ul>
                        
                        <h3>Technology Stack</h3>
                        <p>Built with cutting-edge web technologies, AI integration, and real-time data feeds to provide an immersive learning experience.</p>
                        
                        <div class="app-actions-full">
                            <button class="btn-primary" onclick="launchAcademy()">🚀 Launch Academy</button>
                            <button class="btn-secondary">View Curriculum</button>
                        </div>
                    </div>
                </div>
            `
        },
        crypto: {
            title: 'Crypto Wealth Builder',
            content: `
                <div class="app-detail-content">
                    <div class="app-hero">
                        <div class="app-icon-large">💰</div>
                        <h2>Crypto Wealth Builder</h2>
                        <p>AI-Driven Investment Platform</p>
                    </div>
                    
                    <div class="app-description">
                        <h3>Coming Soon</h3>
                        <p>Our AI-powered investment platform will revolutionize how you approach cryptocurrency wealth building through advanced analytics and automated strategies.</p>
                        
                        <h3>Planned Features</h3>
                        <ul>
                            <li>📈 AI-powered market analysis</li>
                            <li>🤖 Automated trading strategies</li>
                            <li>📊 Portfolio optimization</li>
                            <li>⚠️ Risk management tools</li>
                            <li>📱 Mobile trading interface</li>
                        </ul>
                    </div>
                </div>
            `
        },
        health: {
            title: 'Health AI Assistant',
            content: `
                <div class="app-detail-content">
                    <div class="app-hero">
                        <div class="app-icon-large">🏥</div>
                        <h2>Health AI Assistant</h2>
                        <p>Personal Medical Intelligence</p>
                    </div>
                    
                    <div class="app-description">
                        <h3>In Development</h3>
                        <p>Your personal AI health companion providing insights, monitoring, and recommendations based on the latest medical research.</p>
                        
                        <h3>Key Capabilities</h3>
                        <ul>
                            <li>🩺 Symptom analysis</li>
                            <li>💊 Medication tracking</li>
                            <li>📊 Health metrics monitoring</li>
                            <li>🏃‍♂️ Fitness recommendations</li>
                            <li>🍎 Nutrition guidance</li>
                        </ul>
                    </div>
                </div>
            `
        },
        creative: {
            title: 'Creative Studio AI',
            content: `
                <div class="app-detail-content">
                    <div class="app-hero">
                        <div class="app-icon-large">🎨</div>
                        <h2>Creative Studio AI</h2>
                        <p>AI-Powered Creative Tools</p>
                    </div>
                    
                    <div class="app-description">
                        <h3>In Development</h3>
                        <p>Unleash your creativity with AI-powered tools for design, content creation, and multimedia production.</p>
                        
                        <h3>Creative Suite</h3>
                        <ul>
                            <li>🎨 AI design generation</li>
                            <li>✍️ Content creation tools</li>
                            <li>🎬 Video editing assistance</li>
                            <li>🎵 Music composition</li>
                            <li>📱 Social media content</li>
                        </ul>
                    </div>
                </div>
            `
        }
    };
    
    const app = appDetails[appId];
    if (app) {
        title.textContent = app.title;
        body.innerHTML = app.content;
        modal.classList.add('active');
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .app-detail-content {
        color: var(--text-primary);
    }
    
    .app-hero {
        text-align: center;
        margin-bottom: 2rem;
        padding: 2rem;
        background: var(--card-bg);
        border-radius: 16px;
        border: 1px solid var(--border-color);
    }
    
    .three-circles.large {
        width: 80px;
        height: 80px;
        margin: 0 auto 1rem;
    }
    
    .three-circles.large .circle.main {
        width: 32px;
        height: 32px;
        top: 24px;
        left: 24px;
    }
    
    .three-circles.large .circle.top-left {
        width: 24px;
        height: 24px;
    }
    
    .three-circles.large .circle.bottom-right {
        width: 24px;
        height: 24px;
    }
    
    .app-icon-large {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    
    .app-hero h2 {
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        background: var(--gradient-1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .app-description h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 2rem 0 1rem;
        color: var(--primary-color);
    }
    
    .app-description p, .app-description li {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 0.5rem;
    }
    
    .app-description ul {
        margin-left: 1rem;
    }
    
    .app-actions-full {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        justify-content: center;
    }
    
    @keyframes pulse {
        0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7);
        }
        50% { 
            transform: scale(1.05); 
            box-shadow: 0 0 20px 10px rgba(0, 229, 255, 0);
        }
    }
`;
document.head.appendChild(style);

// Initialize the AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});

// Add some dynamic effects
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.portfolio-card');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    cards.forEach((card, index) => {
        const offsetX = (x - 0.5) * 10 * (index % 2 === 0 ? 1 : -1);
        const offsetY = (y - 0.5) * 10 * (index % 2 === 0 ? -1 : 1);
        card.style.transform = `translateY(-8px) translateX(${offsetX}px) translateY(${offsetY}px)`;
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
