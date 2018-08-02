//Tro vao file databaseUtils
let databaseUtils = require("../datautils/databaseUtils.js");

//Tro vao file constant
let constant = require("../datautils/constant.js");

let method = {};

//Luu hoac update lai du lieu thong qua method
method.save = (obj, method) => {
    let sql = "";
    //Sua loi ket map
    if (constant.RESETMAP == method) {
        sql = "UPDATE ".concat(constant.DATABASEGAME)
            .concat("t_char SET scene ='0', xpos ='25000', zpos ='20000' WHERE charguid = ? AND accname = ? ");
    }
    //Mo khoa nhan vat
    else if (constant.UNLOCKCHAR == method) {
        sql = "UPDATE ".concat(constant.DATABASEGAME)
            .concat("t_char SET settings = ")
            .concat(constant.CODEUNLOCK)
            .concat(" WHERE charguid = ? AND accname = ?");
    }
    //Reset gio choi
    else if (constant.RESETTIME == method) {
        sql = "UPDATE ".concat(constant.DATABASEGAME)
            .concat("t_char SET fatigue = ")
            .concat(constant.CODERESETTIME)
            .concat(" WHERE charguid = ? AND accname = ? ");
    } else {
        return constant.ERRORMETHOD().then(data => data).catch(err => err);
    }
    return databaseUtils.save2(sql, obj).then(data => data).catch(err => err);
}

//Lay du lieu ra thong qua method
method.select = (obj, method) => {
    let sql = "";
    //Su dung de dang nhap
    if (constant.INFOCHAR == method) {
        sql = "SELECT ".concat("charname, charguid, level")
            .concat(" FROM ")
            .concat(constant.DATABASEGAME)
            .concat("t_char WHERE accname = ?");
    }
    //Lay thong tin bang xep hang theo level
    else if (constant.RATINGSLEVEL == method) {
        sql = "SELECT ".concat("charname, charguid, level, menpai, exp, sex")
            .concat(" FROM ")
            .concat(constant.DATABASEGAME)
            .concat("t_char ORDER BY level DESC LIMIT 10");
    }
    //Lay thong tin bang xep hang theo diem mon phai
    else if (constant.RATINGSWEALTH == method) {
        sql = "SELECT ".concat("charname, charguid, level, menpai, exp, menpaipoint,sex")
            .concat(" FROM ")
            .concat(constant.DATABASEGAME)
            .concat("t_char ORDER BY menpaipoint DESC LIMIT 10");
    } else {
        return constant.ERRORMETHOD().then(data => data).catch(err => err);
    }
    return databaseUtils.select2(sql, obj).then(data => data).catch(err => err);
}

module.exports = method;