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

// UI structure:
    // Fetch "pomodoro #" region from HTML using DOM
    // Manipulate its text content to match that of the counter object state