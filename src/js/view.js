import { formatISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export default class View {
  #sidebar;
  #tasks;
  #addTaskBtn;
  #taskDialog;
  #closeTaskBtn;
  #taskForm;
  #taskTitle;
  #taskDesc;
  #taskPriority;
  #taskDate;
  #taskMode;
  #timeZone;
  #addProjectBtn;
  #projectDialog;
  #projectForm;
  #projectTitle;
  #closeProjectBtn;
  #projectMode;
  #projectName;
  #projectIndex;

  constructor() {
    this.#sidebar = document.querySelector('.sidebar');
    this.#tasks = document.querySelector('.tasks');
    this.#addTaskBtn = document.querySelector('.add-task');
    this.#closeTaskBtn = document.querySelector('.task-cancel');
    this.#taskDialog = document.querySelector('.task-dialog');
    this.#taskForm = document.querySelector('.task-form');
    this.#taskTitle = document.querySelector('#task-title');
    this.#taskDesc = document.querySelector('#task-desc');
    this.#taskPriority = document.querySelector('#task-priority');
    this.#taskDate = document.querySelector('#task-date');
    this.#taskMode = document.querySelector('#task-mode');
    this.#timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.#addProjectBtn = document.querySelector('.add-project');
    this.#projectDialog = document.querySelector('.project-dialog');
    this.#projectForm = document.querySelector('.project-form');
    this.#projectTitle = document.querySelector('#project-title');
    this.#closeProjectBtn = document.querySelector('.project-cancel');
    this.#projectMode = document.querySelector('#project-mode');
    this.#projectName = document.querySelector('.project-name');
    this.#projectIndex = document.querySelector('#project-index');
  }

  // Task element functions
  #createTask(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const taskMinimized = this.#createTaskMinimized(task);
    const taskDetails = this.#createTaskDetails(task);

    taskElement.appendChild(taskMinimized);
    taskElement.appendChild(taskDetails);

    return taskElement;
  }

  init() {
    document.querySelector('.header-date').textContent = this.#formatDateString(
      Date.now(),
    );

    this.#taskDate.setAttribute(
      'min',
      formatISO(Date.now(), { representation: 'date' }),
    );
  }

  #createTaskMinimized(task) {
    const taskMinimized = document.createElement('div');
    taskMinimized.classList.add('task-min');

    const checkBtn = document.createElement('button');
    checkBtn.classList.add(
      'clickable-btn',
      `${task.completed ? 'checked' : 'unchecked'}`,
    );

    const taskTitle = document.createElement('span');
    taskTitle.classList.add('title');
    taskTitle.textContent = task.title;

    const taskLeft = document.createElement('div');
    taskLeft.classList.add('task-left');

    taskLeft.appendChild(checkBtn);
    taskLeft.appendChild(taskTitle);

    const taskRight = document.createElement('div');
    taskRight.classList.add('task-right');

    const taskDateEle = document.createElement('span');
    taskDateEle.classList.add('date');
    taskDateEle.textContent = this.#formatDateString(task.dueDate);

    const editBtn = document.createElement('button');
    editBtn.classList.add('clickable-btn', 'edit');

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('clickable-btn', 'delete');

    const detailsBtn = document.createElement('button');
    detailsBtn.classList.add('clickable-btn', 'drop-down');

    taskRight.appendChild(taskDateEle);
    taskRight.appendChild(editBtn);
    taskRight.appendChild(deleteBtn);
    taskRight.appendChild(detailsBtn);

    taskMinimized.appendChild(taskLeft);
    taskMinimized.appendChild(taskRight);

    return taskMinimized;
  }

  #createTaskDetails(task) {
    const taskDetails = document.createElement('div');
    taskDetails.classList.add('task-details');

    const taskDescription = document.createElement('p');
    taskDescription.textContent = task.desc;

    const taskPriority = document.createElement('div');
    taskPriority.textContent = task.priority;
    taskPriority.classList.add(`${task.priority}`, 'priority');

    taskDetails.appendChild(taskDescription);
    taskDetails.appendChild(taskPriority);

    return taskDetails;
  }

  #updateTasksIndices() {
    const tasks = this.#tasks.querySelectorAll('.task');

    let i = 0;
    tasks.forEach((task) => {
      task.dataset.index = i;
      i++;
    });
  }

  #updateProjectIndices() {
    const tasks = this.#sidebar.querySelectorAll('.project:not(.today)');

    let i = 0;
    tasks.forEach((task) => {
      task.dataset.index = i;
      i++;
    });
  }

  #formatDateString(date) {
    return formatInTimeZone(date, this.#timeZone, 'MMM dd, yyyy');
  }

  createAndAddTask(task, index) {
    const taskElement = this.#createTask(task);

    taskElement.dataset.index = index;
    this.#tasks.appendChild(taskElement);
  }

  #createAndAddTodayTasks(task, projectIndex, index) {
    const taskElement = this.#createTask(task);

    taskElement.dataset.projectIndex = projectIndex;
    taskElement.dataset.index = index;
    this.#tasks.appendChild(taskElement);
  }

  deleteTask(index) {
    const task = this.#tasks.querySelector(`.task[data-index="${index}"]`);
    this.#tasks.removeChild(task);
    this.#updateTasksIndices();
  }

  editTask(task) {
    const taskEle = this.#tasks.querySelector(
      `.task[data-index="${task.mode}"]`,
    );
    const taskTitle = taskEle.querySelector('.title');
    const taskDate = taskEle.querySelector('.date');
    const taskDescription = taskEle.querySelector('p');
    const taskPriority = taskEle.querySelector('.priority');

    taskTitle.textContent = task.title;
    taskDate.textContent = this.#formatDateString(task.dueDate);
    taskDescription.textContent = task.description;
    taskPriority.classList = `priority ${task.priority}`;
    taskPriority.textContent = task.priority;
  }

  toggleTaskDetails(index) {
    const taskEle = this.#tasks.querySelector(`.task[data-index="${index}"]`);
    const taskDetailsBtn =
      taskEle.querySelector('.drop-down') === null
        ? taskEle.querySelector('.drop-up')
        : taskEle.querySelector('.drop-down');
    const taskDetails = taskEle.querySelector('.task-details');

    if (taskDetailsBtn.classList.contains('drop-down')) {
      taskDetailsBtn.classList.remove('drop-down');
      taskDetailsBtn.classList.add('drop-up');
      taskDetails.style.display = 'flex';
    } else {
      taskDetailsBtn.classList.remove('drop-up');
      taskDetailsBtn.classList.add('drop-down');
      taskDetails.style.display = 'none';
    }
  }

  toggleTaskCompleteMarker(index) {
    const taskEle = this.#tasks.querySelector(`.task[data-index="${index}"]`);
    const taskCompleteMarker =
      taskEle.querySelector('.unchecked') === null
        ? taskEle.querySelector('.checked')
        : taskEle.querySelector('.unchecked');

    if (taskCompleteMarker.classList.contains('unchecked')) {
      taskCompleteMarker.classList.remove('unchecked');
      taskCompleteMarker.classList.add('checked');
    } else {
      taskCompleteMarker.classList.remove('checked');
      taskCompleteMarker.classList.add('unchecked');
    }
  }

  toggleTaskCompleteMarkerToday(projectIndex, index) {
    const taskEle = this.#tasks.querySelector(
      `.task[data-project-index="${projectIndex}"][data-index="${index}"]`,
    );
    const taskCompleteMarker =
      taskEle.querySelector('.unchecked') === null
        ? taskEle.querySelector('.checked')
        : taskEle.querySelector('.unchecked');

    if (taskCompleteMarker.classList.contains('unchecked')) {
      taskCompleteMarker.classList.remove('unchecked');
      taskCompleteMarker.classList.add('checked');
    } else {
      taskCompleteMarker.classList.remove('checked');
      taskCompleteMarker.classList.add('unchecked');
    }
  }

  populateTaskDialog(task, index) {
    this.#taskMode.value = String(index);
    this.#taskTitle.value = task.title;
    this.#taskDesc.value = task.desc;
    this.#taskPriority.value = task.priority;
    this.#taskDate.value = formatISO(task.dueDate, { representation: 'date' });
    this.#projectIndex.value = '';
  }

  populateTodayTaskDialog(task, projectIndex, index) {
    this.populateTaskDialog(task, index);
    this.#projectIndex.value = String(projectIndex);
  }

  populateProjectDialog(project, index) {
    this.#projectMode.value = String(index);
    this.#projectTitle.value = project.title;
  }

  // Project element functions
  createProject(title, index) {
    const projectEle = document.createElement('li');
    projectEle.classList.add('project');
    projectEle.dataset.index = index;

    const projectBtn = document.createElement('button');
    projectBtn.type = 'button';
    projectBtn.classList.add('project-btn');

    const projectTitle = document.createElement('span');
    projectTitle.textContent = title;

    const projectControls = document.createElement('div');
    projectControls.classList.add('project-controls');

    const editBtn = document.createElement('button');
    editBtn.classList.add('clickable-btn', 'edit');

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('clickable-btn', 'delete');

    projectControls.appendChild(editBtn);
    projectControls.appendChild(deleteBtn);

    projectBtn.appendChild(projectTitle);
    projectBtn.appendChild(projectControls);
    projectEle.appendChild(projectBtn);
    document.querySelector('.sidebar > ul').appendChild(projectEle);
  }

  getToday(projects) {
    this.#tasks.replaceChildren();

    const currDate = formatISO(Date.now(), { representation: 'date' });
    for (let i = 0; i < projects.length; i++) {
      for (let j = 0; j < projects[i].tasks.length; j++) {
        if (
          formatISO(projects[i].getTask(j).dueDate, {
            representation: 'date',
          }) == currDate
        ) {
          this.#createAndAddTodayTasks(projects[i].getTask(j), i, j);
        }
      }
    }
    this.#projectName.textContent = 'Today';
    this.#addTaskBtn.classList.add('hide-task-btn');

    const activeProject = document.querySelector('.active');
    if (activeProject !== null) {
      activeProject.classList.remove('active');
    }
    const projectTab = document.querySelector(`.project[data-index="-1"]`);
    projectTab.classList.add('active');
  }

  getProject(project, index) {
    this.#tasks.replaceChildren();
    for (let i = 0; i < project.tasks.length; i++) {
      this.createAndAddTask(project.tasks[i], i);
    }
    this.#projectName.textContent = project.title;
    this.#addTaskBtn.classList.remove('hide-task-btn');

    const activeProject = document.querySelector('.active');
    if (activeProject !== null) {
      activeProject.classList.remove('active');
    }
    const projectTab = document.querySelector(
      `.project[data-index="${index}"]`,
    );
    projectTab.classList.add('active');
  }

  editProject(project) {
    const projectEle = this.#sidebar.querySelector(
      `.project[data-index="${project.mode}"]`,
    );
    const projectTitle = projectEle.querySelector('.project-btn');
    projectTitle.textContent = project.title;

    if (projectEle.classList.contains('active')) {
      this.#projectName.textContent = project.title;
    }
  }

  deleteProject(index) {
    const projectEle = this.#sidebar.querySelector(
      `.project[data-index="${index}"]`,
    );
    projectEle.remove();
    this.#updateProjectIndices();
  }

  showTaskDialog() {
    const activeProject = document.querySelector('.active');
    if (activeProject !== null) {
      if (this.#taskDate.value === '') {
        this.#taskDate.value = formatISO(Date.now(), {
          representation: 'date',
        });
      }
      this.#taskDialog.showModal();
    }
  }

  closeTaskDialog() {
    this.#taskDialog.close();
  }

  clearTaskForm() {
    this.#taskForm.reset();
  }

  showProjectDialog() {
    this.#projectDialog.showModal();
  }

  closeProjectDialog() {
    this.#projectDialog.close();
  }

  clearProjectForm() {
    this.#projectForm.reset();
  }

  // Binders for events to handlers in controller
  bindSelectProject(handler) {
    this.#sidebar.addEventListener('click', (event) => {
      if (event.target.classList.contains('project-btn')) {
        const index = parseInt(event.target.closest('.project').dataset.index);

        handler(index);
      }
    });
  }

  bindOpenTaskDialog(handler) {
    this.#addTaskBtn.addEventListener('click', handler);
  }

  bindEditTaskDialog(handler) {
    this.#tasks.addEventListener('click', (event) => {
      if (event.target.classList.contains('edit')) {
        const taskEle = event.target.closest('.task');
        const index = parseInt(taskEle.dataset.index);
        const projectIndex = taskEle.dataset.projectIndex
          ? parseInt(taskEle.dataset.projectIndex)
          : null;

        handler(projectIndex, index);
      }
    });
  }

  bindCloseTaskDialog(handler) {
    this.#closeTaskBtn.addEventListener('click', handler);
  }

  bindTaskSubmit(handler) {
    this.#taskForm.addEventListener('submit', () => {
      const taskData = {
        mode: this.#taskMode.value,
        title: this.#taskTitle.value,
        description: this.#taskDesc.value,
        priority: this.#taskPriority.value,
        dueDate: this.#taskDate.value,
        projectIndex: this.#projectIndex.value,
      };

      handler(taskData);
    });
  }

  bindDeleteTask(handler, todayHandler) {
    this.#tasks.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete')) {
        const index = parseInt(event.target.closest('.task').dataset.index);
        const activeProject = document.querySelector('.active');

        if (!activeProject.classList.contains('today')) {
          handler(index);
        } else {
          const projectIndex = parseInt(
            event.target.closest('.task').dataset.projectIndex,
          );
          todayHandler(projectIndex, index);
        }
      }
    });
  }

  bindToggleTaskDetails(handler) {
    this.#tasks.addEventListener('click', (event) => {
      if (
        event.target.classList.contains('drop-down') ||
        event.target.classList.contains('drop-up')
      ) {
        const index = parseInt(event.target.closest('.task').dataset.index);

        handler(index);
      }
    });
  }

  bindToggleTaskCompleteMarker(handler, todayHandler) {
    this.#tasks.addEventListener('click', (event) => {
      if (
        event.target.classList.contains('unchecked') ||
        event.target.classList.contains('checked')
      ) {
        const index = parseInt(event.target.closest('.task').dataset.index);
        const activeProject = document.querySelector('.active');

        if (!activeProject.classList.contains('today')) {
          handler(index);
        } else {
          const projectIndex = parseInt(
            event.target.closest('.task').dataset.projectIndex,
          );
          todayHandler(projectIndex, index);
        }
      }
    });
  }

  bindOpenProjectDialog(handler) {
    this.#addProjectBtn.addEventListener('click', handler);
  }

  bindCloseProjectDialog(handler) {
    this.#closeProjectBtn.addEventListener('click', handler);
  }

  bindProjectSubmit(handler) {
    this.#projectForm.addEventListener('submit', () => {
      const projectData = {
        mode: this.#projectMode.value,
        title: this.#projectTitle.value,
      };
      handler(projectData);
    });
  }

  bindEditProjectDialog(handler) {
    this.#sidebar.addEventListener('click', (event) => {
      if (event.target.classList.contains('edit')) {
        const index = parseInt(event.target.closest('.project').dataset.index);

        handler(index);
      }
    });
  }

  bindDeleteProject(handler) {
    this.#sidebar.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete')) {
        const index = parseInt(event.target.closest('.project').dataset.index);

        handler(index);
      }
    });
  }
}
