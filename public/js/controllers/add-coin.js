showMessage = (value) => {
    $("#messageError").show();
    $("#lblMessage").html(value);
}

$(document).ready(() => {
    $("#txtUsername").val($("#accountId").html());

    $("#btnReloadcaptcha").click(() => {
        reloadCaptcha();
    });

    $.ajax({
        type: "POST",
        url: "/captcha",
        dataType: "text",
        success: function (data) {
            $("#lblCaptcha").append(data);
        }
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
                    $("#add-coin").show();

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
                        $("#add-coin").addClass("lockform");
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

    $("#btnAddCoin").click(() => {
        $.ajax({
            type: "POST",
            url: "/add-coin",
            data: $("#formAddCoin").serialize(),
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        showMessage("Chuyển thành công " + $("#txtCoin").val() + " bạc vào game");
                        totalCoin = parseInt($("#spanCoin").html().split(",").join("")
                            .split("Bạc: ").join("")) - parseInt($("#txtCoin").val());

                        $("#spanCoin").html("Bạc: " + totalCoin.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    } else if (s[0] == "ERROR") {
                        if (s[1] == "-5") {
                            window.location.href = "/account";
                        } else if (s[1] == "-9") {
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