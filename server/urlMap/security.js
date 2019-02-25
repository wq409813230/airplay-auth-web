const modules = require('../public/modules');

const security = modules.security;

module.exports = {
    userInfo : ({ userId }) => security + '/1/employees/' + userId
};
