const setDebugHost = require('./setDebugHost');
const path = require('path');
const mapUrl = require('./controllers')(path.resolve(__dirname, '../urlMap'));
const getToken = require('./getToken');
const config = require('../config/config');
const request = require('request');

module.exports = () => {
    return async (ctx, next) => {
        const url = ctx.request.path.split('\/').slice(1);
        const query = ctx.request.query;
        const path = encodeURI(mapUrl[url[0]][url[1]](query));
        const host = setDebugHost(path);
        console.log('请求路径: ' + ctx.method + ' / ' + host + path);
        const tokenProduct = {product: config.product, token: await getToken(ctx.cookies.get('token'))};
        const contentType = ctx.request.headers['content-type'];
        if (contentType && contentType.indexOf('multipart') > -1) {
            ctx.body = ctx.req.pipe(request({
                url: host + path,
                headers: tokenProduct,
                gzip: true
            }, (error, response, body) => {
                console.log('返回json: ' + body);
            }));
        } else {
            const body = await new Promise(resolve => {
                request({
                    url: host + path,
                    method: ctx.method,
                    headers: { ...ctx.headers, ...tokenProduct },
                    body: ctx.request.body,
                    json: true,
                    gzip: true
                }, (error, response, body) => {
                    console.log('返回json: ' + JSON.stringify(body, null, 2));
                    resolve(body);
                })
            });
            if(body && body.result && body.result.token){
                ctx.cookies.set('token', body.result.token, {expires: new Date(Date.now() + 1000 * 3600 * 24 * 7)});
            }
            ctx.body = body;
        }
        await next();
    }
};
