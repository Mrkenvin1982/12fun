//Khai bao router
let router = require("express").Router();

//Dung de lay cac thong tin param phia client
let bodyParser = require("./bodyParser.js");

//Tro den file accountDAO
let accountDAO = require("../dao/accountDAO.js");

let fileAction = require("./fileAction.js");

//Tro den file constant
let constant = require("../datautils/constant.js");

//Tro den file session
let session = require("./session.js");

//Tro den file validateUtils
let validates = require("../datautils/validateUtils.js");

//Dung de ma hoa du lieu
let md5 = require("./md5.js");

//Router dang ky tai khoan
router.post("/register", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let method = req.body.method;
        let username = req.body.username;
        let qq = req.body.qq;
        let email = req.body.email;
        let password = req.body.password;
        let pin = req.body.pin;

        let captcha = session.checkCaptcha(req);
        if (!captcha) {
            return res.send(constant.ERROR + "|Sai mã xác nhận");
        }

        //Kiem tra xem cac tham so null hay rong
        let isNullEmpty = validates.isEmptyNull([username, qq, email, password, pin]);
        if (!isNullEmpty) {
            return res.send(constant.ERROR + "|Nhập đầy đủ thông tin");
        } else {
            let arrayAccount = [
                [username, qq, email, md5.md5(password), pin]
            ];

            let arrayValidate = [{
                "Tài khoản": username,
                "CMND": qq,
                "Mật khẩu": password,
            }];

            let arrayValidateLength = [
                [username, 6, 12, "Tài khoản"],
                [qq, 9, 12, "CMND"],
                [password, 6, 12, "Mật khẩu"],
                [email, 12, 20, "Email"],
                [pin, 5, 6, "Pin"]
            ];

            let message = validates.isSepcialChar(arrayValidate);

            message += validates.validateLength(arrayValidateLength);

            let isEmail = validates.isEmail(email);
            if (!isEmail) {
                message += "Email sai định dạng <br>";
            }
            let isNumber = validates.isNumber(pin);
            if (!isNumber) {
                message += "Pin phải là số  <br>";
            }

            if (message != "") {
                return res.send(constant.ERROR + "|" + message);
            }


            accountDAO.save([arrayAccount], method).then(data => {
                let value = fileAction.dataFile(arrayAccount, data);
                fileAction.logFile(__dirname + "/../log/registerlog.txt", value);
                return res.send(data);
            }).catch(err => {
                let value = fileAction.dataFile(req.session.username, err);
                fileAction.logFile(__dirname + "/../log/registerlog.txt", value);
                return res.send(constant.ERROR + "|" + err)
            });

        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

//Router thay doi mat khau
router.post("/change-password", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let username = req.session.username;
        let passwordOld = req.body.passwordOld;
        let passwordNew = req.body.passwordNew;
        let passwordReNew = req.body.passwordReNew;
        let captcha = session.checkCaptcha(req);

        //Kiem tra xem cac tham so null hay rong
        let isNullEmpty = validates.isEmptyNull([username, passwordOld, passwordNew, passwordReNew]);
        if (!isNullEmpty) {
            return res.send(constant.ERROR + "|Nhập đầy đủ thông tin");
        } else if (passwordNew != passwordReNew) {
            return res.send(constant.ERROR + "|Mật khẩu mới không khớp");
        } else if (!captcha) {
            return res.send(constant.ERROR + "|Mã xác nhận không chính xác");
        } else if (passwordOld == passwordNew) {
            return res.send(constant.ERROR + "|Mật mới không được giống mật khẩu cũ");
        } else {

            let arrayValidate = [{
                "Mật khẩu cũ": passwordOld,
                "Mật khẩu mới": passwordNew
            }];

            let arrayValidateLength = [
                [passwordNew, 6, 12, "Mật khẩu mới"],
            ];

            let message = validates.isSepcialChar(arrayValidate);

            message += validates.validateLength(arrayValidateLength);

            if (message != "") {
                return res.send(constant.ERROR + "|" + message);
            }

            let arrayAccount = [md5.md5(passwordNew), username, md5.md5(passwordOld)];

            accountDAO.save(arrayAccount, constant.CHANGEPASSWORD).then(data => {
                let value = fileAction.dataFile(arrayAccount, data);
                fileAction.logFile(__dirname + "/../log/change-password-log.txt", value);
                return res.send(data);
            }).catch(err => {
                let value = fileAction.dataFile(req.session.username, err);
                fileAction.logFile(__dirname + "/../log/change-password-log.txt", value);
                return res.send(constant.ERROR + "|" + err)
            });
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

//Router reset password
router.post("/reset-password", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let username = req.body.username;
        let email = req.body.email;
        let qq = req.body.qq;
        let pin = req.body.pin;
        let captcha = session.checkCaptcha(req);

        //Kiem tra xem cac tham so null hay rong
        let isNullEmpty = validates.isEmptyNull([username, email, qq, pin]);
        if (!isNullEmpty) {
            return res.send(constant.ERROR + "|Nhập đầy đủ thông tin");
        } else if (!captcha) {
            return res.send(constant.ERROR + "|Mã xác nhận không chính xác");
        } else {
            let arrayValidate = [{
                "Tài khoản": username,
                "Email": email,
                "CMND": qq,
                "Pin": pin
            }];

            let message = validates.isSepcialChar(arrayValidate);

            if (message != "") {
                return res.send(constant.ERROR + "|" + message);
            }

            let arrayAccount = [username, email, qq, pin];

            accountDAO.save(arrayAccount, constant.FORGOTPASSWORD).then(data => {
                let value = fileAction.dataFile(arrayAccount, data);
                fileAction.logFile(__dirname + "/../log/reset-pass-log.txt", value);
                return res.send(data);
            }).catch(err => {
                let value = fileAction.dataFile(req.session.username, err);
                fileAction.logFile(__dirname + "/../log/reset-pass-log.txt", value);
                return res.send(constant.ERROR + "|" + err)
            });
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

//Router dang nhap
router.post("/login", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let captcha = session.checkCaptcha(req);
        if (!captcha) {
            return res.send(constant.ERROR + "|Mã xác nhận không chính xác");
        }
        let arrayLogin = [req.body.username, md5.md5(req.body.password)];

        accountDAO.select(arrayLogin, constant.LOGIN).then(data => {
            let s = data.split("|");
            if (s.length >= 2) {
                let count = JSON.parse(s[1]);
                if (count[0] != undefined && count[0] != null) {
                    if (count[0].COUNT >= 1) {
                        session.sessionUsername(req);
                        return res.send(constant.SUCCESS + "|");
                    }

                }
            }
            return res.send(constant.ERROR + "|Sai tài khoản hoặc mật khẩu");
        }).catch(err => res.send(constant.ERROR + "|" + err));
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

//Router dang xuat
router.post("/logout", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        session.sessionDestroy(req);
        return res.send(constant.SUCCESS + "|");
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

//Router thong tin tai khoan
router.post("/account-info", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        if (isSession) {
            accountDAO.select([req.session.username], constant.ACCOUTNINFO).then(data => {
                let s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == constant.SUCCESS) {
                        let info = JSON.parse(s[1]);
                        req.session.roleId = info[0].roleId;
                    }
                }
                return res.send(data);
            }).catch(err => res.send(constant.ERROR + "|" + err));
        } else {
            return res.send(constant.ERROR + "|" + constant.SESSIONFALSE);
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

//Router co ton tai session hay khong
router.post("/is-session", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        return res.send("" + isSession);
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

//Router add donate vao tai khoan, tru bac khi da add xong
router.post("/add-coin", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        //Lay thong tin so luong coin muon chuyen
        let coin = req.body.coin;
        let charguid = req.body.charguid;
        let captcha = req.body.svgcaptcha;
        //Kiem tra xem da ton tai session hay chua
        let isSession = session.isSession(req);
        if (isSession) {
            let username = req.session.username;
            //Lay thong tin coin tu db
            accountDAO.select([username], constant.ACCOUTNINFO).then(data => {
                //Chat chuoi
                let s = data.split("|");
                if (s.length >= 2) {
                    let count = JSON.parse(s[1]);

                    //Kiem tra xem da chon nhan vat hay chua
                    if (charguid == undefined || charguid == null || charguid.trim() == "") {
                        return res.send(constant.ERROR + "|Chưa chọn nhân vật");
                    }

                    //Kiem tra xem du lieu co phai la so hay khong
                    let isNumber = validates.isNumber(coin);
                    if (!isNumber) {
                        return res.send(constant.ERROR + "|Bạc phải là số");
                    } else {
                        coin = parseInt(coin);
                    }
                    //Kiem tra so luong phai lon hon 0 
                    if (coin <= 0 || coin > count[0].point) {
                        return res.send(constant.ERROR + "|Bạc phải lớn hơn 0 và nhỏ hơn " + count[0].point);
                    }
                    //Kiem tra so du  
                    else if (count[0].point < coin) {
                        return res.send(constant.ERROR + "|Số dư không đủ");
                    }
                    //Kiem tra ma xac nhan
                    else if (captcha != req.session.captcha) {
                        return res.send(constant.ERROR + "|Mã xác nhận không chính xác");
                    } else {
                        //Cap nhat thong tin coin
                        let arrayAccount = [coin, username, coin, coin * 2 / 3, charguid, username];

                        let arrayValidate = [{
                            "Bạc": coin,
                            "Nhân vật": charguid
                        }];

                        let message = validates.isSepcialChar(arrayValidate);

                        if (message != "") {
                            return res.send(constant.ERROR + "|" + message);
                        }

                        accountDAO.save(arrayAccount, constant.ADDCOIN)
                            .then(data => {
                                let value = fileAction.dataFile(arrayAccount, data);
                                fileAction.logFile(__dirname + "/../log/add-coin-log.txt", value);
                                return res.send(data);
                            }).catch(err => {
                                let value = fileAction.dataFile(req.session.username, err);
                                fileAction.logFile(__dirname + "/../log/add-coin-log.txt", value);
                                return res.send(constant.ERROR + "|" + err)
                            });
                    }
                } else {
                    return res.send(constant.ERROR + "|" + s);
                }
            }).catch(err => {
                let value = fileAction.dataFile(req.session.username, err);
                fileAction.logFile(__dirname + "/../log/add-coin-log.txt", value);
                return res.send(constant.ERROR + "|" + err)
            });
        } else {
            //Loi khi chua dang nhap
            return res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        return res.send(constant.ERROR + "|" + error);
    }
});

module.exports = router;