"use strict";

import fetch from "node-fetch"; //ajax请求的封装，用于发起ajax请求
import formidable from 'formidable'
import Ids from "../models/ids";
import fs from "fs";
import gm from 'gm'; //图片处理工具
import path from 'path';

export default class BaseComponent {
    constructor() {
        this.idList = ['restaurant_id', 'food_id', 'order_id', 'user_id', 'address_id', 'cart_id', 'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'statis_id'];
    }
    async fetch(url = "", data = {}, type = "GET", resType = "JSON") { //函数设置默认值的方式
        type = type.toUpperCase();
        resType = resType.toUpperCase();
        if ((type = "GET")) {
            let dataStr = "";
            Object.keys(data).forEach(key => {
                dataStr += key + "=" + data[key] + "&";
            });
            if (dataStr !== "") {
                dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
                url = url + "?" + dataStr;
            }
        }
        let requestConfig = {
            method: type,
            headers: {
                Accept: "application/json",
                "content-Type": "application/json"
            }
        };
        if (type == "POST") {
            Object.defineProperty(requestConfig, "body", {
                value: JSON.stringify(data)
            });
        }
        let responseJson;
        try {
            const response = await fetch(url, requestConfig);
            if (resType === "TEXT") {
                responseJson = await response.text();
            } else {
                responseJson = await response.json();
            }
        } catch (error) {
            console.log("获取http数据失败", error);
            throw new Error(error);
        }
        return responseJson;
    };
    //获取路径
    async getPath(req, res) {
        return new Promise((resolve, reject) => {
            const form = formidable.IncomingForm();
            // console.log(form);
            form.uploadDir = './public/img'; //设置上传文件的临时存放路径
            form.parse(req, async(err, fields, files) => {
                let img_id;
                try {
                    img_id = await this.getId('img_id');
                } catch (error) {
                    console.log('获取图片ID失败');
                    fs.unlinkSync(files.file.path);
                    reject('获取图片ID失败');
                }
                const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + img_id;
                const extname = path.extname(files.file.name);
                if (!['.jpg', '.jpeg', '.png'].includes(extname)) { //判断文件格式是否是图片？
                    fs.unlinkSync(files.file.path);
                    res.send({
                        status: 0,
                        type: 'ERROR_EXTNAME',
                        message: '文件格式错误'
                    })
                    reject('上传失败'); //catch 接收
                    return
                }
                const fullName = hashName + extname;
                const repath = './public/img/' + fullName;
                try {
                    fs.renameSync(files.file.path, repath);
                    gm(repath).resize(200, 200, '!').write(repath, async(err) => {
                        resolve(fullName); //then接收
                    })
                } catch (error) {
                    console.log('保存图片失败');
                    if (fs.existsSync(repath)) { //检查命令是否存在
                        fs.unlinkSync(repath); //删除文件
                    } else {
                        fs.unlinkSync(files.file.path);
                    }
                    reject('图片保存失败');
                }
            })
        })
    }
    async getId(type) {
        if (!this.idList.includes(type)) {
            console.log('id类型错误');
            throw new Error('的类型错误');
            return;
        }
        try {
            const idData = await Ids.findOne();
            idData[type]++;
            await idData.save();
            return idData[type];
        } catch (error) {
            console.log('获取数据失败');
            throw new Error('error');
        }
    }
}