export function eraseTable() {
  const TBL = document.getElementById("calc-table");
  const rows = TBL.rows.length;

  // 問題の行（1行目）以外をクリア
  for (let i = 0; i < rows; i++) {
    if (i === 1) continue; // 問題の行はスキップ
    for (let j = 0; j < 13; j++) {
      TBL.rows[i].cells[j].innerHTML = "";
    }
  }

  // 商の背景色をリセット（6～12列目）
  for (let j = 6; j <= 12; j += 2) {
    TBL.rows[0].cells[j].style.backgroundColor = "antiqueWhite";
  }
}
