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
    // Add logic to consider 5 states: pomodoro, short break, long break, paused, reset
    // Bind DOM elements like buttons and signals from pomodoro.js to control the state of this object

// UI structure:
    // Fetch timer from HTML using DOM
    // Manipulate its text content to match that of the timer object state
    // Style its "ring" conditionally (this part will be tricky, ask me if you need help!)