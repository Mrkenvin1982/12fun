var method = {};

method.isEmptyNull = (arrayValue) => {
    let count = 0;
    for (var i = 0; i < arrayValue.length; i++) {
        if (arrayValue[i] != undefined && arrayValue[i] != null && arrayValue[i].trim() != '') {
            count++;
        }
    }

    if (count == arrayValue.length) {
        return true;
    }
    return false;
};

method.isNumber = (number) => {
    let regex = /^\d+$/;
    if (number == undefined || number == null) {
        return false;
    }
    if (!number.toString().trim().match(regex)) {
        return false;
    }
    return true;
};

method.validateLength = (arrayValue) => {
    let message = "";
    for (let i = 0; i < arrayValue.length; i++) {
        if (arrayValue[i][0].trim().length < arrayValue[i][1] ||
            arrayValue[i][0].trim().length > arrayValue[i][2]) {

            message += arrayValue[i][3] +
                " phải có độ dài từ " + arrayValue[i][1] +
                " đến " + arrayValue[i][2] + " ký tự <br>";
        }
    }

    return message;
}

method.isNumberNegative = (number) => {
    number = parseInt(number);
    if (number < 0) {
        return false
    }
    return true;
};

method.isSepcialChar = (arrayValue) => {
    let message = "";
    let regex = /^[a-zA-Z0-9!@#\^\&*\)\(+=._-]{1,}$/g;
    for (let i = 0; i < arrayValue.length; i++) {
        for (let j = 0; j < Object.keys(arrayValue[i]).length; j++) {
            if (!Object.values(arrayValue[i])[j].toString().trim().match(regex)) {
                message += Object.keys(arrayValue[i])[j] + " không được chứa ký tự đặc biệt <br>";
            }
        }
    }

    return message;
};

method.isEmail = (value) => {
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    var r1 = /^[a-zA-Z0-9!@#\^\&*\)\(+=._-]{1,}$/g;
    if (value.match(r1) && value.match(re)) {
        return true;
    }
    return false;
}

method.isExist = (value0, value1) => {
    if (value0 == value1) {
        return true;
    }
    return false;
};

module.exports = method;