"use strict";

import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  data: {}
});

citySchema.statics.cityGuess = function(name) {
  return new Promise(async (resolve, reject) => {
    const firtWord = name.substr(0, 1).toUpperCase();
    try {
      const city = await this.findOne();
      Object.entries(city.data).forEach(item => {
        if (item[0] == firtWord) {
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
        message: "查找数据失败"
      });
      console.log(error);
    }
  });
};

const Cities = mongoose.model("Cities", citySchema);

export default Cities;
