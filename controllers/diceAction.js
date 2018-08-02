let router = require("express").Router();

//Tro den file session
let session = require("./session.js");

//Tro den file session
let fileAction = require("./fileAction");

//Tro den file validateUtils
let validates = require("../datautils/validateUtils.js");

//Tro den file constant
let constant = require("../datautils/constant.js");

//Tro den file accountDAO
let accountDAO = require("../dao/accountDAO.js");

//Tro den file transactionDiceDAO
let transactionDiceDAO = require("../dao/transactionDiceDAO.js");

//Dung de lay cac thong tin param phia client
let bodyParser = require("./bodyParser.js");

let timer = 10 * 6;
let timeleft = 10;
let totalTime = 60;
let arrayFinancial = [];
let arrayCollapse = [];
let arrayWin = [];
let totalCoinFinancial = 0;
let totalCoinCollapse = 0;
let isPutDice = true;
let O_U = "";
let Session_dice = 1;
setInterval(() => {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    let minutes2 = parseInt(timer / 60, 10);
    let seconds2 = parseInt(timeleft % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    seconds2 = seconds2 < 10 ? "0" + seconds2 : seconds2;
    minutes2 = minutes2 < 10 ? "0" + minutes2 : minutes2;

    io.sockets.emit("server-send-time", {
        "timer": minutes + ":" + seconds,
        "timeleft": minutes2 + ":" + seconds2,
        "Session_dice": Session_dice
    });

    io.sockets.emit("server-send-put-dice", {
        "totalFinancial": arrayFinancial.length,
        "totalCollapse": arrayCollapse.length,
        "totalCoinFinancial": totalCoinFinancial,
        "totalCoinCollapse": totalCoinCollapse
    });

    if (--timer <= 0) {
        isPutDice = false;
        if (timer == 0) {
            let number1 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            let number2 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            let number3 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

            let numbersFinancial = [];
            let numbersCollapse = [];
            let totalFinancial = 0;
            let totalCollapse = 0;
            let arrayReturnCoin = [];
            for (let i = 0; i < arrayFinancial.length; i++) {
                numbersFinancial.push(arrayFinancial[i].point);
            }

            for (let i = 0; i < arrayCollapse.length; i++) {
                numbersCollapse.push(arrayCollapse[i].point);
            }

            if (numbersFinancial.length > 0) {
                totalFinancial = numbersFinancial.reduce(constant.getSum);
            }

            if (numbersCollapse.length > 0) {
                totalCollapse = numbersCollapse.reduce(constant.getSum);
            }

            if (totalCollapse != totalFinancial) {
                if (totalCollapse < totalFinancial) {
                    for (let i = 0; i < arrayFinancial.length; i++) {
                        totalFinancial = totalFinancial - arrayFinancial[i].point;
                        let point = arrayFinancial[i].point;
                        let name = arrayFinancial[i].name;
                        let type = arrayFinancial[i].type;
                        let timeput = arrayFinancial[i].timeput;
                        let session_dice = arrayFinancial[i].session_dice;

                        arrayReturnCoin.push(arrayFinancial[i]);

                        arrayFinancial.splice(i, 1);
                        if (totalFinancial == totalCollapse) {
                            break;
                        } else if (totalFinancial < totalCollapse) {

                            arrayReturnCoin.splice(i, 1);

                            let pointReturn = point - (totalCollapse - totalFinancial);

                            arrayReturnCoin.push({
                                "name": name,
                                "point": pointReturn,
                                "type": type,
                                "method": constant.RETURNCOIN,
                                "session_dice": session_dice
                            });

                            let pointA = totalCollapse - totalFinancial;
                            totalFinancial = totalFinancial + pointA;
                            arrayFinancial.push({
                                "name": name,
                                "point": pointA,
                                "type": type,
                                "session_dice": session_dice,
                                "returnCoin": pointReturn,
                                "timeput": timeput
                            })
                            break;
                        }
                    }
                } else if (totalFinancial < totalCollapse) {
                    for (let i = 0; i < arrayCollapse.length; i++) {
                        totalCollapse = totalCollapse - arrayCollapse[i].point;
                        let point = arrayCollapse[i].point;
                        let name = arrayCollapse[i].name;
                        let type = arrayCollapse[i].type;
                        let session_dice = arrayCollapse[i].session_dice;
                        let timeput = arrayCollapse[i].timeput;
                        arrayReturnCoin.push(arrayCollapse[i]);

                        arrayCollapse.splice(i, 1);
                        if (totalCollapse == totalFinancial) {
                            break;
                        } else if (totalCollapse < totalFinancial) {
                            arrayReturnCoin.splice(i, 1);

                            let pointReturn = point - (totalFinancial - totalCollapse);

                            arrayReturnCoin.push({
                                "name": name,
                                "point": pointReturn,
                                "type": type,
                                "method": constant.RETURNCOIN,
                                "session_dice": session_dice,
                            });

                            let pointA = totalFinancial - totalCollapse;
                            totalCollapse = totalCollapse + pointA;
                            arrayCollapse.push({
                                "name": name,
                                "point": pointA,
                                "type": type,
                                "session_dice": session_dice,
                                "returnCoin": pointReturn,
                                "timeput": timeput
                            })
                            break;
                        }
                    }
                }
            }


            if (arrayReturnCoin.length > 0) {
                totalCoinFinancial = 0;
                totalCoinCollapse = 0;
                for (let i = 0; i < arrayFinancial.length; i++) {
                    totalCoinFinancial = totalCoinFinancial + arrayFinancial[i].point;
                }
                for (let i = 0; i < arrayCollapse.length; i++) {
                    totalCoinCollapse = totalCoinCollapse + arrayCollapse[i].point;
                }

                accountDAO.save(arrayReturnCoin, constant.RETURNCOIN).then(data => {
                    let value = fileAction.dataFile(arrayReturnCoin, data);
                    fileAction.logFile(__dirname + "/../log/dicelog.txt", value);
                }).catch(err => {
                    let value = fileAction.dataFile(arrayWin, err);
                    fileAction.logFile(__dirname + "/../log/dicelog.txt", value);
                });
            }

            setTimeout(() => {
                io.sockets.emit("server-send-auto-number", {
                    "number1": number1,
                    "number2": number2,
                    "number3": number3
                });

                let totalDice = number1 + number2 + number3;

                if (totalDice >= 11 && totalDice <= 18) {
                    arrayWin = arrayFinancial;
                    O_U = "O";

                } else if (totalDice >= 1 && totalDice <= 10) {
                    O_U = "U";
                    arrayWin = arrayCollapse;
                } else {
                    arrayWin = [];
                }


                if (arrayWin.length > 0) {
                    accountDAO.save(arrayWin, constant.INCREASECOIN).then(data => {
                        let value = fileAction.dataFile(arrayWin, data);
                        fileAction.logFile(__dirname + "/../log/dicelog.txt", value);
                    }).catch(err => {
                        let value = fileAction.dataFile(arrayWin, err);
                        fileAction.logFile(__dirname + "/../log/dicelog.txt", value);
                    });
                }

                let object_user = JSON.stringify(arrayFinancial.concat(arrayCollapse));
                let time = constant.TODAY();

                let arrayTransacionDice = [
                    [O_U, number1, number2, number3,
                        totalDice, Session_dice, object_user, time
                    ]
                ];

                transactionDiceDAO.save([arrayTransacionDice], constant.SAVE_TRANSACTIONDICE)
                    .then(data => {
                        let value = fileAction.dataFile(arrayTransacionDice, data);
                        fileAction.logFile(__dirname + "/../log/transaction-dice-log.txt", value);
                    }).catch(err => {
                        let value = fileAction.dataFile(arrayTransacionDice, err);
                        fileAction.logFile(__dirname + "/../log/transaction-dice-log.txt", value);
                    });
                Session_dice++;
                setTimeout(() => {
                    timer = totalTime;
                    timeleft = 10;
                    totalCoinCollapse = 0;
                    totalCoinFinancial = 0;
                    arrayCollapse = [];
                    arrayFinancial = [];
                    O_U = "";
                    //arrayWin = [];
                    isPutDice = true;
                }, 12000)
            }, 8000);
        }

        if (timer < -8) {
            --timeleft;
        }
    }
}, 1000);

io.on("connection", (socket) => {
    socket.on("client-send-message", (data) => {
        let value = "";
        let username = socket.handshake.session.username;
        if (username) {
            let thisSession = socket.handshake.session;
            let messageTime = new Date().getTime();
            if (thisSession.messageTime == undefined || thisSession.messageTime == null) {
                /* first dice */
                thisSession.messageTime = messageTime;
            }
            if ((messageTime - thisSession.messageTime) >= 5000 || (messageTime - thisSession.messageTime) == 0) {
                thisSession.messageTime = messageTime;
                if (data != undefined && data != null && data.trim() != "") {
                    message = `<li>
                                <span class="n_chat chat_member">
                                <span class="icon_vipchat icon_v0"></span>
                                <span>` + username + `</span>
                                </span>
                                <span class="data_chat">` + data + `</span>
                                </li>`;
                    let value = constant.SUCCESS + "|" + message;
                    fileAction.logFile(__dirname + "/../log/logchat.html", message);
                    return io.sockets.emit("server-send-message-chat", value);
                }

            }
        }
    });
});

router.post("/log-chat", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        fileAction.readFile(__dirname + "/../log/logchat.html").then(data => res.send(data))
            .catch(err => res.send(err));
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});


