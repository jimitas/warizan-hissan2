import * as se from "./se.js";

export function dragEvent() {
  //マウスでのドラッグを可能にする。
  var dragged;

  /* events fired on the draggable target */
  document.addEventListener("drag", function (event) {}, false);

  document.addEventListener(
    "dragstart",
    function (event) {
      // store a ref. on the dragged elem
      dragged = event.target;
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
      // move dragged elem to the selected drop target
      if (event.target.className.match(/droppable-elem/)) {
        dragged.parentNode.removeChild(dragged);
        event.target.appendChild(dragged);
        se.pi.stop();
        se.pi.play();
      }
    },
    false
  );

  function ugoki() {
    //ドラッグ可能アイテムへのタッチイベントの設定
    var draggableItems = document.querySelectorAll(`[class~="draggable-elem"]`);
    for (var i = 0; i < draggableItems.length; ++i) {
      var item = draggableItems[i];
      item.addEventListener("touchstart", touchStartEvent, false);
      item.addEventListener("touchmove", touchMoveEvent, false);
      item.addEventListener("touchend", touchEndEvent, false);
    }
  }
  //ドラッグ開始の操作
  function touchStartEvent(event) {
    //タッチによる画面スクロールを止める
    event.preventDefault();
  }

  //ドラッグ中の操作
  function touchMoveEvent(event) {
    event.preventDefault();
    //ドラッグ中のアイテムをカーソルの位置に追従
    var draggedElem = event.target;
    var touch = event.changedTouches[0];

    // ドラッグ中の視覚的フィードバック（最初に設定）
    if (!event.target.classList.contains("dragging")) {
      event.target.style.zIndex = "1000";
      event.target.style.opacity = "0.8";
      event.target.classList.add("dragging");
    }

    event.target.style.position = "fixed";
    // 元の座標計算を使用（kake-hissanと同じ）
    event.target.style.top = touch.pageY - window.pageYOffset - draggedElem.offsetHeight / 2 + "px";
    event.target.style.left = touch.pageX - window.pageXOffset - draggedElem.offsetWidth / 2 + "px";

    // pointer-events: noneを設定してelementFromPointで下の要素を取得できるように
    event.target.style.pointerEvents = "none";

    // 現在のタッチ位置の下にあるドロップ先をハイライト
    var elementBelow = document.elementFromPoint(
      touch.pageX - window.pageXOffset,
      touch.pageY - window.pageYOffset
    );

    // 既存のハイライトを削除
    var previousHighlight = document.querySelector(".drop-highlight");
    if (previousHighlight) {
      previousHighlight.classList.remove("drop-highlight");
    }
    // 新しいハイライトを追加
    if (elementBelow && elementBelow.className && elementBelow.className.match(/droppable-elem/)) {
      elementBelow.classList.add("drop-highlight");
    }
  }

  //ドラッグ終了後の操作
  function touchEndEvent(event) {
    event.preventDefault();
    var droppedElem = event.target;
    var touch = event.changedTouches[0];

    // pointer-events: noneが設定されているため、下にある要素を取得できる
    var newParentElem = document.elementFromPoint(
      touch.pageX - window.pageXOffset,
      touch.pageY - window.pageYOffset
    );

    // ドラッグ中の操作のために変更していたスタイルを元に戻す
    droppedElem.style.position = "";
    droppedElem.style.top = "";
    droppedElem.style.left = "";
    droppedElem.style.zIndex = "";
    droppedElem.style.opacity = "";
    droppedElem.style.pointerEvents = "";
    droppedElem.classList.remove("dragging");

    // ハイライトを削除
    var highlight = document.querySelector(".drop-highlight");
    if (highlight) {
      highlight.classList.remove("drop-highlight");
    }

    // ドロップした位置にあるドロップ可能なエレメントに親子付けする
    if (newParentElem && newParentElem.className && newParentElem.className.match(/droppable-elem/)) {
      newParentElem.appendChild(droppedElem);
      se.pi.stop();
      se.pi.play();
    }
  }
  ugoki();
}
