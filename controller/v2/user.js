'use strict';

import AddressComponent from '../../prototype/addressComponent';
import UserInfoModel from '../../models/v2/userinfo';

class User extends AddressComponent {
    constructor() {
        super()
    }
    async getInfo(req, res, next) {
        const sid = req.session.user_id;
        const qid = req.query.user_id;
        const user_id = sid || qid;
        if (!use_id || !Number(user_id)) {
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
}

export default new User();