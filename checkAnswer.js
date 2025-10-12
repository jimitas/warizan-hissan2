import * as se from "./se.js";

export function checkAnswer(sho, amari, hintSeen = false) {
  const mySho = Number(document.getElementById("sho-input").value);
  const myAmari = Number(document.getElementById("amari-input").value) || 0;

  // 小数の誤差を考慮して比較（小数第2位まで丸めて比較）
  const shoRounded = Math.round(sho * 100) / 100;
  const amariRounded = Math.round(amari * 100) / 100;
  const myShoRounded = Math.round(mySho * 100) / 100;
  const myAmariRounded = Math.round(myAmari * 100) / 100;

  if (myShoRounded === shoRounded && myAmariRounded === amariRounded) {
    se.seikai2.stop();
    se.seikai2.play();

    // 答えを見ていない場合のみコインを追加
    if (!hintSeen) {
      // コインを追加
      const img = document.createElement("img");
      img.src = "./images/coin.png";
      document.getElementById("score-pallet").appendChild(img);

      // 現在のコイン数を取得して+1
      const savedCoins = localStorage.getItem("wariHissan2CoinCount");
      const coinCount = savedCoins ? parseInt(savedCoins, 10) : 0;
      localStorage.setItem("wariHissan2CoinCount", coinCount + 1);

      alert("正解");
    } else {
      // 答えを見た後の正解
      alert("正解です！（答えを見たのでコインは増えません）");
    }

    document.getElementById("hijosu-input").disabled = false;
    document.getElementById("josu-input").disabled = false;
    document.getElementById("sho-input").disabled = true;
    document.getElementById("amari-input").disabled = true;

    return false;
  } else {
    se.alert.stop();
    se.alert.play();
    alert("もう一度！");
    return true;
  }

  // 答えをチェックする
  // if (mondai_flag === false) {
  //   se.alert.currentTime = 0;
  //   se.alert.play();
  //   alert("「問題を出す」をおしてください。");
  //   return;
  // }
  // if (myAnswer == collectAnswer) {
  //   se.seikai2.currentTime = 0;
  //   se.seikai2.play();
  //   const img = document.createElement("img");
  //   img.src = "./images/coin.png";
  //   document.getElementById("score-pallet").appendChild(img);
  //   alert("正解");
  //   mondai_flag = false;
  // } else {
  //   se.alert.currentTime = 0;
  //   se.alert.play();
  //   alert("もう一度！");
  // }
}
