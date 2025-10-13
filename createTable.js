// 問題に応じた最適なテーブルサイズを計算
export function calculateTableSize(hijosu, josu, sho, mode = "") {
  // わり算の筆算の行数計算ロジック：
  // 例: 60÷5=12（2回立てる）
  // 0行目: 商（12）
  // 1行目: 式（5）60）← 被除数を兼ねる
  // 2行目: 1回目「かける」（5）
  // 3行目: 1回目「ひく」（1、罫線）← 1行目・2行目がセット
  // 4行目: 2回目「かける」（10）
  // 5行目: 2回目「ひく」（0、罫線）← 3行目・4行目がセット、これが最終あまり


  let rows;

  // 自由配置モードの場合は8行固定
  if (mode === "") {
    rows = 8; // i=0～7まで必要
  }
  // モード別の行数設定
  else {
    const shoStr = String(sho);
    // 商の桁数（小数点を除く）= 立てる回数
    const shoDigits = shoStr.replace(".", "").length;

    // rows = 商(1) + 式(1) + 立てる回数 × 2
    // 商が1桁: 4行（0:商、1:式、2:かける、3:ひく兼あまり）
    // 商が2桁: 6行（0:商、1:式、2:かける、3:ひく、4:かける、5:ひく兼あまり）
    // 商が3桁: 8行
    // 商が4桁: 10行（ただし4桁の場合は制限がかかるはず）
    rows = 2 + shoDigits * 2;

  }

  // 列数は固定13列
  const cols = 13;

  return { rows, cols };
}

export function createTable(rows = 8, cols = 13) {
  const TBL = document.getElementById("calc-table");

  // 既存のテーブルをクリア
  while (TBL.firstChild) {
    TBL.removeChild(TBL.firstChild);
  }

  // 指定された行数・列数でテーブルを作成
  for (let i = 0; i < rows; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      const td = document.createElement("td");

      // 小数点用の列（1, 3列目は除数の小数点枠、7, 9, 11列目は被除数の小数点枠）
      if (j === 1 || j === 3 || j === 7 || j === 9 || j === 11) {
        td.style.borderLeft = "dotted gray 1px";
        td.style.width = "10px";
      }

      tr.appendChild(td);
    }
    TBL.appendChild(tr);
  }

  // 「）」記号を配置（除数と被除数の間、5列目、1行目）
  if (TBL.rows.length > 1) {
    TBL.rows[1].cells[5].innerText = ")";
  }

  // 罫線はCSSで設定（style.css参照）
}
