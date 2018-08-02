//Khai bao su dung mysql
let mysql = require("mysql");

//include class constant
let constant = require(__dirname + "/constant.js");

//Su dung de tra ve du lieu
let method = {};

//Mo ket noi mysql bang pool
/*let pool = mysql.createPool({
    host: '210.211.119.207',
    user: 'nguhoadan_tlbb1',
    password: 'Dungphuong9x',
    port:3306,
    //Su dung khi chay nhieu cau lenh
    //multipleStatements: true
})*/

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'abc@1234',
    //Su dung khi chay nhieu cau lenh
    //multipleStatements: true
});

//Kiem tra xem da connect duoc hay khong
let connection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(constant.ERROR + "|" + JSON.stringify(err));
            }
            return resolve(connection);
        });
    });
}

//Su dung de chay query voi mysql
let query = (sql, obj, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, obj, (err, results, fields) => {
            if (err) {
                destroyConnection(connection);
                return reject(constant.ERROR + "|" + JSON.stringify(err));
            }
            destroyConnection(connection);
            return resolve(constant.SUCCESS + "|" + JSON.stringify(results));
        });
    })
}

//Su dung de luu thong tin vao db
method.save = (sql, obj) => connection().then(dataConnect => {
    return query(sql, obj, dataConnect).then(data => {
        s = data.split("|");
        if (s.length >= 2) {
            if (s[0] == constant.SUCCESS) {
                result = JSON.parse(s[1]);
                if (result.affectedRows == 0) {
                    return constant.ERROR + "|Sai thông tin";
                }
                return constant.SUCCESS + "|";
            }
        }
        return s;
    });
}).catch(err => {
    s = err.split("|");
    if (s.length >= 2) {
        if (s[0] == constant.ERROR) {
            object = JSON.parse(s[1]);
            if (object.code == constant.ER_DUP_ENTRY) {
                return constant.ERROR + "|-10";
            }
        }
    }
    return err;
});

//Su dung de lay thong tin tu db    
method.select = (sql, obj) => connection().then(dataConnect => query(sql, obj, dataConnect))
    .catch(err => err);

//Su dung khi ket noi den 1 db khac
let pool2 = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'abc@1234',
    //Su dung khi chay nhieu cau lenh
    //multipleStatements: true
});


//Kiem tra xem da connect duoc hay khong
let connection2 = () => {
    return new Promise((resolve, reject) => {
        pool2.getConnection((err, connection) => {
            if (err) {
                return reject(constant.ERROR + "|" + JSON.stringify(err));
            }
            return resolve(connection);
        });
    });
}

//Su dung de chay query voi mysql
let query2 = (sql, obj, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, obj, (err, results, fields) => {
            if (err) {
                destroyConnection(connection);
                return reject(constant.ERROR + "|" + JSON.stringify(err));
            }
            destroyConnection(connection);
            return resolve(constant.SUCCESS + "|" + JSON.stringify(results));
        });
    })
}

//Su dung de luu thong tin vao db
method.save2 = (sql, obj) => connection2().then(dataConnect => {
    return query2(sql, obj, dataConnect).then(data => {
        let s = data.split("|");
        if (s.length >= 2) {
            if (s[0] == constant.SUCCESS) {
                result = JSON.parse(s[1]);
                if (result.affectedRows == 0) {
                    return constant.ERROR + "|Sai thông tin";
                }
                return constant.SUCCESS + "|";
            }
        }
        return s;
    });
}).catch(err => {
    let s = err.split("|");
    if (s.length >= 2) {
        if (s[0] == constant.ERROR) {
            object = JSON.parse(s[1]);
            if (object.code == constant.ER_DUP_ENTRY) {
                return constant.ERROR + "|-10";
            }
        }
    }
    return err;
});

//Su dung de lay thong tin tu db    
method.select2 = (sql, obj) => connection2().then(dataConnect => query2(sql, obj, dataConnect))
    .catch(err => err);

//Huy bo connection sau khi thuc hien xong
let destroyConnection = (connection) => {
    connection.release();
    connection.destroy();
}

method.pool = pool;
method.pool2 = pool2;

//Exports ra de cac class khac su dung
module.exports = method;