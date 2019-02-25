const modules = require('../public/modules');

const security = modules.security;

module.exports = {
    list: ({ roleCode = '', roleName = '', lockStatus = '', orderby = '', order = '', start = 0, length = 15 }) => {
        return `${security}/1/roles/page?roleCode=${roleCode}&roleName=${roleName}&lockStatus=${lockStatus}&orderby=${orderby}&order=${order}&start=${start}&length=${length}`;
    },
    checkCodeAvailable: ({ roleCode }) => `${security}/1/roles/roleCode/available?roleCode=${roleCode}`,
    createOrDelete: () => `${security}/1/roles`,
    updateOrGetInfo: ({ id }) => `${security}/1/roles/${id}`,
    roleList: ({ lockStatus }) => `${security}/1/roles?lockStatus=${lockStatus}`
};
