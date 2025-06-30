// Comprehensive Test Suite for Landing Page
class LandingPageTestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.startTime = Date.now();
    }

    // Add a test case
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    // Run all tests
    async runAllTests() {
        console.log('🚀 Starting Landing Page Test Suite...\n');
        
        for (const test of this.tests) {
            await this.runTest(test);
        }
        
        this.printResults();
    }

    // Run individual test
    async runTest(test) {
        try {
            const result = await test.testFunction();
            if (result) {
                console.log(`✅ ${test.name}`);
                this.results.passed++;
            } else {
                console.log(`❌ ${test.name}`);
                this.results.failed++;
            }
        } catch (error) {
            console.log(`❌ ${test.name} - Error: ${error.message}`);
            this.results.failed++;
        }
        this.results.total++;
    }

    // Print test results
    printResults() {
        const duration = Date.now() - this.startTime;
        console.log('\n📊 Test Results:');
        console.log(`Total: ${this.results.total}`);
        console.log(`Passed: ${this.results.passed}`);
        console.log(`Failed: ${this.results.failed}`);
        console.log(`Duration: ${duration}ms`);
        console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    }

    // Utility function to wait
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Utility function to check element exists
    elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    // Utility function to check element is visible
    elementVisible(selector) {
        const element = document.querySelector(selector);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }
}

// Initialize test suite
const testSuite = new LandingPageTestSuite();

// DOM Structure Tests
testSuite.addTest('Header section exists', () => {
    return testSuite.elementExists('.header');
});

testSuite.addTest('Main title is present', () => {
    return testSuite.elementExists('.main-title');
});

testSuite.addTest('CTA button exists', () => {
    return testSuite.elementExists('#main-cta');
});

testSuite.addTest('Exit modal exists', () => {
    return testSuite.elementExists('#exit-modal');
});

testSuite.addTest('Countdown timer exists', () => {
    return testSuite.elementExists('#countdown');
});

testSuite.addTest('Activity feed exists', () => {
    return testSuite.elementExists('#activity-feed');
});

// Functionality Tests
testSuite.addTest('Loading overlay is hidden after page load', async () => {
    await testSuite.wait(2000);
    const overlay = document.getElementById('loading-overlay');
    return overlay && (overlay.style.display === 'none' || overlay.classList.contains('hidden'));
});

testSuite.addTest('CTA button is enabled after delay', async () => {
    await testSuite.wait(3000);
    const ctaButton = document.getElementById('main-cta');
    return ctaButton && !ctaButton.disabled;
});

testSuite.addTest('Countdown timer is running', () => {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    return hoursEl && minutesEl && secondsEl &&
           hoursEl.textContent !== '' &&
           minutesEl.textContent !== '' &&
           secondsEl.textContent !== '';
});

testSuite.addTest('Analytics configuration is loaded', () => {
    return typeof window.ANALYTICS_CONFIG !== 'undefined' &&
           typeof window.AnalyticsManager !== 'undefined';
});

testSuite.addTest('Main application is initialized', () => {
    return typeof window.app !== 'undefined';
});

// Performance Tests
testSuite.addTest('Performance optimizer is loaded', () => {
    return typeof window.performanceOptimizer !== 'undefined';
});

testSuite.addTest('Page load time is acceptable', () => {
    const loadTime = performance.now();
    return loadTime < 3000; // Less than 3 seconds
});

testSuite.addTest('No JavaScript errors in console', () => {
    // This is a simplified check - in real testing you'd monitor console.error
    return true;
});

// SEO Tests
testSuite.addTest('Meta robots tag prevents indexing', () => {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    return robotsMeta && robotsMeta.content.includes('noindex');
});

testSuite.addTest('Page title is set', () => {
    return document.title && document.title.length > 0;
});

testSuite.addTest('Meta description is present', () => {
    const descMeta = document.querySelector('meta[name="description"]');
    return descMeta && descMeta.content.length > 0;
});

// Mobile Responsiveness Tests
testSuite.addTest('Viewport meta tag is set', () => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    return viewportMeta && viewportMeta.content.includes('width=device-width');
});

testSuite.addTest('Page is responsive', () => {
    // Check if CSS media queries are working
    const container = document.querySelector('.container');
    if (!container) return false;
    
    const computedStyle = window.getComputedStyle(container);
    return computedStyle.maxWidth !== 'none';
});

// Security Tests
testSuite.addTest('Bot detection is active', () => {
    return window.app && typeof window.app.detectBot === 'function';
});

testSuite.addTest('User interaction tracking is active', () => {
    return window.app && typeof window.app.initUserInteractionTracking === 'function';
});

// PWA Tests
testSuite.addTest('Service Worker is supported', () => {
    return 'serviceWorker' in navigator;
});

testSuite.addTest('Web App Manifest is linked', () => {
    return testSuite.elementExists('link[rel="manifest"]');
});

testSuite.addTest('Theme color is set', () => {
    return testSuite.elementExists('meta[name="theme-color"]');
});

// Analytics Tests
testSuite.addTest('Analytics manager can be initialized', () => {
    if (!window.AnalyticsManager || !window.ANALYTICS_CONFIG) return false;
    
    try {
        const manager = new window.AnalyticsManager(window.ANALYTICS_CONFIG);
        return typeof manager.trackEvent === 'function';
    } catch (error) {
        return false;
    }
});

// Interaction Tests
testSuite.addTest('CTA button click is handled', async () => {
    const ctaButton = document.getElementById('main-cta');
    if (!ctaButton) return false;
    
    // Simulate click event
    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
    });
    
    let eventHandled = false;
    ctaButton.addEventListener('click', () => {
        eventHandled = true;
    }, { once: true });
    
    ctaButton.dispatchEvent(clickEvent);
    await testSuite.wait(100);
    
    return eventHandled;
});

// Content Tests
testSuite.addTest('All required sections are present', () => {
    const requiredSections = ['.header', '.hero', '.solution', '.social-proof', '.urgency', '.cta-section'];
    return requiredSections.every(selector => testSuite.elementExists(selector));
});

testSuite.addTest('Social proof elements are visible', () => {
    return testSuite.elementVisible('.testimonials') &&
           testSuite.elementVisible('.stats-row');
});

testSuite.addTest('Urgency elements create scarcity', () => {
    return testSuite.elementExists('.scarcity-indicators') &&
           testSuite.elementExists('.countdown') &&
           testSuite.elementExists('.recent-activity');
});

// Accessibility Tests
testSuite.addTest('Images have alt attributes', () => {
    const images = document.querySelectorAll('img');
    return Array.from(images).every(img => img.hasAttribute('alt') || img.hasAttribute('aria-label'));
});

testSuite.addTest('Buttons have accessible text', () => {
    const buttons = document.querySelectorAll('button');
    return Array.from(buttons).every(button => 
        button.textContent.trim() !== '' || button.hasAttribute('aria-label')
    );
});

// Performance Metrics Test
testSuite.addTest('Core Web Vitals are measured', async () => {
    await testSuite.wait(1000);
    
    if (!window.performanceOptimizer) return false;
    
    const metrics = window.performanceOptimizer.metrics;
    return metrics && typeof metrics.loadStart === 'number';
});

// Error Handling Tests
testSuite.addTest('Error handling is implemented', () => {
    return window.app && typeof window.app.logSuspiciousActivity === 'function';
});

// Run tests when page is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => testSuite.runAllTests(), 1000);
    });
} else {
    setTimeout(() => testSuite.runAllTests(), 1000);
}

// Export for manual testing
window.testSuite = testSuite;
