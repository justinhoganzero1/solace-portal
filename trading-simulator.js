class CryptoTradingSimulator {
    constructor() {
        this.startingBalance = 10000;
        this.balance = this.startingBalance;
        this.portfolio = {};
        this.transactions = [];
        this.activityLog = [];
        this.activePlatform = 'binance';
        this.scenario = 'balanced';
        this.speedMultiplier = 1;
        this.baseTickMs = 1000;
        this.intervalId = null;
        this.isPaused = false;
        this.cryptos = {
            BTC: { name: 'Bitcoin', symbol: 'BTC', icon: '₿', volatility: 0.012, basePrice: 43250.00 },
            ETH: { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', volatility: 0.016, basePrice: 2280.50 },
            BNB: { name: 'Binance Coin', symbol: 'BNB', icon: '🔶', volatility: 0.02, basePrice: 315.75 },
            ADA: { name: 'Cardano', symbol: 'ADA', icon: '₳', volatility: 0.022, basePrice: 0.58 },
            SOL: { name: 'Solana', symbol: 'SOL', icon: '◎', volatility: 0.028, basePrice: 98.45 },
            XRP: { name: 'Ripple', symbol: 'XRP', icon: '✕', volatility: 0.019, basePrice: 0.52 },
            DOT: { name: 'Polkadot', symbol: 'DOT', icon: '●', volatility: 0.024, basePrice: 7.25 },
            DOGE: { name: 'Dogecoin', symbol: 'DOGE', icon: '🐕', volatility: 0.032, basePrice: 0.085 },
            AVAX: { name: 'Avalanche', symbol: 'AVAX', icon: '🔺', volatility: 0.027, basePrice: 36.80 },
            MATIC: { name: 'Polygon', symbol: 'MATIC', icon: '⬡', volatility: 0.026, basePrice: 0.92 }
        };
        this.platforms = {
            binance: { name: 'Binance', theme: '#F3BA2F', fee: 0.001, features: ['spot', 'futures', 'staking', 'p2p'] },
            coinbase: { name: 'Coinbase', theme: '#0052FF', fee: 0.005, features: ['spot', 'staking', 'earn', 'learn'] },
            kraken: { name: 'Kraken', theme: '#62688F', fee: 0.002, features: ['spot', 'futures', 'staking', 'otc'] },
            kucoin: { name: 'KuCoin', theme: '#2FB577', fee: 0.001, features: ['spot', 'futures', 'staking', 'bot'] }
        };
        this.scenarioProfiles = {
            balanced: { label: 'Balanced', drift: 0, volatility: 1, pulse: 'Steady training flow' },
            bull: { label: 'Bull Breakout', drift: 0.004, volatility: 1.05, pulse: 'Momentum bias upward' },
            bear: { label: 'Bear Pressure', drift: -0.004, volatility: 1.1, pulse: 'Downside pressure active' },
            volatile: { label: 'High Volatility', drift: 0, volatility: 1.8, pulse: 'Fast candles and whipsaws' }
        };
        this.currentPrices = this.generateRealisticPrices();
        this.priceHistory = this.initializePriceHistory();
        this.initializeSimulator();
    }

    generateRealisticPrices() {
        const prices = {};
        Object.entries(this.cryptos).forEach(([symbol, crypto]) => {
            const variation = (Math.random() - 0.5) * 0.06;
            prices[symbol] = crypto.basePrice * (1 + variation);
        });
        return prices;
    }

    initializePriceHistory() {
        const history = {};
        Object.keys(this.cryptos).forEach((symbol) => {
            const items = [];
            let anchor = this.currentPrices[symbol];
            for (let i = 0; i < 96; i += 1) {
                anchor *= 1 + ((Math.random() - 0.5) * this.cryptos[symbol].volatility);
                items.push(anchor);
            }
            history[symbol] = items;
        });
        return history;
    }

    initializeSimulator() {
        this.cacheDom();
        this.bindEvents();
        this.seedActivityLog();
        this.setScenario(this.scenario, false);
        this.setSpeed(this.speedMultiplier, false);
        this.startPriceUpdates();
        this.updateUI();
    }

    cacheDom() {
        this.els = {
            balance: document.getElementById('trading-balance'),
            total: document.getElementById('trading-total'),
            pl: document.getElementById('trading-pl'),
            priceTable: document.getElementById('trading-price-table'),
            portfolio: document.getElementById('trading-portfolio'),
            activityFeed: document.getElementById('trading-activity-feed'),
            priceChart: document.getElementById('price-chart'),
            portfolioChart: document.getElementById('portfolio-chart'),
            selectedCrypto: document.getElementById('selected-crypto'),
            simScenario: document.getElementById('simScenario'),
            simSpeed: document.getElementById('simSpeed'),
            simResetBtn: document.getElementById('simResetBtn'),
            simPauseBtn: document.getElementById('simPauseBtn'),
            simModeLabel: document.getElementById('sim-mode-label'),
            simSpeedLabel: document.getElementById('sim-speed-label'),
            simOpenPositions: document.getElementById('sim-open-positions'),
            ticketSymbol: document.getElementById('ticketSymbol'),
            ticketType: document.getElementById('ticketType'),
            ticketAmount: document.getElementById('ticketAmount'),
            ticketLimitPrice: document.getElementById('ticketLimitPrice'),
            ticketSummary: document.getElementById('ticketSummary'),
            ticketBuyBtn: document.getElementById('ticketBuyBtn'),
            ticketSellBtn: document.getElementById('ticketSellBtn')
        };
    }

    bindEvents() {
        if (this.els.simScenario) {
            this.els.simScenario.addEventListener('change', (event) => this.setScenario(event.target.value));
        }
        if (this.els.simSpeed) {
            this.els.simSpeed.addEventListener('change', (event) => this.setSpeed(Number(event.target.value || 1)));
        }
        if (this.els.simResetBtn) {
            this.els.simResetBtn.addEventListener('click', () => this.resetSimulation());
        }
        if (this.els.simPauseBtn) {
            this.els.simPauseBtn.addEventListener('click', () => this.togglePause());
        }
        if (this.els.selectedCrypto) {
            this.els.selectedCrypto.addEventListener('change', () => {
                if (this.els.ticketSymbol) this.els.ticketSymbol.value = this.els.selectedCrypto.value;
                this.updateTicketSummary();
                this.updateCharts();
            });
        }
        ['ticketSymbol', 'ticketType', 'ticketAmount', 'ticketLimitPrice'].forEach((key) => {
            const el = this.els[key];
            if (el) {
                el.addEventListener('input', () => this.updateTicketSummary());
                el.addEventListener('change', () => this.updateTicketSummary());
            }
        });
        if (this.els.ticketBuyBtn) {
            this.els.ticketBuyBtn.addEventListener('click', () => this.submitTicket('buy'));
        }
        if (this.els.ticketSellBtn) {
            this.els.ticketSellBtn.addEventListener('click', () => this.submitTicket('sell'));
        }
    }

    seedActivityLog() {
        this.logActivity('system', 'Training simulation initialized. All balances, prices, fills, and P/L are simulated only.');
        this.logActivity('coach', 'Choose a scenario, select an asset, and practice entries/exits without risking real funds.');
    }

    logActivity(kind, message) {
        this.activityLog.unshift({ kind, message, timestamp: new Date() });
        this.activityLog = this.activityLog.slice(0, 12);
        this.renderActivityFeed();
    }

    setScenario(scenario, notify = true) {
        if (!this.scenarioProfiles[scenario]) return;
        this.scenario = scenario;
        if (this.els.simScenario) this.els.simScenario.value = scenario;
        if (notify) {
            this.showNotification(`Scenario switched to ${this.scenarioProfiles[scenario].label}. Training simulation only.`, 'info');
            this.logActivity('scenario', `${this.scenarioProfiles[scenario].label} mode active: ${this.scenarioProfiles[scenario].pulse}.`);
        }
        this.updateSimulationMeta();
    }

    setSpeed(multiplier, notify = true) {
        this.speedMultiplier = Math.max(0.5, Number(multiplier) || 1);
        if (this.els.simSpeed) this.els.simSpeed.value = String(this.speedMultiplier);
        this.startPriceUpdates();
        if (notify) {
            this.showNotification(`Simulation speed set to ${this.speedMultiplier}x.`, 'info');
        }
        this.updateSimulationMeta();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.els.simPauseBtn) {
            this.els.simPauseBtn.textContent = this.isPaused ? 'Resume Simulation' : 'Pause Simulation';
        }
        this.showNotification(this.isPaused ? 'Simulation paused. Prices are frozen.' : 'Simulation resumed.', 'warning');
        this.logActivity('system', this.isPaused ? 'Simulation paused for review.' : 'Simulation resumed with live simulated ticks.');
    }

    resetSimulation() {
        this.balance = this.startingBalance;
        this.portfolio = {};
        this.transactions = [];
        this.activityLog = [];
        this.currentPrices = this.generateRealisticPrices();
        this.priceHistory = this.initializePriceHistory();
        this.isPaused = false;
        if (this.els.ticketAmount) this.els.ticketAmount.value = '';
        if (this.els.ticketLimitPrice) this.els.ticketLimitPrice.value = '';
        if (this.els.simPauseBtn) this.els.simPauseBtn.textContent = 'Pause Simulation';
        this.seedActivityLog();
        this.logActivity('system', 'Training account reset to the starting fake balance.');
        this.showNotification('Training account reset. All prior simulated trades were cleared.', 'warning');
        this.updateUI();
    }

    startPriceUpdates() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        const tickMs = Math.max(200, this.baseTickMs / this.speedMultiplier);
        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.updatePrices();
            }
        }, tickMs);
    }

    updatePrices() {
        const scenarioProfile = this.scenarioProfiles[this.scenario];
        Object.entries(this.cryptos).forEach(([symbol, crypto]) => {
            const currentPrice = this.currentPrices[symbol];
            const noise = (Math.random() - 0.5) * crypto.volatility * scenarioProfile.volatility;
            const microTrend = scenarioProfile.drift + ((Math.sin(Date.now() / 10000) + Math.cos(Date.now() / 16000)) * 0.0008);
            const nextPrice = Math.max(0.0001, currentPrice * (1 + noise + microTrend));
            this.currentPrices[symbol] = nextPrice;
            this.priceHistory[symbol].push(nextPrice);
            if (this.priceHistory[symbol].length > 120) {
                this.priceHistory[symbol].shift();
            }
        });
        this.updateUI();
        this.checkAlerts();
    }

    getTicketSnapshot() {
        const symbol = this.els.ticketSymbol?.value || this.els.selectedCrypto?.value || 'BTC';
        const type = this.els.ticketType?.value || 'market';
        const amount = Number(this.els.ticketAmount?.value || 0);
        const marketPrice = this.currentPrices[symbol];
        const limitPrice = Number(this.els.ticketLimitPrice?.value || 0);
        const executionPrice = type === 'limit' && limitPrice > 0 ? limitPrice : marketPrice;
        const gross = executionPrice * amount;
        const fee = gross * this.platforms[this.activePlatform].fee;
        return { symbol, type, amount, marketPrice, limitPrice, executionPrice, gross, fee, total: gross + fee };
    }

    updateTicketSummary() {
        if (!this.els.ticketSummary) return;
        const snapshot = this.getTicketSnapshot();
        const platform = this.platforms[this.activePlatform];
        this.els.ticketSummary.innerHTML = `
            <div class="ticket-summary-row"><span>Training Mode</span><strong>TRAINING SIMULATION ONLY</strong></div>
            <div class="ticket-summary-row"><span>Asset</span><strong>${snapshot.symbol}</strong></div>
            <div class="ticket-summary-row"><span>Market Price</span><strong>${this.formatCurrency(snapshot.marketPrice)}</strong></div>
            <div class="ticket-summary-row"><span>Estimated Fill</span><strong>${this.formatCurrency(snapshot.executionPrice)}</strong></div>
            <div class="ticket-summary-row"><span>Estimated Fee</span><strong>${this.formatCurrency(snapshot.fee)} (${(platform.fee * 100).toFixed(2)}%)</strong></div>
            <div class="ticket-summary-row"><span>Estimated Total</span><strong>${this.formatCurrency(snapshot.total)}</strong></div>
        `;
    }

    submitTicket(side) {
        const snapshot = this.getTicketSnapshot();
        if (!snapshot.amount || snapshot.amount <= 0) {
            this.showNotification('Enter a valid simulated amount before placing a training order.', 'error');
            return;
        }
        if (snapshot.type === 'limit' && snapshot.limitPrice <= 0) {
            this.showNotification('Set a valid limit price for the simulated limit order.', 'error');
            return;
        }
        if (side === 'buy') {
            this.buyCrypto(snapshot.symbol, snapshot.amount, snapshot.type, snapshot.executionPrice);
            return;
        }
        this.sellCrypto(snapshot.symbol, snapshot.amount, snapshot.type, snapshot.executionPrice);
    }

    buyCrypto(symbol, amount, type = 'market', overridePrice = null) {
        const price = overridePrice || this.currentPrices[symbol];
        const gross = amount * price;
        const fee = gross * this.platforms[this.activePlatform].fee;
        const totalCost = gross + fee;
        if (totalCost > this.balance) {
            this.showNotification('Insufficient simulated cash balance for this training order.', 'error');
            return false;
        }
        const holding = this.portfolio[symbol] || { amount: 0, avgPrice: 0 };
        const newAmount = holding.amount + amount;
        const newAvgPrice = ((holding.amount * holding.avgPrice) + (amount * price)) / newAmount;
        this.balance -= totalCost;
        this.portfolio[symbol] = { amount: newAmount, avgPrice: newAvgPrice };
        const trade = { side: 'buy', symbol, amount, price, fee, type, timestamp: new Date(), platform: this.activePlatform };
        this.transactions.unshift(trade);
        this.transactions = this.transactions.slice(0, 40);
        this.logActivity('trade', `Simulated buy executed: ${amount.toFixed(6)} ${symbol} at ${this.formatCurrency(price)} on ${this.platforms[this.activePlatform].name}.`);
        this.showNotification(`Simulated buy filled for ${symbol}. Training simulation only.`, 'success');
        this.updateUI();
        return true;
    }

    sellCrypto(symbol, amount, type = 'market', overridePrice = null) {
        const holding = this.portfolio[symbol];
        if (!holding || holding.amount < amount) {
            this.showNotification('Insufficient simulated holdings for this sell order.', 'error');
            return false;
        }
        const price = overridePrice || this.currentPrices[symbol];
        const gross = amount * price;
        const fee = gross * this.platforms[this.activePlatform].fee;
        const revenue = gross - fee;
        const realized = (price - holding.avgPrice) * amount - fee;
        this.balance += revenue;
        holding.amount -= amount;
        if (holding.amount <= 0.0000001) {
            delete this.portfolio[symbol];
        }
        const trade = { side: 'sell', symbol, amount, price, fee, type, timestamp: new Date(), platform: this.activePlatform, realized };
        this.transactions.unshift(trade);
        this.transactions = this.transactions.slice(0, 40);
        this.logActivity('trade', `Simulated sell executed: ${amount.toFixed(6)} ${symbol} at ${this.formatCurrency(price)}. Realized ${realized >= 0 ? 'gain' : 'loss'} ${this.formatCurrency(Math.abs(realized))}.`);
        this.showNotification(`Simulated sell filled for ${symbol}. No real assets were traded.`, realized >= 0 ? 'success' : 'warning');
        this.updateUI();
        return true;
    }

    getTotalPortfolioValue() {
        let total = this.balance;
        Object.entries(this.portfolio).forEach(([symbol, holding]) => {
            total += holding.amount * this.currentPrices[symbol];
        });
        return total;
    }

    getTotalProfitLoss() {
        let total = 0;
        Object.entries(this.portfolio).forEach(([symbol, holding]) => {
            total += (this.currentPrices[symbol] - holding.avgPrice) * holding.amount;
        });
        return total;
    }

    switchPlatform(platformName) {
        if (!this.platforms[platformName]) return;
        this.activePlatform = platformName;
        this.updateTicketSummary();
        this.updateUI();
        this.showNotification(`Platform theme changed to ${this.platforms[platformName].name}. Still a training simulation only.`, 'info');
        this.logActivity('system', `${this.platforms[platformName].name} training skin active. Fee profile now ${(this.platforms[platformName].fee * 100).toFixed(2)}%.`);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `trading-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2600);
    }

    checkAlerts() {
        Object.entries(this.portfolio).forEach(([symbol, holding]) => {
            const pct = ((this.currentPrices[symbol] - holding.avgPrice) / holding.avgPrice) * 100;
            if (Math.abs(pct) >= 8) {
                this.logActivity('alert', `${symbol} moved ${pct >= 0 ? '+' : ''}${pct.toFixed(2)}% versus your simulated entry.`);
            }
        });
    }

    updateUI() {
        this.updateBalance();
        this.updateSimulationMeta();
        this.updateTicketSummary();
        this.updatePortfolio();
        this.updatePriceTable();
        this.updateCharts();
        this.renderActivityFeed();
    }

    updateBalance() {
        const totalValue = this.getTotalPortfolioValue();
        const plValue = this.getTotalProfitLoss();
        const costBasis = Math.max(totalValue - plValue, 1);
        const plPct = (plValue / costBasis) * 100;
        if (this.els.balance) this.els.balance.textContent = this.formatCurrency(this.balance);
        if (this.els.total) this.els.total.textContent = this.formatCurrency(totalValue);
        if (this.els.pl) {
            this.els.pl.textContent = `${plValue >= 0 ? '+' : ''}${this.formatCurrency(plValue)} (${plPct >= 0 ? '+' : ''}${plPct.toFixed(2)}%)`;
            this.els.pl.style.color = plValue >= 0 ? '#0ECB81' : '#F6465D';
        }
    }

    updateSimulationMeta() {
        const profile = this.scenarioProfiles[this.scenario];
        if (this.els.simModeLabel) this.els.simModeLabel.textContent = profile.label;
        if (this.els.simSpeedLabel) this.els.simSpeedLabel.textContent = `${this.speedMultiplier.toFixed(1)}x`;
        if (this.els.simOpenPositions) this.els.simOpenPositions.textContent = String(Object.keys(this.portfolio).length);
    }

    updatePortfolio() {
        if (!this.els.portfolio) return;
        const entries = Object.entries(this.portfolio);
        if (!entries.length) {
            this.els.portfolio.innerHTML = '<div style="text-align:center;color:#8ea4c7;padding:20px;">No simulated holdings yet. Start a training trade.</div>';
            return;
        }
        this.els.portfolio.innerHTML = entries.map(([symbol, holding]) => {
            const current = this.currentPrices[symbol];
            const value = current * holding.amount;
            const pl = (current - holding.avgPrice) * holding.amount;
            const pct = ((current - holding.avgPrice) / holding.avgPrice) * 100;
            return `
                <div class="portfolio-item">
                    <div class="portfolio-header">
                        <span class="crypto-icon">${this.cryptos[symbol].icon}</span>
                        <span class="crypto-name">${this.cryptos[symbol].name} (${symbol})</span>
                    </div>
                    <div class="portfolio-details">
                        <div>Amount: ${holding.amount.toFixed(6)}</div>
                        <div>Avg Entry: ${this.formatCurrency(holding.avgPrice)}</div>
                        <div>Last Sim Price: ${this.formatCurrency(current)}</div>
                        <div>Position Value: ${this.formatCurrency(value)}</div>
                        <div class="pl ${pl >= 0 ? 'positive' : 'negative'}">P/L: ${pl >= 0 ? '+' : ''}${this.formatCurrency(pl)} (${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%)</div>
                    </div>
                    <div class="portfolio-actions">
                        <button class="btn-sell" onclick="tradingSimulator.sellAll('${symbol}')">Simulate Sell All</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    sellAll(symbol) {
        const holding = this.portfolio[symbol];
        if (!holding) return;
        this.sellCrypto(symbol, holding.amount, 'market', this.currentPrices[symbol]);
    }

    updatePriceTable() {
        if (!this.els.priceTable) return;
        this.els.priceTable.innerHTML = Object.entries(this.cryptos).map(([symbol, crypto]) => {
            const price = this.currentPrices[symbol];
            const history = this.priceHistory[symbol];
            const previous = history[history.length - 2] || price;
            const delta = ((price - previous) / previous) * 100;
            return `
                <div class="price-item" onclick="tradingSimulator.selectCrypto('${symbol}')">
                    <div class="price-header">
                        <span class="crypto-icon">${crypto.icon}</span>
                        <div>
                            <div class="crypto-name">${crypto.name}</div>
                            <div class="market-watch-meta">${symbol} · TRAINING SIMULATION ONLY</div>
                        </div>
                    </div>
                    <div class="price-details">
                        <div class="current-price">${this.formatCurrency(price)}</div>
                        <div class="price-change ${delta >= 0 ? 'positive' : 'negative'}">${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta).toFixed(2)}%</div>
                    </div>
                    <div class="price-actions">
                        <button class="btn-buy" onclick="event.stopPropagation(); tradingSimulator.quickFill('${symbol}', 'buy')">Buy</button>
                        <button class="btn-sell" onclick="event.stopPropagation(); tradingSimulator.quickFill('${symbol}', 'sell')">Sell</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    quickFill(symbol, side) {
        if (this.els.ticketSymbol) this.els.ticketSymbol.value = symbol;
        if (this.els.selectedCrypto) this.els.selectedCrypto.value = symbol;
        if (this.els.ticketAmount && !this.els.ticketAmount.value) this.els.ticketAmount.value = symbol === 'BTC' ? '0.01' : '1';
        this.updateTicketSummary();
        this.updateCharts();
        this.showNotification(`Loaded ${symbol} into the ${side} training ticket.`, 'info');
    }

    updateCharts() {
        this.updatePriceChart();
        this.updatePortfolioChart();
    }

    updatePriceChart() {
        const canvas = this.els.priceChart;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const symbol = this.els.selectedCrypto?.value || 'BTC';
        const history = this.priceHistory[symbol] || [];
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        for (let i = 0; i <= 4; i += 1) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        if (history.length < 2) return;
        const max = Math.max(...history);
        const min = Math.min(...history);
        const range = Math.max(max - min, 0.0001);
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0, 212, 170, 0.35)');
        gradient.addColorStop(1, 'rgba(0, 136, 255, 0.02)');
        ctx.beginPath();
        history.forEach((price, index) => {
            const x = (width / (history.length - 1)) * index;
            const y = height - (((price - min) / range) * (height * 0.78) + height * 0.1);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#00d4aa';
        ctx.stroke();
        ctx.lineTo(width, height - 12);
        ctx.lineTo(0, height - 12);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.fillStyle = '#cfe4ff';
        ctx.font = '12px Segoe UI';
        ctx.fillText(`${symbol} · ${this.formatCurrency(history[history.length - 1])} · TRAINING SIMULATION ONLY`, 14, 22);
    }

    updatePortfolioChart() {
        const canvas = this.els.portfolioChart;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        const slices = [];
        Object.entries(this.portfolio).forEach(([symbol, holding]) => {
            slices.push({ symbol, label: symbol, value: holding.amount * this.currentPrices[symbol], color: this.getCryptoColor(symbol) });
        });
        slices.push({ symbol: 'CASH', label: 'Cash', value: this.balance, color: '#718096' });
        const total = slices.reduce((sum, slice) => sum + slice.value, 0);
        if (total <= 0) return;
        let angle = -Math.PI / 2;
        slices.forEach((slice) => {
            const portion = slice.value / total;
            const next = angle + portion * Math.PI * 2;
            ctx.fillStyle = slice.color;
            ctx.beginPath();
            ctx.moveTo(width / 2, height / 2);
            ctx.arc(width / 2, height / 2, Math.min(width, height) / 3, angle, next);
            ctx.closePath();
            ctx.fill();
            angle = next;
        });
        ctx.fillStyle = '#08111f';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#eaf4ff';
        ctx.font = 'bold 12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Simulated', width / 2, height / 2 - 4);
        ctx.fillText('Portfolio', width / 2, height / 2 + 14);
        ctx.textAlign = 'left';
    }

    renderActivityFeed() {
        if (!this.els.activityFeed) return;
        this.els.activityFeed.innerHTML = this.activityLog.map((item) => `
            <div class="activity-item">
                <div class="activity-top">
                    <span>${String(item.kind || 'system').toUpperCase()}</span>
                    <span>${this.formatTime(item.timestamp)}</span>
                </div>
                <div class="activity-copy">${this.escapeHtml(item.message)}</div>
            </div>
        `).join('');
    }

    formatCurrency(value) {
        return `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: value >= 1 ? 2 : 6 })}`;
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    getCryptoColor(symbol) {
        const colors = {
            BTC: '#F7931A',
            ETH: '#627EEA',
            BNB: '#F3BA2F',
            ADA: '#0033AD',
            SOL: '#00FFA3',
            XRP: '#7b8aa8',
            DOT: '#E6007A',
            DOGE: '#C2A633',
            AVAX: '#E84142',
            MATIC: '#8247E5'
        };
        return colors[symbol] || '#718096';
    }

    selectCrypto(symbol) {
        if (this.els.selectedCrypto) this.els.selectedCrypto.value = symbol;
        if (this.els.ticketSymbol) this.els.ticketSymbol.value = symbol;
        this.updateTicketSummary();
        this.updateCharts();
        this.showNotification(`Selected ${this.cryptos[symbol].name} in the training workspace.`, 'info');
    }
}

let tradingSimulator;

function initializeTradingSimulator() {
    if (!tradingSimulator) {
        tradingSimulator = new CryptoTradingSimulator();
    }
    return tradingSimulator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoTradingSimulator;
}
