const request = require('request');
const auth = require('../urlMap/auth');
const setDebugHost = require('./setDebugHost');
const config = require('../config/config');

module.exports = async (token) => {
    let body;
    if(!token){
        const path = auth.anonymousLogin();
        const host = setDebugHost(path);
        body = await new Promise(resolve => {
            request({
                url: host + path,
                method: 'POST',
                headers: {product: config.product, 'user-agent': 'request'},
                body: {},
                json: true
            }, (error, response, body) => {
                resolve(body);
            })
        });
    }
    return token || body.result.token;
};
