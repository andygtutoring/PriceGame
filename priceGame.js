// priceGame.js
// Product data is in window.PriceGame.Products (from products.js).
// Game variables
let points = 0;
let round = 1;
let currentProduct;
let currentProducts;
// Define the player data object to save and load data in localStorage.
const playerData = {
  currentScore: 0,
  numWins: 0,
  currentRound: 1,
  highestScore: 0
};
// Load existing player data from localStorage
const storedData = JSON.parse(localStorage.getItem('playerData') || '{}');
Object.assign(playerData, storedData);

// Initialize game state with stored data
function initGameState() {
  points = playerData.currentScore;
  wins = playerData.numWins;
  round = playerData.currentRound;
}

// Display points
document.getElementById("points").textContent = `Points: ${points}`;

// Function to start a new round
function startRound() {
  switch (round) {
    case 1:
      auctionRound();
      break;
    case 2:
      miniGameRound();
      break;
    case 3:
      jackpotRound();
      break;
    default:
      endGame();
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const shuffledProducts = shuffleArray(window.PriceGame.Products);
let currentProductIndex = 0;
let allProductNames = "";
for (let i = 0; i < shuffledProducts.length; i++) {
  allProductNames += shuffledProducts[i].name + ", ";
}

function incrementCurrentProductIndex() {
  if (currentProductIndex >= shuffledProducts.length - 1) {
    currentProductIndex = 0;
  }
  else {
    currentProductIndex++;
  }
}

// Function for Auction Round
function auctionRound() {
  document.getElementById("round-title").textContent = "Auction Round";
  currentProduct = shuffledProducts[currentProductIndex];
  incrementCurrentProductIndex();
  document.getElementById("product-display").textContent = currentProduct.name;
  document.getElementById("guess-form").style.display = "block";
  document.getElementById("submit-guess").addEventListener("click", auctionGuess);
}

// Function for Auction Round guess
function auctionGuess(e) {
  e.preventDefault();
  const guess = parseInt(document.getElementById("guess-input").value);
  const computerGuess = Math.floor(Math.random() * (currentProduct.price + 100));
  const result = `You guessed: $${guess}, Computer guessed: $${computerGuess}, Actual price: $${currentProduct.price}`;
  document.getElementById("result-display").textContent = result;
  if (guess <= currentProduct.price && (computerGuess > currentProduct.price || guess >= computerGuess)) {
    points += currentProduct.price;
    animateScoreIncrement(points);
    updatePlayerData(true); // Update player data in localStorage at the end of each round.
    document.getElementById("result-display").style.color = "#0f0";
  } else {
    updatePlayerData(false); // Update player data in localStorage at the end of each round.
    document.getElementById("result-display").style.color = "#f00";
  }
  round++;
  setTimeout(startRound, 3000);
}

// Function for Mini Game Round
function miniGameRound() {
  document.getElementById("round-title").textContent = "Mini Game Round";
  currentProducts = []; // reset for new round.
  for (let i = 0; i < 2; i++) {
    currentProducts.push(shuffledProducts[currentProductIndex]);
    incrementCurrentProductIndex();
  }
  document.getElementById("product-display").innerHTML = `
        <p>Product 1: ${currentProducts[0].name}</p>
        <p>Product 2: ${currentProducts[1].name}</p>
    `;
  document.getElementById("guess-form").style.display = "block";
  document.getElementById("guess-form").innerHTML = `
        <label for="higher-price">Which product has a higher price?</label>
        <select id="higher-price">
            <option value="1">Product 1</option>
            <option value="2">Product 2</option>
        </select>
        <button id="submit-guess">Guess</button>
    `;
  document.getElementById("submit-guess").addEventListener("click", miniGameGuess);
}

// Function for Mini Game Round guess
function miniGameGuess(e) {
  e.preventDefault();
  const guess = document.getElementById("higher-price").value;
  const result = `You guessed: Product ${guess}, Actual higher price: Product ${currentProducts[0].price > currentProducts[1].price ? '1' : '2'}`;
  document.getElementById("result-display").textContent = result;
  if ((guess === '1' && currentProducts[0].price > currentProducts[1].price) || (guess === '2' && currentProducts[0].price < currentProducts[1].price)) {
    points += currentProducts[0].price + currentProducts[1].price;
    animateScoreIncrement(points);
    updatePlayerData(true); // Update player data in localStorage at the end of each round.
    document.getElementById("result-display").style.color = "#0f0";
  } else {
    updatePlayerData(false); // Update player data in localStorage at the end of each round.
    document.getElementById("result-display").style.color = "#f00";
  }
  round++;
  setTimeout(startRound, 3000);
}

// Function for Jackpot Round
function jackpotRound() {
  document.getElementById("round-title").textContent = "Jackpot Round";
  currentProducts = [];
  for (let i = 0; i < 5; i++) {
  alert(currentProductIndex);
    currentProducts.push(shuffledProducts[currentProductIndex]);
    incrementCurrentProductIndex();
  }
  const productsList = currentProducts.map(product => product.name).join(', ');
  document.getElementById("product-display").textContent = `Guess the total price of: ${productsList}`;
  document.getElementById("guess-form").style.display = "block";
  document.getElementById("guess-form").innerHTML = `
        <input type="number" id="guess-input" required>
        <button id="submit-guess">Guess</button>
    `;
  document.getElementById("submit-guess").addEventListener("click", jackpotGuess);
}

// Function for Jackpot Round guess
function jackpotGuess(e) {
  e.preventDefault();
  const guess = parseInt(document.getElementById("guess-input").value);
  const actualTotal = currentProducts.reduce((acc, product) => acc + product.price, 0);
  const computerGuess = Math.floor(Math.random() * (actualTotal + 100));
  const result = `You guessed: $${guess}, Computer guessed: $${computerGuess}, Actual total: $${actualTotal}`;
  document.getElementById("result-display").textContent = result;
  if (guess <= actualTotal && (computerGuess > actualTotal || guess >= computerGuess)) {
    points += actualTotal;
    animateScoreIncrement(points);
    updatePlayerData(true); // Update player data in localStorage at the end of each round.
    document.getElementById("result-display").style.color = "#0f0";
  } else {
    updatePlayerData(false); // Update player data in localStorage at the end of each round.
    document.getElementById("result-display").style.color = "#f00";
  }
  round++;
  setTimeout(endGame, 3000);
}

// Function to animate score increment
function animateScoreIncrement(newScore) {
  let currentScore = parseInt(document.getElementById("points").textContent.split(": ")[1]);
  const scoreDiff = newScore - currentScore;
  const animationDuration = 200; // 0.2 seconds
  const incrementInterval = scoreDiff / animationDuration;

  const scoreInterval = setInterval(() => {
    currentScore += incrementInterval;
    document.getElementById("points").textContent = `Points: ${Math.floor(currentScore)}`;

    if (currentScore >= newScore) {
      clearInterval(scoreInterval);
      document.getElementById("points").textContent = `Points: ${newScore}`;
    }
  }, 1);
}

// Function to end the game
function endGame() {
  document.getElementById("round-title").textContent = "Game Over!";
  document.getElementById("product-display").textContent = `Your final score is: ${points}`;
  document.getElementById("guess-form").style.display = "none";
  document.getElementById("result-display").style.color = "#fff";
}

function updatePlayerData(wonRound) {
  // Update properties as needed
  playerData.currentScore = points;
  if (wonRound) {
    playerData.numWins += 1; // if won
  }
  if (playerData.currentRound >= 3) {
    playerData.currentRound = 1;
  }
  else {
    playerData.currentRound += 1;
  }
  playerData.highestScore = Math.max(playerData.highestScore, points);

  // Store updated player data in localStorage
  localStorage.setItem('playerData', JSON.stringify(playerData));
}

// Start the game
startRound();
