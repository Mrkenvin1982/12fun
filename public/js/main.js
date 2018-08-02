let menpai = ["Thiếu Lâm", "Minh Giáo",
    "Cái Bang", "Võ Đang",
    "Nga My", "Tinh Túc",
    "Thiên Long", "Thiên Sơn",
    "Tiêu Dao", "Không có"
];

function reloadCaptcha() {
    $("#lblCaptcha").html("");
    $.ajax({
        type: "POST",
        url: "/captcha",
        dataType: "text",
        success: function (data) {
            $("#lblCaptcha").html(data);
        }
    });
}

var iterator = menpai.keys();
$(document).ready(() => {
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
                $("#main-page").load("/account/account-info");
            } else {
                $("#main-page").load("/account/login");
            }
        }
    });

    $("#btnAAccounInfo").click(() => {
        $("#main-page").load("/account/account-info");
    });

    $("#btnARegister").click(() => {
        $("#main-page").load("/account/register");
    });

    $("#btnALogin").click(() => {
        $("#main-page").load("/account/login");
    });

    $("#btnARatingsLevel").click(() => {
        $("#main-page").load("/account/ratings-level");
    });

    $("#btnARaingsWealth").click(() => {
        $("#main-page").load("/account/ratings-wealth");
    });

    $("#btnAAccounChange").click(() => {
        $("#main-page").load("/account/change-password");
    });

    $("#btnAAddCoin").click(() => {
        $("#main-page").load("/account/add-coin");
    });

    $("#btnAUnlockChar").click(() => {
        $("#main-page").load("/account/unlock-char");
    });

    $("#btnAFixMap").click(() => {
        $("#main-page").load("/account/fix-map");
    });

    $("#btnAResetTime").click(() => {
        $("#main-page").load("/account/reset-time");
    });

    $("#btnAResetPassword").click(() => {
        $("#main-page").load("/account/reset-password");
    });

    $("#btnAAddNewsEvents").click(() => {
        $("#main-page").load("/admin/add-news-events");
    });

    $("#btnANewsEvents").click(()=>{
        $("#main-page").load("/admin/news-events");
    });

    $("#btnADice").click(() => {
        window.open("/account/dice", '_blank');
    });

    $("#btnALogout").click(() => {
        $.ajax({
            type: "POST",
            url: "/logout",
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        window.location.href = "/account";
                    }
                } else {
                    window.location.href = "/account";
                }
            }
        });
    });
});