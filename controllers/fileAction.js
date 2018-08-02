let fs = require("fs");

//Tro den file constant
let constant = require("../datautils/constant.js");

let method = {};

method.logFile = async (filePath, log) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(filePath, log, (err) => {
            if (err) {
                return reject(constant.ERROR + "|" + err);
            }
            return resolve(constant.SUCCESS);
        });
    });
}

method.readFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return reject(constant.ERROR + "|" + err);
            }
            return resolve(constant.SUCCESS + "|" + data);
        });
    });
}

method.dataFile = (data, status) => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = "0" + dd;
    }

    if (mm < 10) {
        mm = "0" + mm;
    }

    today = dd + "/" + mm + "/" + yyyy + " " + today.getHours() + ":" + today.getMinutes();

    let value = "{" + JSON.stringify(data) + " -- " + today + " -- " + status + "}" + "\r\n";
    return value;
}

module.exports = method;