// Performance Optimization Module
class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            loadStart: performance.now(),
            domContentLoaded: null,
            firstPaint: null,
            firstContentfulPaint: null,
            largestContentfulPaint: null,
            cumulativeLayoutShift: 0,
            firstInputDelay: null
        };
        
        this.init();
    }

    init() {
        // Measure performance metrics
        this.measurePerformance();
        
        // Optimize images
        this.optimizeImages();
        
        // Lazy load non-critical resources
        this.lazyLoadResources();
        
        // Optimize fonts
        this.optimizeFonts();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Monitor and report performance
        this.monitorPerformance();
    }

    // Measure Core Web Vitals and other performance metrics
    measurePerformance() {
        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.metrics.domContentLoaded = performance.now() - this.metrics.loadStart;
            });
        } else {
            this.metrics.domContentLoaded = performance.now() - this.metrics.loadStart;
        }

        // First Paint and First Contentful Paint
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-input') {
                        this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                    }
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        this.metrics.cumulativeLayoutShift += entry.value;
                    }
                });
            }).observe({ entryTypes: ['layout-shift'] });

            // Paint metrics
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime;
                    } else if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                    }
                });
            }).observe({ entryTypes: ['paint'] });
        }
    }

    // Optimize images with lazy loading and WebP support
    optimizeImages() {
        // Create intersection observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // WebP support detection and replacement
        this.detectWebPSupport().then(supportsWebP => {
            if (supportsWebP) {
                document.querySelectorAll('img[data-webp]').forEach(img => {
                    img.src = img.dataset.webp;
                });
            }
        });
    }

    // Detect WebP support
    detectWebPSupport() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Lazy load non-critical resources
    lazyLoadResources() {
        // Lazy load CSS
        const lazyCSS = document.querySelectorAll('link[data-href]');
        lazyCSS.forEach(link => {
            setTimeout(() => {
                link.href = link.dataset.href;
                link.removeAttribute('data-href');
            }, 100);
        });

        // Lazy load JavaScript
        const lazyJS = document.querySelectorAll('script[data-src]');
        lazyJS.forEach(script => {
            setTimeout(() => {
                const newScript = document.createElement('script');
                newScript.src = script.dataset.src;
                newScript.async = true;
                document.head.appendChild(newScript);
            }, 200);
        });
    }

    // Optimize font loading
    optimizeFonts() {
        // Use font-display: swap for better performance
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Optimized';
                src: local('Arial'), local('Helvetica');
                font-display: swap;
            }
        `;
        document.head.appendChild(style);

        // Preload critical fonts
        if (document.fonts && document.fonts.load) {
            document.fonts.load('1rem Arial').then(() => {
                document.body.classList.add('fonts-loaded');
            });
        }
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            { href: '/styles/main.css', as: 'style' },
            { href: '/scripts/main.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    // Monitor performance and send reports
    monitorPerformance() {
        // Report performance metrics after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.reportPerformance();
            }, 1000);
        });

        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry);
                    }
                });
            }).observe({ entryTypes: ['longtask'] });
        }
    }

    // Report performance metrics
    reportPerformance() {
        const report = {
            ...this.metrics,
            loadComplete: performance.now() - this.metrics.loadStart,
            navigationTiming: this.getNavigationTiming(),
            resourceTiming: this.getResourceTiming(),
            memoryUsage: this.getMemoryUsage(),
            connectionInfo: this.getConnectionInfo()
        };

        console.log('Performance Report:', report);

        // Send to analytics if available
        if (window.app && window.app.trackEvent) {
            window.app.trackEvent('performance_metrics', {
                lcp: report.largestContentfulPaint,
                fid: report.firstInputDelay,
                cls: report.cumulativeLayoutShift,
                load_time: report.loadComplete,
                dom_content_loaded: report.domContentLoaded
            });
        }

        // Check Core Web Vitals thresholds
        this.checkCoreWebVitals(report);
    }

    // Get navigation timing data
    getNavigationTiming() {
        if (!performance.timing) return null;

        const timing = performance.timing;
        return {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            ssl: timing.secureConnectionStart > 0 ? timing.connectEnd - timing.secureConnectionStart : 0,
            ttfb: timing.responseStart - timing.navigationStart,
            download: timing.responseEnd - timing.responseStart,
            domProcessing: timing.domComplete - timing.domLoading,
            total: timing.loadEventEnd - timing.navigationStart
        };
    }

    // Get resource timing data
    getResourceTiming() {
        if (!performance.getEntriesByType) return null;

        const resources = performance.getEntriesByType('resource');
        return {
            totalResources: resources.length,
            totalSize: resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
            slowestResource: resources.reduce((slowest, resource) => 
                resource.duration > (slowest?.duration || 0) ? resource : slowest, null)
        };
    }

    // Get memory usage (if available)
    getMemoryUsage() {
        if (!performance.memory) return null;

        return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
        };
    }

    // Get connection information
    getConnectionInfo() {
        if (!navigator.connection) return null;

        return {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
            saveData: navigator.connection.saveData
        };
    }

    // Check Core Web Vitals against thresholds
    checkCoreWebVitals(report) {
        const thresholds = {
            lcp: 2500, // 2.5 seconds
            fid: 100,  // 100 milliseconds
            cls: 0.1   // 0.1
        };

        const results = {
            lcp: report.largestContentfulPaint <= thresholds.lcp ? 'good' : 'needs-improvement',
            fid: report.firstInputDelay <= thresholds.fid ? 'good' : 'needs-improvement',
            cls: report.cumulativeLayoutShift <= thresholds.cls ? 'good' : 'needs-improvement'
        };

        console.log('Core Web Vitals Assessment:', results);

        // Track poor performance
        Object.entries(results).forEach(([metric, result]) => {
            if (result === 'needs-improvement' && window.app && window.app.trackEvent) {
                window.app.trackEvent('poor_performance', {
                    metric: metric,
                    value: report[metric === 'lcp' ? 'largestContentfulPaint' : 
                                 metric === 'fid' ? 'firstInputDelay' : 'cumulativeLayoutShift'],
                    threshold: thresholds[metric]
                });
            }
        });
    }

    // Get performance score (0-100)
    getPerformanceScore() {
        const weights = {
            lcp: 0.25,
            fid: 0.25,
            cls: 0.25,
            loadTime: 0.25
        };

        let score = 100;

        // LCP score
        if (this.metrics.largestContentfulPaint > 4000) score -= 25;
        else if (this.metrics.largestContentfulPaint > 2500) score -= 15;

        // FID score
        if (this.metrics.firstInputDelay > 300) score -= 25;
        else if (this.metrics.firstInputDelay > 100) score -= 15;

        // CLS score
        if (this.metrics.cumulativeLayoutShift > 0.25) score -= 25;
        else if (this.metrics.cumulativeLayoutShift > 0.1) score -= 15;

        // Load time score
        const loadTime = performance.now() - this.metrics.loadStart;
        if (loadTime > 5000) score -= 25;
        else if (loadTime > 3000) score -= 15;

        return Math.max(0, Math.round(score));
    }
}

// Initialize performance optimizer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.performanceOptimizer = new PerformanceOptimizer();
    });
} else {
    window.performanceOptimizer = new PerformanceOptimizer();
}
