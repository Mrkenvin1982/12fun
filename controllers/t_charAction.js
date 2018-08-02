let router = require("express").Router();

let bodyParser = require("./bodyParser.js");

let t_charDAO = require("../dao/t_charDAO.js");

//Tro den file validateUtils
let validates = require("../datautils/validateUtils.js");

let fileAction = require("./fileAction.js");

let constant = require("../datautils/constant.js");

let session = require("./session.js");

let md5 = require("./md5.js");

router.post("/char-action", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        let method = req.body.method;
        let param = JSON.parse(req.body.param);
        if (isSession) {
            if (param.charguid == undefined || param.charguid == null || param.charguid.trim() == "") {
                return res.send(constant.ERROR + "|Chưa chọn nhân vật");
            }

            arrayValidate = [{
                "Nhân vật": param.charguid
            }];

            let message = validates.isSepcialChar(arrayValidate);


            if (message != "") {
                return res.send(constant.ERROR + "|" + message);
            }

            if (param.captcha != req.session.captcha) {
                return res.send(constant.ERROR + "|Mã xác nhận không chính xác");
            }

            t_charDAO.save([param.charguid, req.session.username], method).then(data => {
                let arrayAccount = {
                    "account": req.session.username,
                    "charguid": param.charguid,
                    "method": method
                };
                let value = fileAction.dataFile(arrayAccount, data);
                fileAction.logFile(__dirname + "/../log/char-action-log.txt", value);
                return res.send(data);
            }).catch(err => {
                let value = fileAction.dataFile(req.session.username, err);
                fileAction.logFile(__dirname + "/../log/char-action-log.txt", value);
                return res.send(constant.ERROR + "|" + err)
            });
        } else {
            return res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/char-info", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        let method = req.body.method;

        if (constant.RATINGSWEALTH == method || constant.RATINGSLEVEL == method) {
            t_charDAO.select([], method).then(data => {
                return res.send(data);
            }).catch(err => res.send(constant.ERROR + "|" + err));
        } else {
            if (isSession) {
                t_charDAO.select([req.session.username], method).then(data => {
                    return res.send(data);
                }).catch(err => res.send(constant.ERROR + "|" + err));
            } else {
                return res.send(constant.ERROR + "|" + constant.SESSIONFALSE);
            }
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

module.exports = router;