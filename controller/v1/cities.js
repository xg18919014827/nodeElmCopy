"use strict";

import AddressComponent from "../../prototype/AddressComponent";
import Cities from "../../models/v1/cities";
import pinyin from "pinyin";

class CityHandle extends AddressComponent {
  constructor() {
    super();
    this.getCity = this.getCity.bind(this);
  }
  async getCity(req, res, next) {
    const type = req.query.type;
    try {
      switch (type) {
        case "guess":
          const city = await this.getCityName(req);
          cityInfo = await Cities.cityGuess(city);
          break;
        case "hot":
          cityInfo = await Cities.cityHot();
          break;
        case "guess":
          cityInfo = await Cities.cityGroup();
          break;
        default:
          res.json({
            name: "ERROR_QUERY_TYPE",
            message: "参数错误"
          });
          return;
      }
      res.send(cityInfo);
    } catch (err) {
      res.send({
        name: "ERROR_DATA",
        message: "获取数据失败"
      });
    }
  }
  async getCityName(req) {
    try {
      const cityInfo = await this.guessPosition(req);
      //汉字转拼音
      const pinyinArr = pinyin(cityInfo.city, {
        style: pinyin.STYLE_NORMAL
      });
      let cityName = "";
      pinyinArr.forEach(item => {
        cityName += item[0];
      });
      return cityName;
    } catch (err) {
      return "北京";
    }
  }
}

export default new CityHandle();
