//Tro vao file accountDTO
let accountDTO = require("../dto/accountDTO.js");

//Tro vao file databaseUtils
let databaseUtils = require("../datautils/databaseUtils.js");

//Tro vao file constant
let constant = require("../datautils/constant.js");

let method = {};

//Luu hoac update lai du lieu thong qua method
method.save = (obj, method) => {
    let sql = "";
    let sql2 = "";
    let objAddCoinWeb = [];
    let objAddCoinGame = [];
    //Su dung de add coin vao game, tru coin sau khi add
    if (constant.ADDCOIN == method) {
        for (let i = 0; i < obj.length; i++) {
            if (i < 2) {
                objAddCoinWeb.push(obj[i]);
            } else {
                objAddCoinGame.push(obj[i]);
            }
        }
        sql = " UPDATE ".concat(constant.DATABASEWEB)
            .concat("account set point = point - ? WHERE name = ?");
        sql2 = " UPDATE ".concat(constant.DATABASEGAME)
            .concat("t_char SET zengdian = zengdian + ?, menpaipoint = menpaipoint + ? WHERE charguid = ? and accname= ?");
    }
    //Su dung de dang ky tai khoan
    else if (constant.REGISTER == method) {
        sql = "INSERT INTO ".concat(constant.DATABASEWEB)
            .concat("account ")
            .concat("(name, qq, email, password, pin)").concat(" VALUES ?");
    }
    //Su dung de tru coin 
    else if (constant.MINUSCOIN == method) {
        sql = " UPDATE ".concat(constant.DATABASEWEB)
            .concat("account set point = point - ? WHERE name = ?");
    }
    //Su dung de tang coin trong tai xiu 
    else if (constant.INCREASECOIN == method) {
        sql = "UPDATE ".concat(constant.DATABASEWEB).concat("account SET point = (CASE");
        let arrayAccount = [];
        let arrayAccname = [];
        for (let i = 0; i < obj.length; i++) {
            sql = sql.concat(" WHEN name = ? THEN point + ? * 1.98");

            if (i == obj.length - 1) {
                sql = sql.concat(" END )");
            }
            arrayAccname.push(obj[i].name);
            arrayAccount.push(obj[i].name);
            arrayAccount.push(obj[i].point);
        }

        arrayAccount.push(arrayAccname);

        obj = arrayAccount;

        sql = sql.concat(" WHERE name in (?) ");
    }
    //Tra lai coin khi khong can cua
    else if (constant.RETURNCOIN == method) {
        sql = "UPDATE ".concat(constant.DATABASEWEB).concat("account SET point = (CASE");
        let arrayAccount = [];
        let arrayAccname = [];
        for (let i = 0; i < obj.length; i++) {
            sql = sql.concat(" WHEN name = ? THEN point + ?");

            if (i == obj.length - 1) {
                sql = sql.concat(" END )");
            }
            arrayAccname.push(obj[i].name);
            arrayAccount.push(obj[i].name);
            arrayAccount.push(obj[i].point);
        }

        arrayAccount.push(arrayAccname);

        obj = arrayAccount;

        sql = sql.concat(" WHERE name in (?) ");
    }
    //Su dung de doi mat khau
    else if (constant.CHANGEPASSWORD == method) {
        sql = " UPDATE ".concat(constant.DATABASEWEB)
            .concat("account set password = ? WHERE name = ? and password = ? ");
    }
    //Su dung de reset mat khau
    else if (constant.FORGOTPASSWORD == method) {
        sql = " UPDATE ".concat(constant.DATABASEWEB)
            .concat("account set password = md5('123456') ")
            .concat("WHERE name = ? and email = ? and qq = ? and pin = ?");
    } else {
        return constant.ERRORMETHOD().then(data => data).catch(err => err);
    }

    if (sql != "" && sql2 != "") {
        return databaseUtils.save(sql, objAddCoinWeb).then(data => {
            let s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == constant.SUCCESS) {
                    return databaseUtils.save2(sql2, objAddCoinGame).then(data => data).catch(err => err);
                }
            }
            return data;
        }).catch(err => err);
    } else if (sql2 != "") {
        return databaseUtils.save2(sql2, obj).then(data => data).catch(err => err);
    } else {
        return databaseUtils.save(sql, obj).then(data => data).catch(err => err);
    }
}

//Lay du lieu ra thong qua method
method.select = async (obj, method) => {
    let sql = "";
    //Su dung de dang nhap
    if (constant.LOGIN == method) {
        sql = "SELECT count(*) as COUNT FROM ".concat(constant.DATABASEWEB)
            .concat("account WHERE name = ? AND password = ?");
    }
    //Su dung de lay thong tin account 
    else if (constant.ACCOUTNINFO == method) {
        sql = "SELECT".concat(" name,tel,point,id,roleId ").concat("FROM ")
            .concat(constant.DATABASEWEB)
            .concat("account WHERE name = ? ");
    } else {
        return constant.ERRORMETHOD().then(data => data).catch(err => err);
    }
    return databaseUtils.select(sql, obj).then(data => data).catch(err => err);
}

module.exports = method;