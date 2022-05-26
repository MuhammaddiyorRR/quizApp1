import { generateAnswer, calcQuiz } from "./utils.js";

const login = document.querySelector(".login");
const userName = document.getElementById("user-name");
const userSurname = document.getElementById("user-surname");
const loginBtn = document.querySelector(".loginBtn");

const level = document.querySelector(".level");
const userMessage = document.querySelector(".user-message");
const hard = document.querySelector(".hard");
const medium = document.querySelector(".medium");
const easy = document.querySelector(".easy");
const gameZone = document.querySelector(".game-zone");

let MAX_TIME;
let MAX_ROUND;
let levelGame;

// switch (levelGame) {
//   case "easy":
//     MAX_ROUND = 10;
//     MAX_TIME = 15;

//     break;
//   case "medium":
//     MAX_ROUND = 15;
//     MAX_TIME = 10;

//     break;
//   case "hard":
//     MAX_ROUND = 30;
//     MAX_TIME = 5;

//     break;
// }

const first_num = document.querySelector(".first-number");
const second_num = document.querySelector(".second-number");
const operation_ui = document.querySelector(".operation");
const answers_ui = document.querySelectorAll(".answer");
const quiz_round = document.querySelector(".quiz-round");
const points_ui = document.querySelector(".points");
const timer_ui = document.querySelector(".timer");
const operations = ["*", "-", "+"];
const quizzes = [];
const classOfStatus = ["fail", "success", "timeout"];

// let timer = MAX_TIME;
let intervalId;
let levelNum;
let timer;

// LOGIC FUNCTIONS
const generateAnswers = (corAnswer) => {
  const answers = [corAnswer];
  for (let i = 1; i < 4; i++) answers[i] = generateAnswer(corAnswer);
  const mixedAnswers = answers.sort(() => Math.random() - 0.5);
  return mixedAnswers;
};

function generateQuiz() {
  switch (levelGame) {
    case "easy":
      levelNum = 20;
      MAX_ROUND = 10;
      MAX_TIME = 15;
      timer = MAX_TIME;
      break;
    case "medium":
      levelNum = 60;
      MAX_ROUND = 15;
      MAX_TIME = 10;
      timer = MAX_TIME;

      break;
    case "hard":
      levelNum = 100;
      MAX_ROUND = 30;
      MAX_TIME = 5;
      timer = MAX_TIME;

      break;
  }

  const firstNum = Math.ceil(Math.random() * levelNum); // 40
  const secondNum = Math.ceil(Math.random() * levelNum); // 33
  const ranOpIdx = Math.floor(Math.random() * operations.length);
  const operation = operations[ranOpIdx]; // +
  const correctAnswer = calcQuiz(firstNum, secondNum, operation);
  const answers = generateAnswers(correctAnswer);
  const selectedIdx = null;
  const quiz = {
    firstNum,
    secondNum,
    operation,
    correctAnswer,
    answers,
    selectedIdx,
  };
  quizzes.push(quiz);
  quiz_round.innerText = quizzes.length;
  return quiz;
}

function nextQuiz() {
  const newQuiz = generateQuiz();
  renderQuiz(newQuiz);
}

function checkTimer() {
  if (timer === 0) {
    timer = MAX_TIME;
    timer_ui.innerText = timer + "s";

    renderPoint(classOfStatus[2]);
    nextQuiz();

    checkFinish();
  }
}

function checkFinish() {
  if (quizzes.length  == MAX_ROUND) {
    alert("Oyin tugadi");
    return clearInterval(intervalId);
  }
}

// EVENT HANDLER FUNCTIONS
function onSelectAnswer({ target }) {
  const currentQuiz = quizzes[quizzes.length - 1]; // currentQuiz
  currentQuiz.selectedIdx = target.id;
  const isCorrect = currentQuiz.correctAnswer === +target.innerText;

  if (quizzes.length  - 1 == MAX_ROUND) {
    alert("Oyin tugadi");
    return clearInterval(intervalId);
  }

  if (isCorrect) {
    timer += 5;
    timer_ui.innerText = timer + "s";
  }
  const classIdx = isCorrect ? 1 : 0;
  renderPoint(classOfStatus[classIdx]);
  nextQuiz();
}

function renderPoint(suffix) {
  const className = `point point--${suffix}`;
  const btn = document.createElement("button");
  btn.className = className;
  btn.innerText = quizzes.length;
  btn.disabled = true;
  points_ui.appendChild(btn);
}

// UI FUNCTIONS
loginBtn.addEventListener("click", () => {
  login.classList.add("hidden");
  level.classList.remove("hidden");
  userMessage.innerText =
    "Salom " +
    " " +
    userName.value +
    " " +
    userSurname.value +
    " !" +
    " O'yin darajasini tanlang:";
});

hard.addEventListener("click", () => {
  levelGame = "hard";
  level.classList.add("hidden");
  gameZone.classList.remove("hidden");
  init();
});
medium.addEventListener("click", () => {
  level.classList.add("hidden");
  gameZone.classList.remove("hidden");
  levelGame = "medium";
  init();
});
easy.addEventListener("click", () => {
  level.classList.add("hidden");
  gameZone.classList.remove("hidden");
  levelGame = "easy";
  init();
});

function renderQuiz(quiz) {
  const { operation, firstNum, secondNum, answers, correctAnswer } = quiz;
  first_num.innerText = firstNum;
  second_num.innerText = secondNum;
  operation_ui.innerText = operation;

  answers_ui.forEach((answer_ui, idx) => {
    answer_ui.innerText = answers[idx];
    answer_ui.id = idx;
    answer_ui.addEventListener("click", onSelectAnswer);
  });
}

function init() {
  const firstQuiz = generateQuiz();
  renderQuiz(firstQuiz);
  createInterval();
}

function createInterval() {
  intervalId = setInterval(() => {
    timer--;
    timer_ui.innerText = timer + "s";
    checkTimer();
  }, 1000);
}

// init();
