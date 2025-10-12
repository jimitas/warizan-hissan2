import { clearInput } from "./clearInput.js";
import * as se from "./se.js";

// カスタムモーダルでユーザーの選択を待つ
function showAmariConfirmModal() {
  return new Promise((resolve) => {
    const modal = new bootstrap.Modal(document.getElementById('amariConfirmModal'));
    const yesBtn = document.getElementById('amariYesBtn');
    const noBtn = document.getElementById('amariNoBtn');

    // イベントリスナーを設定（1回のみ実行）
    const handleYes = () => {
      modal.hide();
      cleanup();
      resolve(true);
    };

    const handleNo = () => {
      modal.hide();
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      yesBtn.removeEventListener('click', handleYes);
      noBtn.removeEventListener('click', handleNo);
    };

    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);

    modal.show();
  });
}

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

  const hijosuDec = getDecimalPlaces(hijosu);
  const josuDec = getDecimalPlaces(josu);
  const shoDec = getDecimalPlaces(sho);

  // デバッグログ
  console.log("=== 問題パターン判別 ===");
  console.log("被除数:", hijosu, "除数:", josu, "商:", sho, "あまり:", amari);
  console.log("wantsAmari:", wantsAmari);
  console.log("整数判定 - 被除数:", hijosuIsInt, "除数:", josuIsInt, "商:", shoIsInt);
  console.log("小数桁数 - 被除数:", hijosuDec, "除数:", josuDec, "商:", shoDec);

  // あまりを求める場合：整数÷整数のパターン（mode 0～5）のみ判定
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

  // あまりを求めない場合：整数÷小数をmode 20-23に適合させる
  if (!wantsAmari && hijosuIsInt && josuDec === 1 && amari === 0) {
    console.log("整数÷小数パターンを検査中（被除数を○.0として扱う）");

    // 被除数を小数第1位として扱う（24→24.0）
    const hijosuDecConverted = 1;

    // mode 20: ○.○÷○.○ 商が1桁整数、被除数<10
    if (hijosuDecConverted === 1 && josuDec === 1 && shoIsInt && sho < 10 && hijosu < 10) {
      console.log("→ mode 20 に該当");
      return "20";
    }

    // mode 21: ○○.○÷○.○ 商が1桁整数、被除数>=10
    if (hijosuDecConverted === 1 && josuDec === 1 && shoIsInt && sho < 10 && hijosu >= 10) {
      console.log("→ mode 21 に該当");
      return "21";
    }

    // mode 22: ○○.○÷○.○ 商が2桁整数
    if (hijosuDecConverted === 1 && josuDec === 1 && shoIsInt && sho >= 10 && sho < 100) {
      console.log("→ mode 22 に該当");
      return "22";
    }

    // mode 23: ○○.○÷○.○ 商が小数第1位まで
    if (hijosuDecConverted === 1 && josuDec === 1 && shoDec === 1) {
      console.log("→ mode 23 に該当");
      return "23";
    }
  }

  console.log("→ どのモードにも該当しない → 自由配置モード");
  return "free"; // 自由配置モード
}

export async function makeQuestion(mondai_flag) {
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

  // あまりを求める問題かどうかを確認（カスタムモーダルを使用）
  const wantsAmari = await showAmariConfirmModal();
  console.log("=== あまりを求めるか: ", wantsAmari, "===");

  // 商とあまりを計算
  let sho = hijosu / josu;
  let amari = 0;

  // あまりを求める場合：商は整数まで、残りはあまり
  if (wantsAmari) {
    const shoInt = Math.floor(hijosu / josu);
    const amariCalc = hijosu - shoInt * josu;
    sho = shoInt;
    amari = Math.round(amariCalc * 1000) / 1000;

    console.log("→ あまりを求める: 商=" + sho + "（整数まで）, あまり=" + amari);

    // 商の桁数を表示（わり進む回数の判定に使用）
    const shoStr = String(sho);
    const shoDigits = shoStr.replace(".", "").length;
    console.log("→ 商の桁数: " + shoDigits + "桁 → わり進む回数: " + shoDigits + "回");
  }
  // あまりを求めない場合：割り切れるまで計算
  else {
    // 割り切れるまで計算（最大3桁まで）
    sho = Math.round(sho * 1000) / 1000;

    console.log("→ あまりを求めない: 商=" + sho + "（割り切れるまで）");

    // 商の桁数チェック（わり進み3回まで = 商は3桁まで）
    const shoStr = String(sho);
    const shoDigits = shoStr.replace(".", "").length;

    console.log("→ 商の桁数: " + shoDigits + "桁 → わり進む回数: " + shoDigits + "回");

    if (shoDigits > 3) {
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
    alert("一致する、ドロップエリアのパターンがみつからなかったので、自由配置モードにします。");
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
