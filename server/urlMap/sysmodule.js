const modules = require('../public/modules');
const security = modules.security;
module.exports = {
    getModulesTree: ({ agencyCode }) => {
        return `${security}/1/modules/${agencyCode}/tree`;
    },
    createModule: () => {
        return `${security}/1/modules`;
    },
    updateModule: ({ agencyCode, moduleCode }) => {
        return `${security}/1/modules/${agencyCode}/${moduleCode}`;
    },
    deleteModule: ({ agencyCode }) => {
        return `${security}/1/modules/${agencyCode}`;
    },
    getOperations: () => {
        return `${security}/1/operations`;
    },
    // 分页获取资源列表
    getOperationsByPage: ({ resourceName, start, length, sidx, sort }) => {
        return `${security}/1/operations/page?resourceName=${resourceName}&start=${start}&length=${length}&sidx=${sidx}&sort=${sort}`;
    },
    createModuleOperations: () => {
        return `${security}/1/modules/moduleOperation`;
    },
    getModuleOperations: ({ agencyCode, moduleCode }) => {
        return `${security}/1/modules/${agencyCode}/${moduleCode}`;
    },
    getPermissionOpers: () => {
        return `${security}/1/permissions/module/operations`;
    },
    getModuleBtnList: ({ agencyCode, moduleCode, buttonName, start, length }) => {
        return `${security}/1/modules/moduleOperation/page?agencyCode=${agencyCode}&moduleCode=${moduleCode}&buttonName=${buttonName}&start=${start}&length=${length}`;
    },
    createModuleBtn: () => {
        return `${security}/1/modules/moduleOperation`;
    },
    updateOrDelModuleBtn: ({ moduleOperationId }) => {
        return `${security}/1/modules/moduleOperation/${moduleOperationId}`;
    },
    checkButtonCodeAvailable: ({ agencyCode, moduleCode, buttonCode}) => {
        return `${security}/1/modules/moduleOperation/buttonCode/available?agencyCode=${agencyCode}&moduleCode=${moduleCode}&buttonCode=${buttonCode}`;
    }
};