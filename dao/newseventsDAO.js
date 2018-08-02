//Tro vao file databaseUtils
let databaseUtils = require("../datautils/databaseUtils.js");

//Tro vao file constant
let constant = require("../datautils/constant.js");

let method = {};

//Luu hoac update lai du lieu thong qua method
method.save = (obj, method) => {
    let sql = "";
    if (constant.SAVENEWS_EVENTS == method) {
        sql = "INSERT INTO ".concat(constant.DATABASEWEB).concat("news_events")
            .concat(" (title, content,lastupdate_date, type) VALUES ?");
    } else if (constant.DELETENEWS_EVENTS == method) {
        sql = "DELETE FROM  ".concat(constant.DATABASEWEB).concat("news_events")
            .concat(" WHERE ID in (?)");
    } else if (constant.UPDATENEWS_EVENTS == method) {
        sql = "UPDATE ".concat(constant.DATABASEWEB).concat("news_events")
            .concat(" SET type = ?, title = ?, content = ? WHERE id = ?");
    } else {
        return constant.ERRORMETHOD().then(data => data).catch(err => err);
    }
    return databaseUtils.save(sql, obj).then(data => data).catch(err => err);
}

//Lay du lieu ra thong qua method
method.select = async (obj, method) => {
    let sql = "";
    //Su dung de dang nhap
    if (constant.COUNTNEWS_EVENTS == method) {
        sql = "SELECT count(*) as COUNT FROM ".concat(constant.DATABASEWEB)
            .concat("news_events WHERE 1=1");
        if (obj.length >= 1) {
            sql = sql.concat(" AND type = ?")
        }
        sql = sql.concat(" order by id desc");
    }
    //Su dung de lay thong tin news events
    else if (constant.ALLNEWS_EVENTS == method) {
        sql = "SELECT".concat(" id,title,content,lastupdate_date, type ").concat("FROM ")
            .concat(constant.DATABASEWEB)
            .concat("news_events WHERE 1=1");
        if (obj.length >= 3) {
            sql = sql.concat(" AND type = ?")
        }
        sql = sql.concat("  order by id desc limit ?, ?");
    } else {
        return constant.ERRORMETHOD().then(data => data).catch(err => err);
    }
    return databaseUtils.select(sql, obj).then(data => data).catch(err => err);
}

module.exports = method;