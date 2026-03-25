// ===== 単語リスト =====
const words = [
  "apple", "banana", "orange", "grape", "lemon",
  "programming", "javascript", "typing", "game", "score"
];

// ===== 変数の初期化 =====
let currentWord = "";   // 現在表示中の単語
let score = 0;          // スコア
let timeLeft = 10;      // 残り時間（秒）
let timerInterval = null; // setIntervalのID

// ===== DOM要素の取得 =====
const wordDisplay = document.getElementById("word-display");
const typeInput   = document.getElementById("type-input");
const timerSpan   = document.getElementById("timer");
const scoreSpan   = document.getElementById("score");
const startBtn    = document.getElementById("start-btn");

// ===== ランダムに単語を取得する関数 =====
function getRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

// ===== 新しい単語を表示する関数 =====
function showNewWord() {
  currentWord = getRandomWord();
  wordDisplay.textContent = currentWord;
}

// ===== キー入力を判定する関数 =====
function checkInput() {
  const inputValue = typeInput.value;

  if (inputValue === currentWord) {
    score++;
    scoreSpan.textContent = score;
    typeInput.value = "";
    showNewWord();
  }
}

// ===== タイマーを動かす関数 =====
function startTimer() {
  timerInterval = setInterval(function () {
    timeLeft--;
    timerSpan.textContent = timeLeft;

    // タイマーが0になったとき
    if (timeLeft <= 0) {
      clearInterval(timerInterval); // タイマーを止める
      typeInput.disabled = true;    // 入力を無効化

      // ★ Step1: グレーの背景部分に「タイムアップ！」を表示
      wordDisplay.textContent = "タイムアップ！";

      // ★ Step2: 10ミリ秒後にゲーム判定結果のダイアログを表示
      setTimeout(function () {
        alert("ゲーム終了！\nあなたのスコアは " + score + " 点です！");
      }, 10);
    }
  }, 1000);
}

// ===== ゲームを開始する関数 =====
function startGame() {
  // 初期化
  score     = 0;
  timeLeft  = 10;
  scoreSpan.textContent  = score;
  timerSpan.textContent  = timeLeft;

  // 入力欄を有効化してフォーカス
  typeInput.disabled = false;
  typeInput.value    = "";
  typeInput.focus();

  // 最初の単語を表示
  showNewWord();

  // タイマー開始
  startTimer();
}

// ===== イベントリスナーの設定 =====

// スタートボタンが押されたらゲーム開始
startBtn.addEventListener("click", startGame);

// 入力のたびに判定
typeInput.addEventListener("input", checkInput);
