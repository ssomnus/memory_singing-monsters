const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".memory-game");
const modalWindow = document.getElementById("modal");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Массив карточек
const items = [
    {
        name: "drakog",
        image: "images/2.png"
    },
    {
        name: "cerebro",
        image: "images/8.png"
    },
    {
        name: "strombonin",
        image: "images/9.png"
    },
    {
        name: "chelustygi",
        image: "images/12.png"
    },
    {
        name: "dermit",
        image: "images/14.png"
    },
    {
        name: "lygashka",
        image: "images/18.png"
    },
    {
        name: "fangler",
        image: "images/26.png"
    },
    {
        name: "hippity",
        image: "images/24.png"
    }
];

let seconds = 0, //время
    minutes = 0;

let movesCount = 0, //ходы-повороты и победа
    winCount = 0;

const timeGenerator = () => { //логика времени
    seconds += 1;

    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }

    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Время: </span>${minutesValue}:${secondsValue}`;
};

const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Ходов: </span>${movesCount}`;
};

const generateRandom = (size = 4) => {
    let tempArray = [...items];
    let cardValues = [];
    size = (size * size) / 2;
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before"><img src="images/back.png"></div>
            <div class="card-after">
            <img src="${cardValues[i].image}" class="image"/></div>
        </div>
        `;
    }

    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("matched")) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        winCount += 1;
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            modalWindow.classList.remove("hide");
                            startButton.classList.add("hide");
                            result.innerHTML = `<h4>Ходов: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }
        });
    });
};

startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Ходов: </span> ${movesCount}`;
    initializer();
});

stopButton.addEventListener(
    "click",
    (stopGame = () => {
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
    })
);

const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};