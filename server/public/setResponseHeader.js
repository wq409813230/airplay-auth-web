module.exports = () => {
    return async (ctx, next) => {
        ctx.response.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'
        });
        await next();
    }
};
