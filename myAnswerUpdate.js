export function myAnswerUpdate(sho) {
  const TBL = document.getElementById("calc-table");
  const rows = TBL.rows.length;

  // 自身の回答で商の部分を更新する（小数点含む）
  const myShoArray = [];

  // 商の行（0行目）から数字と小数点を読み取る（6～12列目）
  for (let j = 6; j <= 12; j++) {
    const cellContent = TBL.rows[0].cells[j].textContent.trim();  // innerText → textContent + trim()
    if (cellContent === ".") {
      myShoArray.push(".");
    } else if (cellContent !== "") {
      myShoArray.push(cellContent);
    }
  }

  const mySho = myShoArray.length > 0 ? Number(myShoArray.join("")) : 0;
  document.getElementById("sho-input").value = mySho || "";

  // 正しく商を立てると色がつく実装
  const shoStr = String(sho);

  // 正解の商を桁ごとに配列化（小数点も含む）
  const shoArray = [];
  for (let i = 0; i < shoStr.length; i++) {
    shoArray.push(shoStr[i]);
  }

  // 商の各桁をチェック（小数点を考慮）
  let shoIndex = 0;
  for (let j = 6; j <= 12; j += 2) {
    const cellContent = TBL.rows[0].cells[j].textContent.trim();  // innerText → textContent + trim()
    if (cellContent !== "") {
      // 正解の商と比較
      if (shoIndex < shoArray.length && cellContent === shoArray[shoIndex]) {
        TBL.rows[0].cells[j].style.backgroundColor = "orangered";
        shoIndex++;
      } else {
        TBL.rows[0].cells[j].style.backgroundColor = "antiqueWhite";
      }
    }

    // 小数点列もチェック（7, 9, 11列目）
    if (j === 6 || j === 8 || j === 10) {
      const decimalCellContent = TBL.rows[0].cells[j + 1].textContent.trim();  // innerText → textContent + trim()
      if (decimalCellContent === ".") {
        if (shoIndex < shoArray.length && shoArray[shoIndex] === ".") {
          TBL.rows[0].cells[j + 1].style.backgroundColor = "orangered";
          shoIndex++;
        } else {
          TBL.rows[0].cells[j + 1].style.backgroundColor = "antiqueWhite";
        }
      }
    }
  }

  // あまりの部分を更新する
  const myAmariArray = [];

  // 最下行からあまりを読み取る（小数点も含む）
  const lastRow = rows - 1;
  for (let j = 6; j <= 12; j++) {
    const cellContent = TBL.rows[lastRow].cells[j].textContent.trim();  // innerText → textContent + trim()
    if (cellContent === ".") {
      myAmariArray.push(".");
    } else if (cellContent !== "") {
      myAmariArray.push(cellContent);
    }
  }

  const myAmari = myAmariArray.length > 0 ? Number(myAmariArray.join("")) : 0;
  document.getElementById("amari-input").value = myAmari !== 0 ? myAmari : null;
}
