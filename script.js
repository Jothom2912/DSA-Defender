import StaticArray from "./StaticArray.js";

window.addEventListener("load", start);

// Hardcoded sizes - should probably be dynamic with regards to the CSS ...
const gamesizes = {
  width: 800,
  height: 600,
  enemy: 64,
};

let gameRunning = true;
let health = 100;
let score = 0;

function start() {
  console.log("Game is running");
  // build list of enemies
  createInitialEnemies();
  // ready to start
  resetGame();
  // begin the loop
  requestAnimationFrame(loop);


}

function resetGame() {
  gameRunning = true;
  health = 100;
  score = 0;
}

// **************************************
//  ENEMIES - code for handling the list
// **************************************

// the list of enemies is an array of size 5 - but it could be larger ...
const enemies = new StaticArray(5); 

let firstEnemy = null; 

function createInitialEnemies() {
 // Spawner 5 enemies da i er 5
  for (let i = 0; i < 5; i++) {
    enemies[i] = spawnNewEnemy();
  }
}

// Kalder funktionen createEnemy når firstEnemy er null. Hvis ikke firstEnemy er null
// Bliver den næste i rækken til firstEnemy indtil den finder en der er null, med mindre der ik er nogen hvilket betyder der er 5

function spawnNewEnemy() {
  const enemy = createEnemy();

  if(firstEnemy == null) {
    firstEnemy = enemy
  } else {
    enemy.next = firstEnemy
    firstEnemy = enemy;
  }
  
  return enemy;
}

// removes an enemy object from the list of enemies
function removeEnemy(enemy) {

  // Så hvis den første enemy du clicker på er FirstEnemy(Altså den første i min liste), vil den fjerne
  // den og bruge den næste enemy i min linkedlist som FirstEnemy
  // jeg sætter current til first enemy så mit loop starter der. Jeg looper her efter igennem min liste
  // current.next !== null sørge for jeg looper igennem min liste så længe der er en enemy
  // current.next !== enemy looper igennem indtil den finder enemy. Efter som removeEnemy bliver kaldt
  // er det altså den enemy vi leder efter removeEnemy(enemy). Altså når current = enemy ved vi der er den
  if (firstEnemy === enemy) {
    console.log("Removing the first enemy:", enemy);
    firstEnemy = enemy.next;
    } else {
      let current = firstEnemy;
      while (current.next !== null && current.next !== enemy) {
        current = current.next;
      }
      if (current.next === enemy) {
        console.log("Removing enemy:", enemy);
        current.next = enemy.next;
      } else {
        console.log("Enemy not found in the list:", enemy);
      }
    }
  }
  


// returns the number of enemy objects in the list of enemies
function numberOfEnemies() {
  
  function numberOfEnemies() {
    let count = 0;
    let current = firstEnemy;
  
    // Jeg looper igennem min liste a enemies indtil den er null, hvilket vil være 5.
    while (current !== null) {
      count++;
      current = current.next;
    }
  
    return count;
  }

}

// ************************************************
//  ENEMIES - code for handling individual objects
// ************************************************

// creates a new enemy object and visual representation - returns the object
// also registers click on the object to call the "killEnemy" function
function createEnemy() {
  // create visual representation
  const div = document.createElement("div");
  div.textContent = "🤖";
  div.classList.add("enemy");
  document.querySelector("#enemies").append(div);

  // create enemy object
  const enemy = {
    x: Math.floor(Math.random() * (gamesizes.width - gamesizes.enemy)),
    y: -gamesizes.enemy,
    ySpeed: Math.floor(Math.random() * 50 + 50),
    visual: div,
  };

  div.addEventListener("mousedown", clickEnemy);
  function clickEnemy(event) {
    div.removeEventListener("mousedown", clickEnemy);
    killEnemy(enemy);
  }

  return enemy;
}

// resets an existing enemy object to begin outside the screen
function resetEnemy(enemy) {
  enemy.x = Math.floor(Math.random() * (gamesizes.width - gamesizes.enemy));
  enemy.y = -gamesizes.enemy;
  enemy.ySpeed = Math.floor(Math.random() * 50 + 50);
  enemy.isFrozen = false;
}

// crashes an enemy into the ground, displays animation, and resets
function crashEnemy(enemy) {
  enemy.isFrozen = true;
  enemy.visual.classList.add("crash");
  enemy.visual.addEventListener("animationend", removeCrash);
  function removeCrash() {
    enemy.visual.classList.remove("crash");
    enemy.visual.removeEventListener("animationend", removeCrash);
    // reset this enemy
    resetEnemy(enemy);
  }
}

function killEnemy(enemy) {
  enemy.isFrozen = true;
  enemy.visual.classList.add("explode");
  enemy.visual.addEventListener("animationend", completeKill);
  function completeKill() {
    console.log("complete kill");
    enemy.visual.remove();
    removeEnemy(enemy);
  }
}

// display an enemy's visual representation
function displayEnemy(enemy) {
  enemy.visual.style.setProperty("--x", enemy.x);
  enemy.visual.style.setProperty("--y", enemy.y);
}

// *****************************
//  Other visuals
// *****************************

// displays the health bar
function displayHealth() {
  document.querySelector("#healthbar").style.setProperty("--health", health);
}

// shakes the screen - used when an enemy crashes
function shakeScreen() {
  const gamefield = document.querySelector("#gamefield");
  gamefield.classList.add("shake");
  gamefield.addEventListener("animationend", removeShake);
  function removeShake() {
    gamefield.removeEventListener("animationend", removeShake);
    gamefield.classList.remove("shake");
  }
}

// *****************************
//  MAIN LOOP -
// *****************************

let last = 0;

function loop() {
  const now = Date.now();
  const deltaTime = (now - (last || now)) / 1000;
  last = now;

  // ****
  // Loop through all enemies - and move them until the reach the bottom
  // ****


let enemy = firstEnemy;
while (enemy){

  for (const enemy of enemies) {
    // TODO: Only look at actual enemy objects from the list ...

    // ignore enemies who are dying or crashing - so they don't move any further
    if (!enemy.isFrozen) {
      enemy.y += enemy.ySpeed * deltaTime;
      // handle enemy hitting bottom
      if (enemy.y >= gamesizes.height - gamesizes.enemy) {
        enemyHitBottom(enemy);
      }
    }
  }
    enemy = enemy.next;
}

  // Check for game over
  if (health <= 0) {
    console.log("GAME OVER");
    gameRunning = false;
  }

  // Check for level complete
  if (numberOfEnemies() <= 0) {
    console.log("LEVEL COMPLETE");
    gameRunning = false;
  }

  // ****
  // Loop through all enemies - and update their visuals
  // ****



  for (const enemy of enemies) {
    // TODO: Only do this for actual enemy objects from the list ...
    displayEnemy(enemy);
  }


  // update health display
  displayHealth();

  // repeat
  if (gameRunning) {
    requestAnimationFrame(loop);
  }
}




function enemyHitBottom(enemy) {
  console.log("Enemy attacked base!");
  
  // lose health
  health -= 5;
  // display crash on enemy
  crashEnemy(enemy);
  // and on entire screen
  shakeScreen();
  // spawn another enemy
  spawnNewEnemy();
}
