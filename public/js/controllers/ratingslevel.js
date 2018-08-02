$(document).ready(() => {
    $.ajax({
        type: "POST",
        url: "/char-info",
        data: {
            method: "RATINGSLEVEL"
        },
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    info = JSON.parse(s[1]);
                    for (var i = 0; i < info.length; i++) {
                        if (info[i].sex == 1) {
                            info[i].sex = "Nam";
                        } else {
                            info[i].sex = "Nữ";
                        }
                        for (var j = 0; j < menpai.length; j++) {
                            if (info[i].menpai == j) {
                                info[i].menpai = menpai[j];
                                break;
                            }
                        }
                        $("#tbodyRatingsLevel").append(`<tr>
                            <td>` + (i + 1) + `</td>
                            <td>` + info[i].charname + `</td>
                            <td>` + info[i].level + `</td>
                            <td>` + info[i].charguid + `</td>
                            <td>` + info[i].menpai + `</td>
                            <td>` + info[i].exp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
                            <td>` + info[i].sex + `</td>
                            </tr>`);
                    }
                } else {
                    console.log(data);
                }
            }
        }
    });
});