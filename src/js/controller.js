import { formatISO } from 'date-fns';

import ProjectManager from './projectManager';
import View from './view';

export default class Controller {
    #currProject;
    #projectManager;
    #view;
    #todayProjects;

    constructor() {
        this.#currProject = null;
        this.#projectManager = new ProjectManager();
        this.#view = new View();
        this.#todayProjects = [];

        this.#view.bindSelectProject(this.handleSelectProject.bind(this));
        this.#view.bindDeleteTask(this.handleDeleteTask.bind(this));
        this.#view.bindOpenTaskDialog(this.handleOpenTaskDialog.bind(this));
        this.#view.bindCloseTaskDialog(this.handleCloseTaskDialog.bind(this));
        this.#view.bindTaskSubmit(this.handleTaskSubmit.bind(this));
        this.#view.bindEditTaskDialog(this.handleEditTaskDialog.bind(this));
        this.#view.bindToggleTaskDetails(this.handleToggleTaskDetails.bind(this));
        this.#view.bindToggleTaskCompleteMarker(this.handleToggleCompleteMarker.bind(this));
        this.#view.bindOpenProjectDialog(this.handleOpenProjectDialog.bind(this));
        this.#view.bindCloseProjectDialog(this.handleCloseProjectDialog.bind(this));
        this.#view.bindProjectSubmit(this.handleProjectSubmit.bind(this));
        this.#view.bindEditProjectDialog(this.handleEditProjectDialog.bind(this));
        this.#view.bindDeleteProject(this.handleDeleteProject.bind(this));
    }

    run() {
        this.#init();
    }

    #init() {
        this.#view.init();
        this.#createProject('default');
        this.#currProject.createAndAddTask('Hello world', 'Example desc', 'low', '2024-06-22');
        this.#selectProject(0);
    }

    #createProject(title) {
        this.#currProject = this.#projectManager.createProject(title);
        this.#view.createProject(title, this.#projectManager.projects.length - 1);
    }

    #selectProject(index) {
        if (index === -1) {
            const currDate = formatISO(Date.now(), { representation: 'date' });
            this.#todayProjects = [];
            for (const project of this.#projectManager.projects) {
                for (const task of project.tasks) {
                    if (formatISO(task.dueDate, { representation: 'date' }) == currDate) {
                        this.#todayProjects.push(task);
                    }
                }
            }
            this.#view.getToday(this.#todayProjects);
        } else {
            this.#currProject = this.#projectManager.getProject(index);
            this.#view.getProject(this.#currProject, index);
        }
    }

    #editTask(taskData) {
        const editTask = this.#currProject.getTask(taskData.mode);
        editTask.title = taskData.title;
        editTask.desc = taskData.description;
        editTask.priority = taskData.priority;
        editTask.dueDate = taskData.dueDate;
    }

    #editProject(projectData) {
        const editProject = this.#projectManager.getProject(projectData.mode);
        editProject.title = projectData.title;
    }

    handleSelectProject(index) {
        this.#selectProject(index);
    }

    handleOpenTaskDialog() {
        this.#view.clearTaskForm();
        this.#view.showTaskDialog();
    }

    handleEditTaskDialog(index) {
        this.#view.populateTaskDialog(this.#currProject.getTask(index), index);
        this.#view.showTaskDialog();
    }

    handleCloseTaskDialog() {
        this.#view.closeTaskDialog();
    }

    handleOpenProjectDialog() {
        this.#view.clearProjectForm();
        this.#view.showProjectDialog();
    }

    handleCloseProjectDialog() {
        this.#view.closeProjectDialog();
    }

    handleProjectSubmit(projectData) {
        if (projectData.mode === '') {
            this.#projectManager.createProject(projectData.title);
            this.#view.createProject(projectData.title, this.#projectManager.projects.length - 1);
        } else {
            this.#editProject(projectData);
            this.#view.editProject(projectData);
        }
    }

    handleEditProjectDialog(index) {
        this.#view.populateProjectDialog(this.#projectManager.getProject(index), index);
        this.#view.showProjectDialog();
    }

    handleDeleteProject(index) {
        this.#projectManager.deleteProject(index);
        this.#view.deleteProject(index);
    }

    handleTaskSubmit(taskData) {
        if (taskData.mode === '') {
            const newTask = this.#currProject.createAndAddTask(
                taskData.title,
                taskData.description,
                taskData.priority,
                taskData.dueDate
            );
            this.#view.createAndAddTask(newTask, this.#currProject.tasks.length - 1);
        } else {
            this.#editTask(taskData);
            this.#view.editTask(taskData);
        }
    }

    handleDeleteTask(index) {
        this.#currProject.deleteTask(index);
        this.#view.deleteTask(index);
    }

    handleToggleTaskDetails(index) {
        this.#view.toggleTaskDetails(index);
    }

    handleToggleCompleteMarker(index) {
        this.#currProject.getTask(index).toggleCompleted();
        this.#view.toggleTaskCompleteMarker(index);
    }
}
