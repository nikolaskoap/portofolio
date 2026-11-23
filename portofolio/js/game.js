/**
 * 🎮 RETRO FINANCE & PIXEL GAME ENGINE
 * Crafted for Mikail Syafiq Ikhwanudin's Interactive Portfolio
 * Features:
 * - Pure Web Audio API 8-bit Sound Synthesizer (Zero external audio files)
 * - Draggable Physics Engine with momentum, tossing, and collision
 * - Mario '?' Block interactive coin spawning mechanics
 * - Crypto Vault Staking drop-zone with rewards & confetti
 * - Interactive Mario Runner Mini-Game
 */

class RetroSoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.25;
        this.init();
    }

    init() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            // Lazy init or init on first gesture
            const unlock = () => {
                if (!this.ctx) {
                    this.ctx = new AudioCtx();
                }
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                window.removeEventListener('click', unlock);
                window.removeEventListener('keydown', unlock);
                window.removeEventListener('touchstart', unlock);
            };
            window.addEventListener('click', unlock, { once: true });
            window.addEventListener('keydown', unlock, { once: true });
            window.addEventListener('touchstart', unlock, { once: true });
        }
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playCoin() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        // Classic Mario Coin sound: B5 (987.77 Hz) -> E6 (1318.51 Hz)
        osc.frequency.setValueAtTime(987.77, t);
        osc.frequency.setValueAtTime(1318.51, t + 0.08);

        gain.gain.setValueAtTime(this.volume, t);
        gain.gain.setValueAtTime(this.volume, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.45);
    }

    playJump() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(650, t + 0.15);

        gain.gain.setValueAtTime(this.volume * 0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.18);
    }

    playBump() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);

        gain.gain.setValueAtTime(this.volume * 0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.12);
    }

    playPowerup() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const notes = [330, 392, 659, 523, 587, 784]; // E4, G4, E5, C5, D5, G5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteStart = t + idx * 0.06;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, noteStart);

            gain.gain.setValueAtTime(this.volume * 0.75, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.14);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(noteStart);
            osc.stop(noteStart + 0.14);
        });
    }

    playWarp() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.25);

        gain.gain.setValueAtTime(this.volume * 0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.25);
    }

    playSwapSuccess() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, t); // C5
        osc.frequency.setValueAtTime(659.25, t + 0.08); // E5
        osc.frequency.setValueAtTime(1046.50, t + 0.16); // C6

        gain.gain.setValueAtTime(this.volume * 0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.35);
    }

    playBlip() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        gain.gain.setValueAtTime(this.volume * 0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
    }
}

// Global Sound Engine
window.soundEngine = new RetroSoundEngine();

/**
 * 🪙 COIN & BLOCK MANAGER
 * Manages player SATS, level, streak, and floating crypto spawns
 */
class CryptoGameManager {
    constructor() {
        this.sats = parseInt(localStorage.getItem('mkl_sats') || '250', 10);
        this.eth = parseFloat(localStorage.getItem('mkl_eth') || '0.045');
        this.level = parseInt(localStorage.getItem('mkl_lvl') || '1', 10);
        this.coinsCollected = 0;
        this.blocksHit = 0;
        this.setupEventListeners();
        this.updateHUD();
    }

