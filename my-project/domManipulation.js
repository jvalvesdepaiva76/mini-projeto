// domManipulation.js

// Função para exibir a bandeira do país correto
export function displayFlag(flagContainer, correctCountry) {
    flagContainer.innerHTML = "";
    const flagElement = document.createElement("img");
    flagElement.src = correctCountry.flags.png;
    flagElement.alt = `Bandeira de ${correctCountry.name.common}`;
    flagContainer.appendChild(flagElement);
  
    setTimeout(() => {
      flagElement.classList.add("show");
    }, 50);
  }
  
  // Função para atualizar o display de pontuação e vidas
  export function updateScoreDisplay(hitCount, points, lives) {
    document.querySelector(".hits").textContent = hitCount;
    document.querySelector(".points").textContent = points;
  
    const livesElement = document.querySelector('.lives');
    livesElement.innerHTML = `Vidas: ${lives}`;
  }
  
  // Função para exibir informações do país correto
  export function showCountryInfo(infoContainer, country) {
    infoContainer.innerHTML = `
      <h3>Informações sobre ${country.name.common}:</h3>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
      <p><strong>Região:</strong> ${country.region}</p>
      <p><strong>Sub-região:</strong> ${country.subregion ? country.subregion : "N/A"}</p>
      <p><strong>População:</strong> ${country.population.toLocaleString()}</p>
    `;
  
    setTimeout(() => {
      infoContainer.classList.add("show");
    }, 50);
  }
  
  // Função para exibir mensagem de acerto ou erro
  export function displayMessage(messageContainer, message, color) {
    messageContainer.innerHTML = `<p style="color: ${color}; font-weight: bold;">${message}</p>`;
  }
  