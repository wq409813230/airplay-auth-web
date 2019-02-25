const Koa = require('koa');
const server = require('koa-static');
const bodyParser = require('koa-bodyparser');
// const logger = require('koa-logger');
const setResponseHeader = require('./public/setResponseHeader');
const proxyRequest = require('./public/proxyRequest');
const logOut = require('./public/logOut');
const path = require('path');

const app = new Koa();

app.use(server(path.resolve(__dirname, '../client/dist')));

app.use(setResponseHeader());

// app.use(logger());

app.use(logOut());

app.use(bodyParser());

app.use(proxyRequest());

app.listen(8080);

console.log('app started at port 8080...');
