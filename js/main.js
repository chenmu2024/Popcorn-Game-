document.addEventListener('DOMContentLoaded', () => {
    // 初始化全局变量和配置
    const config = {
        animationDelay: 100,
        scrollOffset: 200,
        mobileBreakpoint: 768
    };

    // 性能优化：使用节流函数优化滚动和调整大小事件
    const throttle = (func, limit) => {
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
    };

    // 性能优化：IntersectionObserver用于惰性加载和动画
    const observeElements = (elements, callback) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => observer.observe(el));
        return observer;
    };

    // 初始化导航功能
    const initNavigation = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', 
                    menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
            });
        }
        
        // 点击导航项时关闭移动导航
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= config.mobileBreakpoint) {
                    nav.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });

        // 添加当前页面标记
        const currentLocation = window.location.pathname;
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentLocation || 
                (linkPath !== '/' && currentLocation.includes(linkPath))) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    };

    // 初始化滚动效果
    const initScrollEffects = () => {
        const header = document.querySelector('header');
        const scrollElements = document.querySelectorAll('.fade-in');
        
        // 处理页眉滚动样式
        if (header) {
            const handleScroll = throttle(() => {
                if (window.scrollY > config.scrollOffset) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, 100);
            
            window.addEventListener('scroll', handleScroll);
        }
        
        // 滚动动画
        if (scrollElements.length > 0) {
            observeElements(scrollElements, (element) => {
                element.classList.add('visible');
            });
        }

        // 平滑滚动到锚点
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // 考虑固定头部的高度
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // 初始化搜索功能
    const initSearch = () => {
        const searchForm = document.querySelector('.search-box');
        const searchInput = document.querySelector('.search-box input');
        
        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    // 在实际应用中，这将重定向到搜索结果页面
                    window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
                }
            });
        }
    };

    // 初始化游戏卡片悬停效果
    const initGameCards = () => {
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            // 使用代理模式优化事件监听
            const cardLink = card.querySelector('a.play-btn') || card.querySelector('a');
            const cardImage = card.querySelector('img');
            
            // 添加键盘焦点支持以提高可访问性
            if (cardLink) {
                cardLink.addEventListener('focus', () => {
                    card.classList.add('hover');
                });
                
                cardLink.addEventListener('blur', () => {
                    card.classList.remove('hover');
                });
            }
            
            // 如果有图像，处理懒加载
            if (cardImage && cardImage.dataset.src) {
                observeElements([cardImage], (image) => {
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                });
            }
        });
    };

    // 初始化模态框功能
    const initModals = () => {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        const modals = document.querySelectorAll('.modal');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // 设置焦点在模态框内
                    const focusableEl = modal.querySelector('button, [href], input, select, textarea');
                    if (focusableEl) {
                        setTimeout(() => focusableEl.focus(), 100);
                    }
                }
            });
        });
        
        // 关闭模态框
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.close-btn');
            const overlay = modal.querySelector('.modal-overlay');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
            
            if (overlay) {
                overlay.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
            
            // 支持Esc键关闭
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    };

    // 初始化表单验证
    const initFormValidation = () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        // 添加错误样式并显示消息
                        field.classList.add('error');
                        
                        // 如果没有错误消息元素，则创建一个
                        let errorMsg = field.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('span');
                            errorMsg.classList.add('error-message');
                            errorMsg.textContent = `${field.getAttribute('placeholder') || 'This field'} is required`;
                            field.insertAdjacentElement('afterend', errorMsg);
                        }
                    } else {
                        // 移除错误样式和消息
                        field.classList.remove('error');
                        const errorMsg = field.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.remove();
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    // 滚动到第一个错误字段
                    const firstErrorField = form.querySelector('.error');
                    if (firstErrorField) {
                        firstErrorField.focus();
                    }
                }
            });
            
            // 实时验证
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                        const errorMsg = input.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.remove();
                        }
                    }
                });
            });
        });
    };

    // 初始化游戏评分系统
    const initRatings = () => {
        const ratingContainers = document.querySelectorAll('.rating-interactive');
        
        ratingContainers.forEach(container => {
            const stars = container.querySelectorAll('.star');
            const ratingValue = container.querySelector('.rating-value');
            
            stars.forEach((star, index) => {
                // 鼠标悬停效果
                star.addEventListener('mouseenter', () => {
                    for (let i = 0; i <= index; i++) {
                        stars[i].classList.add('hovered');
                    }
                });
                
                star.addEventListener('mouseleave', () => {
                    stars.forEach(s => s.classList.remove('hovered'));
                });
                
                // 点击评分
                star.addEventListener('click', () => {
                    stars.forEach(s => s.classList.remove('selected'));
                    for (let i = 0; i <= index; i++) {
                        stars[i].classList.add('selected');
                    }
                    
                    // 更新评分值
                    if (ratingValue) {
                        ratingValue.textContent = (index + 1).toString();
                    }
                    
                    // 可以在这里添加AJAX，将评分发送到服务器
                });
            });
        });
    };

    // 初始化游戏控件
    const initGameControls = () => {
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) return;
        
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        const muteBtn = document.querySelector('.mute-btn');
        const gameIframe = document.querySelector('.game-iframe-container iframe');
        
        if (fullscreenBtn && gameIframe) {
            fullscreenBtn.addEventListener('click', () => {
                if (gameIframe.requestFullscreen) {
                    gameIframe.requestFullscreen();
                } else if (gameIframe.webkitRequestFullscreen) {
                    gameIframe.webkitRequestFullscreen();
                } else if (gameIframe.msRequestFullscreen) {
                    gameIframe.msRequestFullscreen();
                }
            });
        }
        
        if (muteBtn && gameIframe) {
            let isMuted = false;
            muteBtn.addEventListener('click', () => {
                isMuted = !isMuted;
                // 尝试通过postMessage向iframe发送消息
                try {
                    gameIframe.contentWindow.postMessage({ action: 'setMute', value: isMuted }, '*');
                } catch (error) {
                    console.warn('Unable to communicate with game iframe', error);
                }
                
                // 更新按钮图标
                const icon = muteBtn.querySelector('i');
                if (icon) {
                    icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
                }
                muteBtn.setAttribute('aria-label', isMuted ? 'Unmute game' : 'Mute game');
            });
        }
    };

    // 初始化切换暗/亮模式
    const initThemeToggle = () => {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        // 检查用户偏好
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let currentTheme = localStorage.getItem('theme') || (prefersDarkMode ? 'dark' : 'light');
        
        // 应用主题
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            
            // 更新图标
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    };

    // 实用功能：从URL获取参数
    const getParamFromUrl = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    // 初始化搜索结果页
    const initSearchResults = () => {
        const searchResultsContainer = document.querySelector('.search-results');
        if (!searchResultsContainer) return;
        
        const query = getParamFromUrl('q');
        const searchTerm = document.querySelector('.search-term');
        
        if (searchTerm && query) {
            searchTerm.textContent = query;
            
            // 这里通常会有AJAX请求获取搜索结果
            // 演示目的，我们只是显示一条消息
            searchResultsContainer.innerHTML = `<p>Searching for "${query}"...</p>`;
        }
    };

    // 处理外部链接
    const handleExternalLinks = () => {
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        
        externalLinks.forEach(link => {
            // 如果没有rel属性，添加安全相关属性
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
            
            // 如果没有明确声明是外部链接，添加图标
            if (!link.classList.contains('no-external-icon')) {
                // 使用字体图标或添加屏幕阅读器友好的文本
                const srText = document.createElement('span');
                srText.classList.add('sr-only');
                srText.textContent = '(opens in new window)';
                link.appendChild(srText);
            }
        });
    };

    // 初始化图片懒加载
    const initLazyLoading = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        if (lazyImages.length === 0) return;
        
        observeElements(lazyImages, (img) => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        });
    };

    // 初始化后退到顶部按钮
    const initBackToTop = () => {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (!backToTopBtn) return;
        
        const toggleBackToTopBtn = throttle(() => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 200);
        
        window.addEventListener('scroll', toggleBackToTopBtn);
        
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // 初始化页面动画序列
    const initAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animation]');
        if (animatedElements.length === 0) return;
        
        let delay = 0;
        observeElements(animatedElements, (element) => {
            const animation = element.dataset.animation || 'fadeIn';
            const animationDelay = parseInt(element.dataset.delay) || delay;
            
            element.style.animationDelay = `${animationDelay}ms`;
            element.classList.add(animation, 'animated');
            
            delay += config.animationDelay;
        });
    };

    // 页面加载完成后初始化所有功能
    const init = () => {
        initNavigation();
        initScrollEffects();
        initSearch();
        initGameCards();
        initModals();
        initFormValidation();
        initRatings();
        initGameControls();
        initThemeToggle();
        initSearchResults();
        handleExternalLinks();
        initLazyLoading();
        initBackToTop();
        initAnimations();
        
        // 移除加载中指示器
        const loader = document.querySelector('.site-loader');
        if (loader) {
            loader.classList.add('loaded');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        
        console.log('Popcorn Games initialized successfully! 🍿');
    };

    // 执行初始化
    init();
});