    setupEventListeners() {
        // Block clicks
        document.addEventListener('click', (e) => {
            const block = e.target.closest('.pixel-q-block, .pixel-brick-block');
            if (block) {
                this.hitBlock(block, e.clientX, e.clientY);
            }
        });

        // Sound toggle button
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                window.soundEngine.enabled = !window.soundEngine.enabled;
                soundBtn.classList.toggle('muted', !window.soundEngine.enabled);
                soundBtn.setAttribute('aria-label', window.soundEngine.enabled ? 'Mute Sound' : 'Unmute Sound');
                if (window.soundEngine.enabled) {
                    window.soundEngine.playCoin();
                }
            });
        }
    }

    hitBlock(block, clickX, clickY) {
        this.blocksHit++;
        window.soundEngine.playCoin();

        // Authentic block jump animation
        block.classList.add('block-bump');
        setTimeout(() => block.classList.remove('block-bump'), 200);

        // Calculate spawn position
        const rect = block.getBoundingClientRect();
        const spawnX = rect.left + rect.width / 2;
        const spawnY = rect.top;

        // Reward logic
        const satReward = Math.floor(Math.random() * 50) + 50;
        this.sats += satReward;
        this.coinsCollected++;
        this.spawnBitcoinParticle(spawnX, spawnY);

        if (this.coinsCollected % 10 === 0) {
            this.level++;
            this.triggerLevelUp(spawnX, spawnY);
        }

        // Keep the arcade reward state internal; do not render floating money stats.
        this.updateHUD();

        // Save progress
        localStorage.setItem('mkl_sats', this.sats.toString());
        localStorage.setItem('mkl_lvl', this.level.toString());
    }

    spawnFloatingReward(x, y, text) {
        // Floating currency stats are intentionally disabled for a cleaner portfolio UI.
        return { x, y, text };
    }

    spawnCoinParticle(x, y) {
        this.spawnBitcoinParticle(x, y);
    }

    spawnBitcoinParticle(x, y) {
        const coin = document.createElement('div');
        coin.className = 'pixel-coin-particle bitcoin-pop';
        coin.setAttribute('aria-label', 'Koin Bitcoin');
        coin.innerHTML = `
            <span class="bitcoin-pop-coin">₿</span>
            <span class="bitcoin-pop-label">BTC</span>
        `;
        coin.style.left = `${x - 18}px`;
        coin.style.top = `${y - 8}px`;
        document.body.appendChild(coin);
        setTimeout(() => coin.remove(), 900);
    }

    triggerLevelUp(x, y) {
        window.soundEngine.playPowerup();
        const banner = document.createElement('div');
        banner.className = 'level-up-banner';
        banner.innerHTML = `<span>★ LEVEL UP! LVL ${this.level} ★</span><small>Web3 Explorer Power +10%</small>`;
        banner.style.left = `${Math.max(20, Math.min(window.innerWidth - 260, x - 120))}px`;
        banner.style.top = `${Math.max(80, y - 60)}px`;
        document.body.appendChild(banner);

        setTimeout(() => banner.remove(), 2400);
    }

    updateHUD() {
        const satsEls = document.querySelectorAll('.hud-sats-val');
        satsEls.forEach(el => el.textContent = this.sats.toLocaleString());

        const lvlEls = document.querySelectorAll('.hud-lvl-val');
        lvlEls.forEach(el => el.textContent = this.level.toString());
    }
}

/**
 * 🧲 DRAGGABLE PHYSICS ENGINE
 * Makes coins, stickers, and retro windows tossable with inertia & drop zones
 */
class DraggableEngine {
    constructor() {
        this.activeDrag = null;
        this.init();
    }

    init() {
        // Document-level drag handlers
        document.addEventListener('mousedown', (e) => this.onStart(e));
        document.addEventListener('mousemove', (e) => this.onMove(e));
        document.addEventListener('mouseup', (e) => this.onEnd(e));

        document.addEventListener('touchstart', (e) => this.onStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.onMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.onEnd(e));
    }

