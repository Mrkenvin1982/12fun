$(document).ready(() => {
    $.ajax({
        type: "POST",
        url: "/account-info",
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    info = JSON.parse(s[1]);
                    $("#account-info").show();
                    $("#spanCoin").html("Bạc: " + info[0].point.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    $("#prfil-img").html("<img src='images/2.jpg' alt=''>");
                    $("#accountId").html(info[0].name);

                    $("#txtUsername").val(info[0].name);
                    $("#txtCoin").val(info[0].point.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));

                    $("#liTlbbInfo").hide();
                    $("#liAccount").show();
                    $("#liUtilities").show();
                    $("#liBank").show();
                    $("#liChar").show();
                    $("#liHistoryBank").show();
                    if (info[0].roleId == "1") {
                        $("#liAdmin").show();
                    }

                } else {
                    console.log(data);
                   // window.location.href = "/account";
                }
            }
        }
    });
});