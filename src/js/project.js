import Task from './task.js';

export default class Project {
    #title;
    #tasks;

    constructor(title) {
        this.title = title;
        this.#tasks = [];
    }

    get title() {
        return this.#title;
    }

    set title(newTitle) {
        this.#title = String(newTitle);
    }

    get tasks() {
        return this.#tasks;
    }

    addTask(task) {
        if (task instanceof Task) {
            this.#tasks.push(task);
        } else {
            throw new Error('Invalid task object');
        }
    }

    createAndAddTask(title, desc, priority, dueDate) {
        const task = new Task(title, desc, priority, dueDate);
        this.addTask(task);
        return task;
    }

    deleteTask(index) {
        this.#tasks.splice(index, 1);
    }

    getTask(index) {
        return this.#tasks[index];
    }

    toJSON() {
        return {
            title: this.#title,
            tasks: this.#tasks.map((task) => task.toJSON()),
        };
    }

    static fromJSON(projectData) {
        const project = new Project(projectData.title);
        project.#tasks = projectData.tasks.map((taskData) => Task.fromJSON(taskData));
        return project;
    }
}
