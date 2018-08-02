$(document).ready(() => {
    searchNewsEvents();
    $("#btnA1Events").click(() => {
        searchNewsEvents("1", '1');
    });

    $("#btnAEvents").click(() => {
        searchNewsEvents("1", '1');
    });

    $("#btnANews").click(() => {
        searchNewsEvents("0", '1');
    });

    $("#btnA1News").click(() => {
        searchNewsEvents("0", '1');
    });
});

function searchNewsEvents(type, index) {
    $("#lstNewsEvents").html("");
    $("#lstPaging").html("");
    $.ajax({
        type: "POST",
        url: "/get-count-all-news-events",
        data: {
            "type": type,
        },
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    let info = JSON.parse(s[1]);
                    let totalPage = Math.ceil(info[0].COUNT / 10);
                    for (let i = 0; i < totalPage; i++) {
                        $("#lstPaging").append(`<li>
                        <a href="javascript:searchNewsEvents('` + type + `','` + (i + 1) + `');">
                            <label class="ac">` + (i + 1) + `</label>
                        </a>
                        </li>`);
                    }

                } else if (s[0] == "ERROR") {
                    alert(s[1]);
                }
            }
        }
    });

    $.ajax({
        type: "POST",
        url: "/get-all-news-events",
        data: {
            "type": type,
            "index": index
        },
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    info = JSON.parse(s[1]);
                    for (let i = 0; i < info.length; i++) {
                        dayUp = info[i].lastupdate_date;
                        typeText = info[i].type;
                        if (typeText == "1") {
                            typeText = "Sự Kiện";
                        } else {
                            typeText = "Tin tức";
                        }
                        value = info[i].content.trim().split('"').join("").split('\n').join("<br>");
                        $("#lstNewsEvents").append(`<li style="margin-top: 5px;"> 
                            <span style="color: cornflowerblue;"> 
                            [` + typeText + `: ` + dayUp + `] </span>
                            <a href="javascript:viewFuncybox('--Ngày đăng ` + dayUp + `<br><br>` +
                            value.trim() + `');" 
                             style="color:bisque;" id="news_` + i + `">` +
                            info[i].title + `</a>
                            </li>`);
                    }
                } else if (s[0] == "ERROR") {
                    alert(s[1]);
                }
            }
        }
    });
}

function viewFuncybox(value) {
    $.fancybox({
        type: 'inline',
        css: {
            'background-color': '#ff0000'
        },
        content: `<div style="width:600px; color: black;background-color: snow;font-weight: bold;">
        ` + value + `
        </div>`,
    });
}