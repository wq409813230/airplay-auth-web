const setCGI = () => {
    switch (process.env.NODE_HOST) {
        case 'dev':
            return 'http://192.168.2.253/';
        case 'qa':
            return 'http://192.168.2.77/';
        case 'debug':
            return 'http://192.168.2.74/';
        case 'pt':
            return 'http://192.168.2.86/';
        case 'st':
            return 'http://192.168.2.80/';
        default:
            return 'http://192.168.2.253/';
    }
};
module.exports = {
    freeapisCGI: setCGI(),
    product: 'Manage',
    debug: [
        {
            host: 'http://192.168.2.253:8085/',
            model: 'freeapis-web-airplayauth'
        }
    ]
};
