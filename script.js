// ===================================
// MAIN JAVASCRIPT - Valentine's Site
// ===================================

class ValentineSite {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMusicControl();
        this.setupGallery();
        this.setupLightbox();
        this.setupVideoHover();
        this.setupParallax();
        this.setupScrollAnimations();

        console.log('💝 Valentine\'s Site Loaded with Love!');
    }

    // ===================================
    // NAVIGATION
    // ===================================
    setupNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close menu when clicking on a link
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }
    }

    // ===================================
    // MUSIC CONTROL
    // ===================================
    setupMusicControl() {
        const musicToggle = document.getElementById('musicToggle');
        const bgMusic = document.getElementById('bgMusic');

        if (musicToggle && bgMusic) {
            // Préserver le choix utilisateur : par défaut ON à la première visite
            const storedPref = localStorage.getItem('musicPlaying');
            let isPlaying = storedPref === null ? true : (storedPref === 'true');
            let currentTime = parseFloat(localStorage.getItem('musicTime')) || 0;

            // Set initial time
            bgMusic.currentTime = currentTime;

            const updateUI = () => {
                if (isPlaying) {
                    musicToggle.textContent = '⏸';
                    musicToggle.style.opacity = '1';
                } else {
                    musicToggle.textContent = '♫';
                    musicToggle.style.opacity = '0.6';
                }
            };

            updateUI();

            // Tentative d'autoplay immédiat (certaines navigateurs peuvent l'empêcher)
            if (isPlaying && bgMusic.paused) {
                bgMusic.play().catch(e => console.log('Autoplay prevented'));
                updateUI();
            }

            musicToggle.addEventListener('click', () => {
                if (isPlaying) {
                    bgMusic.pause();
                    isPlaying = false;
                } else {
                    bgMusic.play().catch(e => console.log('Music autoplay prevented'));
                    isPlaying = true;
                }
                localStorage.setItem('musicPlaying', isPlaying);
                updateUI();
            });

            // Periodically save current time
            setInterval(() => {
                if (!bgMusic.paused) {
                    localStorage.setItem('musicTime', bgMusic.currentTime);
                }
            }, 1000);

            // Auto-play on first interaction if autoplay was prevented
            const startMusic = () => {
                if (isPlaying && bgMusic.paused) {
                    bgMusic.play().catch(e => console.log('Autoplay prevented'));
                    updateUI();
                }
            };

            document.addEventListener('click', startMusic, { once: true });
            document.addEventListener('scroll', startMusic, { once: true });
        }
    }

    // ===================================
    // GALLERY FILTERS
    // ===================================
    setupGallery() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active button
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.dataset.filter;

                    // Filter items
                    galleryItems.forEach(item => {
                        if (filter === 'all' || item.classList.contains(filter)) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }

    // ===================================
    // LIGHTBOX
    // ===================================
    setupLightbox() {
        this.currentImageIndex = 0;
        this.images = Array.from(document.querySelectorAll('.gallery-item.photos img')).map(img => img.src);

        // Make functions global for onclick handlers
        window.openLightbox = (index) => {
            this.currentImageIndex = index;
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightboxImage');

            if (lightbox && lightboxImage) {
                lightboxImage.src = this.images[index];
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        window.closeLightbox = () => {
            const lightbox = document.getElementById('lightbox');
            if (lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        window.nextImage = () => {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
            document.getElementById('lightboxImage').src = this.images[this.currentImageIndex];
        };

        window.prevImage = () => {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
            document.getElementById('lightboxImage').src = this.images[this.currentImageIndex];
        };

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('lightbox');
            if (lightbox && lightbox.classList.contains('active')) {
                if (e.key === 'Escape') window.closeLightbox();
                if (e.key === 'ArrowRight') window.nextImage();
                if (e.key === 'ArrowLeft') window.prevImage();
            }
        });

        // Click outside to close
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    window.closeLightbox();
                }
            });
        }
    }

    // ===================================
    // VIDEO HOVER EFFECTS
    // ===================================
    setupVideoHover() {
        const videoCards = document.querySelectorAll('.video-card');

        videoCards.forEach(card => {
            const video = card.querySelector('video');

            if (video) {
                card.addEventListener('mouseenter', () => {
                    video.play().catch(e => console.log('Video play prevented'));
                });

                card.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });

                // Click to play/pause
                card.addEventListener('click', () => {
                    if (video.paused) {
                        video.play();
                        card.querySelector('.play-overlay').style.opacity = '0';
                    } else {
                        video.pause();
                        card.querySelector('.play-overlay').style.opacity = '1';
                    }
                });
            }
        });
    }

    // ===================================
    // PARALLAX EFFECT
    // ===================================
    setupParallax() {
        const parallaxLayers = document.querySelectorAll('.parallax-layer');

        if (parallaxLayers.length > 0) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;

                parallaxLayers.forEach((layer, index) => {
                    const speed = (index + 1) * 0.3;
                    layer.style.transform = `translateY(${scrolled * speed}px)`;
                });
            });
        }
    }

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll('.reason-card, .stat-item, .gallery-item');
        animatedElements.forEach(el => observer.observe(el));
    }
}

// ===================================
// INITIALIZE
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    new ValentineSite();
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
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

// ===================================
// HERO VIDEO AUTOPLAY FIX
// ===================================
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
    heroVideo.play().catch(e => {
        console.log('Hero video autoplay prevented, will play on interaction');
        document.addEventListener('click', () => {
            heroVideo.play();
        }, { once: true });
    });
}

// ===================================
// PAGE TRANSITION EFFECT
// ===================================
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

// ===================================
// EASTER EGG - Konami Code
// ===================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        // Secret animation!
        document.body.style.animation = 'rainbow 2s linear infinite';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);

        console.log('🎉 Easter Egg Activated! 🎉');
    }
});