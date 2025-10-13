import * as se from "./se.js";
import { hissan } from "./hissan.js";

// ========================================
// iPad単体用デバッグコンソール
// ========================================
(function() {
  // デバッグコンソール用のdiv要素を作成
  const debugDiv = document.createElement("div");
  debugDiv.id = "debug-console";
  debugDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 250px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.95);
    color: #00ff00;
    font-family: monospace;
    font-size: 11px;
    z-index: 99999;
    padding: 5px;
    border-bottom: 2px solid #00ff00;
    line-height: 1.3;
  `;

  // ページ読み込み後にbodyに追加
  if (document.body) {
    document.body.appendChild(debugDiv);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(debugDiv);
    });
  }

  // 元のconsole.logを保存
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  // ログを画面に追加する関数
  function addToDebugConsole(type, args) {
    const timestamp = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    const color = type === 'error' ? '#ff0000' : type === 'warn' ? '#ffaa00' : '#00ff00';
    const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '📝';

    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');

    const logEntry = document.createElement("div");
    logEntry.style.cssText = `color: ${color}; margin-bottom: 3px; border-bottom: 1px solid #333;`;
    logEntry.innerHTML = `<span style="color:#888;">[${timestamp}]</span> ${prefix} ${message}`;

    debugDiv.appendChild(logEntry);
    debugDiv.scrollTop = debugDiv.scrollHeight; // 最新のログまで自動スクロール

    // ログが多すぎる場合は古いものを削除（最新100件まで保持）
    while (debugDiv.children.length > 100) {
      debugDiv.removeChild(debugDiv.firstChild);
    }
  }

  // console.logを上書き
  console.log = function(...args) {
    originalLog.apply(console, args);
    addToDebugConsole('log', args);
  };

  console.error = function(...args) {
    originalError.apply(console, args);
    addToDebugConsole('error', args);
  };

  console.warn = function(...args) {
    originalWarn.apply(console, args);
    addToDebugConsole('warn', args);
  };

  console.log("🚀 iPad用デバッグコンソール起動完了");
})();
// ========================================

// 全ての音声を事前読み込み
se.preloadAllSounds().then(() => {
  console.log("📱 アプリケーションの初期化完了");
  // 音声読み込み完了後にアプリケーションを開始
  hissan();
}).catch((error) => {
  console.error("音声読み込み中にエラーが発生しましたが、アプリケーションを起動します:", error);
  // エラーが発生してもアプリケーションは起動
  hissan();
});
