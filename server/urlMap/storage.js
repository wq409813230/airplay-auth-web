const modules = require('../public/modules');
const storage = modules.storage;
module.exports = {
    upload: () => {
        return `${storage}/1/storage`;
    },
    multiUpload: () => {
        return `${storage}/1/storage/multi`;
    },
    deleteFile: () => {
        return `${storage}/1/storage`;
    },
    exportExel: ({ type }) => {
        return `${storage}/1/exporting/${type}`;
    },
    getDownloadFilePath: ({ contentId }) => {
        return `${storage}/1/storage/predownload/filepath?contentId=${contentId}`
    },
    importExcel: ({ type }) => {
        return `${storage}/1/exporting/import/${type}`;        
    },
    exportingByConditions: ({ type }) => {
        return `${storage}/1/exporting/${type}/by/conditions`
    }
};