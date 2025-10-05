import { clearInput } from "./clearInput.js";
import * as se from "./se.js";

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

  se.set.currentTime = 0;
  se.set.play();
  mondai_flag = true;

  // 商とあまりを計算
  const sho = hijosu / josu;
  const amari = 0; // 自分で作る場合はあまりなしとする

  // 小数の誤差を丸める
  const shoRounded = Math.round(sho * 1000) / 1000;
  const amariRounded = 0;

  return [hijosu, josu, shoRounded, amariRounded, mondai_flag];
}
