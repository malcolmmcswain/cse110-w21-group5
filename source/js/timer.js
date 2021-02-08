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
var countDownDate; // Holds a Date() obj representing the time when count down should end
var countDownTimeout; // Timeout returned by setInterval(this.countDown, 1000)
var terminateTimeout; // Timeout returned by setTimeout that terminates count down
var timeLeft; // Time left in miliseconds
var shortBreakMins = 5;
var longBreakMins = 15;
var workMins = 25;

class timer {
    /**
     * Start countDown based on passed in param countDownMins
     * @param {*} countDownMins count down time in minutes
     */
    start(countDownMins) {
        this.pause();
        let now = new Date();
        countDownDate = new Date(now.getTime() + countDownMins * 60 * 1000);
        this.countDown();
        countDownTimeout = setInterval(this.countDown, 1000)
        terminateTimeout = setTimeout(function() {
            clearInterval(countDownTimeout);
        }, countDownMins * 60 * 1000);
    }

    /**
     * update timeLeft based on current time and countDownDate
     */
    countDown() {
        let now = new Date();
        timeLeft = countDownDate.getTime() - now.getTime();
        console.log("Seconds left: " + timeLeft / (1000)); 
    }

    /**
     * pause the count down timer
     */
    pause() {
        if (countDownTimeout) {
            clearInterval(countDownTimeout);
        }
        if (terminateTimeout) {
            clearTimeout(terminateTimeout);
        }
    }

    /**
     * resume the count down timer
     */
    resume() {
        this.start((timeLeft) / (60 * 1000));
    }

    startWorking() {
        this.start(workMins);
    }

    startShortBreak() {
        this.start(shortBreakMins);
    }

    startLongBreak() {
        this.start(longBreakMins);
    }
}

let time = new timer();
time.start(0.5);

setTimeout(function() {
    time.pause();
    console.log(timeLeft / 1000);
}, 10000);

setTimeout(function() {
    time.resume();
}, 15000);


// UI structure:
    // Fetch timer from HTML using DOM
    // Manipulate its text content to match that of the timer object state
    // Style its "ring" conditionally (this part will be tricky, ask me if you need help!)