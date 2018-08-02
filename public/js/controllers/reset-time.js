showMessage = (value) => {
    $("#messageError").show();
    $("#lblMessage").html(value);
}

$(document).ready(() => {
    $("#txtUsername").val($("#accountId").html());
    $("#lblCaptcha").html("");

    $("#btnReloadcaptcha").click(() => {
        reloadCaptcha();
    });

    $.ajax({
        type: "POST",
        url: "/captcha",
        dataType: "text",
        success: function (data) {
            $("#lblCaptcha").html(data);
        }
    });

    $("#btnReloadcaptcha").click(() => {
        reloadCaptcha();
    });

    $.ajax({
        type: "POST",
        url: "/char-info",
        data: {
            method: "INFOCHAR"
        },
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    $("#reset-time").show();
                    $("#liTlbbInfo").hide();
                    $("#liAccount").show();
                    $("#liUtilities").show();
                    $("#liBank").show();
                    $("#liChar").show();
                    $("#liHistoryBank").show();
                    info = JSON.parse(s[1]);
                    if (info.length <= 0) {
                        $("#lblChar").css("color", "red");
                        $("#lblChar").html("Bạn chưa có nhân vật");
                        $("#reset-time").addClass("lockform");
                    }
                    for (var i = 0; i < info.length; i++) {
                        $("#slChar").append(`<option value="` + info[i].charguid + `">
                        ` + info[i].charname + ` --- level ` + info[i].level + `</option>`);
                    }
                } else {
                    window.location.href = "/account";
                }
            }
        }
    });

    $("#btnResetTime").click(() => {

        let param = {
            "charguid": $("#slChar").val(),
            "captcha": $("#txtCaptcha").val()
        };

        let json = JSON.stringify(param);

        $.ajax({
            type: "POST",
            url: "/char-action",
            data: {
                method: "RESETTIME",
                param: json
            },
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        showMessage("Reset time thành công");
                    } else if (s[0] == "ERROR") {
                        if (s[1] == "-5") {
                            window.location.href = "/account";
                        }else if (s[1] == "-9") {
                            showMessage("Sai phương thức");
                        } else {
                            showMessage(s[1]);
                        }
                    }
                    reloadCaptcha();
                } else {
                    window.location.href = "/account";
                }
            }
        });
    });
});