let bodyParser = require("body-parser");

let jsonParser = bodyParser.json()

let urlencodeParser = bodyParser.urlencoded({
    extended: false
})

module.exports = urlencodeParser;