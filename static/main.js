// ==============================
// LOADING SCREEN FUNCTIONALITY
// ==============================

// Network-aware loading manager
class LoadingManager {
    constructor() {
        // Store initial scroll position
        this.initialScrollY = window.scrollY;
        
        // Prevent scrolling at the very beginning
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.initialScrollY}px`;
        document.body.style.width = '100%';
        
        this.loadingOverlay = document.getElementById('loadingOverlay');
        if (!this.loadingOverlay) {
            console.warn('Loading overlay not found');
            this.resetBodyStyles();
            return;
        }
        
        // Ensure the overlay is visible, fixed, and at the top
        this.loadingOverlay.style.display = 'flex';
        this.loadingOverlay.style.position = 'fixed';
        this.loadingOverlay.style.top = '0';
        this.loadingOverlay.style.left = '0';
        this.loadingOverlay.style.right = '0';
        this.loadingOverlay.style.bottom = '0';
        this.loadingOverlay.style.zIndex = '999999';
        window.scrollTo(0, 0);
        
        this.loadingStartTime = Date.now();
        this.resources = [];
        this.loadedResources = 0;
        
        // Network-aware loading times
        this.checkNetworkSpeed();
        
        this.init();
    }
    
    // Check network connection and adjust loading time
    checkNetworkSpeed() {
        // Default values
        this.minLoadingTime = 15000; // Default minimum loading time
        
        // Check if Network Information API is available
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Update loading text based on connection
            const loadingText = document.querySelector('.loading-text p');
            if (loadingText) {
                if (connection.saveData) {
                    loadingText.textContent = 'Loading in data-saver mode...';
                } else {
                    loadingText.textContent = 'Preparing your experience...';
                }
            }
            
            // Adjust loading time based on network type
            if (connection.effectiveType) {
                switch(connection.effectiveType) {
                    case 'slow-2g':
                    case '2g':
                        this.minLoadingTime = 2500; // Longer loading time for slow connections
                        console.log('Slow connection detected: Extending loading time');
                        break;
                    case '3g':
                        this.minLoadingTime = 1800;
                        break;
                    case '4g':
                        this.minLoadingTime = 1200; // Shorter time for fast connections
                        break;
                }
            }
            
            // Listen for connection changes
            if (connection.addEventListener) {
                connection.addEventListener('change', () => {
                    this.checkNetworkSpeed();
                });
            }
        }
    }

    init() {
        try {
            // Track critical resources
            this.trackImages();
            this.trackFonts();
            this.trackStylesheets();
            this.trackScripts();
            
            // Start loading process
            this.startLoading();
        } catch (error) {
            console.error('Error initializing loading manager:', error);
            this.hideLoading();
        }
    }

    trackImages() {
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            if (img.src && !img.complete) {
                this.resources.push(img);
                img.addEventListener('load', () => this.resourceLoaded());
                img.addEventListener('error', () => this.resourceLoaded());
            }
        });
    }

    trackFonts() {
        // Track font loading
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                this.resourceLoaded();
            }).catch(error => {
                console.warn('Font loading error:', error);
                this.resourceLoaded();
            });
            this.resources.push('fonts');
        }
    }

    trackStylesheets() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(link => {
            if (!link.sheet) {
                this.resources.push(link);
                link.addEventListener('load', () => this.resourceLoaded());
                link.addEventListener('error', () => this.resourceLoaded());
            }
        });
    }
    
    trackScripts() {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
                this.resources.push(script);
                // Scripts that are already executed won't trigger load events
                // So we immediately count them as loaded
                setTimeout(() => this.resourceLoaded(), 0);
            }
        });
    }

    resourceLoaded() {
        this.loadedResources++;
        this.updateProgress();
        
        if (this.loadedResources >= this.resources.length) {
            this.checkLoadingComplete();
        }
    }

    updateProgress() {
        const progressBar = document.querySelector('.loading-progress-bar');
        if (progressBar && this.resources.length > 0) {
            const progress = (this.loadedResources / this.resources.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    checkLoadingComplete() {
        const elapsedTime = Date.now() - this.loadingStartTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);
        
        setTimeout(() => {
            this.hideLoading();
        }, remainingTime);
    }

    startLoading() {
        // If no resources to track, set a minimum loading time
        if (this.resources.length === 0) {
            setTimeout(() => {
                this.hideLoading();
            }, this.minLoadingTime);
        }
    }

    resetBodyStyles() {
        // Reset all body style constraints
        document.documentElement.style.overflow = '';
        document.body.classList.add('loaded');
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        
        // Restore scroll position
        if (this.initialScrollY) {
            window.scrollTo(0, this.initialScrollY);
        }
    }
    
    hideLoading() {
        if (this.loadingOverlay) {
            // Add fade-out class for smooth transition
            this.loadingOverlay.classList.add('fade-out');
            
            // Reset body styles and restore scroll position
            this.resetBodyStyles();
            
            // Remove loading overlay after transition
            setTimeout(() => {
                if (this.loadingOverlay && this.loadingOverlay.parentNode) {
                    this.loadingOverlay.style.display = 'none';
                    this.loadingOverlay.style.zIndex = '-1'; // Move it behind content
                }
            }, 500);
            
            // Log page load time for performance monitoring
            const loadTime = Date.now() - this.loadingStartTime;
            console.log(`Page loaded in ${loadTime}ms`);
        }
    }
}

// Initialize loading manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        new LoadingManager();
    } catch (error) {
        console.error('Failed to initialize loading manager:', error);
        document.body.classList.add('loaded');
    }
});

// Fallback: Hide loading screen after maximum time
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
            loadingOverlay.classList.add('hidden');
            document.body.classList.add('loaded');
        }
    }, 3000); // Maximum 3 seconds
});

// ==============================
// THEME SWITCHING FUNCTIONALITY
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add a subtle animation to the toggle button
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 100);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'bi bi-sun-fill';
        } else {
            themeIcon.className = 'bi bi-moon-fill';
        }
    }
});

// ==============================
// TYPING ANIMATION
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const roles = [
            'Backend Developer',
            'Python Developer', 
            'Web Developer',
            'Django Developer',
            'Flask Developer'
        ];
        
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;
        
        function typeRole() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let speed = isDeleting ? deleteSpeed : typeSpeed;
            
            if (!isDeleting && charIndex === currentRole.length) {
                speed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
            
            setTimeout(typeRole, speed);
        }
        
        typeRole();
    }
});

// ==============================
// SMOOTH SCROLLING FOR NAVIGATION
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});

// ==============================
// NAVBAR SCROLL EFFECT
// ==============================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.8)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// ==============================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat-item, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ==============================
// CURRENT YEAR UPDATE
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
});

// ==============================
// FLOATING CARDS ANIMATION
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add random movement to floating cards
        setInterval(() => {
            const randomX = Math.random() * 10 - 5; // Random between -5 and 5
            const randomY = Math.random() * 10 - 5;
            card.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + (index * 1000)); // Stagger the animations
    });
});

// ==============================
// MOUSE CURSOR EFFECT (Optional)
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    // Create cursor elements
    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    
    cursor.className = 'cursor';
    cursorFollower.className = 'cursor-follower';
    
    cursor.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: var(--accent-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    
    cursorFollower.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid var(--accent-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.5;
        transition: transform 0.3s ease;
    `;
    
