/********************************* Notes for v1: *************************************
 * This script should be pretty simple for v1, however, it relies on timer.js working
 * properly first. I would wait until most of the timer logic is complete before
 * attempting to work on this file.
 ************************************************************************************/

function convertStatusTextToState(statusText) {
    switch (statusText) {
        case 'Work':
            return 'work';
        case 'Short Break':
            return 'short_break';
        case 'Long Break':
            return 'long_break';
        case 'Stopped':
            return 'stopped';
        case 'Reset':
            return 'reset';
        default:
            return 'stopped';
    }
}

window.onload = function () {
    refreshProjectList();
    initializePage();
}

function initializePage() {
    // Timer Controls
    let startBtn = document.getElementById('start');
    let stopBtn = document.getElementById('stop');
    let resetBtn = document.getElementById('reset');

    // Timer Graphics
    let timeDisplay     = document.getElementById('time');
    let backgroundRing  = document.getElementById('background-ring');
    let burndownRing    = document.getElementById('burndown-ring');
    let burndownAnim    = document.getElementById('burndown-anim');
    let counterText     = document.getElementById('pomodoro-count-text');
    let counterState    = document.getElementById('pomodoro-state-text');
    let options        = document.getElementById('options-btn');
    let opt_panel      = document.getElementById('options-panel');

    // Projects List Controls
    let hamburger = document.getElementById('hamburger');
    let projectList = document.getElementById('project-list');
    let createModal = document.getElementById('create-modal');
    let addProject = document.getElementById('add-project');
    let projectName = document.getElementById('project-name');
    let addNewProject = document.getElementById('add-new-project');
    let closeAddProject = document.getElementById('close-add-project');
    let editModal = document.getElementById('edit-modal');
    let closeEditModal = document.getElementById('close-edit-project');
    let editProjectName = document.getElementById('edit-project-name');
    let editProject = document.getElementById('edit-project');

    // Information Page Controls
    let infoBtn = document.getElementById('info-btn');
    let thematicModal = document.getElementById('thematic-modal');
    let explicitModal = document.getElementById('explicit-modal');
    let closeThematicModal = document.getElementById('close-thematic-modal');
    let toExplicitModal = document.getElementById('to-explicit-modal');
    let closeExplicitModal = document.getElementById('close-explicit-modal');
    let finishInfo = document.getElementById('finish-info');

    // Pomodoro Options
    let pomLength       = document.getElementById('pom-length');
    let shortLength     = document.getElementById('short-length');
    let longLength      = document.getElementById('long-length');
    let cycleLength     = document.getElementById('cycle-length');
    let saveOptions     = document.getElementById('save-options');

    // Distraction Log
    let distractionContainer = document.getElementById('distraction-container');
    let logModal = document.getElementById('log-modal');
    let closeLogModal = document.getElementById('close-log-modal');
    let distraction = document.getElementById('distraction');
    let logBtn = document.getElementById('log-btn');

    // Load in previous options (default without loading is 25/5/30)
    if (localStorage.getItem('pomLength') != null)
        pomLength.value = localStorage.getItem('pomLength');
    else pomLength.value = 25;
    
    if (localStorage.getItem('shortLength') != null)
        shortLength.value = localStorage.getItem('shortLength');
    else shortLength.value = 5;

    if (localStorage.getItem('longLength') != null)
        longLength.value = localStorage.getItem('longLength');
    else longLength.value = 30;

    if (localStorage.getItem('cycleLength') != null)
        cycleLength.value = localStorage.getItem('cycleLength');
    else cycleLength.value = 4;

    // Update storage on options edit
    saveOptions.addEventListener('click', e => {
        e.preventDefault();
        if (document.querySelectorAll('#options-form > input:invalid').length == 0) {
            localStorage.setItem('pomLength', pomLength.value);
            localStorage.setItem('shortLength', shortLength.value);
            localStorage.setItem('longLength', longLength.value);
            localStorage.setItem('cycleLength', cycleLength.value);
        }
    });
    
    // Initialize timer to be used by all events
    window.time = new timer(
        timeDisplay,
        distractionContainer,
        backgroundRing,
        burndownRing,
        burndownAnim,
        counterText,
        counterState,
        1,
        1,
        2,
        3
    );

    refreshDistractionLog();

    window.addEventListener('keypress', e => {
        let working = startBtn.style.display == 'none';
        e.preventDefault();
        switch (e.key) {
            case 'Enter': // Start timer
                if (!working) startBtn.click();
                break;
            case 's': // Stop timer
                if (working) stopBtn.click();
                break;
            case 'r': // Reset timer
                if (working) resetBtn.click();
                break;
            case 'l': // Open up todolist
                hamburger.click();
                break;
            default:
                break;
        }
    });

    startBtn.addEventListener('click', e => {
        // To be replaced with grabbing from settings menu
        window.time.workMins = parseInt(localStorage.getItem('pomLength'));
        window.time.shortBreakMins = parseInt(localStorage.getItem('shortLength'));
        window.time.longBreakMins = parseInt(localStorage.getItem('longLength'));
        window.time.longBreakInterval = parseInt(localStorage.getItem('cycleLength'));
        // Begin working and display stop/reset buttons
        window.time.startWorking();
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        resetBtn.style.display = 'block';
    });
    
    options.addEventListener('click', e => {
    // toggle options panel        
            if(opt_panel.style.display == 'block')
               opt_panel.style.display = 'none';
            else
               opt_panel.style.display = 'block';
        
    });

    stopBtn.addEventListener('click', e => {
        logModal.classList.add('open');
    });

    logBtn.addEventListener('click', e => {
        logDistraction(distraction.value);
        logModal.classList.remove('open');
    });

    closeLogModal.addEventListener('click', e => {
        logModal.classList.remove('open');
    });

    resetBtn.addEventListener('click', e => {
        window.time.reset(true);

        // Stop displaying stop/reset buttons
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        resetBtn.style.display = 'none';
    });

    infoBtn.addEventListener('click', () => {
        thematicModal.classList.add('open');
    });

    toExplicitModal.addEventListener('click', () => {
        thematicModal.classList.remove('open');
        explicitModal.classList.add('open');
    });

    hamburger.addEventListener('click', () => {
        if (projectList.style.opacity === '0' || projectList.style.opacity === '') {
            projectList.style.opacity = '1';
            projectList.style.pointerEvents = 'all';
        } else {
            projectList.style.opacity = '0';
            projectList.style.pointerEvents = 'none';
        }
    });

    addProject.addEventListener('click', () => {
        createModal.classList.add('open');
        projectName.value = "";
    });

    addNewProject.addEventListener('click', () => {
        if (projectName.value !== '') {
            createProject({
                name: document.getElementById('project-name').value,
                pomodoro: 0,
                state: 'reset'
            });
            createModal.classList.remove('open');
        } else {
            alert('Please enter a project name!');
        }
    });

    closeAddProject.addEventListener('click', () => {
        createModal.classList.remove('open');
    });

    closeEditModal.addEventListener('click', () => {
        editModal.classList.remove('open');
    });

    closeThematicModal.addEventListener('click', () => {
        thematicModal.classList.remove('open');
    });

    closeExplicitModal.addEventListener('click', () => {
        explicitModal.classList.remove('open');
    });

    finishInfo.addEventListener('click', () => {
        explicitModal.classList.remove('open');
    });

    editProject.addEventListener('click', () => {
        let originalState = getProject(editProjectName.placeholder);

        if (editProjectName.value !== '') {
            updateProject(editProjectName.placeholder, {
                name: editProjectName.value,
                pomodoro: originalState.pomodoro,
                state: originalState.state
            });
            editModal.classList.remove('open');
        } else {
            alert('Please enter a project name!');
        }
    });

    // Prevents keyboard shortcuts from being disabled while in an input field
    document.querySelectorAll('input').forEach(el => el.onkeypress = function (e) { e.stopPropagation(); });
}

/**
 * Hook method to switch project context
 * @param {string} name name of project 
 */
function changeProject(name) {
    currentProject = localStorage.getItem("currentProject");
    updateProject(currentProject, {
        name: currentProject,
        pomodoro: Number(document.getElementById('pomodoro-count-text').innerHTML),
        state: convertStatusTextToState(document.getElementById('pomodoro-state-text').innerHTML)
    });
    let newProject = getProject(name);
    localStorage.setItem("currentProject", newProject.name);
    window.time.switchState({
        pomodoro: newProject.pomodoro,
        state: newProject.state
    });
}