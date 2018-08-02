let router = require("express").Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/account", (req, res) => {
    res.render("account/index");
});

router.get("/account/register", (req, res) => {
    res.render("account/directional/register.ejs");
});

router.get("/account/login", (req, res) => {
    res.render("account/directional/login.ejs");
});

router.get("/account/account-info", (req, res) => {
    res.render("account/directional/account-info.ejs");
});

router.get("/account/ratings-level", (req, res) => {
    res.render("account/directional/ratingslevel.ejs");
});

router.get("/account/ratings-wealth", (req, res) => {
    res.render("account/directional/ratingswealth.ejs");
});

router.get("/account/change-password", (req, res) => {
    res.render("account/directional/change-password.ejs");
});

router.get("/account/add-coin", (req, res) => {
    res.render("account/directional/add-coin.ejs");
});

router.get("/account/unlock-char", (req, res) => {
    res.render("account/directional/unlock-char.ejs");
});

router.get("/account/fix-map", (req, res) => {
    res.render("account/directional/fix-map.ejs");
});

router.get("/account/reset-time", (req, res) => {
    res.render("account/directional/reset-time.ejs");
});

router.get("/account/reset-password", (req, res) => {
    res.render("account/directional/reset-password.ejs");
});

router.get("/account/dice", (req, res) => {
    res.render("account/directional/dice.ejs");
});

router.get("/admin/add-news-events", (req, res) => {
    res.render("admin/directional/add-news-events.ejs");
});

router.get("/admin/news-events", (req, res) => {
    res.render("admin/directional/news-events.ejs");
});

router.get("/not-found", (req, res) => {
    res.render("not-found");
});


module.exports = router;