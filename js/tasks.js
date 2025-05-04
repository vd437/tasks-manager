// Task management functions
document.addEventListener('DOMContentLoaded', function() {
    if (!StorageHelper.getCurrentUser()) return;

    // Load tasks on dashboard
    if (document.getElementById('tasksContainer')) {
        loadTasks();
        setupTaskForm();
        setupTaskButtons();
    }

    // Load profile data
    if (document.getElementById('profileEmail')) {
        loadProfileData();
    }
});

function loadTasks() {
    const tasks = StorageHelper.getTasks();
    const tasksContainer = document.getElementById('tasksContainer');
    const progressFill = document.getElementById('progressFill');
    
    if (!tasksContainer) return;

    // Calculate completion percentage
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update progress bar
    if (progressFill) {
        progressFill.style.width = `${completionPercentage}%`;
        progressFill.textContent = `${completionPercentage}%`;
    }

    // Clear existing tasks
    tasksContainer.innerHTML = '';

    // Add each task to the container
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });

    // Check for deadline reminders
    checkDeadlineReminders(tasks);
}

function createTaskElement(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.priority}-priority ${task.status === 'done' ? 'done' : ''}`;
    
    // Format due date for display
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const formattedDate = dueDate ? dueDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    }) : 'No deadline';

    // Check if task is due soon (within 2 days)
    const isDueSoon = dueDate && !['done', 'in-progress'].includes(task.status) && 
                     (dueDate - new Date()) < 2 * 24 * 60 * 60 * 1000;

    taskCard.innerHTML = `
        <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <span class="task-priority ${task.priority}">${task.priority}</span>
        </div>
        <p class="task-description">${task.description || 'No description'}</p>
        <p class="task-due-date ${isDueSoon ? 'urgent' : ''}">
            Due: ${formattedDate} ${isDueSoon ? '(Due Soon!)' : ''}
        </p>
        <div class="task-status ${task.status}">
            ${formatStatus(task.status)}
        </div>
        <div class="task-actions">
            <button class="btn-secondary edit-task" data-id="${task.id}">Edit</button>
            <button class="btn-secondary delete-task" data-id="${task.id}">Delete</button>
            ${task.status !== 'done' ? `<button class="btn-primary complete-task" data-id="${task.id}">Complete</button>` : ''}
        </div>
    `;

    return taskCard;
}

function formatStatus(status) {
    const statusMap = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'done': 'Done'
    };
    return statusMap[status] || status;
}

function setupTaskForm() {
    const taskForm = document.getElementById('taskForm');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    const taskFormContainer = document.getElementById('taskFormContainer');

    if (!taskForm || !addTaskBtn) return;

    // Show form when Add Task button is clicked
    addTaskBtn.addEventListener('click', function() {
        taskForm.reset();
        document.getElementById('formTitle').textContent = 'Add New Task';
        document.getElementById('taskId').value = '';
        taskFormContainer.style.display = 'block';
        window.scrollTo({ top: taskFormContainer.offsetTop - 20, behavior: 'smooth' });
    });

    // Hide form when Cancel is clicked
    cancelTaskBtn.addEventListener('click', function() {
        taskFormContainer.style.display = 'none';
    });

    // Handle form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });
}

function saveTask() {
    const taskId = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    const status = document.getElementById('taskStatus').value;

    if (!title) {
        showNotification('Title is required', 'error');
        return;
    }

    let tasks = StorageHelper.getTasks();
    let task;

    if (taskId) {
        // Update existing task
        task = tasks.find(t => t.id === taskId);
        if (task) {
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
            task.priority = priority;
            task.status = status;
            showNotification('Task updated successfully', 'success');
        }
    } else {
        // Create new task
        task = {
            id: Date.now().toString(),
            title,
            description,
            dueDate,
            priority,
            status,
            createdAt: new Date().toISOString()
        };
        tasks.push(task);
        showNotification('Task added successfully', 'success');
    }

    StorageHelper.saveTasks(tasks);
    loadTasks();
    document.getElementById('taskFormContainer').style.display = 'none';
}

function setupTaskButtons() {
    const tasksContainer = document.getElementById('tasksContainer');

    if (!tasksContainer) return;

    // Handle edit, delete, and complete actions
    tasksContainer.addEventListener('click', function(e) {
        const taskId = e.target.getAttribute('data-id');
        if (!taskId) return;

        const tasks = StorageHelper.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) return;

        if (e.target.classList.contains('edit-task')) {
            editTask(tasks[taskIndex]);
        } else if (e.target.classList.contains('delete-task')) {
            deleteTask(taskId);
        } else if (e.target.classList.contains('complete-task')) {
            completeTask(taskId);
        }
    });

    // Layout toggle buttons
    const listLayoutBtn = document.getElementById('listLayoutBtn');
    const gridLayoutBtn = document.getElementById('gridLayoutBtn');

    if (listLayoutBtn && gridLayoutBtn) {
        listLayoutBtn.addEventListener('click', function() {
            tasksContainer.classList.remove('grid-view');
            listLayoutBtn.classList.add('active');
            gridLayoutBtn.classList.remove('active');
        });

        gridLayoutBtn.addEventListener('click', function() {
            tasksContainer.classList.add('grid-view');
            gridLayoutBtn.classList.add('active');
            listLayoutBtn.classList.remove('active');
        });
    }
}

function editTask(task) {
    const taskFormContainer = document.getElementById('taskFormContainer');
    const formTitle = document.getElementById('formTitle');
    
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskDueDate').value = task.dueDate || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    
    formTitle.textContent = 'Edit Task';
    taskFormContainer.style.display = 'block';
    window.scrollTo({ top: taskFormContainer.offsetTop - 20, behavior: 'smooth' });
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        let tasks = StorageHelper.getTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        StorageHelper.saveTasks(tasks);
        loadTasks();
        showNotification('Task deleted', 'success');
    }
}

function completeTask(taskId) {
    let tasks = StorageHelper.getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.status = 'done';
        StorageHelper.saveTasks(tasks);
        loadTasks();
        showNotification('Task marked as completed', 'success');
    }
}

function checkDeadlineReminders(tasks) {
    const now = new Date();
    const soon = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
    
    const upcomingTasks = tasks.filter(task => {
        if (task.status === 'done' || !task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        return dueDate > now && dueDate <= soon;
    });

    if (upcomingTasks.length > 0) {
        const taskTitles = upcomingTasks.map(t => t.title).join(', ');
        showNotification(`Deadline approaching for: ${taskTitles}`, 'warning');
    }
}

function loadProfileData() {
    const currentUser = StorageHelper.getCurrentUser();
    const tasks = StorageHelper.getTasks();
    
    document.getElementById('profileEmail').textContent = currentUser;
    document.getElementById('totalTasks').textContent = tasks.length;
    
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    document.getElementById('completedTasks').textContent = completedTasks;
    
    const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
      }
