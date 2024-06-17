export default class View {
    #header;
    #sidebar;
    #content;
    #tasks;
    #taskDialog;

    constructor() {
        this.#header = document.querySelector('.header');
        this.#sidebar = document.querySelector('.sidebar');
        this.#content = document.querySelector('.content');
        this.#tasks = document.querySelector('.tasks');
        this.#taskDialog = document.querySelector('.task-form');
    }

    #createTask(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        const checkBtn = document.createElement('button');
        checkBtn.classList.add('clickable-btn', 'unchecked');

        const taskTitle = document.createElement('span');
        taskTitle.textContent = task.title;

        const editBtn = document.createElement('button');
        editBtn.classList.add('clickable-btn', 'edit');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('clickable-btn', 'delete');

        const detailsBtn = document.createElement('button');
        detailsBtn.classList.add('clickable-btn', 'drop-down');

        const taskRight = document.createElement('div');
        taskRight.classList.add('task-right');

        taskRight.appendChild(editBtn);
        taskRight.appendChild(deleteBtn);
        taskRight.appendChild(detailsBtn);

        const taskLeft = document.createElement('div');
        taskLeft.classList.add('task-left');

        taskLeft.appendChild(checkBtn);
        taskLeft.appendChild(taskTitle);
        taskElement.appendChild(taskLeft);
        taskElement.appendChild(taskRight);

        return taskElement;
    }

    createAndAddTask(task, index) {
        const taskElement = this.#createTask(task);

        taskElement.dataset.index = index;
        this.#tasks.appendChild(taskElement);
    }

    deleteTask(index) {
        const task = this.#tasks.querySelector(`.task[data-index="${index}"]`);
        this.#tasks.removeChild(task);
    }

    loadProject(project) {
        for (let i = 0; i < project.tasks.length; i++) {
            this.createAndAddTask(project.tasks[i], i);
        }
        const projectName = this.#content.querySelector('.project-name');
        projectName.textContent = project.title;
    }

    bindDeleteTask(handler) {
        this.#tasks.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete')) {
                const taskElement = event.target.closest('.task');
                if (taskElement) {
                    const index = taskElement.dataset.index;
                    handler(index);
                }
            }
        });
    }
}
