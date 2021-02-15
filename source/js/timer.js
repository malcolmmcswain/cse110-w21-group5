// TODO: Timer still has lag each second due to the lag of setInterval. Need to fix this. 

const multipliers = {
    SECOND: 1000,
    MINUTE: 60000
}

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
    this.workMins = workMins;
    this.shortBreakMins = shortBreakMins;
    this.longBreakMins = longBreakMins;

    // Used for internal testing
    this.minutesLeft = 0;
    this.secondsLeft = 0;
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

    /* 
     * Terminate automatic stop. Needed when user terminates timer
     * early to prevent an incorrect automatic stop when a new timer
     * is started.
     */
    if (this.terminateTimeout) clearTimeout(this.terminateTimeout);
}

/**
 * Start countDown based on passed in param countDownMins
 * @param {number} countDownMins count down time in minutes
 */
timer.prototype.start = function(countDownMins) {
    this.stop();
    let now = new Date();
    let countDownOffset = countDownMins * multipliers.MINUTE; 
    this.countDownDate = new Date(now.getTime() + countDownOffset);

    /* Neat hack to prevent lag of the first second */
    setTimeout(this.countDown.bind(this, 0));
    this.countDownTimeout = setInterval(this.countDown.bind(this), 1000);
    this.terminateTimeout = setTimeout(this.stop.bind(this), countDownOffset + 1000);  // + 1s so we get 00:00 print
}

/**
 * Update timeLeft based on current time and countDownDate
 */
timer.prototype.countDown = function() {
    function timerPad(timerField) {
        return timerField.toString().padStart(2, '0');
    }

    let now = new Date();
    let timeLeft = this.countDownDate - now;
    this.minutesLeft = Math.floor((timeLeft / multipliers.MINUTE));
    this.secondsLeft = Math.floor((timeLeft / multipliers.SECOND) % 60);
    console.log(`${timerPad(this.minutesLeft)}:${timerPad(this.secondsLeft)}`);
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