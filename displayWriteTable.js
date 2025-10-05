export function displayWriteTable(randomNumberArray) {
  const TBL = document.getElementById("calc-table");
  const [hijosu, josu, sho, amari] = randomNumberArray;

  // テーブルの行数を取得
  const rows = TBL.rows.length;

  // モードを取得
  const mode = document.getElementById("mode_select").value;

  // テーブルをクリア（1行目は残す）
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < 13; j++) {
      if (i !== 1 || j !== 5) { // 「）」記号以外をクリア
        TBL.rows[i].cells[j].innerText = "";
      }
      TBL.rows[i].cells[j].style.backgroundColor = "";
      TBL.rows[i].cells[j].style.borderBottom = ""; // 罫線もクリア
      TBL.rows[i].cells[j].classList.remove("droppable-elem");
    }
  }

  // 数値を文字列化して配列に変換（小数点も含む）
  const josuArray = String(josu).split("");
  const hijosuArray = String(hijosu).split("");

  // 除数の表示（左側、0～4列目）
  // 列配置: [0][.][2][.][4]
  // 右詰めで配置（小数点がある場合は小数点の位置を固定）

  if (josuArray.includes(".")) {
    // 小数点がある場合、小数点を列3に固定
    const pointIndex = josuArray.indexOf(".");
    const integerPart = josuArray.slice(0, pointIndex);
    const decimalPart = josuArray.slice(pointIndex + 1);

    // 小数点を列3に配置
    TBL.rows[1].cells[3].innerText = ".";

    // 整数部を右詰めで列0, 2に配置
    if (integerPart.length === 2) {
      TBL.rows[1].cells[0].innerText = integerPart[0];
      TBL.rows[1].cells[2].innerText = integerPart[1];
    } else if (integerPart.length === 1) {
      TBL.rows[1].cells[2].innerText = integerPart[0];
    }

    // 小数部を列4に配置
    if (decimalPart.length > 0) {
      TBL.rows[1].cells[4].innerText = decimalPart[0];
    }
  } else {
    // 小数点がない場合、右端から詰めて配置
    if (josuArray.length === 2) {
      TBL.rows[1].cells[2].innerText = josuArray[0];
      TBL.rows[1].cells[4].innerText = josuArray[1];
    } else if (josuArray.length === 1) {
      TBL.rows[1].cells[4].innerText = josuArray[0];
    }
  }

  // 被除数の表示（右側、6～12列目）
  // 列配置: [6][.][8][.][10][.][12]
  // 左詰めで配置（小数点がある場合は適切な位置に配置）

  let hijosuCol = 6;
  for (let i = 0; i < hijosuArray.length; i++) {
    if (hijosuArray[i] === ".") {
      // 小数点の場合、奇数列に配置
      const decimalCol = hijosuCol - 1; // 奇数列（7, 9, 11）
      if (decimalCol >= 7 && decimalCol <= 11) {
        TBL.rows[1].cells[decimalCol].innerText = ".";
      }
    } else {
      // 数字の場合、偶数列に配置
      if (hijosuCol <= 12) {
        TBL.rows[1].cells[hijosuCol].innerText = hijosuArray[i];
        hijosuCol += 2;
      }
    }
  }

  // 商の桁数を計算（小数点を除く）
  const shoStr = String(sho);
  const shoDigits = shoStr.replace(".", "").length;

  // 被除数の桁数を計算（小数点を除く）
  const hijosuDigits = hijosuArray.filter(char => char !== ".").length;

  // 除数の桁数を計算（小数点を除く）
  const josuDigits = josuArray.filter(char => char !== ".").length;

  // 被除数の実際の配置位置（小数点を除いた数字のみ）を取得
  const hijosuPositions = [];
  let currentCol = 6;
  for (let i = 0; i < hijosuArray.length; i++) {
    if (hijosuArray[i] !== ".") {
      hijosuPositions.push(currentCol);
      currentCol += 2;
    }
  }

  // モード別の処理
  // 小数のわり算（mode 10以降）も各パターンに応じてハードコーディング
  if (parseInt(mode) >= 10) {
    // 商の文字列を取得（mode 30, 31で使用）
    const shoStr = String(sho);

    console.log("Mode:", mode, "Rows:", rows, "Sho:", sho, "Hijosu:", hijosu, "Josu:", josu);

    switch (mode) {
      case "10": // ○○.○÷○（わり進み2回）例: 11.5÷5=2.3
        // i=0: j=8,10（商）
        // i=2: j=6,8
        // i=3: j=8,10
        // i=4: j=8,10
        // i=5: j=10
        console.log("Mode 10 - Setting drop areas");
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            if ((i === 0 && (j === 8 || j === 10)) || // 商: j=8,10
                (i === 2 && (j === 6 || j === 8)) || // i=2: j=6,8
                (i === 3 && (j === 8 || j === 10)) || // i=3: j=8,10
                (i === 4 && (j === 8 || j === 10)) || // i=4: j=8,10
                (i === 5 && j === 10)) { // i=5: j=10
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線
        if (TBL.rows[2]) {
          for (let j = 6; j <= 10; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (TBL.rows[4]) {
          for (let j = 8; j <= 10; j += 2) {
            if (TBL.rows[4].cells[j]) {
              TBL.rows[4].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "11": // ○○○.○÷○○（わり進み2回）例: 115.5÷55=2.1
        // i=0: j=10,12（商）
        // i=2: j=6,8,10
        // i=3,4: j=8,10,12
        // i=5: j=12
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            if ((i === 0 && (j === 10 || j === 12)) || // 商: j=10,12
                (i === 2 && (j === 6 || j === 8 || j === 10)) || // i=2: j=6,8,10
                ((i === 3 || i === 4) && (j === 8 || j === 10 || j === 12)) || // i=3,4: j=8,10,12
                (i === 5 && j === 12)) { // i=5: j=12
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線
        if (TBL.rows[2]) {
          for (let j = 6; j <= 12; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (TBL.rows[4]) {
          for (let j = 8; j <= 12; j += 2) {
            if (TBL.rows[4].cells[j]) {
              TBL.rows[4].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "20": // ○.○÷○.○（わり進み1回）例: 4.8÷1.2=4
        // i=0: j=8（商）
        // i=2: j=6,8
        // i=3: j=8
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            if ((i === 0 && j === 8) || // 商: j=8
                (i === 2 && (j === 6 || j === 8)) || // i=2: j=6,8
                (i === 3 && j === 8)) { // i=3: j=8
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線
        if (TBL.rows[2]) {
          for (let j = 6; j <= 8; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "21": // ○○.○÷○.○（わり進み1回）例: 12.8÷1.6=8
        // i=0: j=10（商）
        // i=2: j=6,8,10
        // i=3: j=10
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            if ((i === 0 && j === 10) || // 商: j=10
                (i === 2 && (j === 6 || j === 8 || j === 10)) || // i=2: j=6,8,10
                (i === 3 && j === 10)) { // i=3: j=10
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線
        if (TBL.rows[2]) {
          for (let j = 6; j <= 10; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "22": // ○○.○÷○.○（わり進み2回）例: 18.9÷1.5=12.6
        // i=0: j=8,10（商）
        // i=2: j=6,8
        // i=3,4: j=6,8,10
        // i=5: j=10
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            if ((i === 0 && (j === 8 || j === 10)) || // 商: j=8,10
                (i === 2 && (j === 6 || j === 8)) || // i=2: j=6,8
                ((i === 3 || i === 4) && (j === 6 || j === 8 || j === 10)) || // i=3,4: j=6,8,10
                (i === 5 && j === 10)) { // i=5: j=10
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線
        if (TBL.rows[2]) {
          for (let j = 6; j <= 10; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (TBL.rows[4]) {
          for (let j = 6; j <= 10; j += 2) {
            if (TBL.rows[4].cells[j]) {
              TBL.rows[4].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "23": // ○○.○÷○.○（わり進み2回）例: 22.5÷1.5
        // i=0: j=10,12（商）
        // i=2: j=6,8,10
        // i=3,4: j=8,10,12
        // i=5: j=12
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            if ((i === 0 && (j === 10 || j === 12)) || // 商: j=10,12
                (i === 2 && (j === 6 || j === 8 || j === 10)) || // i=2: j=6,8,10
                ((i === 3 || i === 4) && (j === 8 || j === 10 || j === 12)) || // i=3,4: j=8,10,12
                (i === 5 && j === 12)) { // i=5: j=12
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線
        if (TBL.rows[2]) {
          for (let j = 6; j <= 12; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (TBL.rows[4]) {
          for (let j = 8; j <= 12; j += 2) {
            if (TBL.rows[4].cells[j]) {
              TBL.rows[4].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "30": // わり進む（割り切れるまで）
        // 商の桁数に応じて動的に処理
        // 1回わり進み：商2桁
        // 2回わり進み：商3桁
        // 3回わり進み：商4桁
        const shoDigitsMode30 = shoStr.replace(".", "").length;
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            // 商の配置
            if (i === 0) {
              if ((shoDigitsMode30 === 2 && (j === 6 || j === 8)) ||
                  (shoDigitsMode30 === 3 && (j === 6 || j === 8 || j === 10)) ||
                  (shoDigitsMode30 === 4 && (j === 6 || j === 8 || j === 10 || j === 12))) {
                TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
                TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
              }
            }
            // 筆算部分
            if ((i === 2 || i === 3) && (j === 6 || j === 8)) { // 1回目：2桁分
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
            if (shoDigitsMode30 >= 2 && rows > 4 && (i === 4 || i === 5) && (j === 8 || j === 10)) { // 2回目：2桁分
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
            if (shoDigitsMode30 >= 3 && rows > 6 && (i === 6 || i === 7) && (j === 10 || j === 12)) { // 3回目：2桁分
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線
        if (TBL.rows[2]) {
          for (let j = 6; j <= 8; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (rows > 4 && TBL.rows[4]) {
          for (let j = 8; j <= 10; j += 2) {
            if (TBL.rows[4].cells[j]) {
              TBL.rows[4].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (rows > 6 && TBL.rows[6]) {
          for (let j = 10; j <= 12; j += 2) {
            if (TBL.rows[6].cells[j]) {
              TBL.rows[6].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "31": // あまり付き（商は整数）
        // 商の桁数に応じて処理、最後の行はあまり（除数の桁数分）
        const shoDigitsMode31 = shoStr.replace(".", "").length;
        const josuDigitsMode31 = josuArray.filter(char => char !== ".").length;

        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            // 商の配置（整数）
            if (i === 0) {
              if ((shoDigitsMode31 === 1 && j === 8) ||
                  (shoDigitsMode31 === 2 && (j === 6 || j === 8))) {
                TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
                TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
              }
            }
            // 筆算部分
            if (shoDigitsMode31 === 1) {
              if ((i === 2 || i === 3) && (j === 6 || j === 8)) { // かける・ひく：2桁分（最後があまり）
                TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
                TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
              }
              // あまりは最後のひく行（3行目）の右端
              if (i === 3 && josuDigitsMode31 === 1 && j === 8) { // 除数1桁なら1桁分
                // 既に設定済み
              } else if (i === 3 && josuDigitsMode31 === 2 && (j === 6 || j === 8)) { // 除数2桁なら2桁分
                // 既に設定済み
              }
            } else if (shoDigitsMode31 === 2) {
              if (((i === 2 || i === 3) && (j === 6 || j === 8)) || // 1回目：2桁分
                  ((i === 4 || i === 5) && (j === 8 || j === 10))) { // 2回目：2桁分
                TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
                TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
              }
              // あまりは最後のひく行（5行目）の右端
              if (i === 5 && josuDigitsMode31 === 1 && j === 10) { // 除数1桁なら1桁分
                // 既に設定済み
              } else if (i === 5 && josuDigitsMode31 === 2 && (j === 8 || j === 10)) { // 除数2桁なら2桁分
                // 既に設定済み
              }
            }
          }
        }
        // 罫線
        if (TBL.rows[2]) {
          for (let j = 6; j <= 8; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (shoDigitsMode31 === 2 && TBL.rows[4]) {
          for (let j = 8; j <= 10; j += 2) {
            if (TBL.rows[4].cells[j]) {
              TBL.rows[4].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      default:
        // その他のモードは汎用的な処理を使用
        break;
    }
    return; // 小数のわり算の場合はここで終了
  }

  // 整数のわり算（mode 0～5）の場合は、wari-hissanと同じロジックを使用
  else if (mode >= "0" && mode <= "5") {
    // 整数のわり算用の特別な処理
    switch (mode) {
      case "0": // （２けた）÷（１けた）商が１けた
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            // 列インデックスの変換（wari-hissanは0-5、wari-hissan2は6-12の偶数列）
            const origCol = (j - 6) / 2 + 3; // 6→3, 8→4, 10→5
            if ((i === 0 && origCol === 4) ||
                (i === 2 && (origCol === 3 || origCol === 4)) ||
                (i === 3 && origCol === 4)) {
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線を追加
        if (TBL.rows[2]) {
          for (let j = 6; j <= 8; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "1": // （２けた）÷（１けた）商が２けた
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            const origCol = (j - 6) / 2 + 3;
            if ((i !== 1 && i !== 5 && (origCol === 3 || origCol === 4)) ||
                (i === 5 && origCol === 4)) {
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線を追加
        if (TBL.rows[2]) {
          for (let j = 6; j <= 8; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (TBL.rows[4]) {
          for (let j = 6; j <= 8; j += 2) {
            if (TBL.rows[4].cells[j]) {
              TBL.rows[4].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "2": // （３けた）÷（１けた）商が２けた
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            const origCol = (j - 6) / 2 + 3;
            if (((i === 0 || i === 3 || i === 4) && (origCol === 4 || origCol === 5)) ||
                (i === 2 && (origCol === 3 || origCol === 4)) ||
                (i === 5 && origCol === 5)) {
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線を追加
        if (TBL.rows[2]) {
          for (let j = 6; j <= 8; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (TBL.rows[4]) {
          for (let j = 8; j <= 10; j += 2) {
            if (TBL.rows[4].cells[j]) {
              TBL.rows[4].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "3": // （２けた）÷（２けた）商が１けた
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            const origCol = (j - 6) / 2 + 3;
            if ((i === 0 && origCol === 4) ||
                ((i === 2 || i === 3) && (origCol === 3 || origCol === 4))) {
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線を追加
        if (TBL.rows[2]) {
          for (let j = 6; j <= 8; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "4": // （３けた）÷（２けた）商が１けた
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            const origCol = (j - 6) / 2 + 3;
            if ((i === 0 && origCol === 5) ||
                (i === 2 && origCol >= 3 && origCol <= 5) ||
                (i === 3 && (origCol === 4 || origCol === 5))) {
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線を追加
        if (TBL.rows[2]) {
          for (let j = 6; j <= 10; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;

      case "5": // （３けた）÷（２けた）商が２けた
        for (let i = 0; i < rows; i++) {
          for (let j = 6; j <= 12; j += 2) {
            const origCol = (j - 6) / 2 + 3;
            if (((i === 0 || i === 5) && (origCol === 4 || origCol === 5)) ||
                (i >= 2 && i <= 4 && origCol >= 3 && origCol <= 5)) {
              TBL.rows[i].cells[j].setAttribute("class", "droppable-elem");
              TBL.rows[i].cells[j].style.backgroundColor = "antiqueWhite";
            }
          }
        }
        // 罫線を追加
        if (TBL.rows[2]) {
          for (let j = 6; j <= 10; j += 2) {
            if (TBL.rows[2].cells[j]) {
              TBL.rows[2].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        if (TBL.rows[4]) {
          for (let j = 8; j <= 10; j += 2) {
            if (TBL.rows[4].cells[j]) {
              TBL.rows[4].cells[j].style.borderBottom = "solid black 2px";
            }
          }
        }
        break;
    }
    return; // 整数のわり算の場合はここで終了
  }

  // 以下は汎用的な処理（上記のモードに該当しない場合）
  // 商の位置（0行目）を設定
  // 商は被除数の桁数と除数の桁数の関係で決まる
  const shoStartCol = hijosuPositions[hijosuDigits - shoDigits] || 6;
  const shoEndCol = hijosuPositions[hijosuDigits - 1] || 12;

  for (let j = shoStartCol; j <= shoEndCol; j += 2) {
    if (j >= 6 && j <= 12) {
      TBL.rows[0].cells[j].setAttribute("class", "droppable-elem");
      TBL.rows[0].cells[j].style.backgroundColor = "antiqueWhite";
    }
  }

  // 筆算の計算過程でドロップ可能な場所と罫線を設定
  // わり算の筆算では、各商の桁に対して「かける」行と「ひく」行のペアがある
  // 例: 商が2桁の場合
  //   2行目: 1桁目の「かける」行
  //   3行目: 1桁目の「ひく」行（2行目と同じドロップエリア）
  //   4行目: 2桁目の「かける」行
  //   5行目: 2桁目の「ひく」行（4行目と同じドロップエリア）
  //   6行目: あまり行（除数の桁数分）

  let currentRow = 2; // 最初の「かける」行
  let processedDigits = 0; // 処理済みの桁数

  for (let digit = 0; digit < shoDigits; digit++) {
    if (currentRow >= rows) break;

    const isLastDigit = (digit === shoDigits - 1);

    // このペアで使用するドロップエリアの範囲を決定
    const startCol = hijosuPositions[processedDigits] || 6;
    const endCol = hijosuPositions[hijosuDigits - 1] || 12;

    // 「かける」行にドロップ可能エリアと罫線を設定
    for (let j = startCol; j <= endCol; j += 2) {
      if (TBL.rows[currentRow] && TBL.rows[currentRow].cells[j]) {
        TBL.rows[currentRow].cells[j].setAttribute("class", "droppable-elem");
        TBL.rows[currentRow].cells[j].style.backgroundColor = "antiqueWhite";
        // 「かける」行の下に罫線を引く
        TBL.rows[currentRow].cells[j].style.borderBottom = "solid black 2px";
      }
    }

    // 「ひく」行（次の行）にドロップ可能エリアを設定
    currentRow++;
    if (currentRow < rows) {
      // 通常の「ひく」行は直前の「かける」行と同じ範囲を使用（ペアとして）
      for (let j = startCol; j <= endCol; j += 2) {
        if (TBL.rows[currentRow] && TBL.rows[currentRow].cells[j]) {
          TBL.rows[currentRow].cells[j].setAttribute("class", "droppable-elem");
          TBL.rows[currentRow].cells[j].style.backgroundColor = "antiqueWhite";
        }
      }

      // 次のペアのために処理済み桁数を更新
      // （ただし最後の桁の場合は更新しない）
      if (!isLastDigit) {
        processedDigits++; // 次の桁へ
      }

      currentRow++; // 次の「かける」行へ
    }
  }

  // 小数のわり算の場合、あまり行の処理（商のペア処理が終わった後）
  // 整数のわり算では最後のひく行があまりを兼ねるので、この処理は不要
}
