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
function timer(workMins = 25, shortBreakMins = 5, longBreakMins = 15, longBreakInterval = 3) {
    this.state = 'reset';
    this.counter = 0;

    this.countDownDate = null;
    this.countDownTimeout = null;
    this.workMins = workMins;
    this.shortBreakMins = shortBreakMins;
    this.longBreakMins = longBreakMins;

    this.countDownMins = 0;
    this.theta = 0;

    // Used for internal testing
    this.minutesLeft = 0;
    this.secondsLeft = 0;
}

/**
 * Resets the count down timer
 */
timer.prototype.reset = function(force = false) {
    this.state = 'reset';

    this.countDownDate = null;
    this.countDownTimeout = null;
    this.minutesLeft = 0;
    this.secondsLeft = 0;
    this.countDownMins = 0;
    this.theta = 0;

    document.getElementById('time').innerHTML = '00:00';
    document.getElementById('burndown-ring').style.animation = 'none';
}

/**
 * Stops the count down timer
 */
timer.prototype.stop = function(force = false) {
    if (this.countDownTimeout) clearInterval(this.countDownTimeout);
    console.log('stopped in state '+this.state);

    if (force) {
        this.state = 'stopped';
        document.getElementById('burndown-ring').style.animationPlayState = 'paused';
    } else if (this.state == 'work' && this.counter % this.longBreakInterval == 0) {
        this.reset();
        this.startLongBreak();
    } else if (this.state == 'work') {
        this.reset();
        this.startShortBreak();
    } else if (this.state == 'short_break') {
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

    // Refresh animations
    setTimeout(_ => document.getElementById('burndown-ring').style.animation = `dash ${countDownMins*60}s linear`, 0);

    /* Neat hack to prevent lag of the first second */
    this.countDown.bind(this)();
    this.countDownTimeout = setInterval(this.countDown.bind(this), 500);
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

    document.getElementById('time').innerHTML = `${timerPad(this.minutesLeft)}:${timerPad(this.secondsLeft)}`;
    if (!this.minutesLeft && !this.secondsLeft) {
        clearInterval(this.countDownTimeout);
        this.stop();
    }
}

/**
 * Start work timer
 */
timer.prototype.startWorking = function() {
    this.counter++;
    document.getElementById('background-ring').style.stroke = '#E46E6E';
    document.getElementById('burndown-ring').style.strokeDashoffset = 0;
    document.getElementById('time').setAttribute('fill', '#E46E6E');
    this.state = 'work';
    this.start(this.workMins);
    document.getElementById('session-counter').textContent='Session '+this.counter;
    console.log(this.counter);  // Print counter for debugging purposes
}

/**
 * Start short break timer
 */
timer.prototype.startShortBreak = function() {
    document.getElementById('background-ring').style.stroke = '#6FEA9A';
    document.getElementById('burndown-ring').style.strokeDashoffset = 0;
    document.getElementById('time').setAttribute('fill', '#6FEA9A');
    this.state = 'short_break';
    this.start(this.shortBreakMins);
}

/**
 * Start long break timer
 */
timer.prototype.startLongBreak = function() {
    document.getElementById('background-ring').style.stroke = '#6FEA9A';
    document.getElementById('burndown-ring').style.strokeDashoffset = 0;
    document.getElementById('time').setAttribute('fill', '#6FEA9A');
    this.state = 'long_break';
    this.start(this.longBreakMins);
}

/*
 * Resume the count down timer
 *
timer.prototype.resume = () => {
    this.start((timeLeft) / (60 * 1000));
} */

document.getElementById('start').addEventListener('click', () => {
    let time = new timer(0.1,0.1,0.1);
    time.startWorking();
    document.getElementById('start').style.display = 'none';
    document.getElementById('stop').style.display = 'block';
    document.getElementById('stop').addEventListener('click', () => {
        time.stop(true);
    });
    document.getElementById('reset').style.display = 'block';
    document.getElementById('reset').addEventListener('click', () => {
        time.reset();
        document.getElementById('start').style.display = 'block';
        document.getElementById('stop').style.display = 'none';
        document.getElementById('reset').style.display = 'none';
    });
});


module.exports = timer;