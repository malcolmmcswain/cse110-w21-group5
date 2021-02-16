const { test, expect } = require('@jest/globals');
const { time } = require('console');
const timer = require('../source/js/timer.js');

const MULTIPLIERS = {
    seconds: 1000,
    minutes: 60000,
}

jest.useFakeTimers('modern');

test('Timer resets properly', () => {
    let time = new timer();
    time.reset();
    expect(time.minutesLeft).toBe(0);
});

test('Timer initializes working session properly', () => {
    let time = new timer();
    time.startWorking();
    expect(time.minutesLeft).toBe(25);
    expect(time.secondsLeft).toBe(0);
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

test('Timer manually stops properly', () => {
    let time = new timer();
    time.startWorking();
    jest.advanceTimersByTime(1000);
    time.stop();
    jest.advanceTimersByTime(61000);
    expect(time.minutesLeft).toBe(24);
    expect(time.secondsLeft).toBe(59);
});

test('Timer automatically stops properly', () => {
    let time = new timer();
    time.startWorking();
    jest.advanceTimersByTime(MULTIPLIERS.minutes * 25 - MULTIPLIERS.seconds);
    expect(time.minutesLeft).toBe(0);
    expect(time.secondsLeft).toBe(1);
    jest.advanceTimersByTime(MULTIPLIERS.seconds);
    expect(time.minutesLeft).toBe(0);
    expect(time.secondsLeft).toBe(0);
    jest.advanceTimersByTime(MULTIPLIERS.minutes);
    expect(time.minutesLeft).toBe(0);
    expect(time.secondsLeft).toBe(0);
});