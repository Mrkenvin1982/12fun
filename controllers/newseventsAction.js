//Khai bao router
let router = require("express").Router();

//Dung de lay cac thong tin param phia client
let bodyParser = require("./bodyParser.js");

//Tro den file validateUtils
let validates = require("../datautils/validateUtils.js");

let fileAction = require("./fileAction.js");

//Tro den file constant
let constant = require("../datautils/constant.js");

//Tro den file session
let session = require("./session.js");

//Tro den file newsDAO
let newseventsDAO = require("../dao/newseventsDAO.js");

router.post("/get-all-news-events", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let index = req.body.index;
        let type = req.body.type;
        let start = 0;
        let end = 10;
        let arraySearch = [];

        if (type != undefined && type != null && type != "undefined") {
            let isType = validates.isNumber(type);
            if (!isType) {
                type = "1";
            }
            arraySearch.push(type);
        }

        if (index != undefined && index != null) {
            let isIndex = validates.isNumber(index);
            if (isIndex) {
                start = constant.STARTPAGE(index);
                end = constant.ENDPAGE(index);
            }
        }

        arraySearch.push(start);
        arraySearch.push(end);

        newseventsDAO.select(arraySearch, constant.ALLNEWS_EVENTS).then(data => {
            return res.send(data);
        }).catch(err => res.send(constant.ERROR + "|" + err));
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/get-count-all-news-events", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let type = req.body.type;
        let arraySearch = [];
        if (type != undefined && type != null && type != "undefined") {
            let isType = validates.isNumber(type);
            if (!isType) {
                type = "1";
            }
            arraySearch.push(type);
        }

        newseventsDAO.select(arraySearch, constant.COUNTNEWS_EVENTS).then(data => {
            return res.send(data);
        }).catch(err => res.send(constant.ERROR + "|" + err));
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/admin/get-all-news-events", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        if (isSession && req.session.roleId == "1") {
            let index = req.body.index;
            let type = req.body.type;
            let start = 0;
            let end = 10;
            let arraySearch = [];

            if (type != undefined && type != null && type != "undefined") {
                let isType = validates.isNumber(type);
                if (!isType) {
                    type = "1";
                }
                arraySearch.push(type);
            }

            if (index != undefined && index != null) {
                let isIndex = validates.isNumber(index);
                if (isIndex) {
                    start = constant.STARTPAGE(index);
                    end = constant.ENDPAGE(index);
                }
            }

            arraySearch.push(start);
            arraySearch.push(end);

            newseventsDAO.select(arraySearch, constant.ALLNEWS_EVENTS).then(data => {
                return res.send(data);
            }).catch(err => res.send(constant.ERROR + "|" + err));
        } else {
            return res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/admin/get-count-all-news-events", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        if (isSession && req.session.roleId == "1") {
            let type = req.body.type;
            let arraySearch = [];
            if (type != undefined && type != null && type != "undefined") {
                let isType = validates.isNumber(type);
                if (!isType) {
                    type = "1";
                }
                arraySearch.push(type);
            }

            newseventsDAO.select(arraySearch, constant.COUNTNEWS_EVENTS).then(data => {
                return res.send(data);
            }).catch(err => res.send(constant.ERROR + "|" + err));
        } else {
            return res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/role-news-events", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        if (isSession && req.session.roleId == "1") {
            return res.send(constant.SUCCESS + "|" + req.session.roleId);
        } else {
            return res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }

});

router.post("/add-news-events", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        if (isSession && req.session.roleId == "1") {
            let title = req.body.title;
            let content = req.body.content;
            let type = req.body.type;

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

            today = dd + "/" + mm + "/" + yyyy;

            let isNullEmpty = validates.isEmptyNull([title, content, type]);
            if (!isNullEmpty) {
                return res.send(constant.ERROR + "|Nhập đầy đủ thông tin");
            } else {
                let arrayNews = [
                    [title.trim(), content.trim(), today, type]
                ];
                newseventsDAO.save([arrayNews], constant.SAVENEWS_EVENTS).then(data => {
                    let value = fileAction.dataFile(arrayNews + " -- " + req.session.username +
                        " -- " + constant.SAVENEWS_EVENTS, data);
                    fileAction.logFile(__dirname + "/../log/news-events-log.txt", value);
                    return res.send(data);
                }).catch(err => {
                    let value = fileAction.dataFile(req.session.username +
                        " -- " + constant.SAVENEWS_EVENTS, err);
                    fileAction.logFile(__dirname + "/../log/registerlog.txt", value);
                    res.send(constant.ERROR + "|" + err)
                });
            }
        } else {
            return res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/delete-news-events", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        if (isSession && req.session.roleId == "1") {

            let arrayChks = req.body.arrayChks;
            if (arrayChks != undefined && arrayChks != null) {
                arrayChks = arrayChks.split(",");
            }

            if (Array.isArray(arrayChks)) {
                let isNullEmpty = validates.isEmptyNull(arrayChks);
                if (!isNullEmpty) {
                    return res.send(constant.ERROR + "|Nhập đầy đủ thông tin");
                }
                newseventsDAO.save([arrayChks], constant.DELETENEWS_EVENTS).then(data => {
                    let value = fileAction.dataFile(arrayChks + " -- " + req.session.username +
                        " -- " + constant.DELETENEWS_EVENTS, data);
                    fileAction.logFile(__dirname + "/../log/news-events-log.txt", value);
                    return res.send(data);
                }).catch(err => {
                    let value = fileAction.dataFile(req.session.username +
                        " -- " + constant.DELETENEWS_EVENTS, err);
                    fileAction.logFile(__dirname + "/../log/registerlog.txt", value);
                    res.send(constant.ERROR + "|" + err)
                });

            } else {
                return res.send(constant.ERROR + "|Sai định dạng đầu vào");
            }
        } else {
            return res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

router.post("/update-news-events", bodyParser, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        let isSession = session.isSession(req);
        if (isSession && req.session.roleId == "1") {

            let title = req.body.title;
            let content = req.body.content;
            let type = req.body.type;
            let idUpdate = req.body.idUpdate;

            let arrayUpdate = [type, title, content, idUpdate];

            let isNullEmpty = validates.isEmptyNull(arrayUpdate);
            if (!isNullEmpty) {
                return res.send(constant.ERROR + "|Nhập đầy đủ thông tin");
            }

            newseventsDAO.save(arrayUpdate, constant.UPDATENEWS_EVENTS).then(data => {
                let value = fileAction.dataFile(arrayUpdate + " -- " + req.session.username +
                    " -- " + constant.UPDATENEWS_EVENTS, data);
                fileAction.logFile(__dirname + "/../log/news-events-log.txt", value);
                return res.send(data);
            }).catch(err => {
                let value = fileAction.dataFile(req.session.username +
                    " -- " + constant.UPDATENEWS_EVENTS, err);
                fileAction.logFile(__dirname + "/../log/registerlog.txt", value);
                res.send(constant.ERROR + "|" + err)
            });
        } else {
            return res.send(constant.ERROR + "|-5");
        }
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

module.exports = router;