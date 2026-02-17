// ============================================
// FAST LEFT-TO-RIGHT REVEAL ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initFastLeftToRightReveal();
    initParticles();
    initNavigation();
    initMagneticElements();
    initTextScramble();
    initTiltEffect();
    initCounters();
    initBackToTop();
    initSmoothScroll();
    initLightbox();
    initProjectFocus();
    initHobbyParallax();
    initTypingEffect();
    
    setTimeout(() => lucide.createIcons(), 100);
});

// ============================================
// 1. FAST LEFT-TO-RIGHT REVEAL (MAIN ANIMATION)
// ============================================
function initFastLeftToRightReveal() {
    // Elements to animate from left
    const leftElements = [
        '.about-image',
        '.timeline-block:nth-child(1)',
        '.project-card:nth-child(3n+1)',
        '.cert-card:nth-child(odd)',
        '.cca-card:nth-child(odd)',
        '.hobby-category:nth-child(odd)',
        '.skill-category:nth-child(1)',
        '.contact-text'
    ];
    
    // Elements to animate from right
    const rightElements = [
        '.about-text-content',
        '.timeline-block:nth-child(2)',
        '.project-card:nth-child(3n+2)',
        '.project-card:nth-child(3n+3)',
        '.cert-card:nth-child(even)',
        '.cca-card:nth-child(even)',
        '.hobby-category:nth-child(even)',
        '.skill-category:nth-child(2)',
        '.skill-category:nth-child(3)',
        '.contact-visual'
    ];
    
    // Elements to animate from bottom (fast)
    const bottomElements = [
        '.timeline-item',
        '.detail-item',
        '.hobby-item',
        '.edu-card',
        '.about-quote',
        '.contact-item'
    ];
    
    // Apply initial styles - HIDDEN but ready
    leftElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-80px)';
            el.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.willChange = 'opacity, transform';
        });
    });
    
    rightElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(80px)';
            el.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.willChange = 'opacity, transform';
        });
    });
    
    bottomElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.3s ease-out';
            el.style.willChange = 'opacity, transform';
        });
    });
    
    // Fast intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '50px 0px 0px 0px', // Start animating BEFORE visible
        threshold: 0.05 // Trigger at 5% visibility
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Small delay based on element index for stagger
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                const delay = Math.min(index * 50, 200); // Max 200ms delay
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0) translateY(0)';
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements
    [...leftElements, ...rightElements, ...bottomElements].forEach(selector => {
        document.querySelectorAll(selector).forEach(el => observer.observe(el));
    });
}

// ============================================
// 2. PARTICLE SYSTEM (SIMPLIFIED FOR SPEED)
// ============================================
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    hero.insertBefore(canvas, hero.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    
    // Fewer particles for better performance
    for (let i = 0; i < 25; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            size: Math.random() * 2 + 1
        });
    }
    
    let frameCount = 0;
    function animate() {
        frameCount++;
        // Render every 2nd frame for performance
        if (frameCount % 2 === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = i % 2 === 0 ? '#00F0FF' : '#7000FF';
                ctx.fill();
                
                // Fewer connections
                for (let j = i + 1; j < particles.length; j += 2) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
        }
        
        requestAnimationFrame(animate);
    }
    animate();
}

// ============================================
// 3. NAVIGATION (FAST)
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        navbar.style.background = currentScroll > 50 
            ? 'rgba(11, 12, 21, 0.98)' 
            : 'rgba(11, 12, 21, 0.9)';
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    }, { passive: true });
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navMenu.style.transform = isOpen ? 'translateY(0)' : 'translateY(-150%)';
            navMenu.style.opacity = isOpen ? '1' : '0';
            
            const icon = navToggle.querySelector('i');
            icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
            lucide.createIcons();
        });
    }
}

// ============================================
// 4. MAGNETIC ELEMENTS (SUBTLE)
// ============================================
function initMagneticElements() {
    const magnetics = document.querySelectorAll('.btn, .nav-logo');
    
    magnetics.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            elem.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0, 0)';
            elem.style.transition = 'transform 0.3s ease';
        });
        
        elem.addEventListener('mouseenter', () => {
            elem.style.transition = 'transform 0.1s';
        });
    });
}

