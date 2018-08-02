//Khai bao router
let router = require("express").Router();

//Dung de lay cac thong tin param phia client
let bodyParser = require("./bodyParser.js");

//Tro den file transactionDiceDAO
let transactionDiceDAO = require("../dao/transactionDiceDAO");

//Tro den file constant
let constant = require("../datautils/constant.js");

router.post("/transaction-dice", bodyParser, async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        transactionDiceDAO.select(null, constant.GET_TRANSACTIONDICE).then(data => {
            return res.send(data);
        }).catch(err => res.send(constant.ERROR + "|" + err));
    } catch (error) {
        res.send(constant.ERROR + "|" + error);
    }
});

module.exports = router;