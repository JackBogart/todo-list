import Project from './project.js';

export default class ProjectManager {
    #projects;

    constructor() {
        this.#projects = [];
    }

    createProject(title) {
        const project = new Project(title);
        this.#projects.push(project);
    }

    getProject(index) {
        return this.#projects[index];
    }

    deleteProject(index) {
        this.#projects.splice(index, 1);
    }
}