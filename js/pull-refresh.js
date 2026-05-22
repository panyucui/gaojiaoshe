/**
 * Pull Refresh JS - iOS 下拉刷新逻辑
 * 文件版本: v1.0
 * 生效日期: 2026-05-14
 * 适用范围: 移动端原生体验优化
 */

(function() {
    'use strict';

    // ===== 配置 =====
    const CONFIG = {
        threshold: 80,           // 刷新触发阈值（px）
        indicatorHeight: 60,     // 指示器高度（px）
        refreshDuration: 1000    // 刷新动画时长（ms）
    };

    // ===== 状态 =====
    let isPulling = false;
    let isRefreshing = false;
    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    let container = null;
    let indicator = null;
    let spinner = null;
    let textEl = null;

    // ===== 初始化 =====
    function initPullRefresh(containerSelector, onRefresh) {
        container = document.querySelector(containerSelector);
        if (!container) {
            console.error('Pull refresh container not found');
            return;
        }

        // 创建刷新指示器
        createIndicator();

        // 绑定触摸事件
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        // 保存刷新回调
        container._onRefresh = onRefresh;
    }

    // ===== 创建指示器 =====
    function createIndicator() {
        indicator = document.createElement('div');
        indicator.className = 'ios-pull-refresh-indicator';
        indicator.innerHTML = `
            <div class="ios-refresh-spinner"></div>
            <div class="ios-refresh-text">下拉刷新</div>
        `;

        spinner = indicator.querySelector('.ios-refresh-spinner');
        textEl = indicator.querySelector('.ios-refresh-text');

        container.insertBefore(indicator, container.firstChild);
    }

    // ===== 触摸开始 =====
    function handleTouchStart(e) {
        if (isRefreshing) return;

        // 仅在顶部位置触发
        if (container.scrollTop <= 0) {
            isPulling = true;
            startY = e.touches[0].clientY;
            indicator.classList.add('show');
        }
    }

    // ===== 触摸移动 =====
    function handleTouchMove(e) {
        if (!isPulling || isRefreshing) return;

        currentY = e.touches[0].clientY;
        pullDistance = Math.max(0, currentY - startY);

        // 限制最大下拉距离
        const maxDistance = CONFIG.threshold * 1.5;
        if (pullDistance > maxDistance) {
            pullDistance = maxDistance;
        }

        // 更新指示器位置
        const translateY = Math.min(pullDistance - CONFIG.indicatorHeight, CONFIG.threshold);
        indicator.style.top = `${translateY}px`;

        // 更新文本和状态
        if (pullDistance >= CONFIG.threshold) {
            textEl.textContent = '释放刷新';
            spinner.style.animation = 'ios-spin 1s linear infinite';
        } else {
            textEl.textContent = '下拉刷新';
            spinner.style.animation = 'none';
        }

        // 阻止页面滚动
        if (pullDistance > 0) {
            e.preventDefault();
        }
    }

    // ===== 触摸结束 =====
    function handleTouchEnd(e) {
        if (!isPulling || isRefreshing) return;

        isPulling = false;

        if (pullDistance >= CONFIG.threshold) {
            // 触发刷新
            startRefresh();
        } else {
            // 恢复原位
            indicator.style.top = `${-CONFIG.indicatorHeight}px`;
            setTimeout(() => {
                indicator.classList.remove('show');
            }, CONFIG.refreshDuration / 2);
        }

        pullDistance = 0;
    }

    // ===== 开始刷新 =====
    function startRefresh() {
        isRefreshing = true;

        // 更新状态
        indicator.style.top = '20px';
        textEl.textContent = '正在刷新...';
        spinner.style.animation = 'ios-spin 1s linear infinite';

        // 执行刷新回调
        if (container._onRefresh) {
            container._onRefresh().then(() => {
                finishRefresh();
            }).catch(() => {
                finishRefresh();
            });
        } else {
            // 默认刷新时长
            setTimeout(finishRefresh, CONFIG.refreshDuration);
        }
    }

    // ===== 完成刷新 =====
    function finishRefresh() {
        isRefreshing = false;

        textEl.textContent = '刷新完成';

        setTimeout(() => {
            indicator.style.top = `${-CONFIG.indicatorHeight}px`;
            indicator.classList.remove('show');
            textEl.textContent = '下拉刷新';
            spinner.style.animation = 'none';
        }, 500);
    }

    // ===== 手动触发刷新 =====
    function triggerRefresh() {
        if (isRefreshing) return;

        indicator.classList.add('show');
        startRefresh();
    }

    // ===== 导出 =====
    window.PullRefresh = {
        init: initPullRefresh,
        trigger: triggerRefresh
    };

})();

