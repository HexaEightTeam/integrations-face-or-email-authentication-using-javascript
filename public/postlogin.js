// Event listener for the logout button
document.getElementById('logout').addEventListener('click', function() {
    // Send a POST request to the logout endpoint
    fetch('/user/logout', {
        method: 'POST'
    }).then(function() {
        // Remove the token from local storage
        localStorage.removeItem('token')
        // Redirect to the login page
        window.location.href = '/login.html';
    });
});

// Fetch user data from the API
fetch('/api/data', {
    headers: {
        // Include the token in the Authorization header
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}).then(function(response) {
    // Parse the response as JSON
    return response.json();
}).then(function(data) {
    // Display the user data in the 'userdata' element
    document.getElementById('userdata').textContent = 'User Data: ' + JSON.stringify(data.authorizedData);
}).catch(function(error) {
    // Log any errors to the console
    console.log('Error:', error);
});