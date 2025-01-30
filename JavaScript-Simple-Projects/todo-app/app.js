// Получение элементов
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Массив для зранения задач
let todos = [];

// Добовление задач
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = todoInput.value.trim();
    if (task === '') return; // Игнорируем пустую строку
    
    // Добовляем задачу в массив
    const newTask = {id: Date.now(), text: task, completed: false};
    todos.push(newTask);

    // Оображение
    renderTodos();
    saveToLocalStorage();

    // Очищаем поле ввода
    todoInput.value = '';
});

// Отображение задач
function renderTodos() {
    todoList.innerHTML = ''; // Очищаем список

    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-gray-100 p-2 rounded shadow';

        // Статус задачи
        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        textSpan.className = `flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`;
        textSpan.addEventListener('click', () => toggleCompleted(todo.id));

        // Удаление задачи
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'text-red-500 hover:underline';
        deleteBtn.addEventListener('click', () => deleteTask(todo.id))

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// Сохрарнение в localStorage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Загрузка из localStorage
function loadFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodos()
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