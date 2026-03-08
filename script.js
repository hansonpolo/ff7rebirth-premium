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
    initModalClose();
});

/* ===================================
   Loading Animation
   =================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    
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
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
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
    
    function initParticleArray() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
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
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticleArray();
    animate();
    
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
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
    
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
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
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
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
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
    
    nextBtn.addEventListener('click', nextCard);
    prevBtn.addEventListener('click', prevCard);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showCard(currentIndex);
        });
    });
    
    let autoPlayInterval = setInterval(nextCard, 5000);
    
    const slider = document.querySelector('.characters-slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextCard, 5000);
    });
    
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
   Modal Functions
   =================================== */
function initModalClose() {
    const overlay = document.getElementById('modalOverlay');
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(feature) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    
    const featureData = getFeatureData(feature);
    
    content.innerHTML = featureData;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function getFeatureData(feature) {
    const features = {
        atb: {
            title: 'ATB 战斗系统',
            subtitle: 'ACTIVE TIME BATTLE',
            description: '《最终幻想VII 重生》的ATB系统是即时动作与经典回合制的完美融合，让玩家在激烈的战斗中依然能够进行深度的战术思考。',
            image: 'images/screenshot_1.jpg',
            sections: [
                {
                    title: '⚡ 核心机制',
                    content: 'ATB量表会在战斗中持续充能。普通攻击、防御和闪避都会加速充能。当量表满格时，可以进入战术模式，时间变慢，让你精准选择技能和目标。'
                },
                {
                    title: '🎮 战术模式',
                    content: '按下L1进入战术模式，时间流速降低90%。你可以仔细观察战场局势，选择最合适的技能、道具或魔法，制定完美的战术。'
                },
                {
                    title: '💡 高级技巧',
                    items: [
                        '善用"快攻"能力快速积累ATB',
                        '防御时也会缓慢充能ATB',
                        '不同角色的ATB充能速度不同',
                        '双ATB技能需要两个满格量表'
                    ]
                }
            ],
            gallery: [
                { image: 'images/screenshot_1.jpg', caption: '战斗界面' },
                { image: 'images/screenshot_2.jpg', caption: '战术选择' },
                { image: 'images/screenshot_3.jpg', caption: '技能释放' }
            ]
        },
        limit: {
            title: '极限爆发',
            subtitle: 'LIMIT BREAK',
            description: '每个角色都有独特的极限技能，当承受伤害积累极限值后，可以释放华丽且强力的终极招式，扭转战局！',
            image: 'images/screenshot_2.jpg',
            sections: [
                {
                    title: '💫 极限值积累',
                    content: '在战斗中承受伤害会积累极限值。当极限槽满时，角色会发出光芒，表示可以释放极限技能。每个角色有3个极限等级，威力逐级提升。'
                },
                {
                    title: '🎯 战略运用',
                    content: '极限技能不仅伤害惊人，还往往附带特殊效果：克劳德的"凶斩"可以一击秒杀，蒂法的"最终天堂"是连续格斗组合，爱丽丝的"伟大福音"能治愈全队。'
                },
                {
                    title: '⬆️ 升级系统',
                    items: [
                        '完成特定任务解锁更高等级极限',
                        '使用极限手册学习新技能',
                        '极限等级越高，威力越强',
                        '合理分配极限槽是关键战术'
                    ]
                }
            ],
            gallery: [
                { image: 'images/screenshot_2.jpg', caption: '极限准备' },
                { image: 'images/screenshot_3.jpg', caption: '释放瞬间' },
                { image: 'images/screenshot_4.jpg', caption: '华丽演出' }
            ]
        },
        synergy: {
            title: '双重联携',
            subtitle: 'SYNERGY SKILLS',
            description: '全新的联携系统让两名角色可以同时发动强力组合技能，不仅伤害倍增，还能创造独特的战术机会！',
            image: 'images/screenshot_3.jpg',
            sections: [
                {
                    title: '🤝 联携类型',
                    content: '游戏中有三种联携类型：协同攻击（两人同时攻击）、协同能力（一人支援一人攻击）、协同魔法（组合魔法威力翻倍）。每种都有独特的动画和效果。'
                },
                {
                    title: '⚡ 发动条件',
                    content: '联携技能需要特定角色组合，并且双方都需要消耗ATB量表。成功发动后，会产生额外的协同效果，如削弱敌人防御、提高暴击率等。'
                },
                {
                    title: '🔥 热门组合',
                    items: [
                        '克劳德 + 蒂法：破坏者连击',
                        '爱丽丝 + 蒂法：圣光治愈',
                        '巴雷特 + 红牙：重炮轰击',
                        '解锁更多组合需要提升伙伴羁绊'
                    ]
                }
            ],
            gallery: [
                { image: 'images/screenshot_3.jpg', caption: '双人组合' },
                { image: 'images/screenshot_4.jpg', caption: '联携发动' },
                { image: 'images/work_1.jpg', caption: '组合技演出' }
            ]
        },
        skill: {
            title: '技能树系统',
            subtitle: 'WEAPON ABILITIES',
            description: '每把武器都有独特的技能树，通过SP点数解锁新能力和被动效果，让你的角色变得更加强大！',
            image: 'images/work_1.jpg',
            sections: [
                {
                    title: '🌳 技能树结构',
                    content: '每把武器有独立的技能树，包含主动技能、被动效果和属性提升。使用该武器战斗可以获得SP点数，用于解锁技能节点。'
                },
                {
                    title: '⚔️ 武器熟练度',
                    content: '每种武器都有熟练度系统。战斗中使用该武器可以提升熟练度，满级后武器技能可以永久保留，即使更换武器也能使用！'
                },
                {
                    title: '💡 升级策略',
                    items: [
                        '优先解锁核心技能节点',
                        '注意技能树之间的联动',
                        '平衡攻击、防御、辅助技能',
                        '不同武器适合不同战斗风格'
                    ]
                }
            ],
            gallery: [
                { image: 'images/work_1.jpg', caption: '技能树界面' },
                { image: 'images/work_2.jpg', caption: '技能解锁' },
                { image: 'images/work_3.jpg', caption: '武器选择' }
            ]
        },
        materia: {
            title: '魔晶石系统',
            subtitle: 'MATERIA SYSTEM',
            description: '经典的魔晶石系统回归！将魔晶石镶嵌在武器和防具上，可以获得魔法、召唤兽和各种特殊能力。',
            image: 'images/work_2.jpg',
            sections: [
                {
                    title: '💠 魔晶石类型',
                    content: '魔晶石分为五种颜色：绿色（魔法）、黄色（指令）、紫色（独立）、蓝色（支援）、红色（召唤）。不同颜色提供不同类型的能力。'
                },
                {
                    title: '🔗 组合系统',
                    content: '魔晶石可以组合使用！例如：将"火"与"范围化"组合，火系魔法变成范围攻击；将"回复"与"MP吸收"组合，治疗时还能恢复MP。'
                },
                {
                    title: '⬆️ 成长系统',
                    items: [
                        '战斗中魔晶石会获得AP',
                        'AP积累可以提升魔晶石等级',
                        '高等级魔法威力更强、消耗更少',
                        '某些魔晶石可以进化为更强版本'
                    ]
                }
            ],
            gallery: [
                { image: 'images/work_2.jpg', caption: '魔晶石展示' },
                { image: 'images/work_3.jpg', caption: '镶嵌界面' },
                { image: 'images/screenshot_1.jpg', caption: '魔法释放' }
            ]
        },
        bond: {
            title: '伙伴羁绊系统',
            subtitle: 'AFFINITY SYSTEM',
            description: '与伙伴建立深厚的关系，不仅能解锁专属剧情，还能获得战斗中的强力支援！',
            image: 'images/work_3.jpg',
            sections: [
                {
                    title: '💕 羁绊等级',
                    content: '每个可操控角色都有独立的羁绊等级。通过对话、任务和战斗合作提升羁绊，解锁专属技能和联携招式。'
                },
                {
                    title: '🎭 互动事件',
                    content: '在营火旁与伙伴聊天、一起制作料理、探索世界时的对话...这些互动都会影响羁绊。某些关键选择甚至会改变剧情走向！'
                },
                {
                    title: '🎁 羁绊奖励',
                    items: [
                        '解锁角色专属任务',
                        '获得新联携技能',
                        '战斗中更频繁的支援',
                        '独特的服装和饰品'
                    ]
                }
            ],
            gallery: [
                { image: 'images/work_3.jpg', caption: '伙伴互动' },
                { image: 'images/hero-banner.jpg', caption: '营火对话' },
                { image: 'images/keyart.jpg', caption: '羁绊提升' }
            ]
        }
    };
    
    const data = features[feature];
    if (!data) return '';
    
    return `
        <div class="modal-header">
            <div class="modal-header-text">
                <span class="subtitle">${data.subtitle}</span>
                <h2>${data.title}</h2>
                <p>${data.description}</p>
            </div>
            <div class="modal-header-image">
                <img src="${data.image}" alt="${data.title}">
            </div>
        </div>
        
        <div class="modal-sections">
            ${data.sections.map(section => `
                <div class="modal-section">
                    <h3>${section.title}</h3>
                    ${section.content ? `<p>${section.content}</p>` : ''}
                    ${section.items ? `
                        <ul>
                            ${section.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="modal-gallery">
            <h3>游戏画面</h3>
            <div class="gallery-grid">
                ${data.gallery.map(item => `
                    <div class="gallery-item">
                        <img src="${item.image}" alt="${item.caption}">
                        <div class="caption">${item.caption}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 全局函数供HTML调用
window.openFeatureModal = openModal;
window.closeModal = closeModal;

/* ===================================
   Additional Enhancements
   =================================== */

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
    animateNumbers();
});

/* ===================================
   Performance Optimizations
   =================================== */

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

window.addEventListener('scroll', throttle(() => {
    // 滚动相关的性能敏感操作
}, 16));

window.addEventListener('resize', debounce(() => {
    // 窗口大小改变相关的操作
}, 250));
