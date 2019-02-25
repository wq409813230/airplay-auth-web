const modules = require('../public/modules');

const agency = modules.agency;

module.exports = {
    tree: ({ agencyCode, parentCode }) => `${agency}/1/departments/tree?agencyCode=${agencyCode}&parentCode=${parentCode}`,
    list: ({ start, length, parentCode }) => (
        `${agency}/1/departments/page?start=${start}&length=${length}&parentCode=${parentCode}`
    ),
    CURD: ({ id }) =>  `${agency}/1/departments${id ? ('/' + id) : ''}`,
    lockStatus: ({ id }) =>  `${agency}/1/departments/${id}/lockstatus`,
    getUserByDept: ({ parentCode }) =>  `${agency}/1/departments/withEmployee?parentCode=${parentCode}`
};
