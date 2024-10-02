import './style.css';

const flagContainer = document.querySelector(".flag-container");
const nameContainer = document.querySelector(".name-container");
const playBtn = document.querySelector("#playBtn");
const hitsElement = document.querySelector(".hits");
const pointsElement = document.querySelector(".points");
const infoContainer = document.createElement("div"); // Contêiner para as informações do país
infoContainer.classList.add("info-container");
const messageContainer = document.createElement("div"); // Contêiner para mensagens de feedback
messageContainer.classList.add("message-container");
const introText = document.querySelector('.intro-text'); // Seleciona a div com a classe "intro-text"

let hitCount = 0;
let points = 0;
let lives = 3; // Começando com 3 vidas
let countries = [];
let nextButton;
let gameOver = false;
let attempts = []; // Array para armazenar as pontuações de cada tentativa

// Função para buscar os países da API REST Countries
async function fetchCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  countries = await res.json();
}

// Inicializar o jogo ao clicar no botão de "Play"
playBtn.addEventListener("click", () => {
  playBtn.style.display = "none";
  // Esconder a intro-text ao clicar em Play
  introText.style.display = "none";
  startGame();
});

function startGame() {
  gameOver = false;
  lives = 3;
  hitCount = 0;
  points = 0;
  attempts = []; // Zera o array de tentativas ao iniciar um novo jogo
  updateScoreDisplay();

  if (countries.length === 0) {
    fetchCountries().then(() => {
      displayNewQuestion();
    });
  } else {
    displayNewQuestion();
  }
}

function displayNewQuestion() {
  if (gameOver) return; // Se o jogo terminou, não exibe mais perguntas

  flagContainer.innerHTML = "";
  nameContainer.innerHTML = "";
  infoContainer.innerHTML = "";
  messageContainer.innerHTML = "";

  const selectedCountries = getRandomCountries(4);
  const correctCountry = selectedCountries[Math.floor(Math.random() * selectedCountries.length)];

  // Exibir bandeira correta
  const flagElement = document.createElement("img");
  flagElement.src = correctCountry.flags.png;
  flagElement.alt = `Bandeira de ${correctCountry.name.common}`;
  flagContainer.appendChild(flagElement);

  // Adiciona a animação suave
  setTimeout(() => {
    flagElement.classList.add("show");
  }, 50);

  // Usando Array.map() para gerar os botões das opções
  selectedCountries.map(country => {
    const button = document.createElement("button");
    button.classList.add("country-name-button");
    button.textContent = country.name.common;
    button.addEventListener("click", () => checkAnswer(country, correctCountry));
    nameContainer.appendChild(button);
  });

  // Adicionar o contêiner de informações ao DOM
  flagContainer.appendChild(infoContainer);
  flagContainer.appendChild(messageContainer);
}

// Função que atualiza o placar baseado nas tentativas
function updateScore() {
  // Usando reduce para acumular a pontuação total
  points = attempts.reduce((total, score) => total + score, 0);
  hitsElement.textContent = hitCount;
  pointsElement.textContent = points;
  const livesElement = document.querySelector('.lives');
  livesElement.innerHTML = `Vidas: ${lives}`;
}

function checkAnswer(selectedCountry, correctCountry) {
  if (gameOver) return; // Se o jogo terminou, não avalia mais respostas

  showCountryInfo(correctCountry);

  if (selectedCountry.name.common === correctCountry.name.common) {
    hitCount++;
    attempts.push(100); // Adiciona 100 ao array de tentativas em caso de acerto
    displayMessage("Você acertou!", "green");
  } else {
    lives--; // Remove uma vida ao errar
    attempts.push(0); // Adiciona 0 ao array de tentativas em caso de erro
    displayMessage(`Você errou! A resposta correta era ${correctCountry.name.common}.`, "red");
  }

  updateScore(); // Atualiza o placar chamando a função que usa reduce

  // Verifica se o jogo acabou
  if (lives === 0) {
    endGame();
  } else {
    addNextButton();
  }
}

// Exibir informações do país com animação
function showCountryInfo(country) {
  infoContainer.innerHTML = `
    <h3>Informações sobre ${country.name.common}:</h3>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    <p><strong>Região:</strong> ${country.region}</p>
    <p><strong>Sub-região:</strong> ${country.subregion ? country.subregion : "N/A"}</p>
    <p><strong>População:</strong> ${country.population.toLocaleString()}</p>
  `;

  // Adiciona a animação suave
  setTimeout(() => {
    infoContainer.classList.add("show");
  }, 50);
}

// Exibir mensagem de acerto ou erro
function displayMessage(message, color) {
  messageContainer.innerHTML = `<p style="color: ${color}; font-weight: bold;">${message}</p>`;
}

// Adicionar botão "Próximo"
function addNextButton() {
  if (nextButton) {
    nextButton.remove(); // Remove o botão anterior, se houver
  }

  nextButton = document.createElement("button");
  nextButton.textContent = "Próximo";
  nextButton.classList.add("next-button");
  nextButton.addEventListener("click", () => {
    displayNewQuestion();
    nextButton.remove(); // Remove o botão depois de clicar
  });

  flagContainer.appendChild(nextButton);
}

// Função para atualizar o display do placar e vidas
function updateScoreDisplay() {
  hitsElement.textContent = hitCount;
  pointsElement.textContent = points;

  // Mostra as vidas restantes visualmente (pode ser com corações, números, etc.)
  const livesElement = document.querySelector('.lives');
  livesElement.innerHTML = `Vidas: ${lives}`;
}

// Finaliza o jogo e mostra a pontuação
function endGame() {
  gameOver = true;
  messageContainer.innerHTML = `<p style="color: red; font-weight: bold;">Fim de jogo! Sua pontuação final é: ${points}</p>`;

  // Adicionar o botão "Jogar Novamente"
  const restartButton = document.createElement("button");
  restartButton.textContent = "Jogar Novamente";
  restartButton.classList.add("restart-button");
  restartButton.addEventListener("click", () => {
    restartGame();
    restartButton.remove(); // Remove o botão depois de clicar
  });
  flagContainer.appendChild(restartButton);
}

// Reiniciar o jogo
function restartGame() {
  lives = 3;
  hitCount = 0;
  points = 0;
  attempts = []; // Reinicia as tentativas
  gameOver = false;

  updateScoreDisplay(); // Atualiza o display para os valores iniciais
  displayNewQuestion(); // Recomeça o jogo com uma nova rodada
}

// Função para selecionar países aleatórios
function getRandomCountries(count) {
  const shuffled = [...countries].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Adiciona o elemento para mostrar as vidas
document.addEventListener("DOMContentLoaded", () => {
  const livesElement = document.createElement('div');
  livesElement.classList.add('lives');
  livesElement.innerHTML = `Vidas: ${lives}`;
  document.querySelector('.result').appendChild(livesElement);
});
