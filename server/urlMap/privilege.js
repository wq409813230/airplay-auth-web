const modules = require('../public/modules');
const security = modules.security;
module.exports = {
    getPermissions: () => {
        return `${security}/1/permissions`;
    },
    getPermissionsByType: ({ primaryType, primaryCode }) => {
        return `${security}/1/permissions/${primaryType}/${primaryCode}`;
    },
    createPermissions: () => {
        return `${security}/1/permissions`;
    },
    getUserModuleTree: () => {
    	return `${security}/1/permissions/userModuleTree`;
    }
};