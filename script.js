let taskArray = [];
let updateObject = {};
const taskTag = document.getElementById('toDoItem');
const errorTag = document.getElementById('task-input-error');
const addBtn = document.getElementById('add-btn');
const todoListContainer = document.querySelector('.to-do-list');
const clearBtn = document.getElementById('clear-btn');

addBtn.addEventListener('click', addTask);
clearBtn.addEventListener('click', clearTasks);

function getItemsFromLocalStorga() {
  taskArray = localStorage.getItem('tasks')
    ? JSON.parse(localStorage.getItem('tasks'))
    : [];
}

function setItemsToLocalStorage(array) {
  localStorage.setItem('tasks', JSON.stringify(array));
}

function addTask() {
  if (taskTag.value === '') {
    errorTag.innerText = 'Task is required';
    return;
  }
  if (addBtn.innerText === 'ADD TASK') {
    const task = { Id: Date.now(), Text: taskTag.value, status: 'open' };
    taskArray.push(task);
    setItemsToLocalStorage(taskArray);
    renderTasks();
    taskTag.value = '';
  }
  if (addBtn.innerText === 'UPDATE TASK') {
    const updatedTask = { ...updateObject, Text: taskTag.value };
    const oldTask = taskArray.find((task) => task.Id === updatedTask.Id);
    oldTask.Text = taskTag.value;
    setItemsToLocalStorage(taskArray);
    renderTasks();
    taskTag.value = '';
    addBtn.innerText = 'Add Task';
  }
}

function clearTasks() {
  localStorage.clear();
  renderTasks();
}

function deleteTask(id) {
  const filteredArray = taskArray.filter((task) => task.Id !== id);
  setItemsToLocalStorage(filteredArray);
  renderTasks();
}

function editTask(id) {
  const filteredArray = taskArray.filter((task) => task.Id === id);
  taskTag.value = filteredArray[0].Text;
  addBtn.innerText = 'Update Task';
  updateObject = { Id: id, status: filteredArray[0].status };
}

function doneTask(id) {
  taskArray.forEach((task) => {
    if (task.Id === id) {
      task.status = 'completed';
    }
  });
  setItemsToLocalStorage(taskArray);
  renderTasks();
}

function renderTasks() {
  errorTag.innerText = '';
  getItemsFromLocalStorga();
  let tasksHtml = '';
  taskArray.forEach(renderTask);
  function renderTask(task) {
    tasksHtml += `<div class="to-do-item" id="${task.Id}">
        <p class="item-text ${
          task.status === 'completed' ? 'completed' : ''
        }">${task.Text}</p>
        <div class="to-do-action">
          <button type="button" class="icon-btn delete" id="delete-btn" onClick="deleteTask(${
            task.Id
          })">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn edit" id="edit-btn" onClick="editTask(${
            task.Id
          })">
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn done" id="done-btn" onClick="doneTask(${
            task.Id
          })">
            <i class="fa fa-check-square" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      `;
  }
  todoListContainer.innerHTML = tasksHtml;
}

window.onload = function () {
  renderTasks();
};
