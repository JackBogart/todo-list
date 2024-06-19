export default class View {
    #sidebar;
    #content;
    #tasks;
    #addTaskBtn;
    #taskDialog;
    #closeTaskBtn;
    #taskForm;

    constructor() {
        this.#sidebar = document.querySelector('.sidebar');
        this.#content = document.querySelector('.content');
        this.#tasks = document.querySelector('.tasks');
        this.#addTaskBtn = document.querySelector('.add-task');
        this.#closeTaskBtn = document.querySelector('.cancel');
        this.#taskDialog = document.querySelector('.task-dialog');
        this.#taskForm = document.querySelector('.task-form');
        this.taskTitle = document.querySelector('#task-title');
        this.taskDesc = document.querySelector('#task-desc');
        this.taskPriority = document.querySelector('#task-priority');
        this.taskDate = document.querySelector('#task-date');
    }

    // Task element functions
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

    #updateTasksIndices() {
        const tasks = this.#tasks.querySelectorAll('.task');

        let i = 0;
        tasks.forEach((task) => {
            task.dataset.index = i;
            i++;
        });
    }

    createAndAddTask(task, index) {
        const taskElement = this.#createTask(task);

        taskElement.dataset.index = index;
        this.#tasks.appendChild(taskElement);
    }

    deleteTask(index) {
        const task = this.#tasks.querySelector(`.task[data-index="${index}"]`);
        this.#tasks.removeChild(task);
        this.#updateTasksIndices();
    }

    // Project element functions
    createProject(title, index) {
        const projectEle = document.createElement('li');

        const projectBtn = document.createElement('button');
        projectBtn.type = 'button';
        projectBtn.classList.add('project');
        projectBtn.textContent = title;
        projectBtn.dataset.index = index;

        projectEle.appendChild(projectBtn);
        document.querySelector('.sidebar > ul').appendChild(projectEle);
    }

    getProject(project) {
        this.#tasks.replaceChildren();
        for (let i = 0; i < project.tasks.length; i++) {
            this.createAndAddTask(project.tasks[i], i);
        }
        const projectName = this.#content.querySelector('.project-name');
        projectName.textContent = project.title;
    }

    showTaskDialog() {
        this.#taskDialog.showModal();
    }

    closeTaskDialog() {
        this.#taskDialog.close();
    }

    clearTaskForm() {
        this.#taskForm.reset();
    }

    // Binders for events to handlers in controller
    bindSelectProject(handler) {
        this.#sidebar.addEventListener('click', (event) => {
            if (event.target.classList.contains('project')) {
                const index = parseInt(event.target.dataset.index);

                handler(index);
            }
        });
    }

    bindOpenTaskDialog(handler) {
        this.#addTaskBtn.addEventListener('click', handler);
    }

    bindCloseTaskDialog(handler) {
        this.#closeTaskBtn.addEventListener('click', handler);
    }

    bindTaskSubmit(handler) {
        this.#taskForm.addEventListener('submit', () => {
            const taskData = {
                title: this.taskTitle.value,
                description: this.taskDesc.value,
                priority: this.taskPriority.value,
                dueDate: this.taskDate.value,
            };
            handler(taskData);
        });
    }

    bindDeleteTask(handler) {
        this.#tasks.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete')) {
                const index = parseInt(event.target.closest('.task').dataset.index);

                handler(index);
            }
        });
    }
}
