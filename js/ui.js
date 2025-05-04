// UI related functions
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('taskManagerTheme') || 'light';
        document.body.className = `${savedTheme}-mode`;
        themeToggle.textContent = savedTheme === 'light' ? 'Dark Mode' : 'Light Mode';

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.body.classList.remove(`${currentTheme}-mode`);
            document.body.classList.add(`${newTheme}-mode`);
            themeToggle.textContent = newTheme === 'light' ? 'Dark Mode' : 'Light Mode';
            
            localStorage.setItem('taskManagerTheme', newTheme);
        });
    }

    // Initialize any other UI elements
    initializeUI();
});

function initializeUI() {
    // Any additional UI initialization can go here
}

// This function is also in tasks.js, but we'll keep it here for reference
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
      }