//Router dat cuoc
router.post("/put-dice", bodyParser, async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        let param = JSON.parse(req.body.param);
        let resultError = "";
        if (isSession) {
            let thisSession = req.session;
            let putDiceTime = new Date().getTime();
            if (thisSession.putDiceTime == undefined || thisSession.putDiceTime == null) {
                /* first dice */
                thisSession.putDiceTime = putDiceTime;
            } else {
                if ((putDiceTime - thisSession.putDiceTime) < 2000) {
                    return res.send(constant.ERROR + "|Thao tác quá nhanh");
                } else {
                    thisSession.putDiceTime = putDiceTime;
                }
            }

            if (isPutDice) {
                let name = req.session.username;
                let totalPoint = 0;
                let totalPointO = 0;
                let totalPointU = 0;
                coinFinancial = param.coinFinancial;
                coinCollapse = param.coinCollapse;


                let countFinancial = 0;
                for (let i = 0; i < arrayFinancial.length; i++) {
                    let isExistName = validates.isExist(arrayFinancial[i].name, name);
                    if (isExistName) {
                        countFinancial = 1;
                        break;
                    }
                }

                let countCollapse = 0;
                for (let i = 0; i < arrayCollapse.length; i++) {
                    let isExistName = validates.isExist(arrayCollapse[i].name, name);
                    if (isExistName) {
                        countCollapse = 1;
                        break;
                    }
                }

                if (coinFinancial != undefined &&
                    coinFinancial != null && coinFinancial.trim() != "" && coinCollapse != undefined &&
                    coinCollapse != null && coinCollapse.trim() != "") {
                    return res.send(constant.ERROR + "|Không thể đặt 2 cửa");
                }

                if (countFinancial > 0 && coinCollapse != undefined &&
                    coinCollapse != null && coinCollapse.trim() != "") {
                    return res.send(constant.ERROR + "|Không thể đặt 2 cửa");
                }

                if (countCollapse > 0 && coinFinancial != undefined &&
                    coinFinancial != null && coinFinancial.trim() != "") {
                    return res.send(constant.ERROR + "|Không thể đặt 2 cửa");
                }

                //Chay xong ham nay moi chay tiep nhung cau lenh o duoi
                await accountDAO.select([req.session.username], constant.ACCOUTNINFO)
                    .then(data => {
                        let s = data.split("|");
                        if (s.length >= 2) {
                            if ((coinFinancial == undefined ||
                                coinFinancial == null ||
                                coinFinancial.toString().trim() == "") &&
                                (coinCollapse == undefined ||
                                    coinCollapse == null ||
                                    coinCollapse.toString().trim() == "")) {
                                return resultError = constant.ERROR + "|Chưa đặt cửa";
                            }

                            if (coinFinancial != undefined &&
                                coinFinancial != null &&
                                coinFinancial.toString().trim() != "") {

                                let isNumber = validates.isNumber(coinFinancial);

                                if (isNumber) {
                                    coinFinancial = parseInt(param.coinFinancial);
                                } else {
                                    coinFinancial = 0;
                                }

                                if (coinFinancial <= 0) {
                                    if (resultError == "") {
                                        resultError += constant.ERROR + "|";
                                    }
                                    resultError += "- Số lượng đặt tài phải lớn hơn 0 <br>";
                                }
                            } else {
                                coinFinancial = 0;
                            }


                            if (coinCollapse != undefined &&
                                coinCollapse != null &&
                                coinCollapse != "") {

                                let isNumber = validates.isNumber(coinCollapse);

                                if (isNumber) {
                                    coinCollapse = parseInt(param.coinCollapse);
                                } else {
                                    coinCollapse = 0;
                                }

                                if (coinCollapse <= 0) {
                                    if (resultError == "") {
                                        resultError += constant.ERROR + "|";
                                    }
                                    resultError += "- Số lượng đặt xỉu phải lớn hơn 0 <br>";
                                }
                            } else {
                                coinCollapse = 0;
                            }

                            info = JSON.parse(s[1]);

                            totalPointO_U = coinFinancial + coinCollapse;
                            totalPoint = info[0].point - totalPointO_U;
                            //Kiem tra so du  
                            if (info[0].point < totalPointO_U) {
                                if (resultError == "") {
                                    resultError += constant.ERROR + "|";
                                }
                                resultError += "- Số dư không đủ <br>";
                            }
                        }
                        return resultError;
                    }).catch(err => {
                        let value = fileAction.dataFile(req.session.username, err);
                        fileAction.logFile(__dirname + "/../log/dicelog.txt", value);
                        return resultError = constant.ERROR + "|" + err;
                    });


                if (resultError != "") {
                    return res.send(resultError);
                }

                if (coinFinancial > 0) {
                    //Chay xong ham nay moi chay tiep nhung cau lenh o duoi
                    await accountDAO.save([coinFinancial, name], constant.MINUSCOIN)
                        .then(data => {
                            let isExistName = false;
                            for (let i = 0; i < arrayFinancial.length; i++) {
                                isExistName = validates.isExist(arrayFinancial[i].name, name);
                                if (isExistName) {
                                    totalPointO = arrayFinancial[i].point + coinFinancial;
                                    arrayFinancial[i].point = arrayFinancial[i].point + coinFinancial;
                                    break;
                                }
                            }

                            if (!isExistName) {
                                arrayFinancial.push({
                                    "name": name,
                                    "point": coinFinancial,
                                    "type": "O",
                                    "session_dice": Session_dice,
                                    "returnCoin": "0",
                                    "timeput": constant.HOURS()
                                });
                                totalPointO = totalPointO + coinFinancial;
                            }
                            arrayAccount = {
                                "account": name,
                                "coinFinancial": coinFinancial,
                                "session_dice": Session_dice
                            };
                            let value = fileAction.dataFile(arrayAccount, data);
                            fileAction.logFile(__dirname + "/../log/dicelog.txt", value);

                            totalCoinFinancial = totalCoinFinancial + coinFinancial;
                        }).catch(err => {
                            let value = fileAction.dataFile(req.session.username, err);
                            fileAction.logFile(__dirname + "/../log/dicelog.txt", value);
                            return res.send(constant.ERROR + "|" + err)
                        });
                }

                if (coinCollapse > 0) {
                    //Chay xong ham nay moi chay tiep nhung cau lenh o duoi
                    await accountDAO.save([coinCollapse, name], constant.MINUSCOIN)
                        .then(data => {
                            let isExistName = false;
                            for (let i = 0; i < arrayCollapse.length; i++) {
                                isExistName = validates.isExist(arrayCollapse[i].name, name);
                                if (isExistName) {
                                    totalPointU = arrayCollapse[i].point + coinCollapse;
                                    arrayCollapse[i].point = arrayCollapse[i].point + coinCollapse;
                                    break;
                                }
                            }
                            if (!isExistName) {
                                arrayCollapse.push({
                                    "name": name,
                                    "point": coinCollapse,
                                    "type": "U",
                                    "session_dice": Session_dice,
                                    "returnCoin": "0",
                                    "timeput": constant.HOURS()
                                });
                                totalPointU = totalPointU + coinCollapse;
                            }

                            arrayAccount = {
                                "account": name,
                                "coinCollapse": coinCollapse,
                                "session_dice": Session_dice
                            };
                            let value = fileAction.dataFile(arrayAccount, data);
                            fileAction.logFile(__dirname + "/../log/dicelog.txt", value);

                            totalCoinCollapse = totalCoinCollapse + coinCollapse;
                        }).catch(err => {
                            let value = fileAction.dataFile(req.session.username, err);
                            fileAction.logFile(__dirname + "/../log/dicelog.txt", value);
                            return res.send(constant.ERROR + "|" + err)
                        });
                }

                thisSession.totalPoint = totalPoint;
                if (!thisSession.totalPointO) {
                    thisSession.totalPointO = totalPointO;
                } else {
                    thisSession.totalPointO = totalPointO;
                    totalPointO = thisSession.totalPointO;
                }
                if (!thisSession.totalPointU) {
                    thisSession.totalPointU = totalPointU;
                } else {
                    thisSession.totalPointU = 0 + totalPointU;

                    totalPointU = thisSession.totalPointU;
                }
                thisSession.session_dice = Session_dice;
                return res.send(constant.SUCCESS + "|" + totalPoint + "|" + totalPointO + "|" + totalPointU);
            } else {
                return res.send(constant.ERROR + "|- Hết thời gian đặt cửa");
            }
        } else {
            return res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/total-dice-point", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        if (req.session.username) {
            let totalPointO = 0;
            let totalPointU = 0;
            let totalPoint = 0;
            let name = req.session.username;
    
            for (let i = 0; i < arrayFinancial.length; i++) {
                let isExistName = validates.isExist(arrayFinancial[i].name, name);
                if (isExistName) {
                    totalPointO = arrayFinancial[i].point;
                    break;
                }
            }

            for (let i = 0; i < arrayCollapse.length; i++) {
                let isExistName = validates.isExist(arrayCollapse[i].name, name);
                if (isExistName) {
                    totalPointU = arrayCollapse[i].point;
                    break;
                }
            }

            if (!req.session.session_dice || req.session.session_dice < Session_dice) {
                req.session.totalPointO = 0;
                req.session.totalPointU = 0;
                totalPointO = 0;
                totalPointU = 0;
            }
            return res.send(constant.SUCCESS + "|" + 0 + "|" + totalPointO + "|" + totalPointU);
        } else {
            res.send(constant.ERROR + "|-5");
        }

    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/dice-balance", bodyParser, async (req, res) => {
    try {
        if (req.session.username) {
            let totalPointO = 0;
            let totalPointU = 0;
            let totalPoint = 0;
            let name = req.session.username;

            await accountDAO.select([req.session.username], constant.ACCOUTNINFO)
                .then(data => {
                    s = data.split("|");
                    if (s.length >= 2) {
                        info = JSON.parse(s[1]);
                        totalPoint = info[0].point;
                    }

                }).catch(error => res.send(constant.ERROR + "|" + error));

            for (let i = 0; i < arrayFinancial.length; i++) {
                let isExistName = validates.isExist(arrayFinancial[i].name, name);
                if (isExistName) {
                    totalPointO = arrayFinancial[i].point;
                    break;
                }
            }

            for (let i = 0; i < arrayCollapse.length; i++) {
                let isExistName = validates.isExist(arrayCollapse[i].name, name);
                if (isExistName) {
                    totalPointU = arrayCollapse[i].point;
                    break;
                }
            }

            return res.send(constant.SUCCESS + "|" + totalPoint + "|" + totalPointO + "|" + totalPointU);
        } else {
            res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/dice-top", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        arrayWin.sort(function (a, b) {
            return (a.point < b.point) ? 1 : ((b.point < a.point) ? -1 : 0);
        });
        res.send(arrayWin);
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

module.exports = router;