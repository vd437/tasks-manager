// Helper functions for localStorage operations
class StorageHelper {
    static getUsers() {
        const users = localStorage.getItem('taskManagerUsers');
        return users ? JSON.parse(users) : [];
    }

    static saveUsers(users) {
        localStorage.setItem('taskManagerUsers', JSON.stringify(users));
    }

    static getCurrentUser() {
        return localStorage.getItem('taskManagerCurrentUser');
    }

    static setCurrentUser(email) {
        localStorage.setItem('taskManagerCurrentUser', email);
    }

    static clearCurrentUser() {
        localStorage.removeItem('taskManagerCurrentUser');
    }

    static getTasks() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];
        
        const tasks = localStorage.getItem(`taskManagerTasks_${currentUser}`);
        return tasks ? JSON.parse(tasks) : [];
    }

    static saveTasks(tasks) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;
        
        localStorage.setItem(`taskManagerTasks_${currentUser}`, JSON.stringify(tasks));
    }

    static getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    static addUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
    }
}
