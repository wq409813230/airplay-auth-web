module.exports = () => {
    return async (ctx, next) => {
        const url = ctx.request.path.split('\/').slice(1);
        if(url[1] === 'logOut'){
            ctx.cookies.set('token', '', {expires: new Date(Date.now() - 1000)});
            ctx.response.body = JSON.stringify({
                status: 200,
                result: true,
                code: 'OK',
                message: 'OK'
            });
        }else{
            await next();
        }
    }
};
