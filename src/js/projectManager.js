import Project from './project.js';

export default class ProjectManager {
    #projects;

    constructor() {
        this.#projects = [];
        this.init();
    }

    init() {
        // Detect is localStorage is supported. Returns if not.
        try {
            const x = '__local_storage_test__';
            localStorage.setItem(x, x);
            localStorage.removeItem(x);
        } catch (e) {
            return false;
        }

        if (localStorage.getItem('projects')) {
            this.#populateProjects();
        }
    }

    #populateProjects() {
        const storedProjects = JSON.parse(localStorage.getItem('projects'));

        this.#projects = storedProjects.map((projData) => Project.fromJSON(projData));
    }

    createProject(title) {
        const project = new Project(title);
        this.#projects.push(project);

        return project;
    }

    getProject(index) {
        return this.#projects[index];
    }

    deleteProject(index) {
        this.#projects.splice(index, 1);
    }

    get projects() {
        return this.#projects;
    }

    saveToLocal() {
        localStorage.setItem('projects', JSON.stringify(this.#projects.map((proj) => proj.toJSON())));
    }
}
