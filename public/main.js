// Wait for the DOM content to fully load before running the script
document.addEventListener('DOMContentLoaded', async (event) => {
    // Access the FaceCapture object
    const faceCapture = FaceCapture.default;
    // Define the IDs of the HTML elements to be used
    let videoElement = 'Video';
    let capturedImageElement = 'capturedImage'; // Get the new image element
    let overlayElement = 'overlay';
    let snapshotCanvasElement = 'snapshot';
    let statusElement = 'status';

    // Initially disable the login button
    document.getElementById('loginbutton').disabled=true;
    // Add an event listener to the form submit event
    document.getElementById('submitForm').addEventListener('submit', handleFormSubmit);
    // Display initializing status
    document.getElementById('status').innerHTML="Initializing... Please Wait";
    // Create a new faceCapture instance
    const facecapture = new faceCapture(videoElement, statusElement,true,capturedImageElement);
    // Start capturing the face
    await facecapture.startCapture();
    // Fetch the captured image
    const imgdata = await facecapture.fetchCapturedImage();
    // Send a POST request to the /api/facetoken endpoint with the captured image
    const response = await fetch('/api/facetoken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ facialPicture: imgdata })
    });
    // Parse the response data as JSON
    const data = await response.json();
    // Enable the login button
    document.getElementById('loginbutton').disabled=false;
    // Set the session code input field value to the session code from the response
    document.querySelector(".pass").value = data.sessionCode;
});

// Function to handle form submission
function handleFormSubmit(event) {
    // Prevent the default form submission
    event.preventDefault();
    console.log("Captured");
    // Call the authenticate function
    authenticate();
    return false;
}

// Function to authenticate the user
async function authenticate() {
    // Get the session code and access code from the input fields
    const sessioncodeelement = document.getElementById('sessioncode');
    const sessioncode = document.getElementById('sessioncode').value;
    const accesscode = document.getElementById('accesscode').value;

    // Send a POST request to the /api/login endpoint with the session code and access code
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessioncode, accesscode })
    });
    console.log(response);
    // If the response is ok, login is successful
    if (response.ok) {
        sessioncodeelement.value="Login Successful...";
        sessioncodeelement.readOnly = true;
        const data = await response.json();
        const token = data.token;
        // Store the token in local storage
        localStorage.setItem('token', token);
        // Redirect to the post login page
        window.location.href = '/postlogin.html';
    } else {
        // If the response is not ok, login failed
        sessioncodeelement.value="Login Failed!!!";
        sessioncodeelement.readOnly = true;
        console.log('Login failed');
    }
}