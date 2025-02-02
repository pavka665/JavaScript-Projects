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

// Добовление задач
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

    showNotification('Task added successfully!', 'success');

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
            filter = filterId;
        }

        renderTodos();
    });
});

// Подсчет задач
function updateTaskCount() {
    const total = todos.length;
    const active = todos.filter((todo) => !todo.completed).length;
    const completed = todos.filter((todo) => todo.completed).length;

    const taskCountElement = document.getElementById('task-count');
    taskCountElement.textContent = `Total: ${ total } | Active: ${ active } | Completed: ${ completed }`;
}

// Отображение уведомления
function showNotification(message, type='info') {
    const notification = document.getElementById('notification');

    // Установим техт и стиль
    notification.textContent = message;
    notification.className = `text-sm font-medium ${
        type === 'success'
            ? 'text-green-500'
            : type === 'error'
            ? 'text-red-500'
            : 'text-gray-500'
    }`;

    // Убираем уведомление через 3 секунды
    setTimeout(() => {
        notification.textContent = '';
        notification.className = '';
    }, 3000);
}

// Отображение задач
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

        // Загадовок задачи
        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        textSpan.className = `text-lg ${ todo.completed ? 'line-through text-gray-500': '' }`;
        textSpan.addEventListener('click', () => toggleCompleted(todo.id));

        // Дата задачи
        const dateSpan = document.createElement('span');
        dateSpan.textContent = `Due: ${ todo.date }`;
        dateSpan.className = 'text-sm text-gray-500';

        // Категории задач
        const categorySpan = document.createElement('span');
        categorySpan.textContent = todo.category;
        categorySpan.className = `inline-block mt-1 px-2 py-1 text-xs font-semibold rounded ${
            todo.category === 'work'
                ? 'bg-blue-200 text-blue-800'
                : todo.category === 'personal'
                ? 'bg-green-200 text-green-800'
                : todo.category === 'shopping'
                ? 'bg-yellow-200 text-yellow-800'
                : 'bg-gray-200 text-gray-800'
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

    updateTaskCount();
}

// Запись в localstorage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Загрузка из localstorage
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
    // Уведомление о завершение/отмене задачи
    const task = todos.find((todo) => todo.id === id);
    const status = task.completed ? 'completed' : 'marked as active';
    showNotification(`Task "${ task.text }" ${ status }`, 'success');
}

// Удаление задачи
function deleteTask(id) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
    saveToLocalStorage();
    // Уведомление об удалении
    showNotification('Task deleted successfully!', 'success');
}

loadFromLocalStorage();