// ============================================
// 5. TEXT SCRAMBLE (FAST)
// ============================================
function initTextScramble() {
    const el = document.querySelector('.hero-name');
    if (!el) return;
    
    const originalText = el.textContent;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let frame = 0;
    let queue = [];
    
    for (let i = 0; i < originalText.length; i++) {
        queue.push({
            from: '',
            to: originalText[i],
            start: Math.floor(Math.random() * 20),
            end: Math.floor(Math.random() * 20) + 20
        });
    }
    
    function update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0; i < queue.length; i++) {
            let { from, to, start, end, char } = queue[i];
            if (frame >= end) {
                complete++;
                output += to;
            } else if (frame >= start) {
                if (!char || Math.random() < 0.3) {
                    char = chars[Math.floor(Math.random() * chars.length)];
                    queue[i].char = char;
                }
                output += `<span style="color:#00F0FF">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        el.innerHTML = output;
        
        if (complete === queue.length) return;
        frame++;
        requestAnimationFrame(update);
    }
    
    setTimeout(update, 500);
}

// ============================================
// 6. 3D TILT (FAST)
// ============================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .cert-card, .hobby-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ============================================
// 7. FAST COUNTERS
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let current = 0;
                    const increment = target / 15; // Faster
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target + '+';
                            counter.style.color = '#00FF94';
                            setTimeout(() => counter.style.color = '', 200);
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 30); // Faster interval
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// ============================================
// 8. BACK TO TOP WITH PROGRESS
// ============================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.pageYOffset > 500);
    }, { passive: true });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// 9. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 10. LIGHTBOX
// ============================================
function initLightbox() {
    window.openLightbox = function(element) {
        const lightbox = document.getElementById('lightbox');
        const mediaContainer = document.getElementById('lightbox-media');
        const caption = document.getElementById('lightbox-caption');

        // clear previous media
        mediaContainer.innerHTML = '';

        const imgEl = element.querySelector('img');
        const videoSrc = imgEl && imgEl.dataset ? imgEl.dataset.video : null;

        if (videoSrc) {
            const video = document.createElement('video');
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            video.style.maxWidth = '90%';
            video.style.maxHeight = '80vh';

            const source = document.createElement('source');
            source.src = videoSrc;
            source.type = 'video/mp4';
            video.appendChild(source);

            // prevent clicks on media from closing the lightbox
            video.addEventListener('click', (e) => e.stopPropagation());

            mediaContainer.appendChild(video);

            // attempt to play (may be blocked by browser autoplay policies)
            video.play().catch(() => {});
        } else {
            const img = document.createElement('img');
            img.src = imgEl ? imgEl.src : '';
            img.alt = imgEl ? imgEl.alt : '';
            img.style.maxWidth = '90%';
            img.style.maxHeight = '80vh';
            img.addEventListener('click', (e) => e.stopPropagation());

            mediaContainer.appendChild(img);

            img.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            setTimeout(() => {
                img.style.transition = 'all 0.2s ease';
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
            }, 10);
        }

        caption.textContent = imgEl ? imgEl.alt : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function() {
        const lightbox = document.getElementById('lightbox');
        const mediaContainer = document.getElementById('lightbox-media');

        const video = mediaContainer.querySelector('video');
        if (video) {
            try { video.pause(); } catch (e) {}
            video.remove();
        }

        mediaContainer.innerHTML = '';
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeLightbox();
    });
}

// ============================================
// 11. PROJECT FOCUS
// ============================================
function initProjectFocus() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.6';
                    c.style.filter = 'grayscale(0.5)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            cards.forEach(c => {
                c.style.opacity = '';
                c.style.filter = '';
            });
        });
    });
}

// ============================================
// 12. HOBBY PARALLAX
// ============================================
function initHobbyParallax() {
    const items = document.querySelectorAll('.hobby-item');
    
    items.forEach(item => {
        const img = item.querySelector('img');
        
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            img.style.transform = `scale(1.15) translate(${-x * 15}px, ${-y * 15}px)`;
        });
        
        item.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1) translate(0, 0)';
        });
    });
}

// ============================================
// 13. TYPING EFFECT
// ============================================
function initTypingEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '3px solid #00F0FF';
    title.style.paddingRight = '5px';
    
    let i = 0;
    const type = () => {
        if (i < text.length) {
            title.textContent = text.slice(0, ++i);
            setTimeout(type, 80);
        } else {
            title.style.borderRight = 'none';
            title.style.paddingRight = '0';
        }
    };
    
    setTimeout(type, 800);
}