const modules = require('../public/modules');

const machineModelResourceV1 = modules.airpaluauth + '/1/machineModel';

modules.exports = {
    CRUD: ({ modelCode }) => {
        return `${machineModelResourceV1}${modelCode ? '?modelCode=' + modelCode : ''}`;
    },
    paginate :({start = 0, length = 15,modelCode=''}) =>{
        return `${machineModelResourceV1}/page?start=${start}&length=${length}&modelCode=${modelCode}`;
    }
};