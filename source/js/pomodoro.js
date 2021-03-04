/********************************* Notes for v1: *************************************
 * This script should be pretty simple for v1, however, it relies on timer.js working
 * properly first. I would wait until most of the timer logic is complete before
 * attempting to work on this file.
 ************************************************************************************/

function convertStatusTextToState(statusText) {
    switch (statusText) {
        case 'Work': return 'work';
        case 'Short Break': return 'short_break';
        case 'Long Break': return 'long_break';
        case 'Stopped': return 'stopped';
        case 'Reset': return 'reset';
        default: return 'stopped';
    }
}

window.onload = function() {
    
    refreshProjectList();
    initializePage();
}

function initializePage() {
    // Timer Controls
    let startBtn        = document.getElementById('start');
    let stopBtn         = document.getElementById('stop');
    let resetBtn        = document.getElementById('reset');

    // Timer Graphics
    let timeDisplay     = document.getElementById('time');
    let backgroundRing  = document.getElementById('background-ring');
    let burndownRing    = document.getElementById('burndown-ring');
    let burndownAnim    = document.getElementById('burndown-anim');
    let counterText     = document.getElementById('pomodoro-count-text');
    let counterState    = document.getElementById('pomodoro-state-text');

    // Projects List Controls
    let hamburger       = document.getElementById('hamburger');
    let projectList     = document.getElementById('project-list');
    let createModal     = document.getElementById('create-modal');
    let addProject      = document.getElementById('add-project');
    let projectName     = document.getElementById('project-name');
    let addNewProject   = document.getElementById('add-new-project');
    let closeAddProject = document.getElementById('close-add-project');
    let editModal       = document.getElementById('edit-modal');
    let closeEditModal  = document.getElementById('close-edit-project');
    let editProjectName = document.getElementById('edit-project-name');
    let editProject     = document.getElementById('edit-project');

    // Initialize timer to be used by all events
    window.time = new timer(timeDisplay, backgroundRing, burndownRing,
                        burndownAnim, counterText, counterState, 1, 1, 2);

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
        window.time.workMins = 6/60;
        window.time.shortBreakMins = 6/60;
        window.time.longBreakMins = 6/60;

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
        window.time.stop(true);
    });

    resetBtn.addEventListener('click', e => {
        window.time.reset(true);

        // Stop displaying stop/reset buttons
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        resetBtn.style.display = 'none';
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
