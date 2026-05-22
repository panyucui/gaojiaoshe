/**
 * Export Handler - 导出处理器
 * 文件版本: v2.0
 * 生效日期: 2026-05-18
 * 适用范围: 检索增强模块
 * 更新内容: 对齐PC端导出功能，增加导出数量限制
 */

// 导出权限配置（模拟数据）
const exportPermissions = {
    teacher: ['admin', 'manager', 'export_user'],
    university: ['admin', 'manager', 'export_user']
};

// 作者检索导出字段配置 - PC端字段对齐
const teacherExportFields = [
    { key: 'name', label: '姓名' },
    { key: 'gender', label: '性别' },
    { key: 'unit', label: '所属单位' },
    { key: 'province', label: '所属地区' },
    { key: 'subject', label: '学科' },
    { key: 'titleName', label: '职称等级' },
    { key: 'specialty', label: '专业方向' },
    { key: 'cooperationStatus', label: '合作状态' },
    { key: 'warningStatus', label: '预警状态' },
    { key: 'followStatus', label: '关注状态' }
];

// 高校检索导出字段配置 - PC端字段对齐
const universityExportFields = [
    { key: 'name', label: '高校名称' },
    { key: 'province', label: '属地' },
    { key: 'eduType', label: '学校类型' },
    { key: 'eduLevel', label: '办学层次' },
    { key: 'competentDeptName', label: '主管部门' },
    { key: 'academicianCount', label: '校内院士数' },
    { key: 'cooperationStatus', label: '合作成果/图书' },
    { key: 'coauthorCount', label: '合作作者数' },
    { key: 'cooperationCount', label: '合作次数' },
    { key: 'totalAuthors', label: '收录作者数' },
    { key: 'hasStrategicPartner', label: '战略合作' },
    { key: 'isDoubleFirst', label: '双一流' },
    { key: 'is985', label: '985' },
    { key: 'is211', label: '211' }
];

// 当前导出类型和数据
let currentExportType = null;
let currentExportData = null;

// 模拟用户角色（实际应从后端获取）
let currentUserRole = 'admin';

/**
 * 判断是否有导出权限
 * @param {string} type 导出类型 'teacher' 或 'university'
 * @returns {boolean} 是否有权限
 */
function hasExportPermission(type) {
    return exportPermissions[type]?.includes(currentUserRole) || false;
}

/**
 * 初始化导出按钮
 * @param {string} type 导出类型
 */
function initExportBtn(type) {
    currentExportType = type;
    const exportBtn = document.getElementById('exportBtn');

    if (!exportBtn) return;

    if (hasExportPermission(type)) {
        exportBtn.classList.remove('no-permission');
        exportBtn.classList.add('has-permission');
        exportBtn.disabled = false;
    } else {
        exportBtn.classList.remove('has-permission');
        exportBtn.classList.add('no-permission');
        exportBtn.disabled = true;
        exportBtn.onclick = () => {
            alert('当前角色无导出权限，请联系管理员');
        };
    }
}

/**
 * 设置用户角色（供外部调用）
 * @param {string} role 用户角色
 */
function setExportUserRole(role) {
    currentUserRole = role;
    if (currentExportType) {
        initExportBtn(currentExportType);
    }
}

// 导出（供其他模块使用）
window.hasExportPermission = hasExportPermission;
window.initExportBtn = initExportBtn;
window.setExportUserRole = setExportUserRole;
window.teacherExportFields = teacherExportFields;
window.universityExportFields = universityExportFields;