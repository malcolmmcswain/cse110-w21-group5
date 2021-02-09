/********************************* Notes for v1: *************************************
 * A lot of code in this file is going to be DOM (Document-Object Model) manipulation,
 * so make sure you have a good grasp on that before writing any code here.

 * Manipulating time objects in JavaScript can be tricky - make sure you've read up on
 * using the Date object. Provided that it is permitted in the scope of this class, I 
 * would also highly recommend the use of Moment.js, a popular JS library for time
 * and date manipulation.
 ************************************************************************************/

// IDEAS/SUGGESTED STRUCTURE BELOW:
    // This is to give you a starting point, not an explicit map of what your code should look like

// Logical structure:
    // Create some sort of dynamic timer object using Date or Moment
    // Add logic to consider 5 states: work timer, short break timer, long break timer, stopped, reset
    // Bind DOM elements like buttons and signals from pomodoro.js to control the state of this object

/* TODO: Here I'm using global variables to store necessary pointers, which means we cannot have two timers running parallel.
 *       Do we need to fix this?
 *
 * TODO: Due to run time lagging, setInterval has around a 5ms lag each time, which means we lose a whole second every 200 seconds.
*/

function timer(workMins = 25, shortBreakMins = 5, longBreakMins = 15) {
    this.state = 'reset';
    this.countDownDate = null;
    this.countDownTimeout = null;
    this.terminateTimeout = null;
    this.minutesLeft = 0;
    this.secondsLeft = 0;
    this.workMins = workMins;
    this.shortBreakMins = shortBreakMins;
    this.longBreakMins = longBreakMins;
}

timer.prototype.reset = function() {
    this.state = 'reset';
    this.countDownDate = null;
    this.countDownTimeout = null;
    this.terminateTimeout = null;
    this.minutesLeft = 0;
    this.secondsLeft = 0;
}

/**
 * Stop the count down timer
 */
timer.prototype.stop = function() {
    this.state = 'stopped';
    if (this.countDownTimeout) clearInterval(this.countDownTimeout);
    if (this.terminateTimeout) clearTimeout(this.terminateTimeout);
}

/**
 * Start countDown based on passed in param countDownMins
 * @param {*} countDownMins count down time in minutes
 */
timer.prototype.start = function(countDownMins) {
    this.stop();
    let now = new Date();
    this.countDownDate = new Date(now.getTime() + countDownMins * 60 * 1000 + 1000);
    this.countDownTimeout = setInterval(this.countDown.bind(this), 1000);
    this.terminateTimeout = setTimeout(function() {
        clearInterval(countDownTimeout);
    }, countDownMins * 60 * 1000);
}

/**
 * Update timeLeft based on current time and countDownDate
 */
timer.prototype.countDown = function() {
    let now = new Date();
    let timeLeft = this.countDownDate.getTime() - now.getTime();
    this.minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    this.secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
    console.log(`${this.minutesLeft.toString().padStart(2,'0')}:${this.secondsLeft.toString().padStart(2,'0')}`);
}

/**
 * Resume the count down timer
 *
timer.prototype.resume = () => {
    this.start((timeLeft) / (60 * 1000));
} */

timer.prototype.startWorking = function() {
    this.state = 'work';
    this.start(this.workMins);
}

timer.prototype.startShortBreak = function() {
    this.state = 'short_break';
    this.start(this.shortBreakMins);
}

timer.prototype.startLongBreak = function() {
    this.state = 'long_break';
    this.start(this.longBreakMins);
}

let time = new timer();
time.startLongBreak();
setTimeout(() => {time.stop()}, 5000);

// UI structure:
    // Fetch timer from HTML using DOM
    // Manipulate its text content to match that of the timer object state
    // Style its "ring" conditionally (this part will be tricky, ask me if you need help!)
