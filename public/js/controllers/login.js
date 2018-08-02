$(document).ready(() => {

    reloadCaptcha();

    $("#btnReloadcaptcha").click(() => {
        reloadCaptcha();
    });

    $("#btnLoginRegister").click(() => {
        $("#btnARegister").click();
    });

    $('#txtCaptcha').keyup(function(e){
        if(e.keyCode == 13)
        {
            login();
        }
    });

    $('#txtPassword').keyup(function(e){
        if(e.keyCode == 13)
        {
            login();
        }
    });

    $('#txtUsername').keyup(function(e){
        if(e.keyCode == 13)
        {
            login();
        }
    });

    $("#btnLogin").click(() => {
        login();
    });
});

login = () =>{
    $.ajax({
        type: "POST",
        url: "/login",
        data: $("#frmLogin").serialize(),
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    $("#liTlbbInfo").hide();
                    $("#liAccount").show();
                    $("#liUtilities").show();
                    $("#liBank").show();
                    $("#liChar").show();
                    $("#liHistoryBank").show();
                    $("#main-page").load("/account/account-info");
                } else if (s[0] == "ERROR") {
                    alert(s[1]);
                }
                reloadCaptcha();
            } else {
                window.location.href = "/account";
            }
        }
    });
}