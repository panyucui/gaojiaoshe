/**
 * Gesture Handler JS - 手势处理逻辑
 * 文件版本: v1.0
 * 生效日期: 2026-05-14
 * 适用范围: 移动端原生体验优化
 */

(function() {
    'use strict';

    // ===== 配置 =====
    const CONFIG = {
        swipeThreshold: 50,        // 滑动阈值（px）
        longpressDelay: 500,       // 长按延迟（ms）
        tapFeedbackDuration: 100   // 点击反馈时长（ms）
    };

    // ===== 状态 =====
    let isLongPress = false;
    let longPressTimer = null;
    let startX = 0;
    let startY = 0;
    let currentTab = 0;
    let totalTabs = 0;

    // ===== 点击反馈 =====
    function addTapFeedback(element) {
        if (!element) return;

        element.addEventListener('touchstart', () => {
            element.classList.add('ios-touch-animate');
        }, { passive: true });

        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.classList.remove('ios-touch-animate');
            }, CONFIG.tapFeedbackDuration);
        }, { passive: true });
    }

    // ===== 为所有可点击元素添加反馈 =====
    function initTapFeedback() {
        const interactiveElements = document.querySelectorAll('.ios-btn-capsule, .ios-list-item, .ios-card-interactive, .ios-tab-item, button');
        interactiveElements.forEach(addTapFeedback);
    }

    // ===== 长按处理 =====
    function initLongPress() {
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;

            longPressTimer = setTimeout(() => {
                isLongPress = true;
                const target = e.target.closest('.ios-longpress');
                if (target) {
                    target.classList.add('longpressing');
                    showLongPressMenu(target, startX, startY);
                }
            }, CONFIG.longpressDelay);
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const deltaX = Math.abs(e.touches[0].clientX - startX);
            const deltaY = Math.abs(e.touches[0].clientY - startY);

            // 移动超过阈值则取消长按
            if (deltaX > 10 || deltaY > 10) {
                clearTimeout(longPressTimer);
                isLongPress = false;
                const target = e.target.closest('.ios-longpress');
                if (target) {
                    target.classList.remove('longpressing');
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
            if (!isLongPress) {
                const target = document.querySelector('.longpressing');
                if (target) {
                    target.classList.remove('longpressing');
                }
            }
            isLongPress = false;
        }, { passive: true });
    }

    function showLongPressMenu(target, x, y) {
        // 移除已存在的菜单
        const existingMenu = document.querySelector('.ios-longpress-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // 创建菜单（简化版本，实际使用时需要自定义菜单内容）
        const menu = document.createElement('div');
        menu.className = 'ios-longpress-menu show';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.innerHTML = `
            <div class="ios-longpress-menu-item">复制</div>
            <div class="ios-longpress-menu-item">分享</div>
            <div class="ios-longpress-menu-item destructive">删除</div>
        `;

        document.body.appendChild(menu);

        // 点击菜单项后关闭
        menu.querySelectorAll('.ios-longpress-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                menu.remove();
            });
        });

        // 点击其他区域关闭
        setTimeout(() => {
            document.addEventListener('click', closeMenuOnClick, { once: true });
        }, 100);
    }

    function closeMenuOnClick(e) {
        const menu = document.querySelector('.ios-longpress-menu');
        if (menu && !menu.contains(e.target)) {
            menu.remove();
        }
    }

    // ===== Tab 滑动切换 =====
    function initTabSwipe() {
        const container = document.querySelector('.ios-tab-swipe-container');
        if (!container) return;

        const wrapper = container.querySelector('.ios-tab-content-wrapper');
        if (!wrapper) return;

        const contents = wrapper.querySelectorAll('.ios-tab-content');
        totalTabs = contents.length;

        let isSwiping = false;
        let startX = 0;

        container.addEventListener('touchstart', (e) => {
            isSwiping = true;
            startX = e.touches[0].clientX;
            wrapper.style.transition = 'none';
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const deltaX = e.touches[0].clientX - startX;
            const offset = currentTab * -100;
            wrapper.style.transform = `translateX(calc(${offset}% + ${deltaX}px))`;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            isSwiping = false;

            const deltaX = e.changedTouches[0].clientX - startX;
            wrapper.style.transition = `transform 300ms ease`;

            // 判断切换方向
            if (deltaX > CONFIG.swipeThreshold && currentTab > 0) {
                // 向右滑，切换到上一个Tab
                currentTab--;
                updateTabSwipe(wrapper, currentTab);
            } else if (deltaX < -CONFIG.swipeThreshold && currentTab < totalTabs - 1) {
                // 向左滑，切换到下一个Tab
                currentTab++;
                updateTabSwipe(wrapper, currentTab);
            } else {
                // 恢复原位
                updateTabSwipe(wrapper, currentTab);
            }

            // 同步更新底部Tab导航
            syncTabNavigation(currentTab);
        }, { passive: true });
    }

    function updateTabSwipe(wrapper, index) {
        wrapper.style.transform = `translateX(${-index * 100}%)`;
    }

    function syncTabNavigation(index) {
        const tabItems = document.querySelectorAll('.ios-tab-item');
        tabItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // ===== 触摸边界指示器 =====
    function initTouchEdgeIndicator() {
        const indicator = document.querySelector('.ios-touch-edge');
        if (!indicator) return;

        document.addEventListener('touchstart', (e) => {
            if (e.touches[0].clientX < 20) {
                indicator.classList.add('active');
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            indicator.classList.remove('active');
        }, { passive: true });
    }

    // ===== 初始化 =====
    function init() {
        initTapFeedback();
        initLongPress();
        initTabSwipe();
        initTouchEdgeIndicator();
    }

    // ===== 触感反馈（模拟） =====
    function triggerHaptic(style) {
        // 模拟触感反馈（实际设备需要调用原生API）
        if (navigator.vibrate) {
            const duration = style === 'light' ? 10 : style === 'medium' ? 20 : style === 'success' ? 30 : 10;
            navigator.vibrate(duration);
        }
        console.log('Haptic feedback:', style);
    }

    // ===== 导出 =====
    window.GestureHandler = {
        init: init,
        addTapFeedback: addTapFeedback,
        triggerHaptic: triggerHaptic
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();