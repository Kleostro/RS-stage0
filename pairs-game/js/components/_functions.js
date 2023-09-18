import { startGameForest } from "./_forestGame.js";
import { startGameDragon } from "./_dragonGame.js";

const endGame = document.querySelector('.game__end');
const gameBox = document.querySelector('.game__box');

const gameText = document.querySelector('.game__end-text');
const gameRepeatBtn = document.querySelector('.game__btn-repeat');
const gameMenuBtn = document.querySelector('.game__btn-menu-end');
const timer = document.querySelector('.game__timer');
const bgSound = document.querySelector('.bg-sound');
const winSound = document.querySelector('.win-sound');
const lostSound = document.querySelector('.lost-sound');

export const createPairedCardsArr = (count = 4, srcArr) => {
  let cardsArr = [];
  for (let i = 0; i < count; i++) {
    cardsArr.push(srcArr[i], srcArr[i])
  }

  return cardsArr;
};

export const shufflePairedCardsArr = (pairedCardsArr) => {
  for (let i = pairedCardsArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [pairedCardsArr[i], pairedCardsArr[j]] = [pairedCardsArr[j], pairedCardsArr[i]];
  }
  return pairedCardsArr;
};

export const createList = () => {
  const list = document.createElement('ul');
  list.classList.add('list-reset', 'game__list');

  return list
};

export const createListItem = (className) => {
  const li = document.createElement('li');
  li.classList.add(className);

  return li;
};

const repeatGame = (count, time, imageBgSrc) => {
  timer.textContent = `Time left: 0${time - 1}:59`;
  gameBox.innerHTML = '';
  endGame.classList.add('visually-hidden');
  if (imageBgSrc === 'url(img/card-bg-forest.jpg)') {
    startGameForest(gameBox, count, time, imageBgSrc)
  } else if (imageBgSrc === 'url(img/card-bg-dragon.jpg)') {
    startGameDragon(gameBox, count, time, imageBgSrc)
  }
};

export const completeGame = (gameName, count, time, imageBgSrc, minutes, seconds) => {
  gameBox.classList.remove('game__box--visible');

  setTimeout(() => {
    gameBox.classList.add('visually-hidden');
    gameBox.innerHTML = '';
  }, 400);
  let sound = document.querySelector('.game-sound');
  sound.currentTime = 0;
  sound.pause()
  winSound.play()
  setTimeout(() => {
    bgSound.play()
  }, 2500);

  const win = true;
  const lost = false;
  const steps = localStorage.getItem('counter');
  const score = Number(localStorage.getItem('score'));
  const infoArr = JSON.parse(localStorage.getItem('info')) || [];
  const info = new Info(gameName, win, lost, count, time, minutes, seconds, steps, score);
  infoArr.push(info);

  if (infoArr.length > 10) {
    infoArr.shift()
  }

  localStorage.setItem('info', JSON.stringify(infoArr))

  setTimeout(() => {
    gameText.classList.remove('game__end-text--hidden');
    gameText.textContent = 'You win!';
    endGame.classList.remove('visually-hidden');
    setTimeout(() => {
      gameRepeatBtn.classList.remove('game__btn-repeat--hidden');
      gameMenuBtn.classList.remove('game__btn-menu-end--hidden');
    }, 500);
    addInfoGame()
  }, 3000);

  gameRepeatBtn.onclick = () => {
    gameText.classList.add('game__end-text--hidden');
    gameRepeatBtn.classList.add('game__btn-repeat--hidden');
    gameMenuBtn.classList.add('game__btn-menu-end--hidden');
    let sound = document.querySelector('.btn-sound');
    sound.play();
    sound.currentTime = 0;
    bgSound.pause()
    setTimeout(() => {
      repeatGame(count, time, imageBgSrc)
    }, 500);
  }
};

