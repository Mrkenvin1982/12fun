//Su dung goi express
let express = require("express");

//Su dung session
let session = require("express-session");

let sharedsession = require("express-socket.io-session");

let app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.set("views", "./views");

let server = require("http").Server(app);

app.session = session({
    secret: 'ufhjdkwldj12jsd9',
    cookie: {
        maxAge: 60000 * 15
    },
    resave: false,
    saveUninitialized: true
});

//Thong tin session
app.use(app.session);

//Khai bao la toan cuc de cac file khac co the su dung
global.io = require("socket.io")(server);

io.use(sharedsession(app.session));

let accountAction = require(__dirname + "/controllers/accountAction.js");

let t_charAction = require(__dirname + "/controllers/t_charAction.js");

let captchaAction = require(__dirname + "/controllers/captchaAction.js");

let newseventsAction = require(__dirname + "/controllers/newseventsAction.js");

let views = require(__dirname + "/controllers/views.js");

//Tro den file diceAction
let diceAction = require("./controllers/diceAction.js");

//Tro den file diceAction
let transactionDiceAction = require("./controllers/transactionDiceAction");

server.listen("3000");

app.use(accountAction);

app.use(t_charAction);

app.use(captchaAction);

app.use(diceAction);

app.use(newseventsAction);

app.use(transactionDiceAction);

app.use(views);

app.use(function (req, res, next) {
    res.status(404);
    if (req.accepts("html")) {
        res.render("not-found");
        return;
    }
});

// var request = require('request');
// var r = request.get('https://new.pay.zing.vn/ajax/payment-zingcard', function (err, res, body) {
//   console.log(res.headers);
//     let a = JSON.parse(res.body);
//   console.log(a);
// });