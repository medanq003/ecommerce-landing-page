// Analytics Configuration
// Replace these IDs with your actual tracking IDs

const ANALYTICS_CONFIG = {
    // Google Analytics 4 Configuration
    googleAnalytics: {
        enabled: true,
        measurementId: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID
        config: {
            // Enhanced ecommerce tracking
            send_page_view: true,
            custom_map: {
                'custom_parameter_1': 'landing_page_version'
            }
        },
        // Custom events to track
        events: {
            page_view: 'page_view',
            cta_click: 'cta_click',
            exit_intent: 'exit_intent_detected',
            bot_detected: 'bot_detected',
            conversion: 'conversion'
        }
    },

    // Facebook Pixel Configuration
    facebookPixel: {
        enabled: true,
        pixelId: '1234567890123456', // Replace with your Facebook Pixel ID
        // Standard events to track
        events: {
            page_view: 'PageView',
            view_content: 'ViewContent',
            add_to_cart: 'AddToCart',
            initiate_checkout: 'InitiateCheckout',
            purchase: 'Purchase',
            lead: 'Lead'
        }
    },

    // Custom Analytics Endpoint
    customAnalytics: {
        enabled: false, // Set to true if you have a custom analytics endpoint
        endpoint: '/api/analytics',
        apiKey: 'your-api-key-here'
    },

    // Hotjar Configuration (optional)
    hotjar: {
        enabled: false,
        hjid: 1234567, // Replace with your Hotjar ID
        hjsv: 6
    },

    // Microsoft Clarity Configuration (optional)
    clarity: {
        enabled: false,
        projectId: 'abcdefghij' // Replace with your Clarity project ID
    }
};

// Enhanced Analytics Manager
class AnalyticsManager {
    constructor(config) {
        this.config = config;
        this.initialized = false;
        this.dataLayer = window.dataLayer || [];
    }

    // Initialize all enabled analytics services
    async init() {
        if (this.initialized) return;

        try {
            // Initialize Google Analytics
            if (this.config.googleAnalytics.enabled) {
                await this.initGoogleAnalytics();
            }

            // Initialize Facebook Pixel
            if (this.config.facebookPixel.enabled) {
                this.initFacebookPixel();
            }

            // Initialize Hotjar
            if (this.config.hotjar.enabled) {
                this.initHotjar();
            }

            // Initialize Microsoft Clarity
            if (this.config.clarity.enabled) {
                this.initClarity();
            }

            this.initialized = true;
            console.log('Analytics initialized successfully');

            // Track initial page view
            this.trackPageView();

        } catch (error) {
            console.error('Analytics initialization failed:', error);
        }
    }

    // Google Analytics 4 initialization
    async initGoogleAnalytics() {
        const { measurementId, config } = this.config.googleAnalytics;
        
        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', measurementId, config);

        console.log('Google Analytics initialized');
    }

    // Facebook Pixel initialization
    initFacebookPixel() {
        const { pixelId } = this.config.facebookPixel;
        
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', pixelId);
        
        console.log('Facebook Pixel initialized');
    }

    // Hotjar initialization
    initHotjar() {
        const { hjid, hjsv } = this.config.hotjar;
        
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:hjid,hjsv:hjsv};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

        console.log('Hotjar initialized');
    }

    // Microsoft Clarity initialization
    initClarity() {
        const { projectId } = this.config.clarity;
        
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", projectId);

        console.log('Microsoft Clarity initialized');
    }

    // Track page view
    trackPageView(customParameters = {}) {
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            page_referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            is_mobile: /Mobi|Android/i.test(navigator.userAgent),
            timestamp: new Date().toISOString(),
            ...customParameters
        };

        // Google Analytics
        if (this.config.googleAnalytics.enabled && window.gtag) {
            gtag('event', 'page_view', pageData);
        }

        // Facebook Pixel
        if (this.config.facebookPixel.enabled && window.fbq) {
            fbq('track', 'PageView', pageData);
        }

        // Custom analytics
        this.sendCustomEvent('page_view', pageData);

        console.log('Page view tracked:', pageData);
    }

    // Track custom events
    trackEvent(eventName, parameters = {}) {
        const eventData = {
            event_category: 'landing_page',
            event_label: eventName,
            timestamp: new Date().toISOString(),
            session_id: this.getSessionId(),
            ...parameters
        };

        // Google Analytics
        if (this.config.googleAnalytics.enabled && window.gtag) {
            gtag('event', eventName, eventData);
        }

        // Facebook Pixel
        if (this.config.facebookPixel.enabled && window.fbq) {
            const fbEventName = this.config.facebookPixel.events[eventName] || 'CustomEvent';
            fbq('track', fbEventName, eventData);
        }

        // Custom analytics
        this.sendCustomEvent(eventName, eventData);

        console.log('Event tracked:', eventName, eventData);
    }

    // Track conversions
    trackConversion(conversionData = {}) {
        const data = {
            conversion_type: 'cta_click',
            // 移除价格信息
            ...conversionData
        };

        this.trackEvent('conversion', data);

        // Facebook Pixel conversion
        if (this.config.facebookPixel.enabled && window.fbq) {
            fbq('track', 'Lead', data);
        }
    }

    // Send to custom analytics endpoint
    sendCustomEvent(eventName, data) {
        if (!this.config.customAnalytics.enabled) return;

        const payload = {
            event: eventName,
            data: data,
            timestamp: Date.now(),
            session_id: this.getSessionId()
        };

        fetch(this.config.customAnalytics.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.customAnalytics.apiKey}`
            },
            body: JSON.stringify(payload)
        }).catch(error => {
            console.error('Custom analytics error:', error);
        });
    }

    // Generate or get session ID
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    // Calculate and track CTR
    calculateCTR() {
        const pageViews = parseInt(localStorage.getItem('page_views') || '0') + 1;
        const ctaClicks = parseInt(localStorage.getItem('cta_clicks') || '0');
        
        localStorage.setItem('page_views', pageViews.toString());
        
        const ctr = ctaClicks > 0 ? (ctaClicks / pageViews * 100).toFixed(2) : 0;
        
        this.trackEvent('ctr_calculated', {
            page_views: pageViews,
            cta_clicks: ctaClicks,
            ctr_percentage: ctr
        });

        return ctr;
    }

    // Track CTA click and update CTR
    trackCTAClick(buttonId) {
        const ctaClicks = parseInt(localStorage.getItem('cta_clicks') || '0') + 1;
        localStorage.setItem('cta_clicks', ctaClicks.toString());

        this.trackEvent('cta_click', {
            button_id: buttonId,
            total_clicks: ctaClicks
        });

        this.trackConversion({
            conversion_id: `cta_${buttonId}_${Date.now()}`
        });

        // Calculate new CTR
        this.calculateCTR();
    }
}

// Export for use in main application
window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;
window.AnalyticsManager = AnalyticsManager;
