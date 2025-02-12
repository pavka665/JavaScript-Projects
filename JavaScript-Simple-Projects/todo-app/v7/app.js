// Получение всех элементов
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoDate = document.getElementById('todo-date');
const todoCategory = document.getElementById('todo-category');

const addCategory = document.getElementById('add-category-btn');
const categoryModal = document.getElementById('category-modal');
const newCategoryInput = document.getElementById('new-category-input');
const saveCategoryBtn = document.getElementById('save-category-btn');
const cancelCategoryBtn = document.getElementById('cancel-category-btn');
const sortDateBtn = document.getElementById('sort-date-btn');

const scheduleDateInput = document.getElementById('schedule-date');
const showScheduleBtn = document.getElementById('show-schedule-btn');

// Кнопки фильтрации
const filterButtons = document.querySelectorAll('filter-btn');
let filter = 'all';

// Массив для храрнения задач
let todos = [];

// Логика модального окна
function showModalNotification(message, type='info', time=3000) {
    const modal = document.getElementById('notification-modal');
    const notificationText = document.getElementById('notification-text');

    notificationText.textContent = message;
    notificationText.className = `text-lg font-semobold text-center ${
        type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : 'text-gray-600'
    }`;

    modal.classList.remove('hidden');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, time);
}

// Добавление новой задачи
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

    todoInput.value = '';
    todoDate.value = '';
});

// Отображение задачи
function renderTodos() {
    todoList.innerHTML = '';

    // Группируем задачи по дате
    const groupedTodos = todos.reduce((groups, todo) => {
        if (!groups[todo.date]) {
            groups[todo.date] = [];
        }
        
        groups[todo.date].push(todo);
        return groups;
    }, {});

    // Сортируем даты (по возрастанию)
    const sortedDates = Object.keys(groupedTodos).sort((a,b) => new Date(a) - new Date(b));

    // Рендерим группы задач
    sortedDates.forEach((date) => {
        // Заголовок группы (дата)
        const dateHeader = document.createElement('h3');
        dateHeader.textContent = date;
        dateHeader.className = 'text-lg font-bold text-gray-700 mb-2';

        todoList.appendChild(dateHeader);

        // Задачи внутри группы
        groupedTodos[date].forEach((todo) => {
            const li = document.createElement('li');
            li.className = 'flex flex-col bg-gray-100 p-2 rounded shadow mb-2';

            const textSpan = document.createElement('span');
            textSpan.textContent = todo.text;
            textSpan.className = `text-lg ${ todo.completed ? 'line-through text-gray-500' : '' }`;
            textSpan.addEventListener('click', () => toggleCompleted(todo.id));

            const categorySpan = document.createElement('span');
            categorySpan.textContent = todo.category;
            categorySpan.className = `inline-block mt-1 px-2 py-1 text-xs font-semibold rounded ${
                todo.category === 'work'
                    ? 'bg-blue-200 text-blue-800'
                    : todo.category === 'personal'
                    ? 'bg-green-200 text-green-800'
                    : todo.category === 'shopping'
                    ? 'bg-purple-200 text-purple-800'
                    : 'bg-gray-200 text-gray-800'
            }`;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Удалить';
            deleteBtn.className = 'mt-2 text-red-500 hover:underline';
            deleteBtn.addEventListener('click', () => deleteTask(todo.id))

            li.appendChild(textSpan);
            li.appendChild(categorySpan);
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    });
}

showScheduleBtn.addEventListener('click', () => {
    const selectedDate = scheduleDateInput.value;

    if (!selectedDate) {
        showModalNotification('Пожалуйста выберите дату', 'error');
        return;
    }

    const tasksForDate = todos.filter((todo) => todo.date === selectedDate);
    
    if (tasksForDate.length === 0) {
        showModalNotification('Нету задачи на текущей дате', 'info');
        return;
    }

    todoList.innerHTML = '';

    const dateHeader = document.createElement('h3');
    dateHeader.textContent = `Расписание на ${ selectedDate }`;
    dateHeader.className = 'text-lg font-bold text-gray-700 mb-2';

    todoList.appendChild(dateHeader);

    tasksForDate.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'flex flex-col bg-gray-100 p-2 rounded shadow mb-2';

        const textSpan = document.createElement('span');
        textSpan.textContent = todo.text;
        textSpan.className = `text-lg ${ todo.completed ? 'line-through text-gray-500' : '' }`
        textSpan.addEventListener('click', () => toggleCompleted(todo.id));

        const categorySpan = document.createElement('span');
        categorySpan.textContent = todo.category;
        categorySpan.className = `inline-block mt-2 px-2 py-1 text-sm font-semibold rounded ${
            todo.category === 'work'
                ? 'bg-blue-200 text-blue-800'
                : todo.category === 'personal'
                ? 'bg-green-200 text-green-800'
                : todo.category === 'shopping'
                ? 'bg-yellow-200 text-yellow-800'
                : 'bg-gray-200 text-gray-800'
        }`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.className = 'mt-2 text-red-500 hover:underline';
        deleteBtn.addEventListener('click', () => deleteTask(todo.id));

        li.appendChild(textSpan);
        li.appendChild(categorySpan);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
});

const showAllBtn = document.getElementById('show-all-btn');

showAllBtn.addEventListener('click', () => {
    renderTodos();
})

// Запись в localstrage
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Загрузка из localstorage
function loadFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos !== null) {
        todos = JSON.parse(storedTodos);
        renderTodos();
    }
}

// Переключение статуса задачи
function toggleCompleted(id) {
    todos = todos.map((todo) => todo.id === id ? {...todo, completed: !todo.completed} : todo);
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