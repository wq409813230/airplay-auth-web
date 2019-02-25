const setCGI = () => {
    switch (process.env.NODE_HOST) {
        case 'dev':
            return 'http://192.168.2.74/';
        case 'qa':
            return 'http://192.168.2.77/';
        case 'debug':
            return 'http://192.168.2.74/';
        case 'pt':
            return 'http://192.168.2.86/';
        case 'st':
            return 'http://192.168.2.80/';
        default:
            return 'http://192.168.2.74/';
    }
};
module.exports = {
    freeapisCGI: setCGI(),
    product: 'Manage',
    debug: [{
            host: 'http://192.168.2.253:8081/',
            model: 'freeapis-web-agency'
        },
        {
            host: 'http://192.168.2.253:8082/',
            model: 'freeapis-web-asi'
        },
        {
            host: 'http://192.168.2.253:8083/',
            model: 'freeapis-web-security'
        },
        {
            host: 'http://192.168.2.253:8084/',
            model: 'freeapis-web-systemctl'
        }
    ]
};
