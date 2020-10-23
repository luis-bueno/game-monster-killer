const PLAYER_ATTACK_VALUE = 10;
const PLAYER_STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 15;
const EVENT_PLAYER_ATTACK = 'Player attack';
const EVENT_PLAYER_STRONG_ATTACK = 'Player strong attack';
const EVENT_MONSTER_ATTACK = 'Monster attack';
const EVENT_HEAL = 'Player heal';
const TARGET_PLAYER = 'Player';
const TARGET_MONSTER = 'Monster';

const enteredValue = 100;
// prompt('Please chose the maximum life', '100');
let chosenMaxLife = parseInt(enteredValue);

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
  alert('invalid input. Maximum life was set to 100.');
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenMaxLife);

function writeToLog(event, damage, heal) {
  let entryLog = {
    event: event,
    playerHealth: currentPlayerHealth,
    monsterHealth: currentMonsterHealth,
  };

  switch (event) {
    case EVENT_PLAYER_ATTACK:
    case EVENT_PLAYER_STRONG_ATTACK:
      entryLog.target = TARGET_MONSTER;
      entryLog.damageAttack = damage;
      break;

    case EVENT_HEAL:
      entryLog.healValue = heal;
      break;

    case EVENT_MONSTER_ATTACK:
      entryLog.target = TARGET_PLAYER;
      entryLog.damageAttack = damage;
      break;
  }

  battleLog.push(entryLog);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  adjustHealthBars(chosenMaxLife);
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const monsterDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= monsterDamage;

  writeToLog(EVENT_MONSTER_ATTACK, monsterDamage);

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You would have died, but you had 1 extra life!');
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth >= 0) {
    alert('You won!');
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth >= 0) {
    alert('You lost!');
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You killed the monster and died!');
    reset();
  }
}

function attackMonster(mode) {
  let maxDamage;
  let event;
  if (mode === 'ATTACK') {
    maxDamage = PLAYER_ATTACK_VALUE;
    event = EVENT_PLAYER_ATTACK;
  } else if (mode === 'STRONG ATTACK') {
    maxDamage = PLAYER_STRONG_ATTACK_VALUE;
    event = EVENT_PLAYER_STRONG_ATTACK;
  }
  const playerDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= playerDamage;
  writeToLog(event, playerDamage);
  endRound();
}

function attackHandler() {
  attackMonster('ATTACK');
}

function strongAttackHandler() {
  attackMonster('STRONG ATTACK');
}

function healHandler() {
  let healValue;
  if (currentPlayerHealth > chosenMaxLife - HEAL_VALUE) {
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(EVENT_HEAL, '', healValue);
  endRound();
}

function logHandler() {
  console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healHandler);
logBtn.addEventListener('click', logHandler);
