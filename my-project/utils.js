// utils.js

// Função para selecionar países aleatórios
export function getRandomCountries(countries, count) {
    const shuffled = [...countries].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // Outras funções utilitárias podem ser adicionadas aqui no futuro
  