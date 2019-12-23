'use strict';
import mongoose from 'mongoose';
import config from 'config-lite';
import chalk from 'chalk';

mongoose.connect(config.url, { useMongoClient: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.once('open', () => {
    console.log(
        chalk.green('连接数据库成功')
    )
});
db.on('error', (err) => {
    console.error(
        chalk.red('Error in MongoDb connection:' + err)
    );
    mongoose.disconnect();
});
db.on('close', (err) => {
    console.error(
        chalk.red('Error in MongoDb connection:' + err)
    );
    mongoose.connect(config.url, { auto_reconnect: true });
});

export default db;