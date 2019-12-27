"use strict";

import fetch from "node-fetch";

export default class BaseComponent {
    constructor() {}
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
    }
}