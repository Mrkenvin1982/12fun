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
    let hours = today.getHours();
    let minutes = today.getMinutes();
    if (dd < 10) {
        dd = "0" + dd;
    }

    if (mm < 10) {
        mm = "0" + mm;
    }

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    today = dd + "/" + mm + "/" + yyyy + " " + hours + ":" + minutes;

    let value = "{" + JSON.stringify(data) + " -- " + today + " -- " + status + "}" + "\r\n";
    return value;
}

module.exports = method;