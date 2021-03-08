/**
 * Initialize projectlist and currentProject in localStorage
 */
function initializeLocalStorage() {
    let emtptyJSON = `[{"name": "My Project", "pomodoro": 0, "state": "reset"}]`;
    localStorage.setItem("projectList", emtptyJSON);
    localStorage.setItem("currentProject", "My Project");
}

/**
 * Get all projects (as an array of JSON objects) in localStorage
 */
function getAllProjects() {
    if (localStorage.getItem("projectList") == null) initializeLocalStorage();
    return JSON.parse(localStorage.getItem("projectList"));
}

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
    deleteProject(name);
    createProject(newState);
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

    let projectList = JSON.parse(localStorage.getItem("projectList"));
    projectList.forEach((project) => {
        let projectItem = document.createElement('li');
        projectItem.innerHTML = `
        <a onclick="changeProject('${project.name}')">${project.name}</a>
        <div class="project-action-container">
            <ion-icon name="create-outline" onclick="editProject('${project.name}')"></ion-icon>
            <ion-icon name="trash-outline" onclick="deleteProject('${project.name}')"></ion-icon>
        </div>`;
        projectListView.insertBefore(projectItem, addButton);
    });
}

// module.exports = {
//     initializeLocalStorage,
//     getProject,
//     deleteProject,
//     updateProject,
//     createProject
// };