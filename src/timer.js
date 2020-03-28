const electron = require("electron");
const browserWindow = electron.remote.getCurrentWindow();

const timeCurrentElement = document.getElementById("time-current");
const timeTimerElement = document.getElementById("time-timer");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const btnPause = document.getElementById("btn-pause");
const btnBreak5 = document.getElementById("btn-break-5");
const btnBreak10 = document.getElementById("btn-break-10");
const btnBreak30 = document.getElementById("btn-break-30");

// set up the display state of the buttons

btnStop.classList.add("hidden");
btnPause.classList.add("hidden");

// sets the current time display
const setTimeCurrent = () => {
  timeCurrent = new Date();
  timeCurrentElement.innerText = timeCurrent.toLocaleTimeString("UK");
};

// sets the remaining time display
const setTimeTimer = () => {
  timeRemaining = new Date(targetTime - timeCurrent);
  timeRemaining.setHours(0);
  timeTimerElement.innerText = timeRemaining.toLocaleTimeString("UK");
  browserWindow.setTitle(timeRemaining.toLocaleTimeString("UK"));

  // theck if the timer is at 0
  if (timeRemaining.getMinutes() === 0 && timeRemaining.getSeconds() === 0) {
    btnStart.classList.remove("hidden");
    btnStop.classList.add("hidden");
    btnPause.classList.add("hidden");
    btnPause.innerText = "Pause";
    onTimerEnd();
    clearInterval(timeTimerInterval);
  }
};

// initialize the timer countdown
const startTimer = duration => {
  targetTime = new Date();
  targetTime.setMinutes(targetTime.getMinutes() + duration);
  timeTimerInterval = setInterval(setTimeTimer, 1000);
  btnStart.classList.add("hidden");
  btnStop.classList.remove("hidden");
  btnPause.classList.remove("hidden");
};

// stop the timer and reset back to 0
const stopTimer = () => {
  timeTimerElement.innerText = "00:00:00";
  browserWindow.setTitle("Pomodoro timer");
  clearInterval(timeTimerInterval);
  timeTimerInterval = undefined;
  btnStart.classList.remove("hidden");
  btnStop.classList.add("hidden");
  btnPause.classList.add("hidden");
  btnPause.innerText = "Pause";
};

// pause the timer, or restart if currently paused
const pauseOrRestartTimer = () => {
  if (timeTimerInterval) {
    clearInterval(timeTimerInterval);
    timeTimerInterval = undefined;
    timeAtPause = new Date();
    btnPause.innerText = "Resume";
  } else {
    const curTime = new Date();
    const timeBetween = curTime - timeAtPause;
    targetTime.setMilliseconds(targetTime.getMilliseconds() + timeBetween);
    timeTimerInterval = setInterval(setTimeTimer, 1000);
    btnPause.innerText = "Pause";
  }
};

// play a sound
const onTimerEnd = () => {
  const sound = new Audio("./alarm.mp3");
  sound.play();
};

// event listeners

btnStart.addEventListener("click", () => {
  startTimer(25);
});
btnStop.addEventListener("click", stopTimer);
btnPause.addEventListener("click", pauseOrRestartTimer);
btnBreak5.addEventListener("click", () => {
  stopTimer();
  startTimer(5);
});
btnBreak10.addEventListener("click", () => {
  stopTimer();
  startTimer(10);
});
btnBreak30.addEventListener("click", () => {
  stopTimer();
  startTimer(30);
});

// setup the current time
let timeCurrent;
setTimeCurrent();
const timeCurrentInterval = setInterval(setTimeCurrent, 1000);

// set up the timer time
let timeTimerInterval;
let targetTime;
let timeRemaining;
let timeTimer = new Date();
timeTimer.setHours(0);
timeTimer.setMinutes(0);
timeTimer.setSeconds(0);

// keep track of the passed time when paused
let timeAtPause;
