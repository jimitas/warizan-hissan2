import { clearInput } from "./clearInput.js";
import * as se from "./se.js";

// 整数かどうかを判定
function isInteger(num) {
  return Number.isInteger(num) || Math.abs(num - Math.round(num)) < 0.0001;
}

// 小数点以下の桁数を取得
function getDecimalPlaces(num) {
  const str = String(num);
  if (!str.includes(".")) return 0;
  return str.split(".")[1].length;
}

// 問題パターンを自動判別
function detectMode(hijosu, josu, sho, amari, wantsAmari) {
  const hijosuIsInt = isInteger(hijosu);
  const josuIsInt = isInteger(josu);
  const shoIsInt = isInteger(sho);

  // デバッグログ
  console.log("=== 問題パターン判別 ===");
  console.log("被除数:", hijosu, "除数:", josu, "商:", sho, "あまり:", amari);
  console.log("wantsAmari:", wantsAmari);
  console.log("整数判定 - 被除数:", hijosuIsInt, "除数:", josuIsInt, "商:", shoIsInt);

  // 整数÷整数のパターン（mode 0～5）のみ判定
  if (wantsAmari && hijosuIsInt && josuIsInt && shoIsInt) {
    console.log("整数÷整数パターンを検査中");
    if (hijosu < 100 && josu < 10 && sho < 10) {
      console.log("→ mode 0 に該当");
      return "0";
    }
    if (hijosu < 100 && josu < 10 && sho >= 10 && sho < 100) {
      console.log("→ mode 1 に該当");
      return "1";
    }
    if (hijosu >= 100 && josu < 10 && sho >= 10 && sho < 100) {
      console.log("→ mode 2 に該当");
      return "2";
    }
    if (hijosu < 100 && josu >= 10 && sho < 10) {
      console.log("→ mode 3 に該当");
      return "3";
    }
    if (hijosu >= 100 && josu >= 10 && sho < 10) {
      console.log("→ mode 4 に該当");
      return "4";
    }
    if (hijosu >= 100 && josu >= 10 && sho >= 10) {
      console.log("→ mode 5 に該当");
      return "5";
    }
  }

  console.log("→ 整数÷整数以外 → 自由配置モード");
  return "free"; // 自由配置モード
}

export function makeQuestion(mondai_flag) {
  if (mondai_flag) {
    se.alert.currentTime = 0;
    se.alert.play();
    alert("新しく作りたい場合は、「全部消す」をおしてください。");
    return;
  }

  const hijosu = Number(document.getElementById("hijosu-input").value);
  const josu = Number(document.getElementById("josu-input").value);

  // バリデーションチェック
  if (isNaN(hijosu) || isNaN(josu)) {
    se.alert.currentTime = 0;
    se.alert.play();
    alert("数値を入力してください。");
    clearInput();
    return;
  }

  if (!(hijosu >= 0.01 && hijosu <= 999)) {
    se.alert.currentTime = 0;
    se.alert.play();
    alert("わられる数は（0.01～999）の範囲で入力してください。");
    clearInput();
    return;
  }

  if (!(josu >= 0.1 && josu <= 99)) {
    se.alert.currentTime = 0;
    se.alert.play();
    alert("わる数は（0.1～99）の範囲で入力してください。");
    clearInput();
    return;
  }

  // 小数桁数チェック
  const hijosuStr = String(hijosu);
  const josuStr = String(josu);

  if (hijosuStr.includes(".")) {
    const hijosuDecimalDigits = hijosuStr.split(".")[1].length;
    if (hijosuDecimalDigits > 3) {
      se.alert.currentTime = 0;
      se.alert.play();
      alert("わられる数の小数は第3位までです。");
      clearInput();
      return;
    }
  }

  if (josuStr.includes(".")) {
    const josuDecimalDigits = josuStr.split(".")[1].length;
    if (josuDecimalDigits > 1) {
      se.alert.currentTime = 0;
      se.alert.play();
      alert("わる数の小数は第1位までです。");
      clearInput();
      return;
    }
  }

  // あまりを求める問題かどうかを確認
  const wantsAmari = confirm("あまりを求める問題にしますか？");

  // 商とあまりを計算
  let sho = hijosu / josu;
  let amari = 0;

  // あまりを求める場合：商は整数まで、残りはあまり
  if (wantsAmari) {
    const shoInt = Math.floor(hijosu / josu);
    const amariCalc = hijosu - shoInt * josu;
    sho = shoInt;
    amari = Math.round(amariCalc * 1000) / 1000;
  }
  // あまりを求めない場合：割り切れるまで計算
  else {
    // 割り切れるまで計算（最大4桁まで）
    sho = Math.round(sho * 10000) / 10000;

    // 商の桁数チェック（有効桁数4桁を超える場合）
    const shoStr = String(sho);
    const shoDigits = shoStr.replace(".", "").length;

    if (shoDigits > 4) {
      se.alert.currentTime = 0;
      se.alert.play();
      alert("ここでは、表しきれません。数値を変えてください。");
      clearInput();
      return;
    }

    amari = 0;
  }

  // 問題パターンを自動判別
  const detectedMode = detectMode(hijosu, josu, sho, amari, wantsAmari);

  // 自由配置モードの場合
  if (detectedMode === "free") {
    se.alert.currentTime = 0;
    se.alert.play();
    alert("ドロップエリアを自由配置モードにします。");
    // セレクトボックスは空白のままにする
    document.getElementById("mode_select").value = "";
  } else {
    // 判別されたモードをセレクトボックスに設定
    document.getElementById("mode_select").value = detectedMode;
  }

  se.set.currentTime = 0;
  se.set.play();
  mondai_flag = true;

  // 小数の誤差を丸める
  const shoRounded = Math.round(sho * 1000) / 1000;
  const amariRounded = Math.round(amari * 1000) / 1000;

  return [hijosu, josu, shoRounded, amariRounded, mondai_flag];
}
