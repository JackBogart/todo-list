import 'normalize.css';
import '../css/styles.css';
import Project from './project.js';
import { formatInTimeZone } from 'date-fns-tz';
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

document.querySelector('.date').textContent = formatInTimeZone(Date.now(), timeZone, 'MMM dd, yyyy');
