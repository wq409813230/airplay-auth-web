const modules = require('../public/modules');
const security = modules.security;
module.exports = {
    anonymousLogin: () => `${security}/1/authentication/anonymous`,
    loginByPwd: () => `${security}/1/authentication/superadmin`
};
