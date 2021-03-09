const {
    test,
    expect
} = require('@jest/globals');

require('console');
require('jest-localstorage-mock');
const project = require('../source/js/project.js');

// Using modern fake timers allows date functions to be mocked and settimeout functions to be mocked.
jest.useFakeTimers('modern');

beforeEach(() => {
    // Create a fresh document before each test.
    document.body.innerHTML = `
    <header>
      <nav>
        <h1>Pomodoro Timer</h1>
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
    </main>
    <footer>
      <p>CSE 110 Group 5</p>
    </footer>
  
    <!--DO NOT REMOVE: These tags link the javascript source files to the document-->

    <!-- Set to modules so that pomodoro.js can import timer.js -->
    <script src="js/timer.js"></script>
    <script src="js/project.js"></script>
    <script src="js/pomodoro.js"></script>`;

    localStorage.clear();
    project.initializeLocalStorage();

    // Mocks window alert function to prevent jest error
    const mock = jest.fn(() => undefined);
    window.alert = mock;
});

test('Project added to list/localstorage', () => {
    expect(project.createProject('unit testing')).toBe(true);
});

test('Project deleted from list/localstorage', () => {
    expect(project.createProject('unit testing')).toBe(true);
    expect(project.deleteProject('unit testing')).toBe(true);
});

test('Project updates correctly', () => {
    expect(project.createProject('unit testing')).toBe(true);
    project.updateProject('unit testing', 'testing unit');
    expect(project.deleteProject('testing unit')).toBe(true);
})