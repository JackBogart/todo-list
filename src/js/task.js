import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

const priorities = ['low', 'medium', 'high'];

export default class Task {
  #title;
  #desc;
  #priority;
  #dueDate;
  #completed;

  constructor(title, desc, priority, dueDate, completed = false) {
    this.title = title;
    this.desc = desc;
    this.priority = priority;
    this.dueDate = dueDate;
    this.#completed = completed;
  }

  get title() {
    return this.#title;
  }

  set title(newTitle) {
    this.#title = String(newTitle);
  }

  get desc() {
    return this.#desc;
  }

  set desc(newDesc) {
    this.#desc = String(newDesc);
  }

  get priority() {
    return this.#priority;
  }

  set priority(priorityLevel) {
    // Ensure the priority level is one of the available options
    if (priorities.includes(String(priorityLevel).toLowerCase())) {
      this.#priority = priorityLevel;
    } else {
      throw new Error('Invalid priority level');
    }
  }

  get completed() {
    return this.#completed;
  }

  toggleCompleted() {
    this.#completed = !this.completed;
  }

  get dueDate() {
    return this.#dueDate;
  }

  set dueDate(dueDate) {
    // We want to store all dates in UTC so they can be converted to timezones
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.#dueDate = new Date(fromZonedTime(dueDate, timeZone));
  }

  getLocalDueDate() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return formatInTimeZone(this.dueDate, timeZone, 'MMM dd, yyyy');
  }

  toJSON() {
    return {
      title: this.#title,
      desc: this.#desc,
      priority: this.priority,
      dueDate: this.dueDate,
      completed: this.#completed,
    };
  }

  static fromJSON(taskData) {
    return new Task(
      taskData.title,
      taskData.desc,
      taskData.priority,
      taskData.dueDate,
      taskData.completed,
    );
  }
}
