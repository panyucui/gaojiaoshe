/**
 * PC端数据字典 - 与PC端API兼容
 * 该文件包含所有PC端系统使用的代码值映射
 */

// ===== 省份代码映射 =====
const PROVINCE_MAP = {
    11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
    21: "辽宁", 22: "吉林", 23: "黑龙江",
    31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东",
    41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南",
    50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏",
    61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆",
    71: "台湾", 81: "香港", 82: "澳门"
};

// ===== 职称等级映射 =====
const TITLE_LEVEL_MAP = { 1: "初级", 2: "中级", 3: "副高级", 4: "正高级", 9: "其它" };

// ===== 职称称谓映射 =====
const TITLE_NAME_MAP = { 1: "助教", 2: "讲师", 3: "副教授", 4: "教授", 9: "其它" };

// ===== 性别映射 =====
const GENDER_MAP = { M: "男", F: "女", U: "未知" };

// ===== 学历/办学层次映射 =====
const EDUCATION_LEVEL_MAP = { 1: "本科", 2: "研究生", 3: "大专", 5: "高中", 6: "其他", 7: "初中" };

// ===== 合作状态映射 =====
const COOPERATION_STATUS_MAP = { 1: "已合作", 0: "未合作" };

// ===== 关注状态映射 =====
const FOLLOW_STATUS_MAP = { 1: "已关注", 0: "未关注" };

// ===== 预警类型映射 =====
const RISK_TYPE_MAP = {
    ILLEGAL_DISCIPLINE_CENTRAL: { label: "违法违纪（中纪委）", level: "HIGH" },
    ILLEGAL_DISCIPLINE_PROVINCIAL: { label: "违法违纪（省纪委）", level: "HIGH" },
    RESEARCH_MISCONDUCT: { label: "科研不端", level: "MEDIUM" }
};

// ===== 处理状态映射 =====
const HANDLE_STATUS_MAP = { 0: "未处置", 1: "已处置", 2: "不处置" };

// ===== 风险等级映射 =====
const RISK_LEVEL_MAP = {
    HIGH: { label: "高风险", color: "#FF4D4F", bgColor: "rgba(255, 77, 79, 0.1)" },
    MEDIUM: { label: "中风险", color: "#FAAD14", bgColor: "rgba(250, 173, 20, 0.1)" },
    LOW: { label: "低风险", color: "#1890FF", bgColor: "rgba(24, 144, 255, 0.1)" }
};

// ===== 职称等级筛选选项（PC端enumHelper） =====
const TITLE_LEVEL_OPTIONS = [
    { label: "全部", value: "" },
    { label: "正高级", value: "4" },
    { label: "副高级", value: "3" },
    { label: "中级", value: "2" },
    { label: "初级", value: "1" },
    { label: "其它", value: "9" }
];

// ===== 职称称谓筛选选项（PC端enumHelper） =====
const TITLE_NAME_OPTIONS = [
    { label: "全部", value: "" },
    { label: "教授", value: "4" },
    { label: "副教授", value: "3" },
    { label: "讲师", value: "2" },
    { label: "助教", value: "1" },
    { label: "其它", value: "9" }
];

// ===== 是否有合作筛选选项（PC端enumHelper） =====
const COOPERATION_OPTIONS = [
    { label: "全部", value: "" },
    { label: "是", value: "1" },
    { label: "否", value: "0" }
];

// ===== 关注状态筛选选项（PC端enumHelper） =====
const FOLLOW_STATUS_OPTIONS = [
    { label: "全部", value: "" },
    { label: "已关注", value: "1" },
    { label: "未关注", value: "0" }
];

// ===== 预警类型筛选选项（PC端constants） =====
const RISK_TYPE_OPTIONS = [
    { label: "全部", value: "" },
    { label: "违法违纪（中纪委）", value: "ILLEGAL_DISCIPLINE_CENTRAL" },
    { label: "违法违纪（省纪委）", value: "ILLEGAL_DISCIPLINE_PROVINCIAL" },
    { label: "科研不端", value: "RESEARCH_MISCONDUCT" }
];

// ===== 处置状态筛选选项（PC端constants） =====
const HANDLE_STATUS_OPTIONS = [
    { label: "全部", value: "" },
    { label: "未处置", value: "0" },
    { label: "已处置", value: "1" },
    { label: "不处置", value: "2" }
];

