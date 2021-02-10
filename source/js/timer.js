// TODO: Timer still has lag each second due to the lag of setInterval. Need to fix this. 

/**
 * Represents a timer object
 * @constructor
 * @param {number} workMins - Length of work timer
 * @param {number} shortBreakMins - Length of short break timer
 * @param {number} longBreakMins - Length of long break timer
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

/**
 * Resets the count down timer
 */
timer.prototype.reset = function() {
    this.state = 'reset';
    this.countDownDate = null;
    this.countDownTimeout = null;
    this.terminateTimeout = null;
    this.minutesLeft = 0;
    this.secondsLeft = 0;
}

/**
 * Stops the count down timer
 */
timer.prototype.stop = function() {
    this.state = 'stopped';
    if (this.countDownTimeout) clearInterval(this.countDownTimeout);
    if (this.terminateTimeout) clearTimeout(this.terminateTimeout);
}

/**
 * Start countDown based on passed in param countDownMins
 * @param {number} countDownMins count down time in minutes
 */
timer.prototype.start = function(countDownMins) {
    this.stop();
    let now = new Date();
    this.countDownDate = new Date(now.getTime() + countDownMins * 60 * 1000 + 1000);
    this.countDownTimeout = setInterval(this.countDown.bind(this), 1000);
    this.terminateTimeout = setTimeout(function() {
        clearInterval(this.countDownTimeout);
    }.bind(this), countDownMins * 60 * 1000 + 1000); // + 1s so we get 00:00 print
}

/**
 * Update timeLeft based on current time and countDownDate
 */
timer.prototype.countDown = function() {
    let now = new Date();
    let timeLeft = this.countDownDate.getTime() - now.getTime();
    this.minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    this.secondsLeft = (timeLeft % (1000 * 60)) / 1000;
    console.log(`${this.minutesLeft.toString().padStart(2,'0')}:${this.secondsLeft.toString().padStart(2,'0')}`);
}

/**
 * Start work timer
 */
timer.prototype.startWorking = function() {
    this.state = 'work';
    this.start(this.workMins);
}

/**
 * Start short break timer
 */
timer.prototype.startShortBreak = function() {
    this.state = 'short_break';
    this.start(this.shortBreakMins);
}

/**
 * Start long break timer
 */
timer.prototype.startLongBreak = function() {
    this.state = 'long_break';
    this.start(this.longBreakMins);
}

/*
 * Resume the count down timer
 *
timer.prototype.resume = () => {
    this.start((timeLeft) / (60 * 1000));
} */

// UI structure:
    // Fetch timer from HTML using DOM
    // Manipulate its text content to match that of the timer object state
    // Style its "ring" conditionally (this part will be tricky, ask me if you need help!)
module.exports = timer;