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

    // table.rows[2].cells[6].innerHTML = "わーい";


}

// 列の取得
function getDow(dow) {
    if(dow === "mon") {
        return 1;
    } else if(dow === "tue") {
        return 2;
    } else if(dow === "wed") {
        return 3;
    } else if(dow === "thu") {
        return 4;
    } else if(dow === "fri") {
        return 5;
    } else if(dow === "sat") {
        return 6;
    } else if(dow === "sun") {
        return 7;
    } else {

    }
}

// DBからすべてのスケジュールを読み込み、書き込む
async function readDBWriteSchedule() {
    // putData({
    //     dow: 'mon',
    //     start: '9:00',
    //     end: '10:00',
    //     plan: 'sample'
    // });
    // putData({
    //     dow: 'mon',
    //     start: '11:00',
    //     end: '12:00',
    //     plan: 'sample'
    // });
    // putData({
    //     dow: 'tue',
    //     start: '9:00',
    //     end: '10:00',
    //     plan: 'sample'
    // });
    const scheduleData = await db.schedule.toArray();
    for (let i = 0; i < scheduleData.length; i++) {
        writePlan(scheduleData[i]);
    }
}

//予定の生成
function writePlan(allData) {
    const start = allData.start;
    const splitStart = String(start).split(":");
    const startHour = splitStart[0];
    const startMinutes = splitStart[1];

    const splitEnd = String(allData.end).split(":");
    const endHour = splitEnd[0];
    const endMinutes = splitEnd[1];

    let dowNum = getDow(allData.dow);

    let startHour2 = correspondenceHour(startHour);
    let startMinutes2 = correspondenceMinutes(startMinutes);

    let endHour2 = correspondenceHour(endHour);
    let endMinutes2 = correspondenceMinutes(endMinutes);

    let planNum = startHour2 * 4 + startMinutes2 + 1;
    let endNum = endHour2 * 4 + endMinutes2 + 1;

    const newText = document.createTextNode(allData.plan);
    table.rows[planNum].cells[dowNum].appendChild(newText);
    
    //列の結合
    table.rows[planNum].cells[dowNum].rowSpan = endNum - planNum + 1;
    //右列の削除
    for(let i = planNum; i < endNum; i++) {
         table.rows[i+1].deleteCell(dowNum+1);
    }
}

//時、分のセル位置に対応させるための変更
function correspondenceHour(hour) {
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
    // 要素の取得
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const planName = document.getElementById("planName").value;
    const dow1 = document.getElementById("dow");
    const dow2 = dow1.selectedIndex;
    const dow = dow1.options[dow2].value;

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

    // saveData(allData);

    writePlan(allData);

    return false;
}

//取得したデータの保存
// function saveData(allData) {
//     data.dow.push(allData.dow);
//     data.start.push(allData.start);
//     data.end.push(allData.end);
//     data.plan.push(allData.plan);

//     //データベースへの書き込み

// }

//tableの全削除
function deleteAll() {
    for(let i = 0; i < 96; i++) {
        table.deleteRow(-1);
    }
}

// リロードした時の読み込みなおし
window.onload = function () {
    deleteAll();
    timeBar();
    return false;
}


const main = () => {
    timeBar();
    document.getElementById('mainForm').onsubmit = save;
}

main();

readDBWriteSchedule();