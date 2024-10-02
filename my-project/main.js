import './style.css';
import { getRandomCountries } from './utils';
import { displayFlag, updateScoreDisplay, showCountryInfo, displayMessage } from './domManipulation';

const flagContainer = document.querySelector(".flag-container");
const nameContainer = document.querySelector(".name-container");
const playBtn = document.querySelector("#playBtn");
const hitsElement = document.querySelector(".hits");
const pointsElement = document.querySelector(".points");
const infoContainer = document.createElement("div"); 
infoContainer.classList.add("info-container");
const messageContainer = document.createElement("div");
messageContainer.classList.add("message-container");
const introText = document.querySelector('.intro-text');

let hitCount = 0;
let points = 0;
let lives = 3;
let countries = [];
let nextButton;
let gameOver = false;
let attempts = [];

async function fetchCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  countries = await res.json();
}

playBtn.addEventListener("click", () => {
  playBtn.style.display = "none";
  introText.style.display = "none";
  startGame();
});

function startGame() {
  gameOver = false;
  lives = 3;
  hitCount = 0;
  points = 0;
  attempts = [];
  updateScoreDisplay(hitCount, points, lives);

  if (countries.length === 0) {
    fetchCountries().then(() => {
      displayNewQuestion();
    });
  } else {
    displayNewQuestion();
  }
}

function displayNewQuestion() {
  if (gameOver) return;

  flagContainer.innerHTML = "";
  nameContainer.innerHTML = "";
  infoContainer.innerHTML = "";
  messageContainer.innerHTML = "";

  const selectedCountries = getRandomCountries(countries, 4);
  const correctCountry = selectedCountries[Math.floor(Math.random() * selectedCountries.length)];

  // Exibir a bandeira correta usando a função do módulo
  displayFlag(flagContainer, correctCountry);

  // Usar Array.map() para gerar os botões das opções
  selectedCountries.map(country => {
    const button = document.createElement("button");
    button.classList.add("country-name-button");
    button.textContent = country.name.common;
    button.addEventListener("click", () => checkAnswer(country, correctCountry));
    nameContainer.appendChild(button);
  });

  flagContainer.appendChild(infoContainer);
  flagContainer.appendChild(messageContainer);
}

function checkAnswer(selectedCountry, correctCountry) {
  if (gameOver) return;

  showCountryInfo(infoContainer, correctCountry);

  if (selectedCountry.name.common === correctCountry.name.common) {
    hitCount++;
    attempts.push(100);
    displayMessage(messageContainer, "Você acertou!", "green");
  } else {
    lives--;
    attempts.push(0);
    displayMessage(messageContainer, `Você errou! A resposta correta era ${correctCountry.name.common}.`, "red");
  }

  updateScore();
  if (lives === 0) {
    endGame();
  } else {
    addNextButton();
  }
}

function updateScore() {
  points = attempts.reduce((total, score) => total + score, 0);
  updateScoreDisplay(hitCount, points, lives);
}

function addNextButton() {
  if (nextButton) {
    nextButton.remove();
  }

  nextButton = document.createElement("button");
  nextButton.textContent = "Próximo";
  nextButton.classList.add("next-button");
  nextButton.addEventListener("click", () => {
    displayNewQuestion();
    nextButton.remove();
  });

  flagContainer.appendChild(nextButton);
}

function endGame() {
  gameOver = true;
  messageContainer.innerHTML = `<p style="color: red; font-weight: bold;">Fim de jogo! Sua pontuação final é: ${points}</p>`;

  const restartButton = document.createElement("button");
  restartButton.textContent = "Jogar Novamente";
  restartButton.classList.add("restart-button");
  restartButton.addEventListener("click", () => {
    restartGame();
    restartButton.remove();
  });
  flagContainer.appendChild(restartButton);
}

function restartGame() {
  lives = 3;
  hitCount = 0;
  points = 0;
  attempts = [];
  gameOver = false;

  updateScoreDisplay(hitCount, points, lives);
  displayNewQuestion();
}

document.addEventListener("DOMContentLoaded", () => {
  const livesElement = document.createElement('div');
  livesElement.classList.add('lives');
  livesElement.innerHTML = `Vidas: ${lives}`;
  document.querySelector('.result').appendChild(livesElement);
});
