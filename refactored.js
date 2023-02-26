const Elements = {
  timer: document.querySelector(".timer"),
  button: {
    pomodoro: document.querySelector(".pomodoro"),
    shortBreak: document.querySelector(".short-break"),
    longBreak: document.querySelector(".long-break"),
    start: document.querySelector(".start"),
    reset: document.querySelector(".reset"),
  }
};

const Mode = {
  POMODORO: "POMODORO",
  BREAK_SHORT: "BREAK_SHORT",
  BREAK_LONG: "BREAK_LONG",
};

const Time = {
  [Mode.POMODORO]: 60 * 25,
  [Mode.BREAK_SHORT]: 60 * 5,
  [Mode.BREAK_LONG]: 60 * 15,
};

const ModeButton = {
  [Mode.POMODORO]: Elements.button.pomodoro,
  [Mode.BREAK_SHORT]: Elements.button.shortBreak,
  [Mode.BREAK_LONG]: Elements.button.longBreak,
};

class Timer {
  #timer;
  #time;
  constructor(time) {
    this.#timer = null;
    this.#time = time;
  }

  start(callback, timeout = 1000) {
    this.stop();
    this.#timer = setInterval(() => callback(--this.#time), timeout);
  }

  stop() {
    clearInterval(this.#timer);
  }
}

const State = {
  mode: Mode.POMODORO,
  timer: new Timer(Time[Mode.POMODORO]),
  session: 0,
};

const start = () => {
  State.timer.start(onTick);
  Elements.button.start.textContent = "Stop";
};

const stop = () => {
  State.timer.stop();
  Elements.button.start.textContent = "Start";
};

const reset = () => {
  State.timer.stop();
  State.session = 0;
  setMode(Mode.POMODORO);
  Elements.button.start.textContent = "Start";
};

const setMode = (mode) => {
  State.mode = mode;

  State.timer.stop();
  State.timer = new Timer(Time[mode]);

  Object.values(ModeButton).forEach(btn => btn.classList.remove("active"));

  const currentModeBtn = ModeButton[mode];
  document.body.style.backgroundColor = currentModeBtn.style.backgroundColor;

  currentModeBtn.classList.add("active");

  displayTime(Time[mode]);
};

const onPomodoroEnd = () => {
  State.session++;

  const nextMode = State.session === 4 ? Mode.BREAK_LONG : Mode.BREAK_SHORT;
  setMode(nextMode);
  start();
};

const onShortBreakEnd = () => {
  setMode(Mode.POMODORO);
  start();
};

const onLongBreakEnd = () => {
  setMode(Mode.POMODORO);
};

const onTick = (time) => {
  displayTime(time);

  const hasEnded = time <= 0;
  if (!hasEnded) return;

  reset();

  switch (State.mode) {
    case Mode.POMODORO: return onPomodoroEnd();
    case Mode.BREAK_SHORT: return onShortBreakEnd();
    case Mode.BREAK_LONG: return onLongBreakEnd();
    default: throw new Error(`Unknown mode ${State.mode}`);
  }
};

const pad = (number) => number.toString().padStart(2, "0");
const displayTime = (time = Time.POMODORO) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const display = `${minutes}:${pad(seconds)}`;

  Elements.timer.textContent = display;
  document.title = `(${display}) Pomodoro Timer`;
};

Elements.button.pomodoro.addEventListener("click", () => {
  stop();
  setMode(Mode.POMODORO);
});

Elements.button.shortBreak.addEventListener("click", () => {
  stop();
  setMode(Mode.BREAK_SHORT);
  start();
});

Elements.button.longBreak.addEventListener("click", () => {
  stop();
  setMode(Mode.BREAK_LONG);
  start();
});

Elements.button.start.addEventListener("click", () => {
  if (Elements.button.start.textContent === "Start") start();
  else stop();
});

Elements.button.reset.addEventListener("click", reset);

displayTime(); // display initial time