// ===== 省份筛选选项 =====
const PROVINCE_OPTIONS = [
    { label: "全部地区", value: "" },
    { label: "北京", value: "11" },
    { label: "天津", value: "12" },
    { label: "河北", value: "13" },
    { label: "山西", value: "14" },
    { label: "内蒙古", value: "15" },
    { label: "辽宁", value: "21" },
    { label: "吉林", value: "22" },
    { label: "黑龙江", value: "23" },
    { label: "上海", value: "31" },
    { label: "江苏", value: "32" },
    { label: "浙江", value: "33" },
    { label: "安徽", value: "34" },
    { label: "福建", value: "35" },
    { label: "江西", value: "36" },
    { label: "山东", value: "37" },
    { label: "河南", value: "41" },
    { label: "湖北", value: "42" },
    { label: "湖南", value: "43" },
    { label: "广东", value: "44" },
    { label: "广西", value: "45" },
    { label: "海南", value: "46" },
    { label: "重庆", value: "50" },
    { label: "四川", value: "51" },
    { label: "贵州", value: "52" },
    { label: "云南", value: "53" },
    { label: "西藏", value: "54" },
    { label: "陕西", value: "61" },
    { label: "甘肃", value: "62" },
    { label: "青海", value: "63" },
    { label: "宁夏", value: "64" },
    { label: "新疆", value: "65" }
];

// ===== 辅助函数 =====

/**
 * 省份代码转名称
 * @param {string|number} code 省份代码
 * @returns {string} 省份名称
 */
function getProvinceName(code) {
    return PROVINCE_MAP[code] || PROVINCE_MAP[String(code)] || "未知";
}

/**
 * 职称等级代码转名称
 * @param {string|number} code 职称等级代码
 * @returns {string} 职称等级名称
 */
function getTitleLevelName(code) {
    return TITLE_LEVEL_MAP[code] || TITLE_LEVEL_MAP[String(code)] || "其它";
}

/**
 * 职称称谓代码转名称
 * @param {string|number} code 职称称谓代码
 * @returns {string} 职称称谓名称
 */
function getTitleNameName(code) {
    return TITLE_NAME_MAP[code] || TITLE_NAME_MAP[String(code)] || "其它";
}

/**
 * 性别代码转名称
 * @param {string} code 性别代码
 * @returns {string} 性别名称
 */
function getGenderName(code) {
    return GENDER_MAP[code] || "未知";
}

/**
 * 办学层次/学历代码转名称
 * @param {string|number} code 学历代码
 * @returns {string} 学历名称
 */
function getEducationLevelName(code) {
    return EDUCATION_LEVEL_MAP[code] || EDUCATION_LEVEL_MAP[String(code)] || "未知";
}

/**
 * 合作状态代码转名称
 * @param {string|number} code 合作状态代码
 * @returns {string} 合作状态名称
 */
function getCooperationStatusName(code) {
    return COOPERATION_STATUS_MAP[code] || COOPERATION_STATUS_MAP[String(code)] || "未知";
}

/**
 * 关注状态代码转名称
 * @param {string|number} code 关注状态代码
 * @returns {string} 关注状态名称
 */
function getFollowStatusName(code) {
    return FOLLOW_STATUS_MAP[code] || FOLLOW_STATUS_MAP[String(code)] || "未知";
}

/**
 * 预警类型代码转名称
 * @param {string} type 预警类型代码
 * @returns {string} 预警类型名称
 */
function getRiskTypeLabel(type) {
    return RISK_TYPE_MAP[type]?.label || "未知";
}

/**
 * 处理状态代码转名称
 * @param {string|number} status 处理状态代码
 * @returns {string} 处理状态名称
 */
function getHandleStatusLabel(status) {
    return HANDLE_STATUS_MAP[status] || HANDLE_STATUS_MAP[String(status)] || "未知";
}

/**
 * 风险等级代码转名称
 * @param {string} level 风险等级代码
 * @returns {string} 风险等级名称
 */
function getRiskLevelLabel(level) {
    return RISK_LEVEL_MAP[level]?.label || "未知";
}

/**
 * 获取风险等级样式
 * @param {string} level 风险等级代码
 * @returns {object} 风险等级样式对象 {color, bgColor}
 */
function getRiskLevelStyle(level) {
    return RISK_LEVEL_MAP[level] || { label: "未知", color: "#8C8C8C", bgColor: "rgba(140, 140, 140, 0.1)" };
}

// ===== 默认筛选条件（PC端author.util） =====
const DEFAULT_FILTER = {
    logicMode: "and",
    name: "",
    unit: "",
    province: "",
    subject: "",
    specialty: "",
    titleName: "",
    hasCooperation: "",
    isAcademician: "",
    followStatus: "",
    warningStatus: ""
};

// ===== 默认预警筛选条件（PC端constants） =====
const DEFAULT_RISK_FILTER = {
    abstract: "",
    riskType: "",
    publishTimeStart: "",
    publishTimeEnd: "",
    handleStatus: "",
    companyName: "",
    authorName: ""
};