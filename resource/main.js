//tableの取得
let table = document.getElementById('mainTable');

//入力データ保持用配列
let data = {
    dow : [], //曜日の値
    start : [], // 開始時刻
    end : [], //終了時刻
    plan : []  //計画名
}

//一件分のデータ用配列
let allData = {
    dow : [],
    start : [],
    end : [],
    plan : []
}

// 時間軸の生成
function timeBar() {
    console.log(data);
    let time = [];
    for(let i = 5; i < 24; i++) {
        for(let j = 0; j <= 45; j = j + 15) {
            let newRow = table.insertRow();
            let cell = newRow.insertCell(-1);
            if (j === 0) {
                time.push(i + ":00");
                if (i < 10) {
                    cell.innerHTML =  "0" + i + ":00";
                } else {
                    cell.innerHTML = i + ":00";
                }
            } else {
                time.push(i + ":" + j);
                if (i < 10) {
                    cell.innerHTML = "0" + i + ":" + j;
                } else {
                    cell.innerHTML = i + ":" + j;
                }
            }
            //空セルの生成
            for(let x = 0; x < 7; x++) {
                newRow.insertCell(-1);
            }
        }
    }

    for(let l = 0; l < 5; l++) {
        for(let k = 0; k <= 45; k = k + 15) {
            let newRow = table.insertRow();
            let cell = newRow.insertCell(-1);
            if (k === 0) {
                time.push(l + ":00");
                cell.innerHTML = "0" + l + ":00";
            } else {
                time.push(l + ":" + k);
                cell.innerHTML = "0" + l + ":" + k;
            }

            // 空セルの生成
            for(let x = 0; x < 7; x++) {
                newRow.insertCell(-1);

            }
        }
    }

    //予定の保持
    for(let f = 0; f < data.plan.length; f++) {
        allData.dow = data.dow[f];
        allData.start = data.start[f];
        allData.end = data.end[f];
        allData.plan = data.plan[f];
        writePlan(allData);
    }

    table.rows[1].cells[6].innerHTML = "わーい";


}

// 列の取得
function getDow(dow) {
    console.log('getDOW');
    console.log(dow);
    if(dow === "月曜日") {
        return 1;
    } else if(dow === "火曜日") {
        return 2;
    } else if(dow === "水曜日") {
        return 3;
    } else if(dow === "木曜日") {
        return 4;
    } else if(dow === "金曜日") {
        return 5;
    } else if(dow === "土曜日") {
        return 6;
    } else {
        return 7;
    }
}

//予定の生成
function writePlan(allData) {
    console.log('writePlan')
    const start = allData.start;
    const splitStart = String(start).split(":");
    const startHour = splitStart[0];
    const startMinutes = splitStart[1];

    const splitEnd = String(allData.end).split(":");
    const endHour = splitEnd[0];
    const endMinutes = splitEnd[1];

    let dowNum = getDow(allData.dow);
    console.log('dowNum:' + dowNum);

    let startHour2 = correspondenceHour(startHour);
    let startMinutes2 = correspondenceMinutes(startMinutes);

    let planNum = startHour2 * 4 + startMinutes2;
    console.log('planNum:' + planNum);

    //table.rows[planNum].cells[dowNum].innerText = allData.plan;
    //table.rows[planNum].cells[1].innerHTML = "わーい";
}

//時、分のセル位置に対応させるための変更
function correspondenceHour(hour) {
    console.log('cHour')
    // switch(hour) {
    //     case "00":
    //         return hour = 0;
    //     case "01":
    //         return hour = 1;
    //     case "02":
    //         return hour = 2;
    //     case "03":
    //         return hour = 3;
    //     case "04":
    //         return hour = 4;
    //     case "05":
    //         return hour = 5;
    //     case "06":
    //         return hour = 6;
    //     case "07":
    //         return hour = 7;
    //     case "08":
    //         return hour = 8;
    //     case "09":
    //         return hour = 9;
    //     default:
    //         return hour;
    // }

    if(24 > hour && hour > 4) {
        hour = hour - 5;
    } else {
        hour = hour + 19;
    }

    return hour;
}

function correspondenceMinutes(minutes) {
    console.log('cMinutes');
    switch(minutes) {
        case "00":
            minutes = 0;
            break;
        case "15":
            minutes = 1;
            break;
        case "30":
            minutes = 2;
            break;
        case "45":
            minutes = 3;
            break;
    }
    return minutes;
}

// 決定ボタンを押したときの動作
function save() {
    console.log('save');
    // 要素の取得
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const planName = document.getElementById("planName").value;
    const dow1 = document.getElementById("dow");
    const dow2 = dow1.selectedIndex;
    const dow = dow1.options[dow2].value;

    console.log(dow, startTime, endTime,planName);

    // DB追加
    putData({
        dow: dow,
        start: startTime,
        end: endTime,
        plan: planName
    });

    allData.dow = dow;
    allData.start = startTime;
    allData.end = endTime;
    allData.plan = planName;

    console.log(allData);

    //ここでデータベースに追加
    saveData(allData);

    writePlan(allData);

    return false;
}

//取得したデータの保存
function saveData(allData) {
    data.dow.push(allData.dow);
    data.start.push(allData.start);
    data.end.push(allData.end);
    data.plan.push(allData.plan);

    //データベースへの書き込み

}

// リロードした時の読み込みなおし
window.onload = function () {
    timeBar();
    // writePlan(allData);
    return false;
}


const main = () => {
    timeBar();
    document.getElementById('mainForm').onsubmit = save;
}

main();