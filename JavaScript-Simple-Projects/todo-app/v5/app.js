// Получение элементов
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoDate = document.getElementById('todo-date');

const addCategory = document.getElementById('add-category-btn');
const categoryModal = document.getElementById('category-modal');
const newCategoryInput = document.getElementById('new-category-input');
const saveCategoryBtn = document.getElementById('save-category-btn');
const cancelCategoryBtn = document.getElementById('cancel-category-btn');
const todoCategory = document.getElementById('todo-category');


// Кнопки фильтрации
const filterButtons = document.querySelectorAll('.filter-btn');
let filter = 'all';

// Массив для хранение задач
let todos = [];

// Логика работы модальное окно
function showModalNotification(message, type='info', time=3000) {
    const modal = document.getElementById('notification-modal');
    const notificationText = document.getElementById('notification-text');

    notificationText.textContent = message;

    notificationText.className = `text-lg font-medium text-center ${
        type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-gray-700'
    }`;

    modal.classList.remove('hidden');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, time);
}

// Откритие модального окна для добовление новой категории
addCategory.addEventListener('click', (e) => {
    e.preventDefault();
    categoryModal.classList.remove('hidden');
});

// Закритие модального окна
cancelCategoryBtn.addEventListener('click', () => {
    categoryModal.classList.add('hidden');
});

// Сохранение новой категории
saveCategoryBtn.addEventListener('click', () => {
    const newCategory = newCategoryInput.value.trim();

    if (newCategory === '') {
        showModalNotification('Название категории обязательное поле', 'error');
        return;
    }

    const option = document.createElement('option');
    option.value = newCategory.toLowerCase();
    option.textContent = newCategory;
    todoCategory.appendChild(option);

    categoryModal.classList.add('hidden');
    showModalNotification(`Категория ${ newCategory } была добавлена`, 'success');
})

// Фильтрация задач
filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
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
function unpdateTaskCount() {
    const total = todos.length;
    const active = todos.filter((todo) => !todo.completed).length;
    const completed = todos.filter((todo) => todo.completed).length;

    const taskCountElement = document.getElementById('task-count');
    taskCountElement.textContent = `Все: ${ total } | Активные: ${ active } | Законченый: ${ completed }`;
}

// Добавление задач
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const task = todoInput.value.trim();
    const date = todoDate.value;
    const category = todoCategory.value;

    if (task === '' || date === '') {
        showModalNotification('Нужно указать название и дату задачи', type='error');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: task,
        date: date,
        category: category,
        completed: false
    };

    todos.push(newTask);

    renderTodos();
    saveToLocalStorage();

    showModalNotification('Задача успешно добавлена', 'success');
    todoInput.value = '';
    todoDate.value = '';
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

        // Загаловок
        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        textSpan.className = `text-lg ${ todo.completed ? 'line-through text-gray-500' : '' }`;
        textSpan.addEventListener('click', () => toggleCompleted(todo.id));

        // Дата задачи
        const dateSpan = document.createElement('span');
        dateSpan.textContent = `До: ${ todo.date }`;
        dateSpan.className = 'text-sm text-gray-500';

        // Категории зядяч
        const categorySpan = document.createElement('span');
        categorySpan.textContent = todo.category;
        categorySpan.className = `inline-block mt-1 px-2 py-1 text-xs fonst-semibold rounded ${
            todo.category === 'work'
                ? 'bg-blue-200 text-blue-800'
                : todo.category === 'personal'
                ? 'bg-green-200 text-green-800'
                : todo.category === 'shopping'
                ? 'bg-purple-200 text-purple-800'
                : 'bg-gray-200 text-gray-800'
        }`;

        // Кнопка удалить задачу
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.className = 'mt-2 text-red-500 hover:underline';
        deleteBtn.addEventListener('click', () => deleteTask(todo.id));

        li.appendChild(textSpan);
        li.appendChild(dateSpan);
        li.appendChild(categorySpan);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });

    unpdateTaskCount();
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
    const task = todos.find((todo) => todo.id === id);
    const status = task.completed ? 'завершена' : 'задача в процессе';
    showModalNotification(`Вы поменяли статус задачи на: ${ status }`, type='success', time=3000);
}

// Удаление задачи
function deleteTask(id) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
    saveToLocalStorage();
    showModalNotification('Задача успешно удалена', type='success', time=1000);
}

loadFromLocalStorage();

