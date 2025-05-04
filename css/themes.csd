/* Dark Mode */
body.dark-mode {
    --primary-color: #64b5f6;
    --secondary-color: #42a5f5;
    --accent-color: #4fc3f7;
    --text-color: #e0e0e0;
    --bg-color: #121212;
    --card-bg: #1e1e1e;
    --border-color: #333;
}

body.dark-mode .btn-secondary {
    background-color: #333;
    color: #e0e0e0;
}

body.dark-mode .btn-secondary:hover {
    background-color: #444;
}

body.dark-mode .task-card {
    background-color: #252525;
}

body.dark-mode .task-card.done {
    background-color: #1a1a1a;
}

body.dark-mode input,
body.dark-mode select,
body.dark-mode textarea {
    background-color: #333;
    color: #e0e0e0;
    border-color: #444;
}

body.dark-mode .progress-bar {
    background-color: #333;
}

body.dark-mode .task-status {
    background-color: #333;
}

body.dark-mode .task-status.todo {
    background-color: #423000;
    color: #ffb74d;
}

body.dark-mode .task-status.in-progress {
    background-color: #003063;
    color: #64b5f6;
}

body.dark-mode .task-status.done {
    background-color: #1b5e20;
    color: #81c784;
}