    getClientPos(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    onStart(e) {
        const handle = e.target.closest('[data-drag-handle]') || e.target.closest('.draggable-item, .draggable-coin, .draggable-sticker');
        if (!handle) return;

        // If clicking interactive buttons inside, ignore drag
        if (e.target.closest('button, a, input, select, textarea') && !e.target.classList.contains('drag-allowed')) {
            return;
        }

        const el = handle.closest('.draggable-window, .draggable-item, .draggable-coin, .draggable-sticker');
        if (!el) return;

        const pos = this.getClientPos(e);
        const rect = el.getBoundingClientRect();

        // Bring element to top z-index
        const highestZ = DraggableEngine.getHighestZIndex();
        el.style.zIndex = highestZ + 1;

        this.activeDrag = {
            el: el,
            startX: pos.x,
            startY: pos.y,
            origLeft: rect.left,
            origTop: rect.top,
            lastX: pos.x,
            lastY: pos.y,
            vx: 0,
            vy: 0,
            lastTime: performance.now(),
            isCoin: el.classList.contains('draggable-coin'),
            isSticker: el.classList.contains('draggable-sticker')
        };

        el.classList.add('is-dragging');
        window.soundEngine.playBlip();

        if (e.type === 'touchstart') {
            e.preventDefault();
        }
    }

    onMove(e) {
        if (!this.activeDrag) return;
        const pos = this.getClientPos(e);
        const now = performance.now();
        const dt = Math.max(1, now - this.activeDrag.lastTime);

        const dx = pos.x - this.activeDrag.startX;
        const dy = pos.y - this.activeDrag.startY;

        // Calculate velocity for throw physics
        this.activeDrag.vx = (pos.x - this.activeDrag.lastX) / dt * 15;
        this.activeDrag.vy = (pos.y - this.activeDrag.lastY) / dt * 15;

        this.activeDrag.lastX = pos.x;
        this.activeDrag.lastY = pos.y;
        this.activeDrag.lastTime = now;

        const newLeft = this.activeDrag.origLeft + dx;
        const newTop = this.activeDrag.origTop + dy;

        this.activeDrag.el.style.position = 'fixed';
        this.activeDrag.el.style.left = `${newLeft}px`;
        this.activeDrag.el.style.top = `${newTop}px`;
        this.activeDrag.el.style.margin = '0';
        this.activeDrag.el.style.bottom = 'auto';
        this.activeDrag.el.style.right = 'auto';

        // Check hover over staking vault
        if (this.activeDrag.isCoin) {
            const vault = document.getElementById('crypto-vault-zone');
            if (vault) {
                const vaultRect = vault.getBoundingClientRect();
                const isOver = pos.x >= vaultRect.left && pos.x <= vaultRect.right &&
                               pos.y >= vaultRect.top && pos.y <= vaultRect.bottom;
                vault.classList.toggle('vault-hover', isOver);
            }
        }

        if (e.type === 'touchmove') {
            e.preventDefault();
        }
    }

    onEnd(e) {
        if (!this.activeDrag) return;
        const drag = this.activeDrag;
        drag.el.classList.remove('is-dragging');

        // Check if dropped into Staking Vault
        if (drag.isCoin) {
            const vault = document.getElementById('crypto-vault-zone');
            if (vault) {
                const vaultRect = vault.getBoundingClientRect();
                const rect = drag.el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const inVault = centerX >= vaultRect.left && centerX <= vaultRect.right &&
                                centerY >= vaultRect.top && centerY <= vaultRect.bottom;

                vault.classList.remove('vault-hover');

                if (inVault) {
                    this.depositCoinIntoVault(drag.el, vault);
                    this.activeDrag = null;
                    return;
                }
            }

            // Coin toss physics with boundary bouncing
            this.applyTossPhysics(drag);
        }

        this.activeDrag = null;
    }

    depositCoinIntoVault(coinEl, vaultEl) {
        window.soundEngine.playPowerup();
        vaultEl.classList.add('vault-deposit-anim');
        setTimeout(() => vaultEl.classList.remove('vault-deposit-anim'), 400);

        // SATS reward
        const depositAmount = parseInt(coinEl.dataset.value || '100', 10);
        if (window.gameManager) {
            window.gameManager.sats += depositAmount * 2; // Staking bonus!
            window.gameManager.spawnFloatingReward(
                vaultEl.getBoundingClientRect().left + vaultEl.offsetWidth / 2,
                vaultEl.getBoundingClientRect().top,
                `+${depositAmount * 2} SATS STAKED!`
            );
            window.gameManager.updateHUD();
        }

        // Dissolve coin
        coinEl.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        coinEl.style.transform = 'scale(0) rotate(180deg)';
        coinEl.style.opacity = '0';
        setTimeout(() => {
            coinEl.remove();
            // Respawn after 8 seconds
            setTimeout(() => this.spawnFreeCoin(), 8000);
        }, 300);
    }

    spawnFreeCoin() {
        const pool = document.getElementById('floating-coins-container');
        if (!pool) return;

        const newCoin = document.createElement('div');
        newCoin.className = 'draggable-coin';
        newCoin.dataset.value = '100';
        newCoin.title = 'Tarik & Lempar atau Masukkan ke Crypto Vault!';
        const randomX = Math.random() * (window.innerWidth - 120) + 40;
        const randomY = Math.random() * (window.innerHeight - 300) + 120;

        newCoin.style.position = 'fixed';
        newCoin.style.left = `${randomX}px`;
        newCoin.style.top = `${randomY}px`;
        newCoin.innerHTML = `
            <div class="coin-pixel-graphic">
                <span class="coin-glint"></span>
                <span class="coin-symbol">₿</span>
            </div>
            <span class="coin-tag">100 SATS</span>
        `;
        pool.appendChild(newCoin);
    }

    applyTossPhysics(drag) {
        let x = parseFloat(drag.el.style.left);
        let y = parseFloat(drag.el.style.top);
        let vx = drag.vx;
        let vy = drag.vy;
        const damping = 0.88;
        const gravity = 0.4;
        const bounds = {
            minX: 10,
            maxX: window.innerWidth - drag.el.offsetWidth - 10,
            minY: 60,
            maxY: window.innerHeight - drag.el.offsetHeight - 10
        };

        const step = () => {
            if (Math.abs(vx) < 0.2 && Math.abs(vy) < 0.2) return;

            vy += gravity;
            vx *= damping;
            vy *= damping;

            x += vx;
            y += vy;

            // Bounce on borders
            if (x < bounds.minX) { x = bounds.minX; vx = -vx * 0.6; }
            if (x > bounds.maxX) { x = bounds.maxX; vx = -vx * 0.6; }
            if (y < bounds.minY) { y = bounds.minY; vy = -vy * 0.6; }
            if (y > bounds.maxY) { y = bounds.maxY; vy = -vy * 0.5; }

            drag.el.style.left = `${x}px`;
            drag.el.style.top = `${y}px`;

            if (Math.abs(vx) > 0.2 || Math.abs(vy) > 0.2) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    static getHighestZIndex() {
        let max = 100;
        document.querySelectorAll('.draggable-window, .draggable-item, .draggable-coin, .draggable-sticker').forEach(el => {
            const z = parseInt(window.getComputedStyle(el).zIndex, 10);
            if (!isNaN(z) && z > max) max = z;
        });
        return max;
    }
}

/**
 * 📈 LIVE CRYPTO TICKER & DEX SIMULATOR
 * Real-time simulated candlestick fluctuations for BTC, ETH, SOL
 */
class CryptoTerminal {
    constructor() {
        this.prices = {
            BTC: { price: 95420.50, change: 3.42, high: 96800, low: 94100 },
            ETH: { price: 3485.20, change: 5.18, high: 3550, low: 3390 },
            BASE: { price: 4.82, change: 12.45, high: 5.10, low: 4.20 }
        };
        this.activePair = 'BTC';
        this.history = [];
        this.init();
    }

    init() {
        if (!document.getElementById('pixel-crypto-chart')) return;
        this.generateHistory();
        this.startTickerLoop();
        this.setupEventListeners();
        this.renderChart();
    }

    generateHistory() {
        let base = this.prices[this.activePair].price;
        for (let i = 0; i < 20; i++) {
            const delta = (Math.random() - 0.48) * (base * 0.006);
            base += delta;
            this.history.push(base);
        }
    }

    startTickerLoop() {
        setInterval(() => {
            Object.keys(this.prices).forEach(key => {
                const deltaPct = (Math.random() - 0.49) * 0.003;
                this.prices[key].price *= (1 + deltaPct);
            });

            // Update current active history
            this.history.push(this.prices[this.activePair].price);
            if (this.history.length > 24) this.history.shift();

            this.updateDisplay();
            this.renderChart();
        }, 1800);
    }

    setupEventListeners() {
        const pairTabs = document.querySelectorAll('[data-crypto-pair]');
        pairTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                pairTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.activePair = tab.dataset.cryptoPair;
                this.history = [];
                this.generateHistory();
                this.updateDisplay();
                this.renderChart();
                window.soundEngine.playBlip();
            });
        });

