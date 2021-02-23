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
function timer(timeDisplay, backgroundRing, burndownRing, burndownAnim, counterText, counterState,
               workMins = 25, shortBreakMins = 5, longBreakMins = 15, longBreakInterval = 4) {
    // State management
    this.state = 'reset';
    this.counter = 0;

    // Properties
    this.countDownDate = null;
    this.countDownTimeout = null;
    this.workMins = workMins;
    this.shortBreakMins = shortBreakMins;
    this.longBreakMins = longBreakMins;
    this.longBreakInterval = longBreakInterval;

    // DOM Elements
    this.timeDisplay = timeDisplay;
    this.backgroundRing = backgroundRing;
    this.burndownRing = burndownRing;
    this.burndownAnim = burndownAnim;
    this.counterText = counterText;
    this.counterState = counterState;

    // Used for internal testing
    this.countDownMins = 0;
    this.minutesLeft = 0;
    this.secondsLeft = 0;
}

/**
 * Resets the count down timer
 * @param {boolean} force If timer is forcibly reset
 */
timer.prototype.reset = function(force = false) {
    if (force && this.state !== 'stopped') this.stop(true);
    this.state = 'reset';

    this.countDownDate = null;
    this.countDownTimeout = null;
    this.minutesLeft = 0;
    this.secondsLeft = 0;
    this.countDownMins = 0;

    this.timeDisplay.innerHTML = '00:00';
    
    // If forcibly reset, prepare for next start
    if (force) {
        --this.counter;
        this.backgroundRing.style.stroke = '#E46E6E';
        this.timeDisplay.setAttribute('fill', '#E46E6E');
        this.burndownAnim.endElement();
        this.burndownAnim.ownerSVGElement.unpauseAnimations();
    };
}

/**
 * Stops the count down timer
 * @param {boolean} force If timer is forcibly stopped
 */
timer.prototype.stop = function(force = false) {
    if (this.countDownTimeout) clearInterval(this.countDownTimeout);
    console.log('stopped in state '+this.state);

    // If forcibly stopped, wait for reset
    if (force) {
        this.state = 'stopped';
        this.updateStatusText(); 
        this.burndownAnim.ownerSVGElement.pauseAnimations();  
    } else if (this.state == 'work' && this.counter % this.longBreakInterval == 0) {
        this.reset();
        this.startLongBreak();
    } else if (this.state == 'work') {
        this.reset();
        this.startShortBreak();
    } else if (this.state == 'short_break' || this.state == 'long_break') {
        this.reset();
        this.startWorking();
    }
}

/**
 * Start countDown based on passed in param countDownMins
 * @param {number} countDownMins count down time in minutes
 */
timer.prototype.start = function(countDownMins) {
    const now = new Date();
    const countDownOffset = countDownMins * multipliers.MINUTE;
    this.countDownDate = new Date(now.getTime() + countDownOffset);
    this.countDownMins = countDownMins;

    // Begin svg element
    this.burndownAnim.setAttribute('dur', `${countDownMins * 60}`);
    this.burndownAnim.beginElement();

    // Begin countdown
    this.countDown();
    this.countDownTimeout = setInterval(this.countDown.bind(this), 500);
    this.updateStatusText();
}
    
/**
 * Update timeLeft based on current time and countDownDate
 */
timer.prototype.countDown = function() {
    function timerPad(timerField) {
        return timerField.toString().padStart(2, '0');
    }

    let now = new Date();
    // Use seconds that have passed as the single source of truth.
    let timeLeft = Math.ceil((this.countDownDate - now) / multipliers.SECOND);
    this.minutesLeft = Math.floor(timeLeft / 60);
    this.secondsLeft = timeLeft % 60;

    this.timeDisplay.innerHTML = `${timerPad(this.minutesLeft)}:${timerPad(this.secondsLeft)}`;
    if (!this.minutesLeft && !this.secondsLeft) { // If there is no time left, clear interval
        clearInterval(this.countDownTimeout);
        this.stop();
    }
}

/**
 * Start work timer
 */
timer.prototype.startWorking = function() {
    // Set ring and display colors
    this.backgroundRing.style.stroke = '#E46E6E';
    this.timeDisplay.setAttribute('fill', '#E46E6E');
    
    // Increment session counter
    this.counter++;
    console.log(this.counter);  // Print counter for debugging purposes

    this.state = 'work';
    this.start(this.workMins);
}

/**
 * Start short break timer
 */
timer.prototype.startShortBreak = function() {
    // Set ring and display colors
    this.backgroundRing.style.stroke = '#6FEA9A';
    this.timeDisplay.setAttribute('fill', '#6FEA9A');

    this.state = 'short_break';
    this.start(this.shortBreakMins);
}

/**
 * Start long break timer
 */
timer.prototype.startLongBreak = function() {
    // Set ring and display colors
    this.backgroundRing.style.stroke = '#6FEA9A';
    this.timeDisplay.setAttribute('fill', '#6FEA9A');
    
    this.state = 'long_break';
    this.start(this.longBreakMins);
}

/*
 * Resume the count down timer
 *
timer.prototype.resume = () => {
    this.start((timeLeft) / (60 * 1000));
} */

/* 
 * Update the text for pomodoro status
 */
timer.prototype.updateStatusText = function() {
    let stateText;
    switch (this.state) {
        case 'work':
            stateText = 'Work';
            break;
        case 'short_break':
            stateText = 'Short Break';
            break;
        case 'long_break':
            stateText = 'Long Break';
            break;
        case 'stopped':
            stateText = 'Stopped';
            break;
        case 'reset':
            stateText = 'Reset';
        default:
            stateText = 'Stopped';
    }
    this.counterText.textContent = this.counter;
    this.counterState.textContent = stateText;
}

// module.exports = timer;

// Check if running in nodejs
module.exports = timer;
