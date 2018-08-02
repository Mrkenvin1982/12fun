let md5 = require("md5");

let method = {};

method.md5 = (value) => md5(value);

module.exports = method;