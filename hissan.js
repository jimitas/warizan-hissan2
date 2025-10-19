import * as se from "./se.js";
import { createTable, calculateTableSize } from "./createTable.js";
import { createRandomNumber } from "./createRandomNumber.js";
import { displayInputNumber } from "./displayInputNumber.js";
import { clearTable } from "./clearTable.js";
import { clearInput } from "./clearInput.js";
import { displayWriteTable } from "./displayWriteTable.js";
import { myAnswerUpdate } from "./myAnswerUpdate.js";
import { eraseTable } from "./eraseTable.js";
import { checkAnswer } from "./checkAnswer.js";
import { makeQuestion } from "./makeQuestion.js";

export function hissan() {
  let hijosu = 0;
  let josu = 0;
  let sho = 0;
  let amari = 0;

  let mondai_flag = false; //問題を出したかどうかのフラグ判定
  let point_flag = false; //小数点が既に配置されているかのフラグ
  let hint_flag = false; //答えを見たかどうかのフラグ

  // 初期化
  createTable();
  numberSet();
  loadCoins(); // ページ読み込み時にコインを復元

  // トースト通知を表示（Bootstrap 5のトースト機能を使用）
  window.addEventListener('DOMContentLoaded', () => {
    const toastElement = document.getElementById('infoToast');
    if (toastElement && typeof bootstrap !== 'undefined') {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  });

  // ガイダンステキストの表示
  function updateGuidanceText() {
    const modeSelect = document.getElementById("mode_select");
    const guidanceText = document.getElementById("guidance-text");
    const decimalPointGuide = document.getElementById("decimal-point-guide");
    const textBox2 = document.getElementById("text-box2");
    const mode = modeSelect.value;

    const guidanceMessages = {
      "0": "商を整数まで求め、あまりがあれば求めましょう。",
      "1": "商を整数まで求め、あまりがあれば求めましょう。",
      "2": "商を整数まで求め、あまりがあれば求めましょう。",
      "3": "商を整数まで求め、あまりがあれば求めましょう。",
      "4": "商を整数まで求め、あまりがあれば求めましょう。",
      "5": "商を整数まで求め、あまりがあれば求めましょう。",
      "10": "割り切れるまで計算しましょう。",
      "11": "割り切れるまで計算しましょう。",
      "30": "割り切れるまで計算しましょう。",
      "31": "商を整数まで求め、あまりを求めましょう。"
    };

    if (guidanceMessages[mode]) {
      guidanceText.textContent = guidanceMessages[mode];
      guidanceText.style.display = "block";
    } else {
      guidanceText.style.display = "none";
    }

    // 小数を含むモードの場合、小数点のガイダンスをテーブルの上に表示
    const decimalModes = ["10", "11", "12", "13", "20", "21", "22", "30", "31"];
    if (decimalModes.includes(mode)) {
      decimalPointGuide.innerText = "小数点はクリックすると出ます。";
    } else {
      decimalPointGuide.innerText = "";
    }

    // あまり付き（商は整数）の場合、あまりのガイダンスをテーブルの下に表示
    if (mode === "31") {
      textBox2.innerText = "あまりに小数点を付けると、あまりの欄に小数点が反映されます。";
    } else {
      textBox2.innerText = "";
    }
  }

  // モード選択時にガイダンステキストを更新
  const modeSelect = document.getElementById("mode_select");
  modeSelect.addEventListener("change", updateGuidanceText);
  updateGuidanceText(); // 初期表示

  // 問題を作成する。
  document.getElementById("btn-question").addEventListener("click", createQuestion, false);
  function createQuestion() {
    // 問題の種類が選択されているかチェック
    const modeSelect = document.getElementById("mode_select");
    if (!modeSelect.value || modeSelect.value === "") {
      se.alert.stop();
      se.alert.play();
      alert("問題の種類を選んでください。");
      return;
    }

    se.set.stop();
    se.set.play();
    mondai_flag = true;
    hint_flag = false; // 答えを見たフラグをリセット
    // 被乗数、除数、商、余りを決定し、代入する。
    const randomNumberArray = createRandomNumber();
    [hijosu, josu, sho, amari] = randomNumberArray;

    // 問題に応じた最適なテーブルサイズを計算して再作成
    const mode = document.getElementById("mode_select").value;
    const { rows, cols } = calculateTableSize(hijosu, josu, sho, mode);
    createTable(rows, cols);

    point_flag = false;
    setupDecimalPointClick();
    displayInputNumber(randomNumberArray);
    displayWriteTable(randomNumberArray);
    setupRow1DecimalPointClick(); // i=1の小数点列クリック機能を設定
  }

  // 自分で問題を作成する。
  document.getElementById("btn-make-question").addEventListener(
    "click",
    async () => {
      const makeNumberArray = await makeQuestion(mondai_flag);

      if (makeNumberArray) {
        [hijosu, josu, sho, amari, mondai_flag] = makeNumberArray;
        hint_flag = false; // 答えを見たフラグをリセット

        // 問題に応じた最適なテーブルサイズを計算して再作成
        const mode = document.getElementById("mode_select").value;
        const { rows, cols } = calculateTableSize(hijosu, josu, sho, mode);
        createTable(rows, cols);

        point_flag = false;
        setupDecimalPointClick();
        displayInputNumber(makeNumberArray);
        displayWriteTable(makeNumberArray);
        setupRow1DecimalPointClick(); // i=1の小数点列クリック機能を設定
      }
    },
    false
  );

  //数字を消す
  document.getElementById("btn-erase").addEventListener("click", () => {
    se.reset.stop();
    se.reset.play();
    eraseTable();
    hint_flag = false; // 答えを見たフラグをリセット
  });

  //全部の内容を消す
  document.getElementById("btn-clear").addEventListener("click", () => {
    se.alert.stop();
    se.alert.play();
    const result = window.confirm("全部の内容を消しますか？");

    if (result) {
      se.reset.stop();
      se.reset.play();
      clearInput();
      clearTable();
      point_flag = false;
      setupDecimalPointClick();
      mondai_flag = false;
      hint_flag = false; // 答えを見たフラグをリセット
    }
  });

  // 答えを見る
  document.getElementById("btn-showAnswer").addEventListener(
    "click",
    () => {
      if (mondai_flag === false) {
        se.alert.stop();
        se.alert.play();
        alert("「問題を出す」をおしてください。");
        return;
      }
      se.seikai1.stop();
      se.seikai1.play();

      // 答えを見たフラグを立てる
      hint_flag = true;

      // iPadのために音声再生完了後にalertを表示
      const duration = se.seikai1.duration() * 500; // 音声の半分の長さで表示
      setTimeout(() => {
        if (amari > 0) {
          alert("答えは、「　" + sho + "　あまり　" + amari + "　」です。自分でも計算してみましょう。");
        } else {
          alert("答えは、「　" + sho + "　」です。自分でも計算してみましょう。");
        }
      }, duration);
    },
    false
  );

  // ヒントを出す
  document.getElementById("btn-hint").addEventListener(
    "click",
    () => {
      if (mondai_flag === false) {
        se.alert.stop();
        se.alert.play();
        alert("「問題を出す」をおしてください。");
        return;
      }
      se.seikai1.stop();
      se.seikai1.play();

      // 答えを見たフラグを立てる
      hint_flag = true;

      const hintNumber = [];
      hintNumber.push(...sho.toString());

      // iPadのために音声再生完了後にalertを表示
      const duration = se.seikai1.duration() * 500; // 音声の半分の長さで表示
      setTimeout(() => {
        alert("商のはじめの位は「" + hintNumber[0] + "」です。");
      }, duration);
    },
    false
  );

  // 答え合わせをする
  document.getElementById("btn-check").addEventListener(
    "click",
    () => {
      if (mondai_flag === false) {
        se.alert.stop();
        se.alert.play();
        alert("「問題を出す」をおしてください。");
        return;
      }
      mondai_flag = checkAnswer(sho, amari, hint_flag);
    },
    false
  );

  // ---------------ここから数字のセット

  //関数　数字のセット（初期化時のみ呼び出し）
  function numberSet() {
    //数パレット内の数字を一旦消去
    const ele = document.getElementById("num-pallet");
    while (ele.firstChild) {
      ele.removeChild(ele.firstChild);
    }

    // 数字0～9を追加
    for (let i = 0; i < 10; i++) {
      const div = document.createElement("div");
      div.innerHTML = i;
      div.setAttribute("class", "num draggable-elem");
      div.setAttribute("draggable", "true");
      div.dataset.isOriginal = "true"; // オリジナルの数字としてマーク
      if (i === 0) {
        div.addEventListener("click", () => {
          if (div.classList.contains("diagonal")) {
            div.classList.remove("diagonal");
          } else {
            div.classList.add("diagonal");
          }
        });
      }
      document.getElementById("num-pallet").appendChild(div);
    }
  }

  // タッチイベント用の変数（イベントデリゲーションの前に定義）
  let touchDraggedElem = null;
  let touchOriginalParent = null;

  //ドラッグ開始の操作
  function touchStartEvent(event) {
    //タッチによる画面スクロールを止める
    event.preventDefault();

    const target = event.target;
    // オリジナルの数字パレットの場合、クローンを作成
    if (target.dataset.isOriginal === "true") {
      touchDraggedElem = target.cloneNode(true);
      touchDraggedElem.dataset.isOriginal = "false";
      touchDraggedElem.classList.add("num", "draggable-elem");
      document.body.appendChild(touchDraggedElem);
      touchOriginalParent = null;
    } else {
      // 既に配置された数字の場合
      touchDraggedElem = target;
      touchOriginalParent = target.parentNode;
    }

    // 初期位置を設定
    const touch = event.changedTouches[0];
    touchDraggedElem.style.position = "fixed";
    touchDraggedElem.style.zIndex = "10000";
    touchDraggedElem.style.pointerEvents = "none";
    touchDraggedElem.style.left = (touch.clientX - touchDraggedElem.offsetWidth / 2) + "px";
    touchDraggedElem.style.top = (touch.clientY - touchDraggedElem.offsetHeight / 2) + "px";
  }

  //ドラッグ中の操作
  function touchMoveEvent(event) {
    event.preventDefault();
    if (!touchDraggedElem) return;

    const touch = event.changedTouches[0];
    // transformを使用してGPUアクセラレーションを活用
    const x = touch.clientX - touchDraggedElem.offsetWidth / 2;
    const y = touch.clientY - touchDraggedElem.offsetHeight / 2;
    touchDraggedElem.style.left = x + "px";
    touchDraggedElem.style.top = y + "px";
  }

  //ドラッグ終了後の操作
  function touchEndEvent(event) {
    event.preventDefault();
    if (!touchDraggedElem) return;

    //ドラッグ中の操作のために変更していたスタイルを元に戻す
    touchDraggedElem.style.position = "";
    touchDraggedElem.style.zIndex = "";
    touchDraggedElem.style.pointerEvents = "";
    touchDraggedElem.style.left = "";
    touchDraggedElem.style.top = "";

    //ドロップした位置にあるドロップ可能なエレメントに親子付けする
    const touch = event.changedTouches[0];
    const newParentElem = document.elementFromPoint(touch.clientX, touch.clientY);

    // ドロップ先がdroppable-elemクラスを持っている場合のみ、要素を移動
    // ただし、#num-palletには戻せない（一度ドロップした数字はパレットに戻らない）
    const isNumPallet = newParentElem && (newParentElem.id === "num-pallet" || newParentElem.closest("#num-pallet"));
    const isGomibako = newParentElem && (newParentElem.tagName === "IMG" && newParentElem.alt === "ゴミ箱");

    // ゴミ箱にドロップした場合は削除
    if (isGomibako) {
      if (touchDraggedElem.parentNode) {
        touchDraggedElem.parentNode.removeChild(touchDraggedElem);
      }
      se.pi.stop();
      se.pi.play();
      myAnswerUpdate(sho);
    } else if (newParentElem && newParentElem.className.match(/droppable-elem/) && !isNumPallet) {
      newParentElem.appendChild(touchDraggedElem);
      se.pi.stop();
      se.pi.play();
      myAnswerUpdate(sho);
    } else {
      // ドロップ先が無効な場合（またはnum-palletに戻そうとした場合）
      if (touchOriginalParent && touchOriginalParent.id !== "num-pallet") {
        // 元の場所に戻す（ただし元の場所がnum-pallet以外の場合のみ）
        touchOriginalParent.appendChild(touchDraggedElem);
      } else {
        // クローンの場合、またはnum-palletに戻そうとした場合は削除
        if (touchDraggedElem.parentNode) {
          touchDraggedElem.parentNode.removeChild(touchDraggedElem);
        }
      }
    }

    touchDraggedElem = null;
    touchOriginalParent = null;
  }

  // イベントデリゲーション：document.body全体でタッチイベントを管理
  // これにより、パレット内の数字もドロップ後の数字も両方ドラッグできる
  document.body.addEventListener("touchstart", function(event) {
    if (event.target.classList.contains("draggable-elem")) {
      touchStartEvent(event);
    }
  }, { passive: false });

  document.body.addEventListener("touchmove", function(event) {
    if (touchDraggedElem) {
      touchMoveEvent(event);
    }
  }, { passive: false });

  document.body.addEventListener("touchend", function(event) {
    if (touchDraggedElem) {
      touchEndEvent(event);
    }
  }, { passive: false });

  // 商の行（0行目）とあまりの行（末行）の小数点列をクリック可能にする
  function setupDecimalPointClick() {
    const TBL = document.getElementById("calc-table");
    if (!TBL || TBL.rows.length === 0) return;

    const lastRow = TBL.rows.length - 1;

    // 商の行（0行目）の小数点列（7, 9, 11列目）にクリックイベントを追加
    [7, 9, 11].forEach(col => {
      if (TBL.rows[0] && TBL.rows[0].cells[col]) {
        const cell = TBL.rows[0].cells[col];
        cell.style.cursor = "pointer";

        // 既存のイベントリスナーを削除するために、新しい要素で置き換え
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);

        newCell.addEventListener("click", function() {
          if (point_flag === false) {
            // 小数点がまだない場合、追加
            this.innerText = ".";
            point_flag = true;
            se.pi.stop();
            se.pi.play();
          } else {
            // 小数点が既にある場合
            if (TBL.rows[0].cells[col].innerText === ".") {
              // クリックされたセルに小数点がある場合、削除
              TBL.rows[0].cells[col].innerText = "";
              point_flag = false;
              se.pi.stop();
              se.pi.play();
            } else {
              // 他のセルに小数点がある場合、全て削除してからこのセルに追加
              TBL.rows[0].cells[7].innerText = "";
              TBL.rows[0].cells[9].innerText = "";
              TBL.rows[0].cells[11].innerText = "";
              this.innerText = ".";
              se.pi.stop();
              se.pi.play();
            }
          }
          myAnswerUpdate(sho);
        });
      }
    });

    // あまりの行（末行）の小数点列（7, 9, 11列目）にもクリックイベントを追加
    [7, 9, 11].forEach(col => {
      if (TBL.rows[lastRow] && TBL.rows[lastRow].cells[col]) {
        const cell = TBL.rows[lastRow].cells[col];
        cell.style.cursor = "pointer";

        // 既存のイベントリスナーを削除するために、新しい要素で置き換え
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);

        newCell.addEventListener("click", function() {
          const amariPointExists = TBL.rows[lastRow].cells[7].innerText === "." ||
                                   TBL.rows[lastRow].cells[9].innerText === "." ||
                                   TBL.rows[lastRow].cells[11].innerText === ".";

          if (!amariPointExists) {
            // あまり行に小数点がまだない場合、追加
            this.innerText = ".";
            se.pi.stop();
            se.pi.play();
          } else {
            // あまり行に小数点が既にある場合
            if (TBL.rows[lastRow].cells[col].innerText === ".") {
              // クリックされたセルに小数点がある場合、削除
              TBL.rows[lastRow].cells[col].innerText = "";
              se.pi.stop();
              se.pi.play();
            } else {
              // 他のセルに小数点がある場合、全て削除してからこのセルに追加
              TBL.rows[lastRow].cells[7].innerText = "";
              TBL.rows[lastRow].cells[9].innerText = "";
              TBL.rows[lastRow].cells[11].innerText = "";
              this.innerText = ".";
              se.pi.stop();
              se.pi.play();
            }
          }
          myAnswerUpdate(sho);
        });
      }
    });
  }

  // テーブル作成後に小数点クリック機能を設定
  setupDecimalPointClick();

  // i=1の小数点列をクリックで操作可能にする（空白→小数点→斜線付き→空白）
  function setupRow1DecimalPointClick() {
    const TBL = document.getElementById("calc-table");
    if (!TBL || TBL.rows.length < 2) return;

    // i=1の小数点列（3, 7, 9, 11列目）にクリックイベントを追加
    // 列3: 除数の小数点位置
    // 列7, 9, 11: 被除数の小数点位置
    const decimalCols = [3, 7, 9, 11];

    decimalCols.forEach(col => {
      if (TBL.rows[1] && TBL.rows[1].cells[col]) {
        const cell = TBL.rows[1].cells[col];
        cell.style.cursor = "pointer";

        // 既存のイベントリスナーを削除するために、新しい要素で置き換え
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);

        newCell.addEventListener("click", function() {
          const currentText = this.innerText;
          const hasCrossedClass = this.classList.contains("decimal-crossed");

          // 状態遷移: 空白 → "." → "."(斜線付き) → 空白
          if (currentText === "" || currentText === " ") {
            // 空白 → 小数点
            this.innerText = ".";
            this.classList.remove("decimal-crossed");
            se.pi.stop();
            se.pi.play();
          } else if (currentText === "." && !hasCrossedClass) {
            // 小数点 → 小数点(斜線付き)
            this.classList.add("decimal-crossed");
            se.pi.stop();
            se.pi.play();
          } else if (currentText === "." && hasCrossedClass) {
            // 小数点(斜線付き) → 空白
            this.innerText = "";
            this.classList.remove("decimal-crossed");
            se.pi.stop();
            se.pi.play();
          }
        });
      }
    });
  }

  //マウスでのドラッグを可能にする。
  let dragged;
  let draggedClone; // ドラッグ中のクローン要素

  /* events fired on the draggable target */
  document.addEventListener("drag", function (event) {}, false);

  document.addEventListener(
    "dragstart",
    function (event) {
      const target = event.target;
      // オリジナルの数字パレットからドラッグした場合、クローンを作成
      if (target.classList.contains("draggable-elem") && target.dataset.isOriginal === "true") {
        draggedClone = target.cloneNode(true);
        draggedClone.dataset.isOriginal = "false"; // クローンはオリジナルではない
        // クローンはドラッグ可能にする
        draggedClone.setAttribute("draggable", "true");
        draggedClone.classList.add("num", "draggable-elem");
        dragged = draggedClone;
      } else {
        // 既に配置された数字をドラッグする場合
        dragged = target;
      }
    },
    false
  );

  /* events fired on the drop targets */
  document.addEventListener(
    "dragover",
    function (event) {
      // prevent default to allow drop
      event.preventDefault();
    },
    false
  );

  document.addEventListener(
    "drop",
    function (event) {
      // prevent default action (open as link for some elements)
      event.preventDefault();

      // ドロップ先が#num-palletでないことを確認（一度ドロップした数字はパレットに戻らない）
      const isNumPallet = event.target.id === "num-pallet" || event.target.closest("#num-pallet");
      const isGomibako = event.target.tagName === "IMG" && event.target.alt === "ゴミ箱";

      // ゴミ箱にドロップした場合は削除
      if (isGomibako) {
        if (dragged && dragged.parentNode) {
          dragged.parentNode.removeChild(dragged);
        }
        se.pi.stop();
        se.pi.play();
        myAnswerUpdate(sho);
      }
      // move dragged elem to the selected drop target
      else if (event.target.className.match(/droppable-elem/) && !isNumPallet) {
        // クローンの場合はappend、既存要素の場合は移動
        if (dragged.dataset.isOriginal === "false" && !dragged.parentNode) {
          event.target.appendChild(dragged);
        } else if (dragged.dataset.isOriginal === "false" || dragged.dataset.isOriginal !== "true") {
          dragged.parentNode.removeChild(dragged);
          event.target.appendChild(dragged);
        }
        se.pi.stop();
        se.pi.play();
        myAnswerUpdate(sho);
      }
      draggedClone = null;
    },
    false
  );

  // ローカルストレージからコイン数を読み込み、画面に表示
  function loadCoins() {
    const savedCoins = localStorage.getItem("wariHissan2CoinCount");
    const coinCount = savedCoins ? parseInt(savedCoins, 10) : 0;
    const scorePallet = document.getElementById("score-pallet");

    // 保存されているコイン数だけコイン画像を表示
    for (let i = 0; i < coinCount; i++) {
      const img = document.createElement("img");
      img.src = "./images/coin.png";
      scorePallet.appendChild(img);
    }
  }

  // コインをリセット（計算問題による確認付き）
  const btnResetCoins = document.getElementById("btn-reset-coins");
  btnResetCoins.addEventListener("click", () => {
    se.alert.stop();
    se.alert.play();

    // ランダムな計算問題を生成（3桁÷2桁で割り切れる問題）
    const num2 = Math.floor(Math.random() * 70) + 10;   // 10-79の2桁の除数
    const quotient = Math.floor(Math.random() * 20) + 5; // 5-24の商
    const num1 = num2 * quotient;                        // 割り切れる3桁の被除数を生成
    const correctAnswer = quotient;

    const userAnswer = prompt(`コインをリセットするには、次の計算問題を解いてください。\n\n${num1} ÷ ${num2} = ?`);

    // キャンセルした場合
    if (userAnswer === null) {
      return;
    }

    // 答えが正しいかチェック
    if (parseInt(userAnswer, 10) === correctAnswer) {
      // ローカルストレージをクリア
      localStorage.removeItem("wariHissan2CoinCount");
      // 画面上のコインを全て削除
      const scorePallet = document.getElementById("score-pallet");
      scorePallet.innerHTML = "";
      se.reset.play();
      alert("正解です！コインをリセットしました。");
    } else {
      se.alert.stop();
      se.alert.play();
      alert(`不正解です。正しい答えは ${correctAnswer} でした。\nコインはリセットされませんでした。`);
    }
  });
}
