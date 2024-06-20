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

        this.#view.bindSelectProject(this.handleSelectProject.bind(this));
        this.#view.bindDeleteTask(this.handleDeleteTask.bind(this));
        this.#view.bindOpenTaskDialog(this.handleOpenTaskDialog.bind(this));
        this.#view.bindCloseTaskDialog(this.handleCloseTaskDialog.bind(this));
        this.#view.bindTaskSubmit(this.handleTaskSubmit.bind(this));
        this.#view.bindEditTaskDialog(this.handleEditTaskDialog.bind(this));
        this.#view.bindToggleTaskDetails(this.handleToggleTaskDetails.bind(this));
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
        this.#currProject = this.#projectManager.getProject(index);
        this.#view.getProject(this.#currProject);
    }

    #editTask(taskData) {
        const editTask = this.#currProject.getTask(taskData.mode);
        editTask.title = taskData.title;
        editTask.desc = taskData.description;
        editTask.priority = taskData.priority;
        editTask.dueDate = taskData.dueDate;
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
}
