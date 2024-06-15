import 'normalize.css';
import '../css/styles.css';
import Task from './task.js';

const test = new Task('title', 1, 'high', '2001-07-04');
console.log(test.desc);
