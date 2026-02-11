// ===== API BASE URL =====
const API = '/tasks';

// ===== DOM ELEMENTS =====
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const searchInput = document.getElementById('search');
const filterPriority = document.getElementById('filter-priority');
const filterCompleted = document.getElementById('filter-completed');
const sortBy = document.getElementById('sort-by');

// ===== LOAD TASKS =====
async function loadTasks() {
    // Build query string from filters
    const params = new URLSearchParams();

    const search = searchInput.value.trim();
    const priority = filterPriority.value;
    const completed = filterCompleted.value;
    const sort = sortBy.value;

    if (search) params.append('keyword', search);
    if (priority) params.append('priority', priority);
    if (completed) params.append('completed', completed);
    if (sort) params.append('sort', sort);

    const query = params.toString();
    const url = query ? `${API}?${query}` : API;

    try {
        const response = await fetch(url);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        taskList.innerHTML = '<p class="empty-state">Failed to load tasks</p>';
    }
}

// ===== DISPLAY TASKS =====
function displayTasks(tasks) {
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p class="empty-state-text">No tasks currently</p>
            </div>
        `;
        taskCount.textContent = '';
        return;
    }

    const active = tasks.filter(t => !t.completed).length;
    const done = tasks.filter(t => t.completed).length;
    taskCount.textContent = `${active} active · ${done} completed`;

    taskList.innerHTML = tasks.map(task => `
        <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleComplete(${task.id}, ${!task.completed})">
            </div>
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-meta">
                    ${task.priority ? `<span class="tag tag-priority-${task.priority.toLowerCase()}">${task.priority}</span>` : ''}
                    ${task.category ? `<span class="tag tag-category">${task.category}</span>` : ''}
                    ${task.dueDate ? `<span class="tag ${isOverdue(task.dueDate, task.completed) ? 'tag-overdue' : 'tag-due'}">${formatDate(task.dueDate)}</span>` : ''}
                    ${task.createdAt ? `<span class="tag tag-due">Created ${formatDateTime(task.createdAt)}</span>` : ''}
                    ${task.updatedAt ? `<span class="tag tag-due">Updated ${formatDateTime(task.updatedAt)}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
            <button class="btn-action" onclick="editTask(${task.id})" title="Edit">✏️</button>
                <button class="btn-action btn-delete" onclick="deleteTask(${task.id})" title="Delete">🗑</button>
                
            </div>
        </div>
    `).join('');
}

// ===== CREATE TASK =====
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const task = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim() || null,
        category: document.getElementById('category').value || null,
        priority: document.getElementById('priority').value || null,
        dueDate: document.getElementById('dueDate').value || null
    };

    try {
        const response = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            taskForm.reset();
            loadTasks();
        } else {
            const error = await response.text();
            alert(error);
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
});

// ===== TOGGLE COMPLETE =====
async function toggleComplete(id, completed) {
    try {
        // Get current task data first
        const response = await fetch(`${API}/${id}`);
        const task = await response.json();

        // Update completed status
        task.completed = completed;

        await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });

        loadTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// ===== DELETE TASK =====
async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;

    try {
        await fetch(`${API}/${id}`, {
            method: 'DELETE'
        });

        loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function editTask(id) {
    try {
        const response = await fetch(`${API}/${id}`);
        const task = await response.json();

        const card = document.querySelector(`.task-card[data-id="${id}"]`);
        card.innerHTML = `
            <div class="edit-form">
                <input type="text" id="edit-title-${id}" value="${escapeHtml(task.title)}" placeholder="Title">
                <input type="text" id="edit-desc-${id}" value="${task.description ? escapeHtml(task.description) : ''}" placeholder="Description">
                <select id="edit-category-${id}">
                    <option value="">Select Category</option>
                    <option value="WORK" ${task.category === 'WORK' ? 'selected' : ''}>Work</option>
                    <option value="PERSONAL" ${task.category === 'PERSONAL' ? 'selected' : ''}>Personal</option>
                    <option value="STUDY" ${task.category === 'STUDY' ? 'selected' : ''}>Study</option>
                    <option value="HEALTH" ${task.category === 'HEALTH' ? 'selected' : ''}>Health</option>
                    <option value="FINANCE" ${task.category === 'FINANCE' ? 'selected' : ''}>Finance</option>
                </select>
                <select id="edit-priority-${id}">
                    <option value="">Select Priority</option>
                    <option value="HIGH" ${task.priority === 'HIGH' ? 'selected' : ''}>High</option>
                    <option value="MEDIUM" ${task.priority === 'MEDIUM' ? 'selected' : ''}>Medium</option>
                    <option value="LOW" ${task.priority === 'LOW' ? 'selected' : ''}>Low</option>
                </select>
                <input type="date" id="edit-date-${id}" value="${task.dueDate || ''}">
                <div class="edit-actions">
                    <button class="btn-save" onclick="saveTask(${id})">Save</button>
                    <button class="btn-cancel" onclick="loadTasks()">Cancel</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading task for edit:', error);
    }
}

async function saveTask(id) {
    const task = {
        title: document.getElementById(`edit-title-${id}`).value.trim(),
        description: document.getElementById(`edit-desc-${id}`).value.trim() || null,
        category: document.getElementById(`edit-category-${id}`).value || null,
        priority: document.getElementById(`edit-priority-${id}`).value || null,
        dueDate: document.getElementById(`edit-date-${id}`).value || null,
        completed: false
    };

    try {
        const response = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            loadTasks();
        } else {
            const error = await response.text();
            alert(error);
        }
    } catch (error) {
        console.error('Error saving task:', error);
    }
}

// ===== EVENT LISTENERS FOR FILTERS =====
searchInput.addEventListener('input', debounce(loadTasks, 300));
filterPriority.addEventListener('change', loadTasks);
filterCompleted.addEventListener('change', loadTasks);
sortBy.addEventListener('change', loadTasks);

// ===== HELPER FUNCTIONS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function isOverdue(dateString, completed) {
    if (completed) return false;
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ===== INITIAL LOAD =====
loadTasks();