document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    // Store admin credentials in localStorage if not already present
    if (!localStorage.getItem('adminUsername')) {
        localStorage.setItem('adminUsername', ADMIN_USERNAME);
    }
    if (!localStorage.getItem('adminPassword')) {
        localStorage.setItem('adminPassword', ADMIN_PASSWORD);
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Retrieve stored credentials
        const storedUsername = localStorage.getItem('adminUsername');
        const storedPassword = localStorage.getItem('adminPassword');

        if (username === storedUsername && password === storedPassword) {
            // Successful login
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        } else {
            // Failed login
            errorMessage.textContent = 'Invalid username or password.';
            errorMessage.style.display = 'block';
        }
    });
});
