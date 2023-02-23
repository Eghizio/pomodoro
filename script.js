const pomodoroBtn = document.querySelector(".pomodoro");
const shortBreakBtn = document.querySelector(".short-break");
const longBreakBtn = document.querySelector(".long-break");
const startBtn = document.querySelector(".start");
const resetBtn = document.querySelector(".reset");
const timer = document.querySelector(".timer");
const body = document.querySelector("body");

let time = 25 * 60; // default time for pomodoro
let timerInterval;
let pomodoroCounter = 0;

function startTimer() {
    timerInterval = setInterval(() => {
        time--;
        displayTime();
        if (time === 0) {
            clearInterval(timerInterval);
            startBtn.textContent = "Start";
            if (pomodoroBtn.classList.contains("active")) {
                pomodoroCounter++;
                if (pomodoroCounter === 4) {
                    longBreakBtn.click();
                    pomodoroCounter = 0;
                } else {
                    shortBreakBtn.click();
                }
            } else if (shortBreakBtn.classList.contains("active")) {
                pomodoroBtn.click();
            } else if (longBreakBtn.classList.contains("active")) {
                pomodoroBtn.click();
                clearInterval(timerInterval);
                pomodoroCounter = 0;
                startBtn.textContent = "Start";
            }
        }
    }, 1000);
}

function displayTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const display = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    timer.textContent = display;
    document.title = `(${display}) Pomodoro Timer`;
}

function resetTimer() {
    clearInterval(timerInterval);
    time = 25 * 60;
    pomodoroCounter = 0;
    displayTime();
    startBtn.textContent = "Start";
}

pomodoroBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    pomodoroBtn.classList.add("active");
    shortBreakBtn.classList.remove("active");
    longBreakBtn.classList.remove("active");
    body.style.backgroundColor = "#C1666B";
    time = 25 * 60;
    displayTime();
    startBtn.textContent = "Start";
});

shortBreakBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    pomodoroBtn.classList.remove("active");
    shortBreakBtn.classList.add("active");
    longBreakBtn.classList.remove("active");
    body.style.backgroundColor = "#91C499";
    time = 5 * 60;
    displayTime();
    startBtn.textContent = "Start";
    startTimer();
});

longBreakBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    pomodoroBtn.classList.remove("active");
    shortBreakBtn.classList.remove("active");
    longBreakBtn.classList.add("active");
    body.style.backgroundColor = "#5386E4";
    time = 15 * 60;
    displayTime();
    startBtn.textContent = "Start";
    startTimer();
});

startBtn.addEventListener("click", () => {
    if (startBtn.textContent === "Start") {
        startBtn.textContent = "Stop";
        startTimer();
    } else {
        startBtn.textContent = "Start";
        clearInterval(timerInterval);
    }
});

resetBtn.addEventListener("click", resetTimer);

displayTime(); // display initial time
