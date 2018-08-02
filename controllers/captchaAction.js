//Khai bao router
let router = require("express").Router();

let svgCaptcha = require('svg-captcha');

router.post("/captcha", (req, res) => {
    res.type('svg');
    try {
        var captcha = svgCaptcha.create();
        req.session.captcha = captcha.text;
        res.status(200).send(captcha.data);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;