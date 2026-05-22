/**
 * iOS Navigation JS - iOS 导航逻辑
 * 文件版本: v1.0
 * 生效日期: 2026-05-14
 * 适用范围: 移动端原生体验优化
 */

(function() {
    'use strict';

    // ===== 配置 =====
    const CONFIG = {
        swipeBackThreshold: 50, // 滑动返回阈值（px）
        swipeBackEdge: 20,      // 触发区域（左侧边缘px）
        animationDuration: 300  // 动画时长（ms）
    };

    // ===== 状态 =====
    let isSwiping = false;
    let startX = 0;
    let currentX = 0;
    let currentPage = null;
    let previousPage = null;
    let pageHistory = [];

    // ===== Push 导航 =====
    function pushNavigate(fromPageId, toPageId) {
        const fromPage = document.getElementById(fromPageId);
        const toPage = document.getElementById(toPageId);

        if (!fromPage || !toPage) {
            // 如果页面元素不存在，使用传统页面跳转
            // 解析目标页面ID转换为文件名
            const pageMap = {
                'teacher-list-page': 'teacher-list.html',
                'teacher-profile-page': 'teacher-profile.html',
                'university-list-page': 'university-list.html',
                'university-profile-page': 'university-profile.html',
                'warning-management-page': 'warning-management.html',
                'my-page': 'my.html'
            };
            const targetUrl = pageMap[toPageId] || toPageId.replace('-page', '.html');
            window.location.href = targetUrl;
            return;
        }

        // 记录历史
        pageHistory.push(fromPageId);

        // 保存前一页引用
        previousPage = fromPage;
        currentPage = toPage;

        // 添加动画类
        fromPage.classList.add('ios-page-exit');
        toPage.classList.add('ios-page-enter');
        toPage.style.display = 'block';
        toPage.style.zIndex = '10';

        // 动画结束后清理
        setTimeout(() => {
            fromPage.style.display = 'none';
            fromPage.classList.remove('ios-page-exit');
            fromPage.style.zIndex = '5';
        }, CONFIG.animationDuration);
    }

    // ===== Pop 导航（返回） =====
    function popNavigate() {
        if (pageHistory.length === 0) {
            console.warn('Pop navigate: no history');
            return;
        }

        const fromPageId = pageHistory.pop();
        const toPageId = pageHistory.length > 0 ? pageHistory[pageHistory.length - 1] : null;

        const fromPage = currentPage;
        const toPage = previousPage || document.getElementById(toPageId);

        if (!fromPage || !toPage) {
            console.error('Pop navigate: page not found');
            return;
        }

        // 添加动画类
        fromPage.classList.add('ios-page-pop-exit');
        toPage.classList.add('ios-page-pop-enter');
        toPage.style.display = 'block';
        toPage.style.zIndex = '10';

        // 动画结束后清理
        setTimeout(() => {
            fromPage.style.display = 'none';
            fromPage.classList.remove('ios-page-pop-exit');
            fromPage.style.zIndex = '5';
            toPage.classList.remove('ios-page-pop-enter');

            currentPage = toPage;
            previousPage = null;
        }, CONFIG.animationDuration);
    }

    // ===== 左滑返回手势 =====
    function initSwipeBack() {
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    function handleTouchStart(e) {
        // 仅在左侧边缘触发
        if (e.touches[0].clientX < CONFIG.swipeBackEdge && pageHistory.length > 0) {
            isSwiping = true;
            startX = e.touches[0].clientX;
            currentPage = document.querySelector('.ios-page-enter') || document.querySelector('[data-page="current"]');
            previousPage = document.getElementById(pageHistory[pageHistory.length - 1]);

            if (currentPage) {
                currentPage.style.transition = 'none';
            }
            if (previousPage) {
                previousPage.style.display = 'block';
                previousPage.style.transform = 'translateX(-30%)';
                previousPage.style.opacity = '0.5';
                previousPage.style.transition = 'none';
            }
        }
    }

    function handleTouchMove(e) {
        if (!isSwiping) return;

        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        const screenWidth = window.innerWidth;

        if (currentPage && deltaX > 0) {
            // 实时跟随
            currentPage.style.transform = `translateX(${deltaX}px)`;

            // 前一页同步移动
            if (previousPage) {
                const progress = deltaX / screenWidth;
                previousPage.style.transform = `translateX(-${30 - progress * 30}%)`;
                previousPage.style.opacity = 0.5 + progress * 0.5;
            }

            // 阻止页面滚动
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!isSwiping) return;

        const deltaX = currentX - startX;
        const screenWidth = window.innerWidth;
        const threshold = screenWidth * 0.5;

        // 恢复过渡效果
        if (currentPage) {
            currentPage.style.transition = `transform ${CONFIG.animationDuration}ms ease`;
        }
        if (previousPage) {
            previousPage.style.transition = `transform ${CONFIG.animationDuration}ms ease, opacity ${CONFIG.animationDuration}ms ease`;
        }

        // 判断是否返回
        if (deltaX > threshold) {
            // 执行返回
            if (currentPage) {
                currentPage.style.transform = `translateX(${screenWidth}px)`;
            }
            if (previousPage) {
                previousPage.style.transform = 'translateX(0)';
                previousPage.style.opacity = '1';
            }

            setTimeout(() => {
                popNavigate();
            }, CONFIG.animationDuration);
        } else {
            // 恢复原位
            if (currentPage) {
                currentPage.style.transform = 'translateX(0)';
            }
            if (previousPage) {
                previousPage.style.transform = 'translateX(-30%)';
                previousPage.style.opacity = '0.5';

                setTimeout(() => {
                    previousPage.style.display = 'none';
                    previousPage.style.transform = '';
                    previousPage.style.opacity = '';
                }, CONFIG.animationDuration);
            }
        }

        isSwiping = false;
        startX = 0;
        currentX = 0;
    }

    // ===== Tab 切换 =====
    function switchTab(tabId, navItems, contentItems) {
        // 更新导航项状态
        navItems.forEach(item => {
            if (item.dataset.tab === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 更新内容区域
        contentItems.forEach(item => {
            if (item.dataset.tabContent === tabId) {
                item.classList.add('active');
                item.style.display = 'block';
            } else {
                item.classList.remove('active');
                item.style.display = 'none';
            }
        });
    }

    // ===== 初始化 =====
    function init() {
        initSwipeBack();

        // 绑定 Tab 切换
        const tabNavItems = document.querySelectorAll('.ios-tab-item');
        const tabContents = document.querySelectorAll('.ios-tab-content');

        tabNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.dataset.tab;
                if (tabId) {
                    switchTab(tabId, tabNavItems, tabContents);
                }
            });
        });

        // 绑定列表项点击（push导航）
        const listItems = document.querySelectorAll('[data-push-target]');
        listItems.forEach(item => {
            item.addEventListener('click', () => {
                const fromPage = item.dataset.pushFrom;
                const toPage = item.dataset.pushTarget;
                if (fromPage && toPage) {
                    pushNavigate(fromPage, toPage);
                }
            });
        });

        // 绑定返回按钮
        const backButtons = document.querySelectorAll('.ios-header-btn.left');
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                popNavigate();
            });
        });
    }

    // ===== 导出 =====
    window.iOSNavigation = {
        init: init,
        pushNavigate: pushNavigate,
        popNavigate: popNavigate,
        switchTab: switchTab
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();