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

    let pomLength       = document.getElementById('pom-length');
    let shortLength     = document.getElementById('short-length');
    let longLength      = document.getElementById('long-length');


    // Load in previous options (default without loading is 25/5/30)
    if(localStorage.getItem('pomLength') != null)
        pomLength.value = localStorage.getItem('pomLength');
    if(localStorage.getItem('shortLength') != null)
        shortLength.value = localStorage.getItem('shortLength');
    if(localStorage.getItem('longLength') != null)
        longLength.value = localStorage.getItem('longLength');

    // Update storage on options edit
    pomLength.addEventListener('input', e=> {
        localStorage.setItem('pomLength', pomLength.value);
    });
    shortLength.addEventListener('input', e=> {
        localStorage.setItem('shortLength', shortLength.value);
    });
    longLength.addEventListener('input', e=> {
        localStorage.setItem('longLength', longLength.value);
    });
    
    // Initialize timer to be used by all events
    let time = new timer(timeDisplay, backgroundRing, burndownRing,
                        burndownAnim, counterText, counterState);

    startBtn.addEventListener('click', e => {
        // Set times to options values
        time.workMins = parseInt(pomLength.value);
        time.shortBreakMins = parseInt(shortLength.value);
        time.longBreakMins = parseInt(longLength.value);

        // Begin working and display stop/reset buttons
        time.startWorking();
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
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
