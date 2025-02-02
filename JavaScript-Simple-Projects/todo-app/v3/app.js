// Получение элементов
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoDate = document.getElementById('todo-date');
const todoCategory = document.getElementById('todo-category');

// Кнопки фильтрации
const filterButtons = document.querySelectorAll('.filter-btn');
let filter = 'all';

// Массив с задачами
let todos = [];

// Добавление задачи
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const task = todoInput.value.trim();
    const date = todoDate.value;
    const category = todoCategory.value;

    if (task === '' || date === '') return;

    const newTask = {
        id: Date.now(),
        text: task,
        completed: false,
        date: date,
        category: category
    };

    todos.push(newTask);

    renderTodos();
    saveToLocalStorage();

    todoInput.value = '';
    todoDate.value = '';
});

// Фильтрация задач
filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach((btn) => btn.classList.remove('bg-opacity-50'));
        e.target.classList.add('bg-opacity-50');
        const filterId = e.target.id.replace('filter-', '');

        if (['work', 'personal', 'shopping'].includes(filterId)) {
            filter = filterId;
        } else {
            filter = filterId
        }

        renderTodos();
    });
});

// Отображение задачи
function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = todos.filter((todo) => {
        if (filter === 'all') return true;
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return todo.category === filter;
    });

    filteredTodos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'flex flex-col bg-gray-100 p-2 rounded shadow';

        // Заголовок задачи
        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        textSpan.className = `text-lg ${ todo.completed ? 'line-through text-gray-500' : '' }`;
        textSpan.addEventListener('click', () => toggleCompleted(todo.id));

        // Дата задачи
        const dateSpan = document.createElement('span');
        dateSpan.textContent = `Due: ${ todo.date }`;
        dateSpan.className = 'text-sm text-gray-500';

        // Категории задачи
        const categorySpan = document.createElement('span');
        categorySpan.textContent = todo.category;
        categorySpan.className = `inline-block mt-1 px-2 py-1 text-xs fonst-semibold rounded ${
            todo.category === 'work'
                ? 'bg-blue-200 text-blue-700'
                : todo.category === 'personal'
                ? 'bg-green-200 text-green-700'
                : todo.category === 'shopping'
                ? 'bg-yellow-200 text-yellow-700'
                : 'bg-gray-200 text-gray-700'
        }`;

        // Удаление задачи
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'mt-2 text-red-500 hover:underline';
        deleteBtn.addEventListener('click', () => deleteTask(todo.id));

        li.appendChild(textSpan);
        li.appendChild(dateSpan);
        li.appendChild(categorySpan);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// Записывать в localstorage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Загрузка из localsorage
function loadFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodos();
    }
}

// Переключение статуса задачи
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