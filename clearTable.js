import { createTable } from "./createTable.js";

export function clearTable() {
  const TBL = document.getElementById("calc-table");

  while (TBL.firstChild) {
    TBL.removeChild(TBL.firstChild);
  }
  createTable();

  // 「）」記号は createTable() 内で設定されるので、ここでは不要
}
