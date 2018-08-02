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
    $.ajax({
        type: "POST",
        url: "/is-session",
        dataType: "text",
        success: function (data) {
            if (data == "true") {
                $("#liTlbbInfo").hide();
                $("#liAccount").show();
                $("#liUtilities").show();
                $("#liBank").show();
                $("#liChar").show();
                $("#liHistoryBank").show();
                $("#change-password").show();
            } else {
                window.location.href = "/account";
            }
        }
    });

    $("#btnChangePassword").click(() => {
        $.ajax({
            type: "POST",
            url: "/change-password",
            data: $("#formChangePassword").serialize(),
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        showMessage("Đổi mật khẩu thành công");
                    } else if (s[0] == "ERROR") {
                        showMessage(s[1]);
                        if (s[1] == "-5") {
                            window.location.href = "/account";
                        }
                    }
                    reloadCaptcha();
                }else{
                    window.location.href = "/account";
                }
            }
        });
    });
});