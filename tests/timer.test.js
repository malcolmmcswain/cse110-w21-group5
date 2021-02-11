const { test, expect } = require('@jest/globals');
const { time } = require('console');
const timer = require('../source/js/timer.js');

jest.useFakeTimers('modern');

test('Timer resets properly', () => {
    let time = new timer();
    time.reset();
    expect(time.minutesLeft).toBe(0);
});

test('Timer starts working properly', () => {
    let time = new timer();
    time.startWorking();
    jest.advanceTimersByTime(1000);
    expect(time.minutesLeft).toBe(24);
    expect(time.secondsLeft).toBe(59);
});

test('Timer counts down properly', () => {
    let time = new timer();
    time.startWorking();
    jest.advanceTimersByTime(61000);
    expect(time.minutesLeft).toBe(23);
    expect(time.secondsLeft).toBe(59);
});

test('Timer stops properly', () => {
    let time = new timer();
    time.startWorking();
    jest.advanceTimersByTime(1000);
    time.stop();
    jest.advanceTimersByTime(61000);
    expect(time.minutesLeft).toBe(24);
    expect(time.secondsLeft).toBe(59);
});