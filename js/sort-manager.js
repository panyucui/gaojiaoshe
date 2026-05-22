/**
 * Sort Manager - 排序状态管理器
 * 文件版本: v1.0
 * 生效日期: 2026-05-14
 * 适用范围: 检索增强模块
 */

// 作者检索排序字段配置
const teacherSortItems = [
    { field: 'name', label: '姓名', defaultOrder: 'asc' },
    { field: 'organization', label: '单位', defaultOrder: 'asc' },
    { field: 'titleLevel', label: '职称', defaultOrder: 'desc' },
    { field: 'region', label: '地区', defaultOrder: 'asc' },
    { field: 'cooperationCount', label: '合作次数', defaultOrder: 'desc' },
    { field: 'followedAt', label: '关注时间', defaultOrder: 'desc' }
];

// 高校检索排序字段配置
const universitySortItems = [
    { field: 'name', label: '高校名称', defaultOrder: 'asc' },
    { field: 'region', label: '地区', defaultOrder: 'asc' },
    { field: 'academicianCount', label: '院士数', defaultOrder: 'desc' },
    { field: 'teacherCount', label: '教师数', defaultOrder: 'desc' },
    { field: 'cooperationTeacherCount', label: '合作教师数', defaultOrder: 'desc' },
    { field: 'cooperationCount', label: '合作次数', defaultOrder: 'desc' }
];

// 职称等级排序权重
const titleLevelWeight = {
    '正高级': 4,
    '副高级': 3,
    '中级': 2,
    '初级': 1
};

/**
 * SortManager 排序管理器类
 */
class SortManager {
    constructor(type, sortCallback) {
        this.type = type; // 'teacher' 或 'university'
        this.sortCallback = sortCallback; // 排序回调函数
        this.activeField = null; // 当前激活的排序字段
        this.activeOrder = null; // 当前排序方向 'asc' 或 'desc'
        this.sortItems = type === 'teacher' ? teacherSortItems : universitySortItems;
    }

    /**
     * 初始化排序管理器
     */
    init() {
        // 设置默认选中第一个排序项
        if (this.sortItems.length > 0) {
            this.activeField = this.sortItems[0].field;
            this.activeOrder = this.sortItems[0].defaultOrder;
        }
        this.bindEvents();
        this.updateUI();
    }

    /**
     * 绑定排序按钮点击事件
     */
    bindEvents() {
        const sortBar = document.querySelector('.sort-bar');
        if (!sortBar) return;

        const sortItems = sortBar.querySelectorAll('.sort-item');
        sortItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // 触感反馈
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }

                const field = item.dataset.field;
                this.handleClick(field);
            });
        });
    }

    /**
     * 处理排序按钮点击
     * @param {string} field 排序字段
     */
    handleClick(field) {
        const sortConfig = this.sortItems.find(s => s.field === field);
        if (!sortConfig) return;

        if (this.activeField === field) {
            // 点击已激活的排序项 → 切换排序方向
            this.activeOrder = this.activeOrder === 'asc' ? 'desc' : 'asc';
        } else {
            // 点击未激活的排序项 → 激活该项，按默认方向排序
            this.activeField = field;
            this.activeOrder = sortConfig.defaultOrder;
        }

        this.updateUI();
        this.triggerSort();
    }

    /**
     * 更新排序条UI状态
     */
    updateUI() {
        const sortBar = document.querySelector('.sort-bar');
        if (!sortBar) return;

        const sortItems = sortBar.querySelectorAll('.sort-item');
        sortItems.forEach(item => {
            const field = item.dataset.field;

            // 清除所有激活状态和排序方向类
            item.classList.remove('active', 'asc', 'desc');

            if (field === this.activeField) {
                // 设置激活状态和排序方向图标
                item.classList.add('active', this.activeOrder);
            }
        });
    }

    /**
     * 执行排序并触发回调
     */
    triggerSort() {
        if (!this.activeField || !this.sortCallback) return;

        // 调用排序回调函数
        this.sortCallback(this.activeField, this.activeOrder);
    }

    /**
     * 重置排序状态
     */
    reset() {
        this.activeField = null;
        this.activeOrder = null;
        this.updateUI();
    }

    /**
     * 获取当前排序状态
     * @returns {object} 排序状态
     */
    getSortState() {
        return {
            field: this.activeField,
            order: this.activeOrder
        };
    }
}

// 导出（供其他模块使用）
window.SortManager = SortManager;
window.teacherSortItems = teacherSortItems;
window.universitySortItems = universitySortItems;
window.titleLevelWeight = titleLevelWeight;