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
        this.#view.bindDeleteTask(this.handleDeleteTask.bind(this), this.handleDeleteTodayTask.bind(this));
        this.#view.bindOpenTaskDialog(this.handleOpenTaskDialog.bind(this));
        this.#view.bindCloseTaskDialog(this.handleCloseTaskDialog.bind(this));
        this.#view.bindTaskSubmit(this.handleTaskSubmit.bind(this));
        this.#view.bindEditTaskDialog(this.handleEditTaskDialog.bind(this));
        this.#view.bindToggleTaskDetails(this.handleToggleTaskDetails.bind(this));
        this.#view.bindToggleTaskCompleteMarker(
            this.handleToggleCompleteMarker.bind(this),
            this.handleToggleCompleteMarkerToday.bind(this)
        );
        this.#view.bindOpenProjectDialog(this.handleOpenProjectDialog.bind(this));
        this.#view.bindCloseProjectDialog(this.handleCloseProjectDialog.bind(this));
        this.#view.bindProjectSubmit(this.handleProjectSubmit.bind(this));
        this.#view.bindEditProjectDialog(this.handleEditProjectDialog.bind(this));
        this.#view.bindDeleteProject(this.handleDeleteProject.bind(this));
    }

    run() {
        this.#view.init();
        if (this.#projectManager.projects.length !== 0) {
            // Returning user, load their data
            for (let i = 0; i < this.#projectManager.projects.length; i++) {
                const currentlyLoadingProject = this.#projectManager.getProject(i);
                this.#view.createProject(currentlyLoadingProject.title, i);
                for (let j = 0; j < currentlyLoadingProject.tasks.length; j++) {
                    this.#view.createAndAddTask(currentlyLoadingProject.getTask(j), j);
                }
            }
        } else {
            // First time user -- yay!
            this.#createProject('TODO');
            this.#currProject.createAndAddTask(
                'Welcome!',
                'To get started try selecting the default todo list provided on the left. Once selected a button will appear on the page that you can use to create your own custom tasks for that list!',
                'low',
                formatISO(Date.now(), { representation: 'date' })
            );
            this.#currProject.createAndAddTask(
                'Complete your first task!',
                "Once you've finished your first task you can click the checkbox next to a task to mark it as complete. A completed task will not be deleted unless you opt to.",
                'high',
                '2030-01-01'
            );
            this.#currProject.createAndAddTask(
                'Editing tasks',
                "Made a spelling error? Try clicking the pencil icon, if everyone was perfect we wouldn't need erasers.",
                'medium',
                '2030-01-01'
            );
        }
        this.#selectProject(-1);
        this.#projectManager.saveToLocal();
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
                const todayProjectTasks = [];
                for (const task of project.tasks) {
                    if (formatISO(task.dueDate, { representation: 'date' }) == currDate) {
                        todayProjectTasks.push(task);
                    }
                }
                this.#todayProjects.push(todayProjectTasks);
            }
            this.#currProject = null;
            this.#view.getToday(this.#projectManager.projects);
        } else {
            this.#currProject = this.#projectManager.getProject(index);
            this.#view.getProject(this.#currProject, index);
        }
    }

    #editTask(taskData, taskElement) {
        taskElement.title = taskData.title;
        taskElement.desc = taskData.description;
        taskElement.priority = taskData.priority;
        taskElement.dueDate = taskData.dueDate;
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

    handleEditTaskDialog(projectIndex, index) {
        if (projectIndex === null) {
            this.#view.populateTaskDialog(this.#currProject.getTask(index), index);
        } else {
            this.#view.populateTodayTaskDialog(
                this.#projectManager.getProject(projectIndex).getTask(index),
                projectIndex,
                index
            );
        }
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
            this.#createProject(projectData.title);
        } else {
            this.#editProject(projectData);
            this.#view.editProject(projectData);
        }
        this.#projectManager.saveToLocal();
    }

    handleEditProjectDialog(index) {
        this.#view.populateProjectDialog(this.#projectManager.getProject(index), index);
        this.#view.showProjectDialog();
    }

    handleDeleteProject(index) {
        const deletedProject = this.#projectManager.getProject(index);
        this.#projectManager.deleteProject(index);
        if (this.#currProject === deletedProject || this.#currProject === null) {
            this.#selectProject(-1);
        }
        this.#view.deleteProject(index);
        this.#projectManager.saveToLocal();
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
        } else if (taskData.projectIndex === '') {
            const taskElement = this.#currProject.getTask(taskData.mode);
            this.#editTask(taskData, taskElement);
            this.#view.editTask(taskData);
        } else {
            const taskElement = this.#projectManager.getProject(taskData.projectIndex).getTask(taskData.mode);
            this.#editTask(taskData, taskElement);
            this.#selectProject(-1);
        }
        this.#projectManager.saveToLocal();
    }

    handleDeleteTask(index) {
        this.#currProject.deleteTask(index);
        this.#projectManager.saveToLocal();
        this.#view.deleteTask(index);
    }

    handleToggleTaskDetails(index) {
        this.#view.toggleTaskDetails(index);
    }

    handleToggleCompleteMarker(index) {
        this.#currProject.getTask(index).toggleCompleted();
        this.#projectManager.saveToLocal();
        this.#view.toggleTaskCompleteMarker(index);
    }

    handleDeleteTodayTask(projectIndex, index) {
        this.#projectManager.getProject(projectIndex).deleteTask(index);
        this.#projectManager.saveToLocal();
        this.#selectProject(-1);
    }

    handleToggleCompleteMarkerToday(projectIndex, index) {
        this.#projectManager.getProject(projectIndex).getTask(index).toggleCompleted();
        this.#projectManager.saveToLocal();
        this.#view.toggleTaskCompleteMarkerToday(projectIndex, index);
    }
}