        // Swap button
        const swapBtn = document.getElementById('dex-swap-btn');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => {
                if (window.gameManager && window.gameManager.sats < 50) {
                    alert('Kurang SATS! Tabrak blok tanda tanya (?) untuk koin!');
                    return;
                }
                if (window.gameManager) {
                    window.gameManager.sats -= 50;
                    window.gameManager.updateHUD();
                }

                window.soundEngine.playSwapSuccess();
                swapBtn.innerHTML = `<span>⏳ SWAPPING ON BASE...</span>`;
                swapBtn.disabled = true;

                setTimeout(() => {
                    swapBtn.innerHTML = `<span>✅ SWAPPED 50 SATS → 1 MKL-EXP</span>`;
                    const hashDisplay = document.getElementById('dex-tx-hash');
                    if (hashDisplay) {
                        const fakeHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
                        hashDisplay.innerHTML = `<span class="tx-tag">Tx Success:</span> <a href="https://middlekid.vercel.app" target="_blank" class="tx-link">${fakeHash.substring(0, 10)}...${fakeHash.substring(34)}</a>`;
                    }
                    setTimeout(() => {
                        swapBtn.innerHTML = `<span>⚡ SWAP 50 SATS FOR EXP</span>`;
                        swapBtn.disabled = false;
                    }, 3000);
                }, 1200);
            });
        }
    }

    updateDisplay() {
        const current = this.prices[this.activePair];
        const priceEl = document.getElementById('terminal-current-price');
        const changeEl = document.getElementById('terminal-change');

        if (priceEl) {
            priceEl.textContent = `$${current.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        if (changeEl) {
            const isUp = current.change >= 0;
            changeEl.textContent = `${isUp ? '+' : ''}${current.change.toFixed(2)}%`;
            changeEl.className = `crypto-change ${isUp ? 'is-up' : 'is-down'}`;
        }
    }

    renderChart() {
        const canvas = document.getElementById('pixel-crypto-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Draw pixel grid lines
        ctx.strokeStyle = 'rgba(70, 95, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);

        for (let y = 15; y < h; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        ctx.setLineDash([]);

        if (this.history.length < 2) return;

        const min = Math.min(...this.history);
        const max = Math.max(...this.history);
        const range = max - min || 1;

        // Draw Stepped Pixel Line (Chiptune/Retro Style)
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00D26A';
        ctx.fillStyle = 'rgba(0, 210, 106, 0.1)';

        ctx.beginPath();
        const stepX = w / (this.history.length - 1);

        this.history.forEach((val, i) => {
            const x = i * stepX;
            const y = h - ((val - min) / range) * (h - 20) - 10;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                // Stepped pixel curve
                const prevX = (i - 1) * stepX;
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw glow dot at head
        const lastIdx = this.history.length - 1;
        const lastX = lastIdx * stepX;
        const lastY = h - ((this.history[lastIdx] - min) / range) * (h - 20) - 10;

        ctx.fillStyle = '#00D26A';
        ctx.fillRect(lastX - 3, lastY - 3, 6, 6);
    }
}

/**
 * 🕹️ MARIO PIXEL RUNNER INTERACTIVE AVATAR
 * Interactive character you can move with Arrow keys / A & D / touch controls
 */
class MarioPixelRunner {
    constructor() {
        this.x = 80;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.isJumping = false;
        this.facing = 1; // 1: right, -1: left
        this.runnerEl = document.getElementById('mario-runner-char');
        this.container = document.getElementById('mario-arcade-stage');
        this.keys = {};
        if (this.runnerEl && this.container) {
            this.init();
        }
    }

    init() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (['ArrowUp', 'w', 'W', ' '].includes(e.key) && !this.isJumping) {
                this.jump();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        document.querySelectorAll('[data-runner-control]').forEach((button) => {
            const control = button.dataset.runnerControl;
            const release = (event) => {
                event.preventDefault();
                if (control !== 'jump') {
                    this.keys[control] = false;
                    button.classList.remove('is-pressed');
                    button.setAttribute('aria-pressed', 'false');
                }
            };

            button.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                if (control === 'jump') {
                    this.jump();
                    return;
                }

                this.keys[control] = true;
                button.classList.add('is-pressed');
                button.setAttribute('aria-pressed', 'true');
                if (button.setPointerCapture) button.setPointerCapture(event.pointerId);
            });

            button.addEventListener('pointerup', release);
            button.addEventListener('pointercancel', release);
            button.addEventListener('lostpointercapture', release);
            button.addEventListener('contextmenu', (event) => event.preventDefault());
        });

        // Loop
        const loop = () => {
            this.update();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    jump() {
        if (this.isJumping) return;
        this.isJumping = true;
        this.vy = -11;
        window.soundEngine.playJump();
        this.runnerEl.classList.add('is-jumping');
    }

    update() {
        const stageW = this.container.clientWidth;

        // Horizontal movement
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.vx = 3.5;
            this.facing = 1;
            this.runnerEl.classList.add('is-running');
        } else if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.vx = -3.5;
            this.facing = -1;
            this.runnerEl.classList.add('is-running');
        } else {
            this.vx *= 0.7;
            if (Math.abs(this.vx) < 0.2) {
                this.vx = 0;
                this.runnerEl.classList.remove('is-running');
            }
        }

        // Apply horizontal
        this.x += this.vx;
        if (this.x < 10) this.x = 10;
        const runnerWidth = this.runnerEl.offsetWidth || 50;
        if (this.x > stageW - runnerWidth - 10) this.x = stageW - runnerWidth - 10;

        // Apply gravity
        if (this.isJumping || this.y > 0) {
            this.vy += 0.65;
            this.y -= this.vy;
            if (this.y <= 0) {
                this.y = 0;
                this.vy = 0;
                this.isJumping = false;
                this.runnerEl.classList.remove('is-jumping');
            }
        }

        // Check head collision with stage question blocks
        if (this.vy < 0) {
            const runnerRect = this.runnerEl.getBoundingClientRect();
            const blocks = this.container.querySelectorAll('.pixel-q-block, .pixel-brick-block');
            blocks.forEach(block => {
                const bRect = block.getBoundingClientRect();
                const overlapX = runnerRect.left < bRect.right && runnerRect.right > bRect.left;
                const hitBottom = Math.abs(runnerRect.top - bRect.bottom) < 14;
                if (overlapX && hitBottom) {
                    this.vy = 2; // Bounce down
                    if (window.gameManager) {
                        window.gameManager.hitBlock(block, bRect.left + bRect.width / 2, bRect.top);
                    }
                }
            });
        }

        // Render position
        this.runnerEl.style.transform = `translateX(${this.x}px) translateY(${-this.y}px) scaleX(${this.facing})`;
    }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new CryptoGameManager();
    window.draggableEngine = new DraggableEngine();
    window.cryptoTerminal = new CryptoTerminal();
    window.marioRunner = new MarioPixelRunner();
});
