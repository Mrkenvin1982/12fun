//Tro vao file databaseUtils
let databaseUtils = require("../datautils/databaseUtils.js");

//Tro vao file constant
let constant = require("../datautils/constant.js");

let method = {};

//Luu hoac update lai du lieu thong qua method
method.save = (obj, method) => {
    let sql = "";
    if (constant.SAVE_TRANSACTIONDICE == method) {
        sql = "INSERT INTO ".concat(constant.DATABASEWEB).concat("transaction_dice")
            .concat(" (type, number1, number2, number3, total, session_dice, object_user, lastupdate_date) VALUES ?");
    } else {
        return constant.ERRORMETHOD().then(data => data).catch(err => err);
    }
    return databaseUtils.save(sql, obj).then(data => data).catch(err => err);
}

//Lay du lieu ra thong qua method
method.select = async (obj, method) => {
    let sql = "";
    //Su dung de lay thon tin phien tai xiu
    if (constant.GET_TRANSACTIONDICE == method) {
        sql = "SELECT * FROM ".concat(constant.DATABASEWEB)
            .concat("transaction_dice order by id desc limit 15");
    } else {
        return constant.ERRORMETHOD().then(data => data).catch(err => err);
    }
    return databaseUtils.select(sql, obj).then(data => data).catch(err => err);
}

module.exports = method;