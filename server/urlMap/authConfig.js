const modules = require('../public/modules');

const authConfigResourceV1 = modules.airpaluauth + '/1/authConfig';

module.exports = {
    createAuthConfig: () => {
        return `${authConfigResourceV1}`;
    },
    deleteAuthConfig: ({ id }) => {
        return `${authConfigResourceV1}/${id}`;
    },
    updateAuthConfig: ({ id }) => {
        return `${authConfigResourceV1}/${id}`;
    },
    paginate: ({start = 0, length = 15, machineModel='', companyName=''}) =>{
        return `${authConfigResourceV1}/manage/page?start=${start}&length=${length}&machineModel=${machineModel}&companyName=${companyName}`;
    }
};