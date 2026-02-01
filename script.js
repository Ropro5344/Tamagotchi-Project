const gameStarted = true;

let health = 100;
let hunger = 100;
let sleep = 100;
let joy = 100;
let coins = parseFloat(localStorage.getItem("coins")) || 0;
let alive = "true";
let lastCoinTime = Date.now();
let ecoRoundActive = false;
let headhunterActive = false;
let fullBuyActive = false;
let viperActive = false;

function start_game() {
  health = health;
  hunger = hunger;
  sleep = sleep;
  joy = joy;
  coins = coins;
  lastCoinTime = Date.now();
  ecoRoundActive = false;
  headhunterActive = false;
  fullBuyActive = false;
  viperActive = false;

  localStorage.setItem("health", 100);
  localStorage.setItem("hunger", 100);
  localStorage.setItem("sleep", 100);
  localStorage.setItem("joy", 100);
  localStorage.setItem("coins", 0);
  localStorage.setItem("lastCoinTime", Date.now());
  localStorage.setItem("ecoRoundActive", false);
  localStorage.setItem("headhunterActive", false);
  localStorage.setItem("fullBuyActive", false);
  localStorage.setItem("viperActive", false);

  update_ui();
}

function save() {
  localStorage.setItem("health", health);
  localStorage.setItem("hunger", hunger);
  localStorage.setItem("sleep", sleep);
  localStorage.setItem("joy", joy);
  localStorage.setItem("coins", coins);
  localStorage.setItem("lastCoinTime", lastCoinTime);
  localStorage.setItem("ecoRoundActive", ecoRoundActive);
  localStorage.setItem("headhunterActive", headhunterActive);
  localStorage.setItem("fullBuyActive", fullBuyActive);
  localStorage.setItem("viperActive", viperActive);
}

function resetGame() {
  save();
  update_ui();
  start_game();
}

function decrease_values() {
  if (alive !== "true") return;

  health--;
  hunger--;
  sleep--;
  joy--;

  if (hunger < 0 || sleep < 0 || joy < 0 || health < 0) {
    alert("HORCUS IS DOOD💀💀💀");
    health = 100;
    hunger = 100;
    sleep = 100;
    joy = 100;
    coins = 0;
    ecoRoundActive = false;
    headhunterActive = false;
    fullBuyActive = false;
    viperActive = false;
    lastCoinTime = Date.now();
    save();
    window.location.href = "start.html";
    return;
  }

  update_ui();
  save();
}

function updateCharacterImage() {
  const characterImg = document.getElementById("characterImage");

  if (!characterImg) return;

  if (hunger <= 0 || sleep <= 0 || joy <= 0 || health <= 0) {
    characterImg.src = "./images/skull-horcus.png";
  } else if (hunger <= 30 || sleep <= 30 || joy <= 30 || health <= 30) {
    characterImg.src = "./images/sad-horcus.png";
  } else {
    characterImg.src = "./images/tamagotchi-character.png";
  }
}

function update_ui() {
  const healthEl = document.getElementById("health");
  const hungerEl = document.getElementById("hunger");
  const sleepEl = document.getElementById("sleep");
  const joyEl = document.getElementById("joy");
  const coinsEl = document.getElementById("coins");

  if (healthEl) healthEl.innerHTML = health;
  if (hungerEl) hungerEl.innerHTML = hunger;
  if (sleepEl) sleepEl.innerHTML = sleep;
  if (joyEl) joyEl.innerHTML = joy;
  if (coinsEl) coinsEl.textContent = Math.floor(coins);

  updateCharacterImage();
  updateStatusMessages();
}

function updateStatusMessages() {
  const statusArray = [];

  if (health <= 30) statusArray.push("ik ben ziek");
  if (hunger <= 30) statusArray.push("Ik heb honger");
  if (sleep <= 30) statusArray.push("Ik ben moe");
  if (joy <= 30) statusArray.push("Ik wil spelen");

  const statusEl = document.getElementById("statusMessages");
  if (statusEl) {
    statusEl.textContent = statusArray.join(" | ");
  }
}

