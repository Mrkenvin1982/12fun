showMessage = (value) => {
    $("#messageError").show();
    $("#lblMessage").html(value);
}

$(document).ready(() => {
    $("#txtUsername").val($("#accountId").html());
    $.ajax({
        type: "POST",
        url: "/role-news-events",
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                console.log(data);
                if (s[0] == "SUCCESS" && s[1] == "1") {
                    $("#AddNews-Events").show();
                } else {
                    window.location.href = "/account";
                }
            }
        }
    });

    $("#btnAddNews").click(() => {
        $.ajax({
            type: "POST",
            url: "/add-news-events",
            data: $("#formAddNews-Events").serialize(),
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        showMessage("Đăng tin thành công");
                        $("#slType").val("");
                        $("#txtTitle").val("");
                        $("#txtContent").val("");
                    } else if (s[0] == "ERROR") {
                        if (s[1] == "-5") {
                            window.location.href = "/account";
                        } else if (s[1] == "-9") {
                            showMessage("Sai phương thức");
                        } else {
                            showMessage(s[1]);
                        }
                    }
                } else {
                    window.location.href = "/account";
                }
            }
        });
    });
});