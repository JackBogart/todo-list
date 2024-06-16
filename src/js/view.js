export default class View {
    #header;
    #sidebar;
    #content;

    constructor() {
        this.#header = document.querySelector('.header');
        this.#sidebar = document.querySelector('.sidebar');
        this.#content = document.querySelector('.content');
    }

    addTask(task) {
        const tasks = this.#content.querySelector('.tasks');
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

        const taskRight = document.createElement('div');
        taskRight.classList.add('task-right');

        taskRight.appendChild(editBtn);
        taskRight.appendChild(deleteBtn);

        const taskLeft = document.createElement('div');
        taskLeft.classList.add('task-left');

        taskLeft.appendChild(checkBtn);
        taskLeft.appendChild(taskTitle);
        taskElement.appendChild(taskLeft);
        taskElement.appendChild(taskRight);

        tasks.appendChild(taskElement);
    }
}
