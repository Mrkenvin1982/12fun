socket = io('/');

showMessage = (message) => {
    $("#dice_message").html(message);
    $("#dice_message").show();
    setTimeout(() => {
        $("#dice_message").hide();
    }, 3000);
}

// let loader_dice = new PIXI.loaders.loader();

// var stage_dice = new PIXI.Container();

// let renderer_dice = new PIXI.CanvasRenderer(160, 160, {
//     transparent: true,
//     resolution: 1
// });
// $("#pixi_effect").append(renderer_dice.view);

// loader_dice.add("/css/img/ef-taixiu.png").on("progress").load(setup_dice);

// function setup_dice() {
//     rect_dice = new PIXI.Rectangle(0, 0, 150, y_position_dice);
//     var texture = PIXI.utils.TextureCache["/minigame/dicegame/img/ef-taixiu.png"];
//     texture.frame = rect_dice;
//     //Create the sprite from the texture
//     rocket = new PIXI.Sprite(texture);
//     //Position the rocket sprite on the canvas
//     rocket.x = 0;
//     rocket.y = 0;
//     //Add the rocket to the stage_dice
//     stage_dice.addChild(rocket);
//     //Render the stage
// }

socket.on("server-send-time", function (data) {
    $("#tx_phien").html(data.Session_dice);
    let seconds = data.timer.split(":");
    let number = parseInt(seconds[1].replace(0, ""));

    if (number < 0) {

        if (number == -1) {
            showMessage("Hệ thông cân cửa");
            dicebalance();
        }
        $("#bidO").prop("disabled", "disabled");
        $("#bidU").prop("disabled", "disabled");
        hideButtonCuoc();
        if (number > -5) {

            let number1 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            let number2 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            let number3 = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            $("#clock_effect").prop("class", "dice dice" + number1 + number2 + number3);
        } else {
            $("#timeWait").show(2000);
            $("#timeWait").html(data.timeleft);
        }

        $("#clock_effect").html("");

        //$("#clock_effect").html("00:00");
    } else {
        $("#totalDiceResult").prop("class", "countDiceResult");
        $("#clock_effect").prop("class", "red-circle clock-big");
        $("#clock_effect").html(data.timer);
        $("#xiu_icon").removeClass("active");
        $("#tai_icon").removeClass("active");
        $("#timeWait").hide();
        $("#bidO").removeAttr("disabled");
        $("#bidU").removeAttr("disabled");
    }
    // console.log(data);
});

socket.on('disconnect', function (data) {
    console.log('disconnect');
});

dicebalance = () => {
    $.ajax({
        type: "POST",
        url: "/dice-balance",
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {

                    $("#lblUserMoney").html(s[1].toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));

                    $("#bidO").val(undefined);

                    $("#bidO_val").val(undefined);;

                    $("#totalPointO").val(s[2].toString());

                    $("#lblTai").html(s[2].toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));

                    $("#bidU").val(undefined);

                    $("#bidU_val").val(undefined);;

                    $("#totalPointU").val(s[3].toString());

                    $("#lblXiu").html(s[3].toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                } else {
                    // window.location.href = "/account";
                }
            }
        }
    });
}

socket.on("server-send-auto-number", function (data) {
    total = data.number1 + data.number2 + data.number3;
    $("#clock_effect").prop("class", "dice dice" + data.number1 + data.number2 + data.number3);
    $("#totalDiceResult").prop("class", "countDiceResult countDiceOpen");
    $("#totalDiceResult").html(total);
    $("#timeWait").show();

    let totalCoin = $("#lblUserMoney").html().split(",").join("")
        .split("Bạc: ").join("");

    if (total >= 11 && total <= 18) {
        totalCoin = parseInt(totalCoin) + (parseInt($("#totalPointO").val()) * 2);
        $("#tai_icon").addClass("active");
        $("#aDice").prop("title", "Tài: " + data.number1 + " - " + data.number2 + " - " + data.number3);
        $("#imgDice").prop("src", "/minigame/dicegame/img/ico-black-active.png");
    } else if (total >= 1 && total <= 10) {
        totalCoin = parseInt(totalCoin) + (parseInt($("#totalPointU").val()) * 2);
        $("#xiu_icon").addClass("active");
        $("#aDice").prop("title", "Xỉu: " + data.number1 + " - " + data.number2 + " - " + data.number3);
        $("#imgDice").prop("src", "/minigame/dicegame/img/ico-white-active.png");
    }
    $("#lblUserMoney").html(totalCoin.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));

    $("#totalPointO").val("0");
    $("#lblTai").html("0");
    $("#totalPointU").val("0");
    $("#lblXiu").html("0");
    $("#bidO").val("");
    $("#bidO_val").val("");

    $("#bidU").val("");
    $("#bidU_val").val("");
    transactionDice();
});

