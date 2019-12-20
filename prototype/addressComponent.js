'use strict';

import BaseComponent from './baseComponent'

class AddressComponent extends BaseComponent {
    constructor() {
        super(); // ES6 要求，子类的构造函数必须执行一次 super 函数，否则会报错。
    }

}



export default AddressComponent;