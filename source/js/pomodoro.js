/********************************* Notes for v1: *************************************
 * This script should be pretty simple for v1, however, it relies on timer.js working
 * properly first. I would wait until most of the timer logic is complete before
 * attempting to work on this file.
 ************************************************************************************/

// IDEAS/SUGGESTED STRUCTURE BELOW:
    // This is to give you a starting point, not an explicit map of what your code should look like

// Logical structure:
    // Create a counter object to keep track of how many pomodoro's we've used
    // Increment it based on some sort of signal of pomodoro completion from timer.js
    // On each 3rd or 4th pomodoro, send some sort of signal to timer.js to switch to the "long break" state

window.onload = function() {
    initializePage();
}

function initializePage() {
    let startBtn       = document.getElementById('start');
    let stopBtn        = document.getElementById('stop');
    let resetBtn       = document.getElementById('reset');

    let timeDisplay    = document.getElementById('time');
    let backgroundRing = document.getElementById('background-ring');
    let burndownRing   = document.getElementById('burndown-ring');
    let burndownAnim   = document.getElementById('burndown-anim');
    let counterText    = document.getElementById('pomodoro-count-text');
    let counterState   = document.getElementById('pomodoro-state-text');

    // Initialize timer to be used by all events
    let time = new timer(timeDisplay, backgroundRing, burndownRing,
                        burndownAnim, counterText, counterState, 1, 1, 2);

    startBtn.addEventListener('click', e => {
        // To be replaced with grabbing from settings menu
        time.workMins = 1/20;
        time.shortBreakMins = 1/20;
        time.longBreakMins = 2/20;

        // Begin working and display stop/reset buttons
        time.startWorking();
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        stopBtn.textContent = 'Stop (Log)';
        resetBtn.style.display = 'block';
    });

    stopBtn.addEventListener('click', e => {
        time.stop(true);
    });

    resetBtn.addEventListener('click', e => {
        time.reset(true);

        // Stop displaying stop/reset buttons
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        resetBtn.style.display = 'none';
    });
}

// UI structure:
    // Fetch "pomodoro #" region from HTML using DOM
    // Manipulate its text content to match that of the counter object state

// const timer = require("./timer");
