import express from 'express';
import config from 'config-lite';
import chalk from 'chalk';
import db from './mongodb/db';
import router from './routes/index.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';



const app = express(); //创建node服务器

//监听前端请求，设置响应头
app.all('*', (req, res, next) => {
    const { origin, Origin, referer, Referer } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    //设置头部内容
    res.header("Access-Control-Allow-Origin", allowOrigin); //设置跨域
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With"); //设置跨域
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); //设置跨域
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


// 注册中间件
app.use(cookieParser());
app.use(session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie
}))

//注册路由
router(app);

// 设置静态资源地址
app.use(express.static('./public'));

// 启动服务器，并在端口监听
app.listen(config.port, () => {
    console.log(
        chalk.green(`成功监听端口：${config.port}`)
    )
})