setInterval(decrease_values, 1000);

const hasSave = localStorage.getItem("coins") !== null;

if (gameStarted && !hasSave) {
  start_game();
} else if (!gameStarted) {
  window.location.href = "start.html";
} else {
  health = parseFloat(localStorage.getItem("health")) || health;
  hunger = parseFloat(localStorage.getItem("hunger")) || hunger;
  sleep = parseFloat(localStorage.getItem("sleep")) || sleep;
  joy = parseFloat(localStorage.getItem("joy")) || joy;
  coins = parseFloat(localStorage.getItem("coins")) || coins;
  lastCoinTime = parseFloat(localStorage.getItem("lastCoinTime")) || lastCoinTime;
  ecoRoundActive = localStorage.getItem("ecoRoundActive") === "true";
  headhunterActive = localStorage.getItem("headhunterActive") === "true";
  fullBuyActive = localStorage.getItem("fullBuyActive") === "true";
  viperActive = localStorage.getItem("viperActive") === "true";

  update_ui();
}

const video = document.getElementById("actionVideo");

const healSound = new Audio("./audio/adios.mp3");
const playSound = new Audio("./audio/VAMOS.mp3");
const sleepSound = new Audio("./audio/emotional horcus.mp3");
const eatSound = new Audio("./audio/MY ACE.mp3");

function playAction(videoSrc) {
  if (!video) return;
  video.src = videoSrc;
  video.style.display = "block";
  video.play();
  video.onended = () => {
    video.style.display = "none";
    video.src = "";
  };
}

function heal() {
  const maxH = getMaxStat("health");
  const inc = viperActive ? 2 : 1;
  health = Math.min(health + inc, maxH);
  healSound.currentTime = 0;
  healSound.play();
  playAction("./video/horcus-wink.mp4");
  update_ui();
  save();
}

function eat() {
  const maxHn = getMaxStat("hunger");
  const inc = viperActive ? 20 : 10;
  hunger = Math.min(hunger + inc, maxHn);
  eatSound.currentTime = 0;
  eatSound.play();
  playAction("./video/horcus-wink.mp4");
  update_ui();
  save();
}

function sleepAction() {
  const maxS = getMaxStat("sleep");
  const inc = viperActive ? 20 : 10;
  sleep = Math.min(sleep + inc, maxS);
  sleepSound.currentTime = 0;
  sleepSound.play();
  playAction("./video/horcus-wink.mp4");
  update_ui();
  save();
}

function playGame() {
  const maxJoy = getMaxStat("joy");
  const inc = viperActive ? 20 : 10;
  joy = Math.min(joy + inc, maxJoy);
  playSound.currentTime = 0;
  playSound.play();
  playAction("./video/horcus-wink.mp4");
  update_ui();
  save();
}

function getMaxStat(stat) {
  let base = 100;
  if (stat === "joy" && headhunterActive) base = base * 1.5;
  if (viperActive) base = base * 2;
  return base;
}

function updateCoins() {
  const now = Date.now();
  const elapsed = Math.floor((now - lastCoinTime) / 10000);

  if (elapsed > 0) {
    const coinMultiplier = fullBuyActive ? 3 : ecoRoundActive ? 2 : 1;
    const finalMultiplier = viperActive ? coinMultiplier * 0.5 : coinMultiplier;
    coins += elapsed * finalMultiplier;
    lastCoinTime += elapsed * 10000;
    update_ui();
    save();
  }
}

updateCoins();
setInterval(updateCoins, 1000);

function upgrades() {
  if (ecoRoundActive) {
    alert("Already purchased");
    return;
  }

  if (coins >= 10) {
    coins -= 10;
    ecoRoundActive = true;
    lastCoinTime = Date.now();
    save();
    update_ui();
    alert("Upgrade purchased!");

    const upgradeBtn = document.getElementById("ecoRoundBtn");
    if (upgradeBtn) {
      upgradeBtn.textContent = "Purchased";
      upgradeBtn.disabled = true;
      upgradeBtn.style.opacity = "0.5";
      upgradeBtn.style.cursor = "not-allowed";
      upgradeBtn.style.backgroundColor = "#90EE90";
    }

    const coinsShop = document.getElementById("coinsShop");
    if (coinsShop) {
      coinsShop.textContent = coins;
    }
  } else {
    alert("You don't have enough coins! You need 10 coins.");
  }
}