/**
 * Pagination Manager - 上拉加载更多管理器
 * 文件版本: v1.0
 * 生效日期: 2026-05-14
 * 适用范围: 检索增强模块
 */

(function() {
    'use strict';

    // ===== 配置 =====
    const CONFIG = {
        threshold: 100,          // 触发加载的阈值（距底部px）
        pageSize: 20,            // 每页条数
        maxRetries: 3            // 最大重试次数
    };

    // ===== 状态 =====
    let isLoading = false;
    let isCompleted = false;
    let currentPage = 1;
    let totalPages = 0;
    let totalItems = 0;
    let retryCount = 0;
    let loadMoreSection = null;
    let loadMoreText = null;
    let loadCallback = null;

    // ===== 初始化 =====
    function initPagination(options) {
        loadMoreSection = document.getElementById('loadMoreSection');
        if (!loadMoreSection) {
            console.error('Load more section not found');
            return;
        }

        loadMoreText = loadMoreSection.querySelector('.load-more-text');
        loadCallback = options.onLoadMore || function() {};
        totalItems = options.totalItems || 0;
        totalPages = Math.ceil(totalItems / CONFIG.pageSize);

        setupScrollListener(options.containerSelector);
        updateStatus();
    }

    // ===== 滚动监听 =====
    function setupScrollListener(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error('Scroll container not found');
            return;
        }

        container.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ===== 滚动处理 =====
    function handleScroll(e) {
        if (isLoading || isCompleted) return;

        const container = e.target;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        // 距底部距离
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;

        // 触发加载
        if (distanceToBottom <= CONFIG.threshold) {
            loadNextPage();
        }
    }

    // ===== 加载下一页 =====
    function loadNextPage() {
        if (isLoading || isCompleted || currentPage >= totalPages) {
            if (currentPage >= totalPages) {
                markCompleted();
            }
            return;
        }

        isLoading = true;
        showLoading();

        // 执行加载回调
        const nextPage = currentPage + 1;

        try {
            loadCallback(nextPage).then(data => {
                if (data && data.length > 0) {
                    currentPage = nextPage;
                    hideLoading();
                    isLoading = false;
                    retryCount = 0;

                    // 检查是否加载完成
                    if (currentPage >= totalPages) {
                        markCompleted();
                    }
                } else {
                    markCompleted();
                }
            }).catch(err => {
                showError();
                retryCount++;
                if (retryCount >= CONFIG.maxRetries) {
                    markCompleted();
                }
            });
        } catch (e) {
            // 同步回调处理
            currentPage = nextPage;
            hideLoading();
            isLoading = false;

            if (currentPage >= totalPages) {
                markCompleted();
            }
        }
    }

    // ===== 显示加载中 =====
    function showLoading() {
        loadMoreSection.classList.remove('completed', 'error');
        loadMoreSection.classList.add('loading');
        loadMoreText.textContent = '正在加载...';
    }

    // ===== 隐藏加载中 =====
    function hideLoading() {
        loadMoreSection.classList.remove('loading');
        loadMoreText.textContent = '上拉加载更多';
    }

    // ===== 更新状态 =====
    function updateStatus() {
        if (totalPages <= 1) {
            markCompleted();
        } else {
            loadMoreSection.classList.remove('loading', 'completed', 'error');
            loadMoreText.textContent = '上拉加载更多';
        }
    }

    // ===== 标记完成 =====
    function markCompleted() {
        isCompleted = true;
        isLoading = false;
        loadMoreSection.classList.remove('loading', 'error');
        loadMoreSection.classList.add('completed');
        loadMoreText.textContent = `已加载全部 ${totalItems} 条`;
    }

    // ===== 显示错误 =====
    function showError() {
        loadMoreSection.classList.remove('loading', 'completed');
        loadMoreSection.classList.add('error');
        loadMoreText.textContent = '加载失败，点击重试';
        isLoading = false;

        // 点击重试
        loadMoreSection.onclick = () => {
            retryCount = 0;
            loadMoreSection.classList.remove('error');
            loadMoreSection.onclick = null;
            loadNextPage();
        };
    }

    // ===== 重置 =====
    function resetPagination(options) {
        isLoading = false;
        isCompleted = false;
        currentPage = 1;
        retryCount = 0;

        if (options) {
            totalItems = options.totalItems || 0;
            totalPages = Math.ceil(totalItems / CONFIG.pageSize);
        }

        updateStatus();
    }

    // ===== 导出 =====
    window.PaginationManager = {
        init: initPagination,
        reset: resetPagination,
        getCurrentPage: () => currentPage,
        isCompleted: () => isCompleted
    };

})();