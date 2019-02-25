const config = require('../config/config');

module.exports = (path) => {
    let host = config.freeapisCGI;
    const model = path.split('\/')[0];
    if(!config.debug || !config.debug.length){
        return host;
    }
    const debug = config.debug.filter(item => item.host && item.model === model);
    return debug.length ? debug[0].host : host;
};