export const lostGame = (gameName, count, time, imageBgSrc) => {
  gameBox.classList.remove('game__box--visible');

  setTimeout(() => {
    gameBox.classList.add('visually-hidden');
    gameBox.innerHTML = '';
  }, 400);
  let sound = document.querySelector('.game-sound');
  sound.currentTime = 0;
  sound.pause()

  lostSound.play()

  setTimeout(() => {
    bgSound.play()
  }, 3000);

  const win = false;
  const lost = true;
  const steps = localStorage.getItem('counter');
  const score = Number(localStorage.getItem('score'));
  const minutes = '00';
  const seconds = '00';
  let infoArr = JSON.parse(localStorage.getItem('info')) || [];
  let info = new Info(gameName, win, lost, count, time, minutes, seconds, steps, score);
  infoArr.push(info);

  if (infoArr.length > 10) {
    infoArr.shift()
  }

  localStorage.setItem('info', JSON.stringify(infoArr))

  setTimeout(() => {
    gameText.classList.remove('game__end-text--hidden');
    gameText.textContent = 'You lost!';
    endGame.classList.remove('visually-hidden');
    setTimeout(() => {
      gameRepeatBtn.classList.remove('game__btn-repeat--hidden');
      gameMenuBtn.classList.remove('game__btn-menu-end--hidden');
    }, 500);
  }, 3000);
  endGame.classList.remove('visually-hidden');

  addInfoGame()

  gameRepeatBtn.onclick = () => {
    gameText.classList.add('game__end-text--hidden');
    gameRepeatBtn.classList.add('game__btn-repeat--hidden');
    gameMenuBtn.classList.add('game__btn-menu-end--hidden');
    let sound = document.querySelector('.btn-sound');
    sound.play();
    bgSound.pause()
    setTimeout(() => {
      repeatGame(count, time, imageBgSrc)
    }, 500);
  }
};

export const createTimer = (gameName, time, count, imageBgSrc) => {
  const currentTime = new Date();
  const deadlineTime = currentTime.setMinutes(currentTime.getMinutes() + time);

  const countdown = setInterval(function () {
    const globalTime = new Date().getTime();
    const restTime = deadlineTime - globalTime;
    let minutes = Math.floor((restTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((restTime % (1000 * 60)) / 1000);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timer.innerHTML = `Time left: ${minutes}:${seconds}`;
    if (restTime < 0) {
      clearInterval(countdown);
      timer.textContent = `Time's up!`;
      lostGame(gameName, count, time, imageBgSrc)
    }

    if (count * 2 === document.querySelectorAll('.success').length) {
      clearInterval(countdown);
      completeGame(gameName, count, time, imageBgSrc, minutes, seconds)
      timer.textContent = `Time left: ${minutes}:${seconds}`;
      return
    }
  }, 1000);
};

function Info(location, win, lost, countPairs, time, minutes, seconds, steps, score) {
  this.location = location,
    this.isWin = win,
    this.isLost = lost,
    this.countPairs = Number(countPairs),
    this.totalTime = Number(time),
    this.restMinutes = Number(minutes),
    this.restSeconds = seconds,
    this.steps = Number(steps),
    this.score = Number(score)
}


export function addInfoGame() {
  const tBody = document.querySelector('.score__tbody');

  let infoArr = JSON.parse(localStorage.getItem('info')) || [];

  if (infoArr.length === 0) {
    const span = document.createElement('span');
    span.textContent = 'The list is empty...';
    span.classList.add('score__text');
    tBody.append(span);
  } else {
    tBody.innerHTML = '';
    for (let i = 0; i < infoArr.length; i++) {
      const tr = document.createElement('tr');
      const indexTd = document.createElement('td');
      const locationTd = document.createElement('td');
      const pairsTd = document.createElement('td');
      const totalTimeTd = document.createElement('td');
      const restTimeTd = document.createElement('td');
      const winTd = document.createElement('td');
      const lostTd = document.createElement('td');
      const stepsTd = document.createElement('td');
      const scoreTd = document.createElement('td');

      indexTd.classList.add('score__tbody-td');
      locationTd.classList.add('score__tbody-td');
      pairsTd.classList.add('score__tbody-td');
      totalTimeTd.classList.add('score__tbody-td');
      restTimeTd.classList.add('score__tbody-td');
      winTd.classList.add('score__tbody-td');
      lostTd.classList.add('score__tbody-td');
      stepsTd.classList.add('score__tbody-td');
      scoreTd.classList.add('score__tbody-td');

      indexTd.textContent = i + 1;
      locationTd.textContent = infoArr[i].location;
      pairsTd.textContent = infoArr[i].countPairs;
      totalTimeTd.textContent = `0${infoArr[i].totalTime}:00`;
      restTimeTd.textContent = `0${infoArr[i].restMinutes}:${infoArr[i].restSeconds}`;
      if (infoArr[i].isWin) {
        winTd.innerHTML = `
        <svg>
          <use xlink:href="img/sprite.svg#win-mark"></use>
        </svg>
        `;
      } else {
        winTd.textContent = '';
      }

      if (infoArr[i].isLost) {
        lostTd.innerHTML = `
        <svg>
          <use xlink:href="img/sprite.svg#lost-mark"></use>
        </svg>
        `;
      } else {
        lostTd.textContent = '';
      }

      stepsTd.textContent = infoArr[i].steps;
      scoreTd.textContent = infoArr[i].score;

      tr.append(indexTd, locationTd, pairsTd, totalTimeTd, restTimeTd, winTd, lostTd, stepsTd, scoreTd);
      tBody.append(tr);
    }
  }
}
