/* ===================================
   FINAL FANTASY VII REBIRTH - PREMIUM
   JavaScript - 交互与动效
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有功能
    initLoader();
    initParticles();
    initCursorGlow();
    initNavbar();
    initScrollAnimations();
    initCharacterSlider();
    initParallax();
    initSmoothScroll();
});

/* ===================================
   Loading Animation
   =================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    
    // 2秒后隐藏加载动画
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
    }, 2000);
}

/* ===================================
   Particles Animation
   =================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 80;
    const connectionDistance = 150;
    
    // 设置画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = this.getRandomColor();
        }
        
        getRandomColor() {
            const colors = [
                'rgba(0, 212, 255, 0.5)',
                'rgba(124, 58, 237, 0.5)',
                'rgba(236, 72, 153, 0.5)'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // 边界检测
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    // 初始化粒子
    function initParticleArray() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // 绘制连接线
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 1 - distance / connectionDistance;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    // 初始化
    resizeCanvas();
    initParticleArray();
    animate();
    
    // 窗口大小改变时重新调整
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticleArray();
    });
}

/* ===================================
   Cursor Glow Effect
   =================================== */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    
    // 只在大屏幕上启用
    if (window.innerWidth < 768) {
        cursorGlow.style.display = 'none';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateGlow() {
        // 平滑跟随
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
    
    // 鼠标进入/离开窗口时的效果
    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '0.3';
    });
    
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

/* ===================================
   Navbar Scroll Effect
   =================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // 滚动效果
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // 移动端菜单
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

/* ===================================
   Scroll Animations
   =================================== */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/* ===================================
   Character Slider
   =================================== */
function initCharacterSlider() {
    const cards = document.querySelectorAll('.character-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.char-nav-btn.prev');
    const nextBtn = document.querySelector('.char-nav-btn.next');
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    function showCard(index) {
        // 移除所有active类
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 添加active类到当前卡片
        cards[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        showCard(currentIndex);
    }
    
    function prevCard() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        showCard(currentIndex);
    }
    
    // 事件监听
    nextBtn.addEventListener('click', nextCard);
    prevBtn.addEventListener('click', prevCard);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showCard(currentIndex);
        });
    });
    
    // 自动播放
    let autoPlayInterval = setInterval(nextCard, 5000);
    
    // 鼠标悬停时暂停自动播放
    const slider = document.querySelector('.characters-slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextCard, 5000);
    });
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevCard();
        if (e.key === 'ArrowRight') nextCard();
    });
}

/* ===================================
   Parallax Effect
   =================================== */
function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    if (parallaxLayers.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.3;
            layer.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/* ===================================
   Smooth Scroll
   =================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   Additional Enhancements
   =================================== */

// 视差滚动优化
function enhancedParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (!hero || !heroContent) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const opacity = 1 - (scrolled / heroHeight);
            const translateY = scrolled * 0.3;
            
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translateY(${translateY}px)`;
        }
    });
}

// 鼠标悬停卡片效果
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.location-card, .feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = '';
        });
    });
}

// 按钮涟漪效果
function initButtonRipple() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 数字动画
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-value, .score-value, .badge-value');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // 如果是纯数字，进行动画
                if (!isNaN(finalValue)) {
                    animateNumber(target, 0, parseInt(finalValue), 1500);
                }
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    numbers.forEach(number => {
        observer.observe(number);
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuart(progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

// 初始化额外功能
document.addEventListener('DOMContentLoaded', () => {
    enhancedParallax();
    initCardHoverEffects();
    initButtonRipple();
    animateNumbers();
});

/* ===================================
   Performance Optimizations
   =================================== */

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 防抖函数
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

// 优化滚动事件
window.addEventListener('scroll', throttle(() => {
    // 滚动相关的性能敏感操作
}, 16));

// 优化窗口大小改变事件
window.addEventListener('resize', debounce(() => {
    // 窗口大小改变相关的操作
}, 250));
