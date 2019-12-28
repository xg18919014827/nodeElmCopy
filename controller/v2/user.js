'use strict';

import AddressComponent from '../../prototype/addressComponent';
import UserInfoModel from '../../models/v2/userinfo';
import formidable from 'formidable';
import crypto from 'crypto';
import UserModel from '../../models/v2/user';
import Ids from '../../models/ids';
import { isDate } from 'util';
import dtime from 'time-formater';
import UderInfoModel from '../../models/v2/userinfo';

class User extends AddressComponent {
    constructor() {
        super(); // ES6 要求，子类的构造函数必须执行一次 super 函数，否则会报错。
        this.login = this.login.bind(this);
        this.encryption = this.encryption.bind(this)
    }
    async getInfo(req, res, next) {
        // console.log(req.session);
        const sid = req.session.user_id;
        const qid = req.query.user_id;
        const user_id = sid || qid;
        if (!user_id || !Number(user_id)) {
            res.send({
                status: 0,
                type: 'GET_USER_INFO_FAIELD',
                message: '通过session获取一个用户信息失败'
            });
            return
        }
        try {
            const userinfo = await UserInfoModel.findOne({ user_id }, '-_id');
            res.send(userinfo);
        } catch (err) {
            console.log('通过session获取一个用户信息失败', err);
            res.send({
                status: 0,
                type: 'GET_USER_INFO_FAIELD',
                message: '通过session获取一个用户信息失败'
            });
        }
    }
    async login(req, res, next) {
        const cap = req.cookies.cap;
        if (!cap) {
            console.log('验证码失效');
            res.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码失效'
            })
        }
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            //验证参数是否缺失
            const { username, password, captcha_code } = fields;
            try {
                if (!username) {
                    throw new Error('用户名参数错误');
                } else if (!password) {
                    throw new Error('密码参数错误');
                } else if (!captcha_code) {
                    throw new Error('验证码参数错误');
                }
            } catch (error) {
                console.log('登录参数错误', error);
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: error.message
                })
                return
            }
            //验证验证码是否正确
            if (cap.toString() !== captcha_code.toString()) {
                res.send({
                    status: 0,
                    type: 'ERROR_CAPTCHA',
                    message: '验证码不正确'
                })
                return
            }
            const newPassword = this.encryption(password);
            //判断用户是否存在，若否，则创建新用户
            try {
                const user = await UserModel.findOne({ username })
                if (!user) {
                    const user_id = await this.getId('user_id');
                    const cityInfo = await this.guessPosition(req);
                    const registe_time = dtime().format('YYYY-MM-DD HH:mm');
                    const newUser = { username, password: newPassword, user_id };
                    const newUserInfo = { username, user_id, id: user_id, city: cityInfo.city, registe_time };
                    UserModel.create(newUser);
                    const createUser = new UserInfoModel(newUserInfo);
                    const userinfo = await createUser.save();
                    res.session.user_id = user_id;
                    res.send(userinfo);
                } else if (user.password.toString() !== password.toString()) {
                    console.log('用户登录密码错误');
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '用户登录密码错误'
                    })
                    return
                } else {
                    res.session.user_id = user.user_id;
                    const userinfo = await UserInfoModel.findOne({
                        user_id: user.user_id
                    }, '-_id');
                    res.send(userinfo);

                }
            } catch (error) {
                console.log('用户登录失败', error);
                res.send({
                    status: 0,
                    type: 'SAVE_USER_FAILED',
                    message: '登录失败'
                })
            }
        })
    }
    encryption(password) {
        const newPassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newPassword
    }
    Md5(password) {
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
    async getId(type) {
        if (!this.idList.includes(type)) {
            console.log('id类型错误');
            throw new Error('id类型错误');
            return
        }
        try {
            const idData = await Ids.findOne();
            idData[type]++;
            await idData.save();
            return idData[type]
        } catch (error) {
            console.log('获取ID数据失败');
            throw new Error(error);
        }
    }
}

export default new User();