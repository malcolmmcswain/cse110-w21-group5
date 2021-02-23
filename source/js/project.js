/**
 * Initializing projectlist in localStorage
 */
function initializeLocalStorage() {
    let emtptyJSON = "[]";
    localStorage.setItem("projectList", emtptyJSON);
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
function addProject(project) {
    if (localStorage.getItem("projectList") == null) initializeLocalStorage();
    let projectList = JSON.parse(localStorage.getItem("projectList"));
    if (projectList.find(p => p.name === project.name) != undefined) {
        alert('Project already exists!');
        return false;
    } else {
        projectList.push(project);
        localStorage.setItem("projectList", JSON.stringify(projectList));
        return true;
    }
}

/** 
 * Update local storage to store projects
 * @param {string} state needs to be either "complete" or "incomplete" 

function updateProject(name, newState){
    if (localStorage.getItem("projectList") == null) initializeLocalStorage();
    let 
    // Otherwise create a new project and add it to localStorage
    projectList.push({"projectName":projectName, "state":state});
    localStorage.setItem("projectList", JSON.stringify(projectList));
}
 */

/** delete specified project from the list
 * @param {string} name of the project to be deleted
  */
function deleteProject(name) {
    if (localStorage.getItem("projectList") == null) {
        initializeLocalStorage();
        return false;
    }
    let projectList = JSON.parse(localStorage.getItem("projectList"));
    localStorage.setItem("projectList", JSON.stringify(projectList.filter(project => project.name !== name)));
}