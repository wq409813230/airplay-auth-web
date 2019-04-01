const setCGI = () => {
    switch (process.env.NODE_HOST) {
        case 'dev':
            return 'http://192.168.2.253/';
        case 'qa':
            return 'http://172.18.149.81/';
        case 'pt':
            return 'http://172.18.149.81/';
        default:
            return 'http://192.168.2.253/';
    }
};
module.exports = {
    freeapisCGI: setCGI(),
    product: 'Manage',
    debug: [
        /*{
            host: 'http://192.168.2.100:8085/',
            model: 'freeapis-web-airplayauth'
        }*/
    ]
};
