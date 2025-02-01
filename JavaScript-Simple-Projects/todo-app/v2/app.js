// Получение элементов
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Кнопка фильтрации
const filterButtons = document.querySelectorAll('.filter-btn');
let filter = 'all';

// Массив фильтрации
let todos = [];

// Добавление задач
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const task = todoInput.value.trim();
    if (task === '') return;

    const newTask = {id: Date.now(), text: task, completed: false};
    todos.push(newTask);

    renderTodos();
    saveToLocalStorage();

    todoInput.value = '';
});

// Отображение задачи
function renderTodos() {
    todoList.innerHTML = '';

    // Фильтрация завач перед рендеринга
    const filteredTodos = todos.filter((todo) => {
        if (filter === 'all') return true;
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
    });
    
    filteredTodos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-gray-100 p-2 rounded shadow';

        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        textSpan.className = `flex-1 ${ todo.completed ? 'line-through text-gray-500' : '' }`;
        textSpan.addEventListener('click', () => toggleCompleted(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'text-red-500 hover:underline';
        deleteBtn.addEventListener('click', () => deleteTask(todo.id));

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        todoList.append(li);
    });
}

// Обработка кликов по фильтрам
filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach((btn) => btn.classList.remove('bg-opacity-50'));
        e.target.classList.add('bg-opacity-50');
        filter = e.target.id.replace('filter-', '');
        renderTodos();
    })
})

// Сохранение в Localstorage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Загрузка из Localstorage
function loadFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodos();
    }
}

// Переключение статуса выполнения задачи
function toggleCompleted(id) {
    todos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    renderTodos();
    saveToLocalStorage();
}

// Удаление задачи
function deleteTask(id) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
    saveToLocalStorage();
}

loadFromLocalStorage();