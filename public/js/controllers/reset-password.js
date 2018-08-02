showMessage = (value) => {
    $("#messageError").show();
    $("#lblMessage").html(value);
}

$(document).ready(() => {
    $("#lblCaptcha").html("");
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

    $("#btnResetPassword").click(() => {
        $.ajax({
            type: "POST",
            url: "/reset-password",
            data: $("#formResetPassword").serialize(),
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        showMessage("Mật khẩu của bạn được reset thành 123456 vùi lòng đăng nhập lại và đổi mật khẩu");
                    } else {
                        showMessage(s[1]);
                    }
                    console.log(s[1]);
                    reloadCaptcha();
                }
            }
        });
    });
});