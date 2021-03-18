const {
  test,
  expect
} = require('@jest/globals');

require('console');
require('jest-localstorage-mock');

// Using modern fake timers allows date functions to be mocked and settimeout functions to be mocked.
jest.useFakeTimers('modern');

beforeEach(() => {
  // Create a fresh document before each test.
  document.body.innerHTML = `
  <header>
  <nav>
    <div class='webpage-title'>
      <h1>Pomodoro Timer</h1>
      <ion-icon id='info-btn' class='help' name="help-circle"></ion-icon>
    </div>

    <!--navigation links (v2 projects?)-->
    <!-- Template for task menu, drop-down menu not yet inplemented -->
    <ion-icon id="hamburger" class="icon" name="list-outline"></ion-icon>

    <ul id="project-list">
      <li id="add-project-wrapper">
        <ion-icon id="add-project" name="add-circle-outline"></ion-icon>
      </li>
    </ul>
  </nav>
</header>
<main>
  <svg id="timer-display" viewBox="0 0 80 80">
    <!-- Used to transform the rings to begin animation at correct position -->
    <g id="rings">
      <circle cx="40" cy="40" r="36" fill="none" id="background-ring"/>
      <circle cx="40" cy="40" r="36" fill="none" id="burndown-ring" stroke-dasharray="0 226">
        <!-- SVG to animate the stroke of the circle. Started and duration edited by timer.js -->
        <animate id="burndown-anim" attributeType="XML" attributeName="stroke-dasharray" from="0 226" to="226.08 226" begin="indefinite"/>
      </circle>
    </g>
    <text id="time" x="40" y="48" font-size="20px" text-anchor="middle" fill="#E46E6E">00:00</text>
  </svg>

  <!-- The text for session counter would be replaced once user starts working -->
  <div id="pomodoro-state">
    <text> Pomodoro&nbsp; </text> 
    <text id="pomodoro-count-text"> 0 </text>
    <text> &nbsp;&nbsp;|&nbsp;&nbsp; </text>
    <text id="pomodoro-state-text"> Stopped </text>
  </div>
  
  <div id="timer-control">
    <button id="start">Start</button>
    <button id="stop">Stop</button>
    <button id="reset">Reset</button>
  </div>

  <div id="create-modal" class="modal">
    <div class="project-prompt">
      <div class="close-container">
        <ion-icon id="close-add-project" class="icon" name="close-circle-outline"></ion-icon>
      </div>
      <h2>What are you working on?</h2>
      <input id="project-name" placeholder="Enter the name of your project..."></input>
      <button id="add-new-project">Create New Project</button>
    </div>
  </div>
  <div id="edit-modal" class="modal">
    <div class="project-prompt">
      <div class="close-container">
        <ion-icon id="close-edit-project" class="icon" name="close-circle-outline"></ion-icon>
      </div>
      <h2>Working on something else?</h2>
      <input id="edit-project-name" placeholder="Enter a new name for your project..."></input>
      <button id="edit-project">Save Project</button>
    </div>
  </div>
  <div id="thematic-modal" class="thematic-modal">
    <div class="description">
      <div class="close-container">
        <ion-icon id="close-thematic-modal" class="icon" name="close-circle-outline"></ion-icon>
      </div>
      <h2>The Pomodoro Method</h2>
      <div class="state-descriptions">
        <div class="state-item">
          <img src="media/tomato.webp" alt="Tomato">
          <h3>Pomodoro</h3>
          <p>Once a pomodoro starts, it's go time! This period is for uninterrupted, distraction-free work.</p>
        </div>
        <div class="state-item">
          <img src="media/coffee.png" alt="Coffee">
          <h3>Short Break</h3>
          <p>After a pomodoro ends, it's time to treat yourself to a quick mental break. Relax and unwind before the next pomodoro.</p>
        </div>
        <div class="state-item">
          <img src="media/burger.png" alt="Burger">
          <h3>Long Break</h3>
          <p>Every few pomodoros, you deserve to relax for a bit longer. Take this time to step away from your work.</p>
        </div>
      </div>
      <div class="distraction-descriptions">
        <h3>Distractions</h3>
        <p>Distractions are a natural pat of working, but studies show it can take up to 15 minutes to regain focus after 
          being distracted! So it's important to be mindful by keeping track of what's pulling you away from your work.
          Use the distraction log to write down distractions as they come up.
        </p>
      </div>
      <button id="to-explicit-modal">Next</button>
    </div>
  </div>
  <div id="explicit-modal" class="explicit-modal">
    <div class="description">
      <div class="close-container">
        <ion-icon id="close-explicit-modal" class="icon" name="close-circle-outline"></ion-icon>
      </div>
      <h2>How to Use the Timer</h2>
      <img src="media/info.JPG" alt="info">
      <button id="finish-info">Got it</button>
    </div>
  </div>
</main>

<div class="overlay" id="options-panel">
  <form id="options-form">
    <text id="opt-text">Options</text><br>
    <hr style="width:90%;text-align:center;">
    <label for="pom-length" id="pom-length-label">Pomodoro Length</label>
    <input type="number" id="pom-length"/><br>
    <label for="short-length" id="short-length-label">Short Break Length</label>
    <input type="number" id="short-length"/><br>
    <label for="long-length" id="long-length-label">Long Break Length</label>
    <input type="number" id="long-length"/>
    <button id="save-options">Save</button>
  </form>
</div>

<footer>
  <ion-icon id="options-btn" name="cog-outline"></ion-icon>
  <p>CSE 110 Group 5</p>
</footer>

<!--DO NOT REMOVE: These tags link the javascript source files to the document-->

<!-- Set to modules so that pomodoro.js can import timer.js -->
<script src="js/timer.js"></script>
<script src="js/project.js"></script>
<script src="js/pomodoro.js"></script>`;

  localStorage.clear();
  localStorage.setItem('pomLength', 25);
  localStorage.setItem('shortLength', 5);
  localStorage.setItem('longLength', 30);
});

test('Pomo length in storage', () => {
  expect(JSON.parse(localStorage.__STORE__['pomLength'])).toEqual(25);
});

test('Short length in storage', () => {
  expect(JSON.parse(localStorage.__STORE__['shortLength'])).toEqual(5);
});

test('Long length in storage', () => {
  expect(JSON.parse(localStorage.__STORE__['longLength'])).toEqual(30);
});