// Ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskDeadline = document.getElementById('taskDeadline');
    const taskPriority = document.getElementById('taskPriority');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage
    loadTasks();

    // Add Task Event
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const deadline = taskDeadline.value;
        const priority = taskPriority.value;

        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        // Create Task Item
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item', priority);
        taskItem.draggable = true;
        taskItem.innerHTML = `
            <span>${taskText} (Due: ${deadline || 'No deadline'})</span>
            <div class="actions">
                <button class="edit">✏️</button>
                <button class="delete">🗑️</button>
            </div>
        `;
        taskList.appendChild(taskItem);

        // Clear Inputs
        taskInput.value = '';
        taskDeadline.value = '';
        taskPriority.value = 'medium';

        attachTaskListeners(taskItem);
        saveTasks();
    });

    // Edit and Delete Task
    function attachTaskListeners(taskItem) {
        const editBtn = taskItem.querySelector('.edit');
        const deleteBtn = taskItem.querySelector('.delete');

        editBtn.addEventListener('click', () => {
            const newTaskText = prompt('Edit your task:', taskItem.querySelector('span').innerText);
            if (newTaskText) {
                taskItem.querySelector('span').innerText = newTaskText;
                saveTasks();
            }
        });

        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
        });

        taskItem.addEventListener('dragstart', () => {
            taskItem.classList.add('dragging');
        });

        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('dragging');
            saveTasks();
        });
    }

    // Drag and Drop Functionality
    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(taskList, e.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggingItem);
        } else {
            taskList.insertBefore(draggingItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Save and Load Tasks
    function saveTasks() {
        localStorage.setItem('tasks', taskList.innerHTML);
    }

    function loadTasks() {
        taskList.innerHTML = localStorage.getItem('tasks') || '';
        taskList.querySelectorAll('.task-item').forEach(attachTaskListeners);
    }
});
