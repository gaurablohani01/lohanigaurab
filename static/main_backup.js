// ==============================
// LOADING SCREEN FUNCTIONALITY
// ==============================

// Prevent scrolling during loading
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

class LoadingManager {
    constructor() {
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.progressBar = document.querySelector('.loading-progress-bar');
        this.loadingText = document.querySelector('.loading-text p');
        
        this.resources = [];
        this.loadedResources = 0;
        this.progress = 0;
        this.minLoadingTime = 2000; // Minimum 2 seconds
        this.loadingStartTime = Date.now();
        
        this.messages = [
            'Preparing your experience...',
            'Loading educational content...',
            'Setting up animations...',
            'Almost ready...',
            'Welcome!'
        ];
        this.currentMessageIndex = 0;
        
        this.init();
    }
    
    init() {
        // Track critical resources
        this.trackImages();
        this.trackStylesheets();
        this.trackFonts();
        
        // Start message rotation
        this.rotateMessages();
        
        // Start loading simulation
        this.simulateProgress();
        
        // Fallback: Complete loading after maximum time
        setTimeout(() => {
            this.completeLoading();
        }, 5000);
    }
    
    trackImages() {
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            if (!img.complete) {
                this.resources.push(img);
                img.addEventListener('load', () => this.resourceLoaded());
                img.addEventListener('error', () => this.resourceLoaded());
            }
        });
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
    
    trackFonts() {
        if (document.fonts) {
            this.resources.push('fonts');
            document.fonts.ready.then(() => {
                this.resourceLoaded();
            }).catch(() => {
                this.resourceLoaded();
            });
        }
    }
    
    resourceLoaded() {
        this.loadedResources++;
        this.updateProgress();
        
        if (this.loadedResources >= this.resources.length) {
            this.checkMinimumTime();
        }
    }
    
    simulateProgress() {
        // Simulate loading progress if no resources to track
        if (this.resources.length === 0) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    this.checkMinimumTime();
                }
                this.setProgress(progress);
            }, 200);
        }
    }
    
    updateProgress() {
        if (this.resources.length > 0) {
            const progress = (this.loadedResources / this.resources.length) * 100;
            this.setProgress(progress);
        }
    }
    
    setProgress(percentage) {
        this.progress = Math.min(percentage, 100);
        if (this.progressBar) {
            this.progressBar.style.width = `${this.progress}%`;
        }
    }
    
    rotateMessages() {
        if (this.loadingText && this.currentMessageIndex < this.messages.length) {
            this.loadingText.textContent = this.messages[this.currentMessageIndex];
            this.currentMessageIndex++;
            
            setTimeout(() => {
                this.rotateMessages();
            }, 800);
        }
    }
    
    checkMinimumTime() {
        const elapsedTime = Date.now() - this.loadingStartTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);
        
        // Ensure progress reaches 100%
        this.setProgress(100);
        
        setTimeout(() => {
            this.completeLoading();
        }, remainingTime);
    }
    
    completeLoading() {
        // Enable scrolling
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        
        // Add loaded class to body
        document.body.classList.add('loaded');
        
        // Hide loading overlay
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('fade-out');
            
            // Remove overlay after transition
            setTimeout(() => {
                if (this.loadingOverlay && this.loadingOverlay.parentNode) {
                    this.loadingOverlay.remove();
                }
                
                // Trigger any scroll-based animations
                this.triggerScrollAnimations();
            }, 800);
        }
    }
    
    triggerScrollAnimations() {
        // Trigger intersection observer for animations
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }
}

// Initialize loading manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new LoadingManager();
});

// Fallback for immediate execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        new LoadingManager();
    });
} else {
    new LoadingManager();
}

// ==============================
// SCROLL ANIMATIONS
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for education items
                if (entry.target.classList.contains('education-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in-up, .education-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
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
    
    // Update icon based on current theme
    updateThemeIcon();
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    });
    
    function updateThemeIcon() {
        const currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            themeIcon.className = 'bi bi-sun-fill';
        } else {
            themeIcon.className = 'bi bi-moon-fill';
        }
    }
});

// ==============================
// NAVBAR FUNCTIONALITY
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    // Navbar scroll behavior
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// ==============================
// SMOOTH SCROLLING FUNCTIONALITY
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ==============================
// ANIMATION ON SCROLL
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with fade-in animation
    document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right').forEach(el => {
        observer.observe(el);
    });
});

// ==============================
// TYPING ANIMATION
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.querySelector('.typing-animation');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        typingElement.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after a short delay
        setTimeout(typeWriter, 500);
    }
});

// ==============================
// BACK TO TOP BUTTON
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ==============================
// CONTACT FORM FUNCTIONALITY
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handler)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
            }, 2000);
        });
    }
});

// ==============================
// NOTIFICATION SYSTEM
// ==============================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// ==============================
// FOOTER FUNCTIONALITY
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

// ==============================
// SERVICE WORKER REGISTRATION
// ==============================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// ==============================
// PERFORMANCE MONITORING
// ==============================
window.addEventListener('load', function() {
    // Performance monitoring
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }
    }
});

// ==============================
// ERROR HANDLING
// ==============================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});
