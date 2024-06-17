import { formatInTimeZone } from 'date-fns-tz';

import ProjectManager from './projectManager';
import View from './view';

import 'normalize.css';
import '../css/styles.css';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const view = new View();
const projectManager = new ProjectManager();
projectManager.createProject('default');
projectManager.getProject(0).createAndAddTask('Hello world', 'first task', 'high', '2001-07-04');
projectManager
    .getProject(0)
    .createAndAddTask(
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, consectetur odit! Quisquam iste, magnam architecto libero quis officia illum at cumque. Modi, illum! Consectetur iusto veritatis doloribus, est a dolorem?',
        'first task',
        'high',
        '2001-07-04'
    );
console.log(projectManager.getProject(0).getTask(0));
view.loadProject(projectManager.getProject(0));
document.querySelector('.date').textContent = formatInTimeZone(Date.now(), timeZone, 'MMM dd, yyyy');

const handleDeleteTask = (index) => {
    // this.model.removeTask(index);
    console.log(index);
    view.deleteTask(index);
};

view.bindDeleteTask(handleDeleteTask);

const addTaskModal = document.querySelector('.task-modal');
const taskForm = document.querySelector('.task-form');
const addTaskBtn = document.querySelector('.add-task');
addTaskBtn.addEventListener('click', () => {
    addTaskModal.showModal();
});

const submitTaskBtn = document.querySelector('.submit-task');
submitTaskBtn.addEventListener('click', (event) => {
    let isValidForm = taskForm.checkValidity();
    if (!isValidForm) {
        taskForm.reportValidity();
    } else {
        event.preventDefault();
        const title = document.querySelector('.task-modal #title');
        const desc = document.querySelector('.task-modal #desc');
        const dueDate = document.querySelector('.task-modal #due-date');
        const priority = document.querySelector('input[name="priority"]:checked');

        const currProject = projectManager.getProject(0);
        console.log(dueDate.value);
        const newTask = currProject.createAndAddTask(title.value, desc.value, priority.value, dueDate.value);

        view.createAndAddTask(newTask, currProject.tasks.length - 1);
        addTaskModal.close();
    }
});
