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
    this.terminateTimeout = null;
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
    this.stop(true);

    if (force) {
        this.counter--; // Reset this particular pomo session
    }
    
    this.state = 'reset';

    this.countDownDate = null;
    this.countDownTimeout = null;
    this.terminateTimeout = null;
    this.minutesLeft = 0;
    this.secondsLeft = 0;
    this.countDownMins = 0;
    this.theta = 0;

    document.getElementById('time').innerHTML = '00:00';
    document.getElementById('dark').setAttribute('d', 'M60,60 v-60 a60,60 0 0,1 0,0');
    this.updateStatusText();
}

/**
 * Stops the count down timer
 */
timer.prototype.stop = function(force = false) {
    if (this.countDownTimeout) clearInterval(this.countDownTimeout);

    console.log('stopped in state '+this.state);

    if (force) {
        this.state = 'stopped';
        this.updateStatusText();
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

    /* 
     * Terminate automatic stop. Needed when user terminates timer
     * early to prevent an incorrect automatic stop when a new timer
     * is started.
     */
    // if (this.terminateTimeout) clearTimeout(this.terminateTimeout);
}

/**
 * Start countDown based on passed in param countDownMins
 * @param {number} countDownMins count down time in minutes
 */
timer.prototype.start = function(countDownMins) {
    let now = new Date();
    let countDownOffset = countDownMins * multipliers.MINUTE; 
    this.countDownDate = new Date(now.getTime() + countDownOffset);
    this.countDownMins = countDownMins;

    /* Neat hack to prevent lag of the first second */
    this.countDown.bind(this)();
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

    let dark = document.getElementById('dark'),
    radius = document.getElementById('svg').getBBox().width / 2;
    dark.setAttribute('transform', 'translate(' + radius + ',' + radius + ')');

    let increment = 360 / (this.countDownMins * 60) / 2;
    this.theta += increment;
    let d = 'M0,0 v' + -radius + 'A' + radius + ' ' + radius + ' 1 ' + ((this.theta > 180) ? 1 : 0) + ' 1 ' + Math.sin(this.theta * Math.PI / 180) * radius + ' ' + Math.cos(this.theta * Math.PI / 180) * -radius + 'z';
    dark.setAttribute('d', d);

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
    document.getElementById('light').setAttribute('fill', '#E46E6E');
    document.getElementById('time').setAttribute('fill', '#E46E6E');
    this.state = 'work';
    this.start(this.workMins);
}

/**
 * Start short break timer
 */
timer.prototype.startShortBreak = function() {
    document.getElementById('light').setAttribute('fill', '#6FEA9A');
    document.getElementById('time').setAttribute('fill', '#6FEA9A');
    this.state = 'short_break';
    this.start(this.shortBreakMins);
}

/**
 * Start long break timer
 */
timer.prototype.startLongBreak = function() {
    document.getElementById('light').setAttribute('fill', '#6FEA9A');
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


/* update the text for pomodoro status
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
    document.getElementById('pomodoro-state-text').innerHTML = `Pomodoro ${this.counter} | ${stateText}`;
}

document.getElementById('start').addEventListener('click', () => {
    let time = new timer(0.2,0.2,0.3);
    time.startWorking();
    document.getElementById('start').style.display = 'none';
    document.getElementById('stop').style.display = 'block';
    document.getElementById('stop').addEventListener('click', () => {
        time.stop(true);
    });
    document.getElementById('reset').style.display = 'block';
    document.getElementById('reset').addEventListener('click', () => {
        time.reset(true);
        document.getElementById('start').style.display = 'block';
        document.getElementById('stop').style.display = 'none';
        document.getElementById('reset').style.display = 'none';
    });
});
module.exports = timer;