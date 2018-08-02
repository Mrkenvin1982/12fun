//tTo den file mysqlUtils.js
let mysql = require(__dirname + "/mysqlUtils.js");

//Tro den file constant.js
let constant = require(__dirname + "/constant.js");

//Tra ve gia tri khi cac class khac goi den
let method = {};

//Luu cac thong tin vao db
method.save = (sql, obj) => mysql.save(sql, obj).then(data => data)
    .catch(err => err);

//Lay cac thong tin tu db ra
method.select = (sql, obj) => mysql.select(sql, obj).then(data => data)
    .catch(err => err);

//Luu cac thong tin vao db
method.save2 = (sql, obj) => mysql.save2(sql, obj).then(data => data)
    .catch(err => err);

//Lay cac thong tin tu db ra
method.select2 = (sql, obj) => mysql.select2(sql, obj).then(data => data)
    .catch(err => err);

module.exports = method;