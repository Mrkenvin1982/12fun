$(document).ready(() => {

    reloadCaptcha();

    $("#btnReloadcaptcha").click(() => {
        reloadCaptcha();
    });

    $("#btnRegisterLogin").click(() => {
        $("#btnALogin").click();
    });

    $("#btnRegister").click(() => {
        $.ajax({
            type: "POST",
            url: "/register",
            data: $("#formRegister").serialize(),
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        alert("Đăng ký thành công");
                        window.location.href = "/account";
                    } else if (s[0] == "ERROR") {
                        if (s[1] == "-10") {
                            alert("Tài khoản đã tồn tại");
                        }else{
                            alert(s[1].split("<br>").join("\n"));
                        }
                    } else {
                        alert(data);
                    }
                    reloadCaptcha();
                }
            }
        });
    });
});