function gymSession() {
  if (coins >= 10) {
    coins -= 10;
    const maxH = getMaxStat("health");
    health = maxH;
    lastCoinTime = Date.now();

    save();
    update_ui();
    alert("Gym Session purchased! Health restored to 100!");

    const coinsShop = document.getElementById("coinsShop");
    if (coinsShop) {
      coinsShop.textContent = coins;
    }
  } else {
    alert("You don't have enough coins! You need 10 coins.");
  }
}

function headhunter() {
  if (headhunterActive) {
    alert("Already purchased");
    return;
  }

  if (coins >= 20) {
    coins -= 20;
    headhunterActive = true;
    lastCoinTime = Date.now();
    joy = Math.min(getMaxStat("joy"), getMaxStat("joy"));
    save();
    update_ui();

    const upgradeBtn = document.getElementById("headhunterBtn");
    if (upgradeBtn) {
      upgradeBtn.textContent = "Purchased";
      upgradeBtn.disabled = true;
      upgradeBtn.style.opacity = "0.5";
      upgradeBtn.style.cursor = "not-allowed";
      upgradeBtn.style.backgroundColor = "#90EE90";
    }

    const coinsShop = document.getElementById("coinsShop");
    if (coinsShop) {
      coinsShop.textContent = coins;
    }

    alert("Headhunter purchased! Joy boosted!");
  } else {
    alert("You don't have enough coins! You need 20 coins.");
  }
}

function fullBuy() {
  const cost = 30;
  if (fullBuyActive) {
    alert("Already purchased");
    return;
  }

  if (coins >= cost) {
    coins -= cost;
    fullBuyActive = true;
    lastCoinTime = Date.now();
    save();
    update_ui();

    const upgradeBtn = document.getElementById("fullBuyBtn");
    if (upgradeBtn) {
      upgradeBtn.textContent = "Purchased";
      upgradeBtn.disabled = true;
      upgradeBtn.style.opacity = "0.5";
      upgradeBtn.style.cursor = "not-allowed";
      upgradeBtn.style.backgroundColor = "#90EE90";
    }

    const coinsShop = document.getElementById("coinsShop");
    if (coinsShop) {
      coinsShop.textContent = coins;
    }

    alert("Full Buy purchased! You'll now earn 3 coins per 10 seconds!");
  } else {
    alert(`You don't have enough coins! You need ${cost} coins.`);
  }
}

function viper() {
  const cost = 25;
  if (viperActive) {
    alert("Already purchased");
    return;
  }

  if (coins >= cost) {
    coins -= cost;
    viperActive = true;
    lastCoinTime = Date.now();

    health = Math.min(health * 2, getMaxStat("health"));
    hunger = Math.min(hunger * 2, getMaxStat("hunger"));
    sleep = Math.min(sleep * 2, getMaxStat("sleep"));
    joy = Math.min(joy * 2, getMaxStat("joy"));

    save();
    update_ui();

    const upgradeBtn = document.getElementById("viperBtn");
    if (upgradeBtn) {
      upgradeBtn.textContent = "Purchased";
      upgradeBtn.disabled = true;
      upgradeBtn.style.opacity = "0.5";
      upgradeBtn.style.cursor = "not-allowed";
      upgradeBtn.style.backgroundColor = "#90EE90";
    }

    const coinsShop = document.getElementById("coinsShop");
    if (coinsShop) {
      coinsShop.textContent = Math.floor(coins);
    }


    alert("Viper purchased! Coin income halved; health, sleep and joy doubled.");
  } else {
    alert(`You don't have enough coins! You need ${cost} coins.`);
  }
}

const upgradesBtn = document.getElementById("upgradesBtn");
if (upgradesBtn) {
  upgradesBtn.onclick = () => {
    save();
    window.location.href = "upgrades.html";
  };
}
