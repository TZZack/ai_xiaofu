const DATE_FORMAT_REGEX = /[YmdHis]/g;
const DATE_FORMAT_FUNCTION = (function () {
    const DECIMAL = 2;
    let zeroLeftPad = (v) => leftPad(v, DECIMAL, '0');

    return {
        Y: (date) => String(date.getFullYear()),
        m: (date) => zeroLeftPad(date.getMonth() + 1),
        d: (date) => zeroLeftPad(date.getDate()),
        H: (date) => zeroLeftPad(date.getHours()),
        i: (date) => zeroLeftPad(date.getMinutes()),
        s: (date) => zeroLeftPad(date.getSeconds())
    };
}());

function leftPad (str, size, character = ' ') {
    let result = String(str);
    while (result.length < size) {
        result = character + result;
    }
    return result;
}

/**
 * 时间格式化的函数，简化实现，只支持YmdHis几种关键字
 * @param {*} date   日期对象，或者时间戳（可以是数字或者字符串）
 * @param {String} format 时间格式字符串
 * @returns {String} 返回结果如下：2019-01-20 12:23:34
 */
function encodeDate (date, format = 'Y-m-d H:i:s') {
    if (typeof date === 'string') {
        if (/^\d+$/.test(date)) {
            date = parseInt(date, 10);
        }
    }

    //  时间戳类型
    if (typeof date === 'number') {
        date = date.toString().length === 13 ? date : 1000 * date;
        date = new Date(date);
    }

    return (format).replace(DATE_FORMAT_REGEX, m => {
        if (m in DATE_FORMAT_FUNCTION) {
            return DATE_FORMAT_FUNCTION[m](date);
        }
        return m;
    });
}

module.exports = {
    encodeDate
};
  