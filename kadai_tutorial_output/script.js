// ========== 単語リスト ==========
const WORDS = [
  // 英単語（アルファベット）
  "apple", "banana", "orange", "grape", "lemon",
  "school", "house", "water", "music", "happy",
  "japan", "tokyo", "spring", "summer", "winter",
  "coffee", "flower", "castle", "bridge", "garden",
  "programming", "keyboard", "computer", "internet", "software",
  "window", "screen", "button", "player", "typing",
  "cloud", "stars", "ocean", "river", "forest",
  "smile", "dream", "light", "peace", "heart",
  "memory", "future", "travel", "world", "number",
  "thunder", "rainbow", "crystal", "shadow", "silver"
];

// ========== ゲーム状態 ==========
let score = 0;
let correctCount = 0;
let missCount = 0;
let timeLeft = 60;
let timerInterval = null;
let currentWord = "";

// ========== DOM要素の取得 ==========
const startScreen    = document.getElementById("start-screen");
const gameScreen     = document.getElementById("game-screen");
const resultScreen   = document.getElementById("result-screen");

const startBtn       = document.getElementById("start-btn");
const retryBtn       = document.getElementById("retry-btn");

const scoreEl        = document.getElementById("score");
const timerEl        = document.getElementById("timer");
const correctCountEl = document.getElementById("correct-count");
const currentWordEl  = document.getElementById("current-word");
const typingInput    = document.getElementById("typing-input");
const feedbackEl     = document.getElementById("feedback");

const finalScoreEl    = document.getElementById("final-score");
const finalCorrectEl  = document.getElementById("final-correct");
const finalMissEl     = document.getElementById("final-miss");
const finalAccuracyEl = document.getElementById("final-accuracy");
const rankMessageEl   = document.getElementById("rank-message");

// ========== 画面切り替え ==========
function showScreen(screen) {
  [startScreen, gameScreen, resultScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

// ========== ランダム単語の取得 ==========
function getRandomWord() {
  let word;
  do {
    word = WORDS[Math.floor(Math.random() * WORDS.length)];
  } while (word === currentWord); // 連続で同じ単語が出ないようにする
  return word;
}

// ========== 次の単語を表示 ==========
function nextWord() {
  currentWord = getRandomWord();
  currentWordEl.textContent = currentWord;
  typingInput.value = "";
  typingInput.className = "typing-input";
  currentWordEl.className = "word";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
}

// ========== スコアを更新 ==========
function updateScore(points) {
  score += points;
  scoreEl.textContent = score;
}

// ========== タイマー処理 ==========
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    // 残り10秒で警告色
    if (timeLeft <= 10) {
      timerEl.classList.add("danger");
    }

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// ========== ゲーム開始 ==========
function startGame() {
  // 状態をリセット
  score = 0;
  correctCount = 0;
  missCount = 0;
  timeLeft = 60;

  scoreEl.textContent = "0";
  timerEl.textContent = "60";
  timerEl.classList.remove("danger");
  correctCountEl.textContent = "0";

  showScreen(gameScreen);
  nextWord();
  typingInput.focus();
  startTimer();
}

// ========== ゲーム終了 ==========
function endGame() {
  clearInterval(timerInterval);

  // 結果を計算
  const total    = correctCount + missCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // 結果画面に反映
  finalScoreEl.textContent    = score;
  finalCorrectEl.textContent  = correctCount;
  finalMissEl.textContent     = missCount;
  finalAccuracyEl.textContent = accuracy + "%";

  // ランク判定
  rankMessageEl.textContent = getRankMessage(score);

  showScreen(resultScreen);
}

// ========== ランクメッセージ ==========
function getRankMessage(s) {
  if (s >= 500) return "🏆 PERFECT! 完璧なタイピングです！";
  if (s >= 350) return "🥇 EXCELLENT! 素晴らしいです！";
  if (s >= 200) return "🥈 GREAT! よくできました！";
  if (s >= 100) return "🥉 GOOD! なかなかです！";
  return "👍 KEEP GOING! 練習あるのみ！";
}

// ========== 入力監視 ==========
typingInput.addEventListener("input", () => {
  const inputValue = typingInput.value;

  // 入力が空の場合はリセット
  if (inputValue === "") {
    typingInput.className = "typing-input";
    currentWordEl.className = "word";
    return;
  }

  // 正しい入力の途中
  if (currentWord.startsWith(inputValue)) {
    typingInput.className = "typing-input correct";

    // 完全一致 → 正解！
    if (inputValue === currentWord) {
      correctCount++;
      correctCountEl.textContent = correctCount;

      // スコア加算（単語の長さに応じてボーナス）
      const points = 10 + currentWord.length * 2;
      updateScore(points);

      // 正解アニメーション
      currentWordEl.classList.add("correct-flash");
      feedbackEl.textContent = `+${points}点！`;
      feedbackEl.className = "feedback correct";

      setTimeout(nextWord, 200);
    }
  } else {
    // ミス
    typingInput.className = "typing-input wrong";
    currentWordEl.classList.add("wrong-flash");
    feedbackEl.textContent = "ミス！";
    feedbackEl.className = "feedback wrong";
    missCount++;

    // アニメーション後にリセット
    setTimeout(() => {
      if (!currentWord.startsWith(typingInput.value)) {
        typingInput.value = "";
        typingInput.className = "typing-input";
        currentWordEl.className = "word";
      }
    }, 300);
  }
});

// ========== ボタンイベント ==========
startBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", startGame);
