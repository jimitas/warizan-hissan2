// 音声ファイルの設定
// Howler.jsを使用して効果音を管理

export const pi = new Howl({
  src: ["./Sounds/pi.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

export const set = new Howl({
  src: ["./Sounds/set.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

export const seikai1 = new Howl({
  src: ["./Sounds/seikai.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

export const seikai2 = new Howl({
  src: ["./Sounds/seikai2.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

export const reset = new Howl({
  src: ["./Sounds/reset.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

export const right = new Howl({
  src: ["./Sounds/right.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

export const move1 = new Howl({
  src: ["./Sounds/move1.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

export const move2 = new Howl({
  src: ["./Sounds/move2.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

export const alert = new Howl({
  src: ["./Sounds/alert.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

export const kako = new Howl({
  src: ["./Sounds/kako.mp3"],
  preload: true,
  volume: 1.0,
  loop: false,
  autoplay: false,
});

// 全ての音声のリスト
const allSounds = [pi, set, seikai1, seikai2, reset, right, move1, move2, alert, kako];

/**
 * 全ての音声ファイルを事前に読み込む関数
 * アプリ起動時に呼び出して、音声がスムーズに再生されるようにする
 * @returns {Promise} 全ての音声の読み込みが完了したらresolve
 */
export function preloadAllSounds() {
  return Promise.all(
    allSounds.map(sound => {
      return new Promise((resolve) => {
        if (sound.state() === 'loaded') {
          // 既に読み込み済み
          resolve();
        } else {
          // 読み込み完了を待つ
          sound.once('load', () => {
            resolve();
          });
          sound.once('loaderror', () => {
            resolve(); // エラーでも続行
          });
          // 明示的に読み込みを開始
          sound.load();
        }
      });
    })
  );
}
