const modules = require('../public/modules');

const authConfigResourceV1 = modules.airpaluauth + '/1/authConfig';
const authHistoryResourceV1 = modules.airpaluauth + '/1/authHistory';

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
    paginate: ({start = 0, length = 15, machineModel='', companyName=''}) => {
        return `${authConfigResourceV1}/manage/page?start=${start}&length=${length}&machineModel=${machineModel}&companyName=${companyName}`;
    },
    getAuthHistoryByPage: ({start = 0, length = 15, deviceMac='', machineModel='', companyName=''}) => {
        return `${authHistoryResourceV1}/manage/page?start=${start}&length=${length}&deviceMac=${deviceMac}&machineModel=${machineModel}&companyName=${companyName}`;
    },
    generateKeyPair: () => {
        return `${authConfigResourceV1}/rsa/keyPair`;
    },
    getKeyPair: () => {
        return `${authConfigResourceV1}/rsa/keyPair`;
    },
    deleteAuthHistory: ({ deviceMac }) => {
        return `${authHistoryResourceV1}/deviceMac/${deviceMac}`
    },
    getAuthInfoList: ({ configId, deviceMac, start = 0, length = 15 }) => {
        return `${authConfigResourceV1}/${configId}/authInfo/page?deviceMac=${deviceMac}&start=${start}&length=${length}`;
    },
    deleteAuthInfo: ({ id }) => {
        return `${authConfigResourceV1}/authInfo/${id}`;
    }
};
