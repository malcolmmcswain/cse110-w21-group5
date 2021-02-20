const { test, expect } = require('@jest/globals');
const { time } = require('console');
const timer = require('../source/js/timer.js');

const MULTIPLIERS = {
    seconds: 1000,
    minutes: 60000,
}

// Using modern fake timers allows date functions to be mocked and settimeout functions to be mocked.
jest.useFakeTimers('modern');

let pomo;

beforeEach(() => {
    // Create a fresh document before each test.
    document.body.innerHTML = `
    <svg id="timer-display" viewBox="0 0 80 80">
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
    <text id="session-counter">Start your working session now</text>  
  
    <div id="timer-control">
        <button id="start">Start</button>
        <button id="stop">Stop</button>
        <button id="reset">Reset</button>
    </div>`;

    // Get all elements used to pass into pomodoro
    let timeDisplay = document.getElementById('time');
    let backgroundRing = document.getElementById('background-ring');
    let burndownRing = document.getElementById('burndown-ring');
    let burndownAnim = document.getElementById('burndown-anim');
    let sessionCounter = document.getElementById('session-counter');

    // Mock SVGElement functions as JSDOM does not support SVGElement functions.
    const mockFn = jest.fn(() => undefined);
    burndownAnim.beginElement = mockFn;
    burndownAnim.endElement = mockFn;
    burndownAnim.ownerSVGElement.unpauseAnimations = mockFn;
    burndownAnim.ownerSVGElement.pauseAnimations = mockFn;

    pomo = new timer(timeDisplay, backgroundRing, burndownRing, burndownAnim, sessionCounter);
});

test('Timer resets properly', () => {
    pomo.reset();
    expect(pomo.minutesLeft).toBe(0);
});

test('Timer initializes working session properly', () => {
    pomo.startWorking();
    expect(pomo.minutesLeft).toBe(25);
    expect(pomo.secondsLeft).toBe(0);
});


// Ensures that the timer begins counting down properly
test('Timer starts working properly', () => {
    pomo.startWorking();
    jest.advanceTimersByTime(1000);
    expect(pomo.minutesLeft).toBe(24);
    expect(pomo.secondsLeft).toBe(59);
});

// Ensures that the timer counts down minutes properly
test('Timer counts down properly', () => {
    pomo.startWorking();
    jest.advanceTimersByTime(61000);
    expect(pomo.minutesLeft).toBe(23);
    expect(pomo.secondsLeft).toBe(59);
});


// Ensures that the timer does not progress when manually stopped
test('Timer manually stops properly', () => {
    pomo.startWorking();
    jest.advanceTimersByTime(1000);

    pomo.stop(true);
    jest.advanceTimersByTime(61000);
    expect(pomo.minutesLeft).toBe(24);
    expect(pomo.secondsLeft).toBe(59);
});

test('Timer automatically stops properly', () => {
    pomo.startWorking();

    // Advance through phases to reach long break and then reach back to short breaks
    for (let i = 1; i < 6; ++i) {
        // Advance through work
        expect(pomo.counter).toBe(i);
        expect(pomo.state).toBe('work');
        expect(pomo.minutesLeft).toBe(pomo.workMins);
        expect(pomo.secondsLeft).toBe(0);
        jest.advanceTimersByTime(pomo.workMins * MULTIPLIERS.minutes);

        if (i % 4 == 0) { // Do long break if on long break interval
            expect(pomo.counter).toBe(pomo.longBreakInterval);
            expect(pomo.state).toBe('long_break');
            expect(pomo.minutesLeft).toBe(15);
            expect(pomo.secondsLeft).toBe(0);
            jest.advanceTimersByTime(pomo.longBreakMins * MULTIPLIERS.minutes);
        } else { // Do short break if not on long break interval
            expect(pomo.counter).toBe(i);
            expect(pomo.state).toBe('short_break');
            expect(pomo.minutesLeft).toBe(pomo.shortBreakMins);
            expect(pomo.secondsLeft).toBe(0);
            jest.advanceTimersByTime(pomo.shortBreakMins * MULTIPLIERS.minutes);
        }
    }
});