socket.on("server-send-put-dice", (data) => {
    $("#tai_number").html(data.totalFinancial.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $("#xiu_number").html(data.totalCollapse.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $("#tai_amount_total").html(data.totalCoinFinancial.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $("#xiu_amount_total").html(data.totalCoinCollapse.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
});

socket.on("server-send-message-chat", (data) => {
    s = data.split("|");
    if (s.length >= 2) {
        if (s[0] == "SUCCESS") {
            $("#conversation").append(s[1]);
            height = $("#mCSB_1").height();
            //$("#gametxcontent").hide();
            $("#mCSB_1").animate({
                scrollTop: 0
            });
        }
    }
});

transactionDice = () => {
    $("#dice_result_list").html("");
    $.ajax({
        type: "POST",
        url: "/transaction-dice",
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    info = JSON.parse(s[1]);
                    for (let i = info.length - 1; i >= 0; i--) {
                        if (info[i].total >= 11 && info[i].total <= 18) {
                            if (i == 0) {
                                $("#dice_result_list").append(`<li>
                                <input type="hidden" value="` + info[i].session_dice + `" id="txtTransaction_` + info[i].id + `"/>
                                <textarea id="txtObjectUser_` + info[i].id + `" style="display: none">` + info[i].object_user + `</textarea>
                                <input type="hidden" id="txtTransTime_` + info[i].id + `"  value = "` + info[i].lastupdate_date + `"/>
                                <input type="hidden" id="txtType` + info[i].id + `"  value = "` + info[i].type + `"/>
                                <input type="hidden" id="txtTotal` + info[i].id + `"  value = "` + info[i].total + `"/>
                                <input type="hidden" id="txtNumber_1_` + info[i].id + `"  value = "` + info[i].number1 + `"/>
                                <input type="hidden" id="txtNumber_2_` + info[i].id + `"  value = "` + info[i].number2 + `"/>
                                <input type="hidden" id="txtNumber_3_` + info[i].id + `"  value = "` + info[i].number3 + `"/>
                                <a href="javascript:getTransactionDice(` + info[i].id + `);" title="#` + info[i].session_dice +
                                    ` Tài (` + info[i].number1 + ` + ` + info[i].number2 + ` + ` + info[i].number3 + `)">
                                    <img src="/minigame/dicegame/img/ico-black-active.png">
                                </a>
                                </li>`);
                            } else {
                                $("#dice_result_list").append(`<li>
                                <input type="hidden" value="` + info[i].session_dice + `" id="txtTransaction_` + info[i].id + `"/>
                                <textarea id="txtObjectUser_` + info[i].id + `" style="display: none">` + info[i].object_user + `</textarea>
                                <input type="hidden" id="txtTransTime_` + info[i].id + `"  value = "` + info[i].lastupdate_date + `"/>
                                <input type="hidden" id="txtType` + info[i].id + `"  value = "` + info[i].type + `"/>
                                <input type="hidden" id="txtTotal` + info[i].id + `"  value = "` + info[i].total + `"/>
                                <input type="hidden" id="txtNumber_1_` + info[i].id + `"  value = "` + info[i].number1 + `"/>
                                <input type="hidden" id="txtNumber_2_` + info[i].id + `"  value = "` + info[i].number2 + `"/>
                                <input type="hidden" id="txtNumber_3_` + info[i].id + `"  value = "` + info[i].number3 + `"/>
                                <a href="javascript:getTransactionDice(` + info[i].id + `);" title="#` + info[i].session_dice +
                                    ` Tài (` + info[i].number1 + ` + ` + info[i].number2 + ` + ` + info[i].number3 + `)">
                                    <img src="/minigame/dicegame/img/ico-black.png">
                                </a>
                                </li>`);;
                            }
                        } else {
                            if (i == 0) {
                                $("#dice_result_list").append(`<li>
                                <input type="hidden" value="` + info[i].session_dice + `" id="txtTransaction_` + info[i].id + `"/>
                                <textarea id="txtObjectUser_` + info[i].id + `" style="display: none">` + info[i].object_user + `</textarea>
                                <input type="hidden" id="txtTransTime_` + info[i].id + `"  value = "` + info[i].lastupdate_date + `"/>
                                <input type="hidden" id="txtType` + info[i].id + `"  value = "` + info[i].type + `"/>
                                <input type="hidden" id="txtTotal` + info[i].id + `"  value = "` + info[i].total + `"/>
                                <input type="hidden" id="txtNumber_1_` + info[i].id + `"  value = "` + info[i].number1 + `"/>
                                <input type="hidden" id="txtNumber_2_` + info[i].id + `"  value = "` + info[i].number2 + `"/>
                                <input type="hidden" id="txtNumber_3_` + info[i].id + `"  value = "` + info[i].number3 + `"/>
                                <a href="javascript:getTransactionDice(` + info[i].id + `);" title="#` + info[i].session_dice +
                                    ` Xỉu (` + info[i].number1 + ` + ` + info[i].number2 + ` + ` + info[i].number3 + `)">
                                    <img src="/minigame/dicegame/img/ico-white-active.png">
                                </a>
                                </li>`);
                            } else {
                                $("#dice_result_list").append(`<li>
                                <input type="hidden" value="` + info[i].session_dice + `" id="txtTransaction_` + info[i].id + `"/>
                                <textarea id="txtObjectUser_` + info[i].id + `" style="display: none">` + info[i].object_user + `</textarea>
                                <input type="hidden" id="txtTransTime_` + info[i].id + `"  value = "` + info[i].lastupdate_date + `"/>
                                <input type="hidden" id="txtType` + info[i].id + `"  value = "` + info[i].type + `"/>
                                <input type="hidden" id="txtTotal` + info[i].id + `"  value = "` + info[i].total + `"/>
                                <input type="hidden" id="txtNumber_1_` + info[i].id + `"  value = "` + info[i].number1 + `"/>
                                <input type="hidden" id="txtNumber_2_` + info[i].id + `"  value = "` + info[i].number2 + `"/>
                                <input type="hidden" id="txtNumber_3_` + info[i].id + `"  value = "` + info[i].number3 + `"/>
                                <a href="javascript:getTransactionDice(` + info[i].id + `);" title="#` + info[i].session_dice +
                                    ` Xỉu (` + info[i].number1 + ` + ` + info[i].number2 + ` + ` + info[i].number3 + `)">
                                    <img src="/minigame/dicegame/img/ico-white.png">
                                </a>
                                </li>`);;
                            }
                        }
                    }
                } else {
                    window.location.href = "/account";
                }
            }
        }
    });
}

getTransactionDice = (idTransaction) => {
    $("#phien-info").html("");
    $("#tbodyO").html("");
    $("#tbodyU").html("");
    $("#total_li_O").html("");
    $("#total_li_U").html("");
    $("#divDices").html("");

    let txtTransaction = $("#txtTransaction_" + idTransaction).val();
    let objectUser = JSON.parse($("#txtObjectUser_" + idTransaction).val());
    let txtTransTime = $("#txtTransTime_" + idTransaction).val();
    let txtType = $("#txtType" + idTransaction).val();
    let txtTotal = $("#txtTotal" + idTransaction).val();
    let txtNumber_1 = $("#txtNumber_1_" + idTransaction).val();
    let txtNumber_2 = $("#txtNumber_2_" + idTransaction).val();
    let txtNumber_3 = $("#txtNumber_3_" + idTransaction).val();

    $("#divDices").append(`<div class="dice dice` + txtNumber_1 + `"></div>
    <div class="dice dice` + txtNumber_2 + `"></div>
    <div class="dice dice` + txtNumber_3 + `"></div>
    <span class="total" id="spanTotal">` + txtTotal + `</span>`);

    if (txtType == "U") {
        $("#div-phien").prop("class", "phien-kq kq-xiu");
    } else {
        $("#div-phien").prop("class", "phien-kq kq-tai");
    }

    $("#phien-info").append(`Phiên
    <span>#` + txtTransaction + `</span> (` + txtTransTime + `)`);
    let arrayO = [];
    let arrayU = [];
    let totalO = 0;
    let totalRO = 0;
    let totalU = 0;
    let totalRU = 0;
    for (let i = 0; i < objectUser.length; i++) {
        if (objectUser[i].type == "U") {
            arrayU.push(objectUser[i]);
        } else {
            arrayO.push(objectUser[i]);
        }
    }

    for (let i = 0; i < arrayO.length; i++) {
        totalO = totalO + parseInt(arrayO[i].point);
        totalRO = totalRO + parseInt(arrayO[i].returnCoin);
        $("#tbodyO").append(`<tr>
        <td>` + arrayO[i].timeput + `</td>
        <td>
            <div title="` + arrayO[i].name + `">` + arrayO[i].name + `</div>
        </td>
        <td class="text-right-tx">` + arrayO[i].point.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
        <td class="text-right-tx">` + arrayO[i].returnCoin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
        </tr>`);
    }

    for (let i = 0; i < arrayU.length; i++) {
        totalU = totalU + parseInt(arrayU[i].point);
        totalRU = totalRU + parseInt(arrayU[i].returnCoin);
        $("#tbodyU").append(`<tr>
        <td>` + arrayU[i].timeput + `</td>
        <td>
            <div title="` + arrayU[i].name + `">` + arrayU[i].name + `</div>
        </td>
        <td class="text-right-tx">` + arrayU[i].point.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
        <td class="text-right-tx">` + arrayU[i].returnCoin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
        </tr>`);
    }

    $("#total_li_O").append(`<ul>
    <li>Tổng
        <span> (Cược/Hoàn)</span>
    </li>
    <li>` + totalO.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</li>
    <li>` + totalRO.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</li>
    </ul>`);

    $("#total_li_U").append(`<ul>
    <li>Tổng
        <span> (Cược/Hoàn)</span>
    </li>
    <li>` + totalU.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</li>
    <li>` + totalRU.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</li>
    </ul>`);
    $("#table-session").show();
}

$(document).ready(() => {
    $("#conversation").html("");
    transactionDice();

    $("#btnCloseTrans").click(() => {
        $("#table-session").hide();
    });

    $.ajax({
        type: "POST",
        url: "/account-info",
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    info = JSON.parse(s[1]);
                    $("#mainHeader").show();
                    $("#bBody").show();
                    $("#lblUserMoney").html(info[0].point.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    $(".name-header").html(info[0].name);
                    $(".id-header").html("ID: " + info[0].id);
                } else {
                    window.location.href = "/account";
                }
            }
        }
    });

    $.ajax({
        type: "POST",
        url: "/log-chat",
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    $("#conversation").append(s[1]);
                } else {
                    console.log(data);
                }
            }
        }
    });

    $.ajax({
        type: "POST",
        url: "/total-dice-point",
        dataType: "text",
        success: function (data) {
            s = data.split("|");
            if (s.length >= 2) {
                if (s[0] == "SUCCESS") {
                    if (s[2] != undefined && s[2] != "undefined" && s[2] != "0") {
                        $("#lblTai").html(s[2].toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        $("#totalPointO").val(s[2].toString());
                    }
                    if (s[3] != undefined && s[3] != "undefined" && [3] != "0") {
                        $("#lblXiu").html(s[3].toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        $("#totalPointU").val(s[3].toString());
                    }
                } else {
                    console.log(data);
                }
            }
        }
    });

    $("#btnCancelCoin").click(() => {
        $("#bidO").val(undefined);
        $("#bidO_val").val(undefined);

        $("#bidU").val(undefined);
        $("#bidU_val").val(undefined);
        hideButtonCuoc();
    });

    $("#icon-openchattaixiu").click(function () {
        // setTimeout(autoScrolling, 100);
        $("#chattaixiu").toggle();
        height = $("#mCSB_1_container").height();
        //$("#gametxcontent").hide();
        $("#mCSB_1").animate({
            scrollTop: height
        });
    });

    $("#close_mini_chat").click(() => {
        $("#chattaixiu").hide();
    });

    $("#btn1k").click(() => {
        let bidO = $("#bidO_0");
        let bidU = $("#bidU_0");
        let bidO_val = $("#bidO_val");
        let bidU_val = $("#bidU_val");
        if (bidO.val() == "1") {
            $("#bidO").val($("#btn1k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidO_val.val($("#btn1k").attr("data-money"));
        }

        if (bidU.val() == "1") {
            $("#bidU").val($("#btn1k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidU_val.val($("#btn1k").attr("data-money"));
        }
    });


    $("#btn5k").click(() => {
        let bidO = $("#bidO_0");
        let bidU = $("#bidU_0");
        let bidO_val = $("#bidO_val");
        let bidU_val = $("#bidU_val");
        if (bidO.val() == "1") {
            $("#bidO").val($("#btn5k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidO_val.val($("#btn5k").attr("data-money"));
        }

        if (bidU.val() == "1") {
            $("#bidU").val($("#btn5k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidU_val.val($("#btn5k").attr("data-money"));
        }
    });


    $("#btn10k").click(() => {
        let bidO = $("#bidO_0");
        let bidU = $("#bidU_0");
        let bidO_val = $("#bidO_val");
        let bidU_val = $("#bidU_val");
        if (bidO.val() == "1") {
            $("#bidO").val($("#btn10k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidO_val.val($("#btn10k").attr("data-money"));
        }

        if (bidU.val() == "1") {
            $("#bidU").val($("#btn10k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidU_val.val($("#btn10k").attr("data-money"));
        }
    });


    $("#btn50k").click(() => {
        let bidO = $("#bidO_0");
        let bidU = $("#bidU_0");
        let bidO_val = $("#bidO_val");
        let bidU_val = $("#bidU_val");
        if (bidO.val() == "1") {
            $("#bidO").val($("#btn50k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidO_val.val($("#btn50k").attr("data-money"));
        }

        if (bidU.val() == "1") {
            $("#bidU").val($("#btn50k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidU_val.val($("#btn50k").attr("data-money"));
        }
    });


    $("#btn100k").click(() => {
        let bidO = $("#bidO_0");
        let bidU = $("#bidU_0");
        let bidO_val = $("#bidO_val");
        let bidU_val = $("#bidU_val");
        if (bidO.val() == "1") {
            $("#bidO").val($("#btn100k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidO_val.val($("#btn100k").attr("data-money"));
        }

        if (bidU.val() == "1") {
            $("#bidU").val($("#btn100k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidU_val.val($("#btn100k").attr("data-money"));
        }
    });


    $("#btn500k").click(() => {
        let bidO = $("#bidO_0");
        let bidU = $("#bidU_0");
        let bidO_val = $("#bidO_val");
        let bidU_val = $("#bidU_val");
        if (bidO.val() == "1") {
            $("#bidO").val($("#btn500k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidO_val.val($("#btn500k").attr("data-money"));
        }

        if (bidU.val() == "1") {
            $("#bidU").val($("#btn500k").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidU_val.val($("#btn500k").attr("data-money"));
        }
    });


    $("#btn1M").click(() => {
        let bidO = $("#bidO_0");
        let bidU = $("#bidU_0");
        let bidO_val = $("#bidO_val");
        let bidU_val = $("#bidU_val");
        if (bidO.val() == "1") {
            $("#bidO").val($("#btn1M").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidO_val.val($("#btn1M").attr("data-money"));
        }

        if (bidU.val() == "1") {
            $("#bidU").val($("#btn1M").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidU_val.val($("#btn1M").attr("data-money"));
        }
    });

    $("#btn2M").click(() => {
        let bidO = $("#bidO_0");
        let bidU = $("#bidU_0");
        let bidO_val = $("#bidO_val");
        let bidU_val = $("#bidU_val");
        if (bidO.val() == "1") {
            $("#bidO").val($("#btn2M").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidO_val.val($("#btn2M").attr("data-money"));
        }

        if (bidU.val() == "1") {
            $("#bidU").val($("#btn2M").attr("data-money").toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidU_val.val($("#btn2M").attr("data-money"));
        }
    });

    $("#btnAllCoin").click(() => {
        let bidO = $("#bidO_0");
        let bidU = $("#bidU_0");
        let bidO_val = $("#bidO_val");
        let bidU_val = $("#bidU_val");
        let totalCoin = $("#lblUserMoney").html().split(",").join("")
            .split("Bạc: ").join("");
        if (bidO.val() == "1") {
            $("#bidO").val(totalCoin.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidO_val.val(totalCoin);
        }

        if (bidU.val() == "1") {
            $("#bidU").val(totalCoin.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            bidU_val.val(totalCoin);
        }
    });

    showButtonCuoc = () => {
        $(".cuoc-wrap").addClass("show");
        $(".cuoc-wrap").removeClass("hide");
    }

    hideButtonCuoc = () => {
        $(".cuoc-wrap").addClass("hide");
        $(".cuoc-wrap").removeClass("show");
    }

    $("#bidO").focusin(() => {
        $("#bidO_0").val(1);
        $("#bidU_0").val("");
        showButtonCuoc();
    });

    $("#bidU").focusin(() => {
        $("#bidU_0").val(1);
        $("#bidO_0").val("");
        showButtonCuoc();
    });

    $("#button_submit_chat").click(() => {
        let message = $("#dataMessage").val();
        socket.emit("client-send-message", message);
        $("#dataMessage").val("");
        $("#dataMessage").focus();
    });

    $('#dataMessage').keypress(function (e) {
        if (e.which === 13) {
            $(this).blur();
            $('#button_submit_chat').click();
        }
    });

    $('input.currency-bio').keyup(function (event) {
        // skip for arrow keys
        if (event.which >= 37 && event.which <= 40) return;
        // format number
        $(this).val(function (index, value) {
            return value
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
        var value = $(this).val().replace(/\,/g, '');
        $("#bidO_val").val(value);
    });

    $('input.currency-biu').keyup(function (event) {
        // skip for arrow keys
        if (event.which >= 37 && event.which <= 40) return;
        // format number
        $(this).val(function (index, value) {
            return value
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
        var value = $(this).val().replace(/\,/g, '');
        $("#bidU_val").val(value);
    });

    $("#close-huongdantaixiu").click(() => {
        //$("#gametxcontent").show();
        $("#taixiu-huongdan").hide();
    });


    $("#modalfaq").click(() => {
        $("#taixiu-huongdan").show();
    });

    $("#btnPutCoin").click(() => {
        let coinFinancial = $("#bidO_val").val().trim();
        let coinCollapse = $("#bidU_val").val().trim();
        //if (parseInt(coinFinancial) > 0 || parseInt(coinCollapse) > 0) {
        // socket.emit("client-send-put-dice", {
        //     "coinFinancial": coinFinancial,
        //     "coinCollapse": coinCollapse
        // });
        let param = {
            "coinFinancial": coinFinancial,
            "coinCollapse": coinCollapse
        };

        let json = JSON.stringify(param);

        $.ajax({
            type: "POST",
            url: "/put-dice",
            data: {
                param: json
            },
            dataType: "text",
            success: function (data) {
                s = data.split("|");
                if (s.length >= 2) {
                    if (s[0] == "SUCCESS") {
                        $("#lblUserMoney").html(s[1].toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        showMessage("Đặt thành công");

                        $("#bidO").val("");

                        $("#bidO_val").val("");;

                        $("#totalPointO").val(s[2].toString());

                        $("#lblTai").html(s[2].toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ","));

                        $("#bidU").val("");

                        $("#bidU_val").val("");;

                        $("#totalPointU").val(s[3].toString());

                        $("#lblXiu").html(s[3].toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ","));

                    } else if (s[0] == "ERROR") {
                        if (s[1] == "-5") {
                            window.location.href = "/account";
                        } else {
                            showMessage(s[1]);
                        }
                    } else {
                        alert(data);
                    }
                }
            }
        });
        // }
    });

    $("#taixiu-bangvinhdanh").click(() => {
        $("#ltsTop").html("");
        $.ajax({
            type: "POST",
            url: "/dice-top",
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    $("#ltsTop").append(`<tr> 
                            <td> <span>` + (i + 1) + `</span> </td> 
                            <td style="text-align: center; color: white"> ` + data[i].name + `</td>
                            <td style="text-align: center; color: white"> ` + (data[i].point * 1.98).toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
                            </tr>`);
                }
            }
        });

        $("#taixiu-bangvinhdanh-div").toggle();
    });

    $("#close-taixiubangvinhdanh").click(() => {
        $("#taixiu-bangvinhdanh-div").toggle();
    });

    // $("#chat_scroll").mCustomScrollbar({
    //     theme: "minimal-dark",
    //     scrollbarPosition: "outside",
    //     scrollButtons: {
    //         enable: true
    //     }
    // });

    // function autoScrolling() {
    //     $('#chat_scroll').mCustomScrollbar('scrollTo', 'bottom');
    // }
    // $("#icon-openchattaixiu").click(function () {
    //     setTimeout(autoScrolling, 100);
    // });

    $("#myDIV_mCSB_6").niceScroll();
    $("#myDIV_mCSB_6_VinhDanh").niceScroll();
    $("#mCSB_1").niceScroll();
    $("#bg_table_phien_O").niceScroll();
    $("#bg_table_phien_U").niceScroll();
});