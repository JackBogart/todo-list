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
view.addTask(projectManager.getProject(0).getTask(0));
view.addTask(projectManager.getProject(0).getTask(1));
document.querySelector('.date').textContent = formatInTimeZone(Date.now(), timeZone, 'MMM dd, yyyy');
