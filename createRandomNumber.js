// wari-hissanのルールに従った固定パターン方式
// 除数→商→あまり→被除数の順で生成

export function createRandomNumber() {
  const mode = document.getElementById("mode_select").value;

  let hijosu = 0; // 被除数（わられる数）
  let josu = 0;   // 除数（わる数）
  let sho = 0;    // 商（答え）
  let amari = 0;  // あまり

  switch (mode) {
    // ========== 整数のわり算 ==========
    case "0": // 整数（２けた）÷整数（１けた）商が１けた
      josu = Math.floor(Math.random() * 8 + 2); // 2～9
      sho = Math.floor(Math.random() * (9 - 10 / josu) + Math.floor(10 / josu) + 1);
      amari = Math.floor(Math.random() * josu); // 0～josu-1
      hijosu = sho * josu + amari;
      break;

    case "1": // 整数（２けた）÷整数（１けた）商が２けた
      josu = Math.floor(Math.random() * 8 + 2); // 2～9
      sho = Math.floor(Math.random() * (99 / josu - 10) + 10);
      amari = Math.floor(Math.random() * josu);
      hijosu = sho * josu + amari;
      break;

    case "2": // 整数（３けた）÷整数（１けた）商が２けた
      josu = Math.floor(Math.random() * 8 + 2); // 2～9
      sho = Math.floor(Math.random() * (99 - 100 / josu) + Math.floor(100 / josu));
      amari = Math.floor(Math.random() * josu);
      hijosu = sho * josu + amari;
      break;

    case "3": // 整数（２けた）÷整数（２けた）商が１けた
      josu = Math.floor(Math.random() * 15 + 10); // 10～24
      sho = Math.floor(Math.random() * (99 / josu - 2) + 2);
      amari = Math.floor(Math.random() * josu);
      hijosu = sho * josu + amari;
      break;

    case "4": // 整数（３けた）÷整数（２けた）商が１けた
      josu = Math.floor(Math.random() * 88 + 12); // 12～99
      sho = Math.floor(Math.random() * (9 - 100 / josu) + Math.floor(100 / josu) + 1);
      amari = Math.floor(Math.random() * josu);
      hijosu = sho * josu + amari;
      break;

    case "5": // 整数（３けた）÷整数（２けた）商が２けた
      josu = Math.floor(Math.random() * 18 + 12); // 12～29
      sho = Math.floor(Math.random() * (950 / josu - 10) + 10);
      amari = Math.floor(Math.random() * josu);
      hijosu = sho * josu + amari;
      break;

    // ========== 小数÷整数 ==========
    case "10": // ○○.○÷○（わり進み2回）例: 11.5÷5=2.3
      // 商を1.1～9.9の小数（整数にならない）で決定
      let sho10Int = Math.floor(Math.random() * 9) + 1; // 1～9
      let sho10Dec = Math.floor(Math.random() * 9) + 1; // 1～9（必ず小数）
      sho = sho10Int + sho10Dec / 10;

      // 除数を2～9の整数で決定
      josu = Math.floor(Math.random() * 8 + 2); // 2～9

      // 被除数 = 商 × 除数
      hijosu = sho * josu;
      hijosu = Math.round(hijosu * 10) / 10;

      // 被除数が10以下の場合はやり直し
      while (hijosu <= 10) {
        sho10Int = Math.floor(Math.random() * 9) + 1;
        sho10Dec = Math.floor(Math.random() * 9) + 1;
        sho = sho10Int + sho10Dec / 10;
        josu = Math.floor(Math.random() * 8 + 2);
        hijosu = sho * josu;
        hijosu = Math.round(hijosu * 10) / 10;
      }

      amari = 0; // 割り切れる
      break;

    case "11": // ○○○.○÷○○（わり進み2回）例: 115.5÷55=2.1
      // 商を1.1～9.9の小数（整数にならない）で決定
      let sho11Int = Math.floor(Math.random() * 9) + 1; // 1～9
      let sho11Dec = Math.floor(Math.random() * 9) + 1; // 1～9（必ず小数）
      sho = sho11Int + sho11Dec / 10;

      // 除数を11～99の整数で決定
      josu = Math.floor(Math.random() * 89 + 11); // 11～99

      // 被除数 = 商 × 除数
      hijosu = sho * josu;
      hijosu = Math.round(hijosu * 10) / 10;

      // 被除数が100以下の場合はやり直し
      while (hijosu <= 100) {
        sho11Int = Math.floor(Math.random() * 9) + 1;
        sho11Dec = Math.floor(Math.random() * 9) + 1;
        sho = sho11Int + sho11Dec / 10;
        josu = Math.floor(Math.random() * 89 + 11);
        hijosu = sho * josu;
        hijosu = Math.round(hijosu * 10) / 10;
      }

      amari = 0; // 割り切れる
      break;

    // ========== 小数÷小数 ==========
    case "20": // ○.○÷○.○（わり進み1回）例: 4.8÷1.2=4
      // 商を2～9の整数で決定
      sho = Math.floor(Math.random() * 8) + 2; // 2～9

      // 除数を1.1～9.9の小数（整数にならない）で決定
      let josu20Int = Math.floor(Math.random() * 9) + 1; // 1～9
      let josu20Dec = Math.floor(Math.random() * 9) + 1; // 1～9（必ず小数）
      josu = josu20Int + josu20Dec / 10;

      // 被除数 = 商 × 除数
      hijosu = sho * josu;
      hijosu = Math.round(hijosu * 10) / 10;

      // 被除数が10を超える場合はやり直し
      while (hijosu > 10) {
        sho = Math.floor(Math.random() * 8) + 2;
        josu20Int = Math.floor(Math.random() * 9) + 1;
        josu20Dec = Math.floor(Math.random() * 9) + 1;
        josu = josu20Int + josu20Dec / 10;
        hijosu = sho * josu;
        hijosu = Math.round(hijosu * 10) / 10;
      }

      amari = 0; // 割り切れる
      break;

    case "21": // ○○.○÷○.○（わり進み1回）例: 12.8÷1.6=8
      // 商を2～9の整数で決定
      sho = Math.floor(Math.random() * 8) + 2; // 2～9

      // 除数を1.1～9.9の小数（整数にならない）で決定
      let josu21Int = Math.floor(Math.random() * 9) + 1; // 1～9
      let josu21Dec = Math.floor(Math.random() * 9) + 1; // 1～9（必ず小数）
      josu = josu21Int + josu21Dec / 10;

      // 被除数 = 商 × 除数
      hijosu = sho * josu;
      hijosu = Math.round(hijosu * 10) / 10;

      // 被除数が10以下の場合はやり直し
      while (hijosu <= 10) {
        sho = Math.floor(Math.random() * 8) + 2;
        josu21Int = Math.floor(Math.random() * 9) + 1;
        josu21Dec = Math.floor(Math.random() * 9) + 1;
        josu = josu21Int + josu21Dec / 10;
        hijosu = sho * josu;
        hijosu = Math.round(hijosu * 10) / 10;
      }

      amari = 0; // 割り切れる
      break;

    case "22": // ○○.○÷○.○（わり進み2回）例: 18.9÷1.5
      // 商を11～99の整数で決定
      sho = Math.floor(Math.random() * 89) + 11; // 11～99

      // 除数を1.1～9.9の小数で決定（整数にならない）
      let josu22Int = Math.floor(Math.random() * 9) + 1; // 1～9
      let josu22Dec = Math.floor(Math.random() * 9) + 1; // 1～9
      josu = josu22Int + josu22Dec / 10;

      // 被除数 = 商 × 除数
      hijosu = sho * josu;
      hijosu = Math.round(hijosu * 10) / 10;

      // 被除数が100を超える場合、または除数×10が被除数を超える場合はやり直し
      while (hijosu > 100 || josu * 10 > hijosu) {
        sho = Math.floor(Math.random() * 89) + 11; // 11～99
        josu22Int = Math.floor(Math.random() * 9) + 1;
        josu22Dec = Math.floor(Math.random() * 9) + 1;
        josu = josu22Int + josu22Dec / 10;
        hijosu = sho * josu;
        hijosu = Math.round(hijosu * 10) / 10;
      }

      amari = 0; // 割り切れる
      break;

    case "23": // ○○.○÷○.○（わり進み2回）例: 22.5÷1.5
      // ランダムで商または除数の片方の小数第1位を5にする
      const pattern23 = Math.random() < 0.5;

      if (pattern23) {
        // パターン1: 商の小数第1位を5にする
        let sho23Int = Math.floor(Math.random() * 9) + 1; // 1～9
        sho = sho23Int + 0.5; // ○.5の形

        // 除数の小数第1位を偶数（2, 4, 6, 8）にする
        let josu23Int = Math.floor(Math.random() * 9) + 1; // 1～9
        const evenDigits = [2, 4, 6, 8];
        let josu23Dec = evenDigits[Math.floor(Math.random() * 4)];
        josu = josu23Int + josu23Dec / 10;
      } else {
        // パターン2: 除数の小数第1位を5にする
        let josu23Int = Math.floor(Math.random() * 9) + 1; // 1～9
        josu = josu23Int + 0.5; // ○.5の形

        // 商の小数第1位を偶数（2, 4, 6, 8）にする
        let sho23Int = Math.floor(Math.random() * 9) + 1; // 1～9
        const evenDigits = [2, 4, 6, 8];
        let sho23Dec = evenDigits[Math.floor(Math.random() * 4)];
        sho = sho23Int + sho23Dec / 10;
      }

      // 被除数 = 商 × 除数
      hijosu = sho * josu;
      hijosu = Math.round(hijosu * 10) / 10;

      // 被除数が100を超える場合、または除数×10が被除数を超えない場合、または被除数が10未満の場合はやり直し
      while (hijosu > 100 || josu * 10 <= hijosu || hijosu < 10) {
        if (pattern23) {
          let sho23Int = Math.floor(Math.random() * 9) + 1;
          sho = sho23Int + 0.5;
          let josu23Int = Math.floor(Math.random() * 9) + 1;
          const evenDigits = [2, 4, 6, 8];
          let josu23Dec = evenDigits[Math.floor(Math.random() * 4)];
          josu = josu23Int + josu23Dec / 10;
        } else {
          let josu23Int = Math.floor(Math.random() * 9) + 1;
          josu = josu23Int + 0.5;
          let sho23Int = Math.floor(Math.random() * 9) + 1;
          const evenDigits = [2, 4, 6, 8];
          let sho23Dec = evenDigits[Math.floor(Math.random() * 4)];
          sho = sho23Int + sho23Dec / 10;
        }
        hijosu = sho * josu;
        hijosu = Math.round(hijosu * 10) / 10;
      }

      amari = 0; // 割り切れる
      break;

    // ========== 特殊な計算 ==========
    case "30": // ○.○○（わり進み3回）例: 6.18÷3=2.06
      // 商を3.34～9.99の範囲で生成（必ず小数第2位まで値がある）
      // 3.34 × 3 = 10.02 なので、被除数は必ず10以上になる
      let attempts30 = 0;
      do {
        let sho30Int = Math.floor(Math.random() * 7) + 3; // 3～9
        let sho30Dec1 = Math.floor(Math.random() * 10); // 0～9（小数第1位）
        let sho30Dec2 = Math.floor(Math.random() * 10); // 0～9（小数第2位）

        // 小数第2位が0の場合は1～9にする
        if (sho30Dec2 === 0) {
          sho30Dec2 = Math.floor(Math.random() * 9) + 1; // 1～9
        }
        // 小数第1位と第2位がともに0の場合は両方とも非ゼロにする
        if (sho30Dec1 === 0 && sho30Dec2 <= 1) {
          sho30Dec1 = Math.floor(Math.random() * 9) + 1; // 1～9
          sho30Dec2 = Math.floor(Math.random() * 9) + 1; // 1～9
        }
        // 3の場合は、3.34以上になるように調整
        if (sho30Int === 3 && sho30Dec1 < 3) {
          sho30Dec1 = Math.floor(Math.random() * 7) + 3; // 3～9
        }
        if (sho30Int === 3 && sho30Dec1 === 3 && sho30Dec2 < 4) {
          sho30Dec2 = Math.floor(Math.random() * 6) + 4; // 4～9
        }

        sho = sho30Int + sho30Dec1 / 10 + sho30Dec2 / 100;
        sho = Math.round(sho * 100) / 100;

        // 除数を3～9の整数でランダムに決定
        josu = Math.floor(Math.random() * 7) + 3; // 3～9

        // 被除数 = 商 × 除数
        hijosu = sho * josu;
        hijosu = Math.round(hijosu * 100) / 100;

        // 被除数の1桁目（最上位の数字）を取得
        const hijosuStr = String(hijosu);
        const hijosuFirstDigit = parseInt(hijosuStr[0]);

        attempts30++;

        // 被除数の1桁目 < 除数 なら条件を満たす
        if (hijosuFirstDigit < josu) {
          break;
        }
      } while (attempts30 < 100);

      amari = 0; // 割り切れる
      break;

    case "31": // あまり付き（商は整数）
      // 除数か被除数のどちらかが必ず小数になるようにする
      const pattern31 = Math.random();

      if (pattern31 < 0.5) {
        // パターン1: 小数÷小数（例: 18.5 ÷ 3.2 = 5 あまり 2.5）
        josu = (Math.floor(Math.random() * 99) + 1) / 10; // 0.1～9.9
        // 商は整数1～9
        sho = Math.floor(Math.random() * 9) + 1;
        // あまりは除数より小さい値（0.1～josu-0.1）
        const maxAmari31_1 = Math.floor((josu - 0.1) * 10);
        amari = (Math.floor(Math.random() * maxAmari31_1) + 1) / 10;
        amari = Math.min(amari, josu - 0.1); // 除数より確実に小さくする
        amari = Math.round(amari * 10) / 10;
        // 被除数 = 商×除数 + あまり
        const shoTimesJosu31_1 = Math.round(sho * josu * 10) / 10;
        hijosu = shoTimesJosu31_1 + amari;
        hijosu = Math.round(hijosu * 10) / 10;
      } else {
        // パターン2: 小数÷整数（例: 23.5 ÷ 4 = 5 あまり 3.5）
        josu = Math.floor(Math.random() * 8 + 2); // 2～9（整数）
        // 商は整数1～9
        sho = Math.floor(Math.random() * 9) + 1;
        // あまりは除数より小さい小数（0.1～josu-0.1）
        const maxAmari31_2 = Math.floor((josu - 0.1) * 10);
        amari = (Math.floor(Math.random() * maxAmari31_2) + 1) / 10;
        amari = Math.round(amari * 10) / 10;
        // 被除数 = 商×除数 + あまり
        const shoTimesJosu31_2 = sho * josu; // 整数×整数なので誤差なし
        hijosu = shoTimesJosu31_2 + amari;
        hijosu = Math.round(hijosu * 10) / 10;
      }
      break;

    default:
      // デフォルトは mode "0"
      josu = Math.floor(Math.random() * 8 + 2);
      sho = Math.floor(Math.random() * (9 - 10 / josu) + Math.floor(10 / josu) + 1);
      amari = Math.floor(Math.random() * josu);
      hijosu = sho * josu + amari;
  }

  // 最終的な丸め処理
  hijosu = Math.round(hijosu * 1000) / 1000;
  josu = Math.round(josu * 1000) / 1000;
  sho = Math.round(sho * 1000) / 1000;
  amari = Math.round(amari * 1000) / 1000;

  return [hijosu, josu, sho, amari];
}
