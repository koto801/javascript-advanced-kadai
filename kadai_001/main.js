// ── ワードリスト ──────────────────────────────
const WORDS = [
  "apple", "banana", "cherry", "dragon", "elephant",
  "forest", "guitar", "hunter", "island", "jungle",
  "knight", "lemon", "mango", "noble", "orange",
  "planet", "queen", "rocket", "sunset", "tiger",
  "umbrella", "violet", "winter", "xenon", "yellow",
  "zebra", "cloud", "dance", "earth", "flame",
  "ghost", "heart", "image", "joker", "karma"
];

const GAME_TIME = 30; // 制限時間（秒）

// ── DOM 取得 ──────────────────────────────────
const startScreen   = document.getElementById("start-screen");
const gameScreen    = document.getElementById("game-screen");
const resultScreen  = document.getElementById("result-screen");

const startBtn      = document.getElementById("start-btn");
const retryBtn      = document.getElementById("retry-btn");

const timerEl       = document.getElementById("timer");
const scoreEl       = document.getElementById("score");
const currentWordEl = document.getElementById("current-word");
const typeInput     = document.getElementById("type-input");

// 課題追加要素: タイプ数カウント
const countValueEl  = document.getElementById("count-value");

const finalScoreEl  = document.getElementById("final-score");
const finalCountEl  = document.getElementById("final-count");

// ── 状態変数 ──────────────────────────────────
let score       = 0;  // 正解したワード数
let typeCount   = 0;  // 正確にタイプした文字の累計数
let timeLeft    = GAME_TIME;
let timerID     = null;
let currentWord = "";
let prevLen     = 0;  // 前回の正確な入力長（差分計算用）

// ── ヘルパー ──────────────────────────────────
function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function showScreen(screen) {
  [startScreen, gameScreen, resultScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function setNewWord() {
  currentWord = getRandomWord();
  currentWordEl.textContent = currentWord;
  typeInput.value = "";
  typeInput.classList.remove("correct", "wrong");
  prevLen = 0; // ワードが変わるたびにリセット
}

// ── ゲーム開始 ────────────────────────────────
function startGame() {
  score     = 0;
  typeCount = 0;
  timeLeft  = GAME_TIME;
  prevLen   = 0;

  scoreEl.textContent      = score;
  timerEl.textContent      = timeLeft;
  countValueEl.textContent = typeCount; // 課題: 初期値を表示

  setNewWord();
  showScreen(gameScreen);
  typeInput.focus();

  timerID = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// ── ゲーム終了 ────────────────────────────────
function endGame() {
  clearInterval(timerID);
  typeInput.blur();

  finalScoreEl.textContent = score;
  finalCountEl.textContent = typeCount; // 課題: 合計タイプ数を結果に表示

  showScreen(resultScreen);
}

// ── キー入力判定 ──────────────────────────────
typeInput.addEventListener("input", () => {
  const typed    = typeInput.value;
  const expected = currentWord.slice(0, typed.length); // 先頭 typed.length 文字と比較

  if (typed === expected) {
    // ── 正確な入力 ──
    typeInput.classList.remove("wrong");
    typeInput.classList.add("correct");

    // 正確に増えた文字数だけ加算（貼り付け・複数文字入力にも対応）
    const diff = typed.length - prevLen;
    if (diff > 0) {
      typeCount += diff;
      countValueEl.textContent = typeCount; // 課題: タイプ数をリアルタイム更新
    }
    prevLen = typed.length;

    // ワード完成判定
    if (typed === currentWord) {
      score++;
      scoreEl.textContent = score;
      setNewWord(); // prevLen も内部でリセットされる
    }

  } else {
    // ── 間違い ──
    typeInput.classList.remove("correct");
    typeInput.classList.add("wrong");
    // 間違い入力はカウントしない
    prevLen = typed.length; // 修正後に余分な増分が発生しないよう位置を記憶
  }
});

// ── ボタンイベント ────────────────────────────
startBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", startGame);
