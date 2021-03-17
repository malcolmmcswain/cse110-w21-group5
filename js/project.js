/**
 * Initialize projectlist and currentProject in localStorage
 */
function initializeLocalStorage() {
    let emtptyJSON = `[{"name": "My Project", "pomodoro": 0, "state": "reset"}]`;
    localStorage.setItem("projectList", emtptyJSON);
    localStorage.setItem("currentProject", "My Project");
    localStorage.setItem("distractionLog", "[]");
}

/**
 * Get all projects (as an array of JSON objects) in localStorage
 */
// function getAllProjects() {
//     if (localStorage.getItem("projectList") == null) initializeLocalStorage();
//     return JSON.parse(localStorage.getItem("projectList"));
// }

/**
 * Get a single project (as a JSON object) in localStorage
 * @param {string} name is the name of the project
 */
function getProject(name) {
    if (localStorage.getItem("projectList") == null) initializeLocalStorage();
    return JSON.parse(localStorage.getItem("projectList")).find(project => project.name === name);
}

/**
 * Add a single project (as a JSON object) in localStorage
 * @param {object} project is the project to add
 */
function createProject(project) {
    if (localStorage.getItem("projectList") == null) initializeLocalStorage();
    let projectList = JSON.parse(localStorage.getItem("projectList"));
    if (projectList.find(p => p.name === project.name)) {
        alert(project.name + 'Project already exists!');
        return false;
    } else {
        projectList.push(project);
        localStorage.setItem("projectList", JSON.stringify(projectList));
        refreshProjectList();
        return true;
    }
}

/**
 * Delete specified project from the list
 * @param {string} name of the project to be deleted
 */
function deleteProject(name) {
    if (localStorage.getItem("projectList") == null) {
        initializeLocalStorage();
        return false;
    }
    let projectList = JSON.parse(localStorage.getItem("projectList"));
    localStorage.setItem("projectList", JSON.stringify(projectList.filter(project => project.name !== name)));
    refreshProjectList();
    return true;
}

/** 
 * Update local storage to store projects
 * @param {string} name name of project to update
 * @param {object} newState new project object
 */
function updateProject(name, newState) {
    if (localStorage.getItem("projectList") == null) initializeLocalStorage();
    let projectList = JSON.parse(localStorage.getItem("projectList"));
    if (projectList.find(p => p.name == name)) {
        let projectIndex = projectList.findIndex(p => p.name == name);
        projectList[projectIndex] = newState;
        localStorage.setItem("projectList", JSON.stringify(projectList));
        refreshProjectList();
        return true;
    } else {
        alert('Project '+name+' doesn\'t exist!');
        return false;
    }
}

/**
 * Initiate project editing by displaying modal
 * @param {string} name name of project
 */
function editProject(name) {
    document.getElementById('edit-modal').classList.add('open');
    document.getElementById('edit-project-name').setAttribute('placeholder', name);
    document.getElementById('edit-project-name').value = name;
}

/**
 * Update DOM to reflect changes in projectList
 */
function refreshProjectList() {
    if (localStorage.getItem("projectList") == null) initializeLocalStorage();

    let projectListView = document.getElementById('project-list');
    let addButton = document.getElementById('add-project-wrapper');

    while (projectListView.childNodes.length > 2) {
        projectListView.removeChild(projectListView.firstChild);
    }

    let currentProject = localStorage.getItem('currentProject');
    let projectList = JSON.parse(localStorage.getItem('projectList'));
    projectList.forEach((project) => {
        let projectItem = document.createElement('li');
        if (project.name == currentProject) {
            projectItem.innerHTML = `
            <a style="font-weight: bold;" onclick="changeProject('${project.name}')">${project.name}</a>
            <div class="project-action-container">
                <ion-icon name="create-outline" class="edit-task" onclick="editProject('${project.name}')"></ion-icon>
                <ion-icon name="trash-outline" class="delete-task" onclick="deleteProject('${project.name}')"></ion-icon>
            </div>`;
        } else {
            projectItem.innerHTML = `
            <a onclick="changeProject('${project.name}')">${project.name}</a>
            <div class="project-action-container">
                <ion-icon name="create-outline" class="edit-task" onclick="editProject('${project.name}')"></ion-icon>
                <ion-icon name="trash-outline" class="delete-task" onclick="deleteProject('${project.name}')"></ion-icon>
            </div>`;
        }
        projectItem.classList.add("project-item");
        projectListView.insertBefore(projectItem, addButton);
    });
}

/**
 * Get all distractions (as an array of strings) in localStorage
 */
// function getAllDistractions() {
//     if (localStorage.getItem("distractionLog") == null) initializeLocalStorage();
//     return JSON.parse(localStorage.getItem("distractionLog"));
// }

/**
 * Log distraction to localStorage
 * @param {string} distraction description of distraction
 */
function logDistraction(distraction) {
    if (localStorage.getItem("distractionLog") == null) initializeLocalStorage();
    let distractionLog = JSON.parse(localStorage.getItem("distractionLog"));
    if (distractionLog.length >= 5) distractionLog.shift();
    distractionLog.push(distraction);
    localStorage.setItem("distractionLog", JSON.stringify(distractionLog));
    refreshDistractionLog();
}

/**
 * Update DOM to reflect changes in distractionLog
 */
function refreshDistractionLog() {
    if (localStorage.getItem("distractionLog") == null) initializeLocalStorage();
    let distractionLog = JSON.parse(localStorage.getItem("distractionLog"));
    let logList = document.getElementById('log-list');

    logList.innerHTML = ``;

    distractionLog.forEach((distraction) => {
        let distractionItem = document.createElement('li');
        distractionItem.innerHTML = distraction;
        distractionItem.classList.add("log-item");
        logList.appendChild(distractionItem);
    });
}


module.exports = {
    initializeLocalStorage,
    getProject,
    deleteProject,
    editProject,
    updateProject,
    createProject,
    logDistraction,
    refreshDistractionLog
};