// 即将到来的游戏倒计时
function initCountdown() {
    const countdownElements = document.querySelectorAll('.countdown');
    
    countdownElements.forEach(element => {
        const targetDate = new Date(element.getAttribute('data-target-date')).getTime();
        
        if (isNaN(targetDate)) {
            element.textContent = 'Invalid date';
            return;
        }
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                element.textContent = 'Released!';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            element.innerHTML = `
                <div class="countdown-item"><span>${days}</span> days</div>
                <div class="countdown-item"><span>${hours}</span> hours</div>
                <div class="countdown-item"><span>${minutes}</span> mins</div>
                <div class="countdown-item"><span>${seconds}</span> secs</div>
            `;
        };
        
        updateCountdown();
        const countdownTimer = setInterval(updateCountdown, 1000);
        
        // 清理计时器，避免内存泄漏
        element.dataset.timerId = countdownTimer;
    });
}

// 如果页面上有倒计时元素，初始化倒计时
if (document.querySelector('.countdown')) {
    initCountdown();
}

// 防止通过右键单击查看源代码
if (sessionStorage.getItem('devMode') !== 'true') {
    document.addEventListener('contextmenu', (e) => {
        const targetElement = e.target;
        const isFormElement = targetElement.matches('input, textarea, select');
        
        // 允许在表单元素中使用右键菜单
        if (!isFormElement) {
            e.preventDefault();
        }
    });
} 