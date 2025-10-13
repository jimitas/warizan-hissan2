/**
 * 小数のわり算の筆算練習アプリ
 * メインエントリーポイント
 */
import * as se from "./se.js";
import { hissan } from "./hissan.js";

// 全ての音声を事前読み込み
// 音声が準備できたらアプリケーションを開始
se.preloadAllSounds().then(() => {
  hissan();
}).catch(() => {
  // エラーが発生してもアプリケーションは起動
  hissan();
});
