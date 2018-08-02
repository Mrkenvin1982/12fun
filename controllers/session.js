let method = {};

//Khoi tao session
method.sessionUsername = (req) => {
    let sess = req.session;
    sess.username = req.body.username;
}

//Huy session
method.sessionDestroy = (req) => {
    req.session.destroy();
    req.session = undefined;
}

//Kiem tra da ton tai session chua
method.isSession = (req) => {
    if (req.session.username) {
        return true;
    }
    return false;
}

//Kiem ma captcha co dung hay k
method.checkCaptcha = (req) => {
    if (req.body.svgcaptcha == req.session.captcha) {
        return true;
    }
    return false;
}

module.exports = method;