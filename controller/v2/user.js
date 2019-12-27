'use strict';

import AddressComponent from '../../prototype/addressComponent';
import UserInfoModel from '../../models/v2/userinfo';
import formidable from 'formidable';

class User extends AddressComponent {
    constructor() {
        super(); // ES6 要求，子类的构造函数必须执行一次 super 函数，否则会报错。
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
            const { username, password, captcha_code } = fields;
            if (!username) {
                res.send({

                })
            }
        })
        res.send({
            // msg: 'haha'
        })
    }
}

export default new User();