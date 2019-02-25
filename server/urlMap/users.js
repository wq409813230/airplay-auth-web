const modules = require('../public/modules');

const security = modules.security;

module.exports = {
    list: ({ start = 0, length = 15, sidx = '', sort = '', employeeCode = '', userName = '', departmentCode = '' }) => {
        return `${security}/1/employees/page?start=${start}&length=${length}&employeeCode=${employeeCode}&departmentCode=${departmentCode}&sidx=${sidx}&sort=${sort}&userName=${userName}`
    },
    CURD: ({ id }) =>  `${security}/1/employees${id ? ('/' + id) : ''}`,
    changeStatus: ({ id }) => `${security}/1/employees/${id}/lockStatus`,
    brieflyEmployee: () => `${security}/1/employees/brieflyEmployee`,
    checkCodeIsValid: ({ code }) => {
        return `${security}/1/employees/available?employeeCode=${code}`;
    },
    resetPassword: () => {
        return `${security}/1/employees/password`;
    },
    brieflyEmployeeParam: ({ roleCode }) => {
        return `${security}/1/employees/brieflyEmployee/by/param?roleCode=${roleCode}`
    },
    updateEmployeePassword: ({ userId }) => {
        return `${security}/1/employees/reset/${userId}`
    },
    deleteMergeAccount: ({ userId }) => {
        return `${security}/1/authentication/${userId}`
    }
};
