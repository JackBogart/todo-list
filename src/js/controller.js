import { formatInTimeZone } from 'date-fns-tz';

import ProjectManager from './projectManager';
import View from './view';

export default class Controller {
    #currProject;
    #projectManager;
    #view;

    constructor() {
        this.#currProject = null;
        this.#projectManager = new ProjectManager();
        this.#view = new View();

        this.#view.bindSelectProject(this.handleSelectProject);
        this.#view.bindDeleteTask(this.handleDeleteTask);
    }

    run() {
        this.#init();
    }

    #init() {
        this.#createProject('default');
        this.#currProject.createAndAddTask('Hello world', 'first task', 'high', '2001-07-04');
        this.#currProject.createAndAddTask(
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, consectetur odit! Quisquam iste, magnam architecto libero quis officia illum at cumque. Modi, illum! Consectetur iusto veritatis doloribus, est a dolorem?',
            'first task',
            'high',
            '2001-07-04'
        );
        this.#currProject.createAndAddTask(
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, consectetur odit! Quisquam iste, magnam architecto libero quis officia illum at cumque. Modi, illum! Consectetur iusto veritatis doloribus, est a dolorem?',
            'first task',
            'high',
            '2001-07-04'
        );
        this.#currProject.createAndAddTask(
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, consectetur odit! Quisquam iste, magnam architecto libero quis officia illum at cumque. Modi, illum! Consectetur iusto veritatis doloribus, est a dolorem?',
            'first task',
            'high',
            '2001-07-04'
        );

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.querySelector('.date').textContent = formatInTimeZone(Date.now(), timeZone, 'MMM dd, yyyy');

        this.#createProject('default 2');
        this.#currProject.createAndAddTask('Hello world 2', 'first task', 'high', '2001-07-04');
        this.#getProject(0);
    }

    #createProject(title) {
        this.#currProject = this.#projectManager.createProject(title);
        this.#view.createProject(title, this.#projectManager.projects.length - 1);
    }

    #getProject(index) {
        this.#currProject = this.#projectManager.getProject(index);
        this.#view.getProject(this.#currProject);
    }

    #deleteTask(index) {
        this.#currProject.deleteTask(index);
        this.#view.deleteTask(index);
    }

    handleSelectProject = (index) => {
        this.#getProject(index);
    };

    handleDeleteTask = (index) => {
        this.#deleteTask(index);
    };
}
