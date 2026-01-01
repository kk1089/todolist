const todoList = document.querySelector('.todoList');
const totalCount = document.querySelector('.totalCount');
const completedCount = document.querySelector('.completedCount');
const remainingCount = document.querySelector('.remainingCount');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');

let tasks = [];

todoInput.addEventListener('input', function () {
    if (this.value.trim() !== '') {
        this.style.border = '';
        this.placeholder = 'новая задача...';
    }
});

todoInput.addEventListener('focus', function () {
    this.style.border = '';
    this.placeholder = 'новая задача...';
});

function addTask() {

    const textTasks = todoInput.value.trim();

    if (textTasks === '') {
        todoInput.style.border = '2px solid red';
        todoInput.placeholder = 'Введите новую задачу...';
        return;
    }

    todoInput.style.border = '';
    todoInput.placeholder = 'новая задача...';

    const newTask = {
        id: Date.now(),
        text: textTasks,
        completed: false
    };

    tasks.push(newTask);
    todoInput.value = '';
    renderTasks();
    todoInput.focus();

}

function renderTasks() {
    todoList.innerHTML = '';

    if (tasks.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Нет задач';
        todoList.appendChild(li);
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;

        const span = document.createElement('span');
        span.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';

        handleCheckboxChange(checkbox, task, span);
        handleDeleteButton(deleteBtn, task, index);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });

}

function handleCheckboxChange(checkbox, task, span) {
    checkbox.addEventListener('change', function () {
        task.completed = this.checked;
        span.classList.toggle('completed', this.checked);
    });
}

function handleDeleteButton(deleteBtn, task, index) {
    deleteBtn.addEventListener('click', function () {
        tasks.splice(index, 1);
        renderTasks();
    });
}

addBtn.addEventListener('click', addTask);

todoInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    todoInput.focus();
});