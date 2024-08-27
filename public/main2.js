// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async (event) => {
    // Initially hide the login button and show the generate session code button
    document.getElementById('generate').hidden = false;
    document.getElementById('loginbutton').hidden = true;
    document.getElementById('loginbutton').disabled = true;
    // Add event listener for form submission
    document.getElementById('submitForm').addEventListener('submit', handleFormSubmit);
});

// Function to handle the form submission
function handleFormSubmit(event) {
    // Prevent the form from being submitted normally
    event.preventDefault();
    // Call the function to get the session code
    getSessionCode();
    return false;
}

// Function to get the session code
async function getSessionCode() {
    // Get the email from the input field
    const email = document.getElementById('email').value;
    // Send a POST request to the server to get the session code
    const response = await fetch('/api/getemailsessioncode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    });
    // Parse the response as JSON
    const data = await response.json();
    // Hide the generate session code button and show the login button
    document.getElementById('generate').hidden = true;
    document.getElementById('loginbutton').hidden = false;
    document.getElementById('loginbutton').disabled = false;
    // Display the session code in the input field
    document.getElementById('sessioncode').value = data.sessionCode;
    // Add event listener for the second form submission
    document.getElementById('submitForm').addEventListener('submit', handleFormSubmit2);
}

// Function to handle the second form submission
function handleFormSubmit2(event) {
    // Prevent the form from being submitted normally
    event.preventDefault();
    // Call the function to authenticate the user
    authenticate();
    return false;
}

// Function to authenticate the user
async function authenticate() {
    // Get the session code and access code from the input fields
    const sessioncode = document.getElementById('sessioncode').value;
    const accesscode = document.getElementById('accesscode').value;
    // Send a POST request to the server to authenticate the user
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessioncode, accesscode })
    });
    // If the response is OK, the user is authenticated
    if (response.ok) {
        // Display a success message and redirect the user
        document.getElementById('sessioncode').value="Login Successful...";
        document.getElementById('sessioncode').readOnly = true;
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);
        window.location.href = '/postlogin2.html';
    } else {
        // If the response is not OK, the login failed
        document.getElementById('sessioncode').value="Login Failed!!!";
        document.getElementById('sessioncode').readOnly = true;
        console.log('Login failed');
    }
}