
let accessToken = ""; // Variable to store the OAuth 2.0 access token

// URL for Google Drive API to upload files
const uploadUrl =
  "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
const folderId = "1lkq3UdLDd9-aS8J7WrPUCkyJmLscB3HQ"; // Folder ID from your Google Drive

// Event listener for upload button
document.getElementById("uploadButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileUpload"); // Get file input element
  const file = fileInput.files[0]; // Get the selected file
  if (file) {
    try {
      await uploadFileToDrive(file); // Call the function to upload the file
    } catch (error) {
      console.error("File upload failed:", error); // Log any error
      alert("An error occurred during file upload. Please try again."); // Display error message to the user
    }
  } else {
    // If no file is selected, show an alert
    alert("Please select a file.");
  }
});

// Function to upload file to Google Drive
async function uploadFileToDrive(file) {
  // Metadata for the file upload, including name, type, and parent folder
  const metadata = {
    name: file.name, // File name on Google Drive
    parents: [folderId], // Folder ID where the file will be uploaded
    mimeType: file.type, // MIME type of the file (e.g., image/jpeg, application/pdf)
  };

  // Create form data that will be sent to Google Drive
  const formData = new FormData();
  formData.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  formData.append("file", file);

  // Send the POST request to upload the file
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: new Headers({ Authorization: "Bearer " + accessToken }), // Include the access token for authorization
    body: formData, // Send the form data
  });

  if (!response.ok) {
    throw new Error("File upload failed. Status: " + response.status);
  }

  const data = await response.json(); // Parse the response as JSON
  console.log("File uploaded successfully:", data); // Log the response data
  alert("File uploaded to Google Drive successfully!"); // Show a success message to the user
}

// OAuth 2.0 authentication function
function authenticate() {
  const clientId =
    "21812121373-ehtg2sccmgirt697mtmu37kmcs0dgs9c.apps.googleusercontent.com"; // Replace with your Google OAuth 2.0 Client ID
  const redirectUri = window.location.origin; // The redirect URI, usually the current page
  const scope = "https://www.googleapis.com/auth/drive.file"; // The scope to access Google Drive
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

  // Redirect the user to Google login page
  window.location.href = authUrl;
}

// Function to run on page load
window.onload = function () {
  const params = new URLSearchParams(window.location.hash.replace("#", ""));
  if (params.has("access_token")) {
    // If an access token is present in the URL, store it
    accessToken = params.get("access_token");
    console.log("Access Token:", accessToken); // Log the access token
  } else {
    // If no access token, trigger authentication
    authenticate();
  }
};
