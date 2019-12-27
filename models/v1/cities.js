"use strict";

import mongoose from "mongoose";
import cityData from '../../initData/cities'

const citySchema = new mongoose.Schema({
    data: {}
});

//获取定位城市
citySchema.statics.cityGuess = function(name) {
    return new Promise(async(resolve, reject) => {
        const firstWord = name.substr(0, 1).toUpperCase();
        try {
            const city = await this.findOne();
            Object.entries(city.data).forEach(item => {
                if (item[0] == firstWord) {
                    item[1].forEach(cityItem => {
                        if (cityItem.pinyin == name) {
                            resolve(cityItem);
                        }
                    });
                }
            });
        } catch (error) {
            reject({
                name: "ERROR_DATA",
                message: error
            });
            console.log(error);
        }
    });
}

// 获取热门城市列表
citySchema.statics.cityHot = function() {
    return new Promise(async(resolve, reject) => {
        try {
            const city = await this.findOne();
            resolve(city.data.hotCities);
        } catch (error) {
            reject({
                key: '2',
                name: 'ERROR_DATA',
                message: '查找数据失败'
            })
            console.log(error);
        }
    })
}

// 获取所以城市列表（按首字母排）
citySchema.statics.cityGroup = function() {
    return new Promise(async(resolve, reject) => {
        try {
            const city = await this.findOne();
            // console.log(city);
            const cityObj = city.data;
            resolve(cityObj);
        } catch (error) {
            reject({
                key: '2',
                name: 'ERROR_DATA',
                message: '查找数据失败'
            })
            console.log(error);
        }
    })
}

const Cities = mongoose.model("Cities", citySchema);

Cities.findOne((err, data) => {
    if (!data) { //初始化城市数据
        Cities.create({
            data: cityData
        });
    }
})

export default Cities;