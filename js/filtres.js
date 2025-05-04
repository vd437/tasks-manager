// Filtering and searching functionality
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('tasksContainer')) return;

    // Initialize filters
    setupFilters();
});

function setupFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const searchInput = document.getElementById('searchInput');

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }

    if (priorityFilter) {
        priorityFilter.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const priorityFilter = document.getElementById('priorityFilter')?.value || 'all';
    const searchText = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    const tasks = StorageHelper.getTasks();
    const tasksContainer = document.getElementById('tasksContainer');
    
    if (!tasksContainer) return;

    // Clear existing tasks
    tasksContainer.innerHTML = '';

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        // Status filter
        if (statusFilter !== 'all' && task.status !== statusFilter) {
            return false;
        }
        
        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
            return false;
        }
        
        // Search filter
        if (searchText && !task.title.toLowerCase().includes(searchText)) {
            return false;
        }
        
        return true;
    });

    // Display filtered tasks
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = '<p class="no-tasks">No tasks match your filters.</p>';
    } else {
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksContainer.appendChild(taskElement);
        });
    }
      }
