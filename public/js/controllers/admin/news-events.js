showMessage = (value) => {
    $("#messageError").show();
    $("#lblMessage").html(value);
}

showMessage2 = (value) => {
    $("#messageError2").show();
    $("#lblMessage2").html(value);
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
                if (s[0] == "SUCCESS" && s[1] == "1") {
                    $("#NewsEvents").show();
                    $("#Update-News-Events").show();
                } else if (s[0] == "ERROR") {
                    if (s[1] == "-5") {
                        window.location.href = "/account";
                    }
                }
            }
        }
    });
    searchNewsEvents();

    $("#ckAll").click(() => {
        let ckAll = $('#ckAll:checkbox:checked').length > 0;
        if (ckAll > 0) {
            $('input[name="checkDelete"]').each(function () {
                this.checked = true;
            });
        } else {
            $('input[name="checkDelete"]').each(function () {
                this.checked = false;
            });
        }
    });

    $("#btnUpdate").click(() => {
        $.ajax({
            type: "POST",
            url: "/update-news-events",
            data: $("#formUpdate-News-Events").serialize(),
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        searchNewsEvents();
                        showMessage("Cập nhật thành công");
                    } else if (s[0] == "ERROR") {
                        if (s[1] == "-5") {
                            window.location.href = "/account";
                        } else {
                            showMessage(s[1]);
                        }
                    }
                }
            }
        });
    });

    $("#btnDelete").click(() => {
        let arrayChks = [];
        $('input[name="checkDelete"]').each(function () {
            if (this.checked) {
                arrayChks.push(this.value);
            }
        });

        let dataString = "&arrayChks=" + JSON.parse("[" + arrayChks + "]") + "";

        $.ajax({
            type: "POST",
            url: "/delete-news-events",
            data: dataString,
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        searchNewsEvents();
                        showMessage2("Xóa thành công");
                    } else if (s[0] == "ERROR") {
                        if (s[1] == "-5") {
                            window.location.href = "/account";
                        } else {
                            showMessage2(s[1]);
                        }
                    }
                }
            }
        });
    });
});

function checkBox(e) {
    if (!e.checked) {
        $("#ckAll").prop("checked", false);
    } else {
        let numChecked = $(".cssChk:checkbox:checked").length;
        let numtotal = $(".cssChk").length;
        if (numtotal == numChecked) {
            $("#ckAll").prop("checked", true);
        }
    }
}

function getDetailNewsEvents(idNE) {
    let title = $("#title_" + idNE + "").val();
    let content = $("#content_" + idNE + "").val();
    let type = $("#type_" + idNE + "").val();
    let idUpdate = $("#txtID_" + idNE + "").val();

    $("#slType").val(type);
    $("#txtTitle").val(title);
    $("#txtContent").val(content);
    $("#txtIdUpdate").val(idUpdate);
    $("html, body").animate({
        scrollTop: $('#Update-News-Events').offset().top
    }, 1000);
}

function searchNewsEvents(type, index, isLoad) {
    if (isLoad) {
        $("html, body").animate({
            scrollTop: $('#page-wrapper').offset().top
        }, 1000);
    }
    $("#ulPagination").html("");
    $("#tbodyNewsEvents").html("");
    $("#ckAll").prop("checked", false);
    $.ajax({
        type: "POST",
        url: "/admin/get-count-all-news-events",
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
                        $("#ulPagination").append(`<li>
                        <a href="javascript:searchNewsEvents('` + type + `','` + (i + 1) + `','true');">` +
                            (i + 1) + `</a></li>`);
                    }

                } else if (s[0] == "ERROR") {
                    alert(s[1]);
                }
            }
        }
    });

    $.ajax({
        type: "POST",
        url: "/admin/get-all-news-events",
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
                        $("#tbodyNewsEvents").append(`<tr>
                            <td> 
                            <input type="hidden" id="txtID_` + info[i].id + `" value="` + info[i].id + `"/> ` +
                            (i + 1) + `
                            </td>
                            <td>
                            <textarea class="form-control" id="title_` + info[i].id + `" rows="2" name="title" disabled="disabled">` +
                            info[i].title + `
                            </textarea>
                            </td>
                            <td><input type="hidden" id="type_` + info[i].id + `" value = "` + info[i].type + `"/>
                            ` + typeText + `</td>
                            <td>
                            <textarea class="form-control" rows="2" id="content_` + info[i].id + `" name="title" disabled="disabled">` +
                            info[i].content + `</textarea></td>
                            <td>` + dayUp + `</td>
                            <td> 
                            <input type="checkbox" class="cssChk" onclick="checkBox(this)" name="checkDelete" value ="` + info[i].id + `" />
                            </td>
                            <td>
                            <a style="cursor: pointer;" title="Chỉnh sửa" 
                            href="javascript:getDetailNewsEvents('` + info[i].id + `');"> 
                            <i class="fa fa-cog"></i>
                             </a> 
                             </td>
                            </tr>`);
                    }
                } else if (s[0] == "ERROR") {
                    alert(s[1]);
                }
            }
        }
    });
}