function login(event) {
    event.preventDefault();
    // Redirect to dashboard after "logging in"
    window.location.href = "dashboard.html";
}

function logout() {
    // Redirect to login page after "logging out"
    window.location.href = "index.html";
}