    // Only add custom cursor on desktop
    if (window.innerWidth > 768) {
        document.body.appendChild(cursor);
        document.body.appendChild(cursorFollower);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 5 + 'px';
            cursor.style.top = e.clientY - 5 + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX - 20 + 'px';
                cursorFollower.style.top = e.clientY - 20 + 'px';
            }, 100);
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '0.5';
        });
        
        // Scale cursor on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .tech-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursorFollower.style.transform = 'scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
});

// ==============================
// PERFORMANCE OPTIMIZATIONS
// ==============================

// Preload critical images
function preloadImages() {
    const criticalImages = [
        '/static/img/profile1.jpg',
        '/static/img/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Lazy loading for non-critical images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    initLazyLoading();
});

// ==============================
// ENHANCED ANIMATIONS
// ==============================

// Add loading animation completion
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    body.classList.add('loaded');
    
    // Stagger animation for skill items
    const skillItems = document.querySelectorAll('.tech-item, .skill-item');
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.section, .card, .skill-category');
    animateElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ==============================
// PERFORMANCE OPTIMIZATION
// ==============================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounced scroll listener
const debouncedScrollHandler = debounce(() => {
    // Any scroll-related functionality can be added here
}, 10);

// Education timeline animations
function initEducationAnimations() {
    const educationItems = document.querySelectorAll('.education-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200);
            }
        });
    }, observerOptions);
    
    educationItems.forEach(item => {
        observer.observe(item);
    });
}

document.addEventListener('DOMContentLoaded', initEducationAnimations);

// ==============================
// PERFORMANCE MONITORING
// ==============================
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0
        };
        this.init();
    }

    init() {
        // Measure performance metrics
        window.addEventListener('load', () => {
            this.measureMetrics();
        });
    }

    measureMetrics() {
        // Performance timing API
        const perfData = performance.timing;
        this.metrics.loadTime = perfData.loadEventEnd - perfData.navigationStart;
        this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;

        // Paint timing API
        if ('getEntriesByType' in performance) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    this.metrics.firstPaint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                }
            });
        }

        // Log performance metrics in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Performance Metrics:', this.metrics);
        }
    }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', function() {
    new PerformanceMonitor();
});

// Error handling for unhandled promises
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent the default handling (console error)
    event.preventDefault();
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
