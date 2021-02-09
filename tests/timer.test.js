const { test, expect } = require('@jest/globals');
const { time } = require('console');
const timer = require('../source/js/timer.js');

test('Timer resets properly', () => {
    let time = new timer();
    time.reset();
    expect(time.minutesLeft).toBe(0);
});

test('Timer starts working properly', () => {
    let time = new timer();
    time.startWorking();
    setTimeout(() => {expect(time.minutesLeft).toBe(24)}, 1000);
});

test('Timer counts down properly', () => {
    let time = new timer();
    time.startWorking();
    setTimeout(() => {expect(time.minutesLeft).toBe(23)}, 61000);
});

test('Timer stops properly', () => {
    let time = new timer();
    time.startWorking();
    setTimeout(() => {time.stop()}, 1000)
    setTimeout(() => {expect(time.minutesLeft).toBe(24)}, 61000);
});