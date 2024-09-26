let accessToken = ""; // Store the OAuth 2.0 access token

// URL for Google Drive API to upload files
const uploadUrl = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
const folderId = "1iE_NirOMcTjCB88Uzwf32vObjwRPlg1u"; // Your Google Drive folder ID

document.getElementById("uploadButton").addEventListener("click", async () => {
    console.log("Upload button clicked");
    if (!accessToken) {
        console.log("No access token, starting authentication");
        authenticate(); // Only call authenticate here
    } else {
        console.log("Access token exists, proceeding with upload");
        const fileInput = document.getElementById("fileUpload");
        const file = fileInput.files[0];
        if (file) {
            try {
                await uploadFileToDrive(file);
            } catch (error) {
                console.error("File upload failed:", error);
                alert("An error occurred during file upload. Please try again.");
            }
        } else {
            alert("Please select a file.");
        }
    }
});

// Function to upload the file to Google Drive
async function uploadFileToDrive(file) {
    const metadata = {
        name: file.name,
        parents: [folderId],
        mimeType: file.type,
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("file", file);

    const response = await fetch(uploadUrl, {
        method: "POST",
        headers: new Headers({ Authorization: "Bearer " + accessToken }),
        body: formData,
    });

    if (!response.ok) {
        throw new Error("File upload failed. Status: " + response.status);
    }

    const data = await response.json();
    console.log("File uploaded successfully:", data);
    alert("File uploaded successfully!");
}

// OAuth 2.0 authentication
function authenticate() {
    const clientId = "998766543441-d68nm2fi1ovc4433fob2fr14ni8vnhmb.apps.googleusercontent.com"; // Your Google Client ID
    const redirectUri = window.location.origin;
    const scope = "https://www.googleapis.com/auth/drive.file";
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

    window.location.href = authUrl;
}

// Handle the access token from the URL when the user is redirected back after authentication
function handleAuthToken() {
    const params = new URLSearchParams(window.location.hash.replace("#", ""));
    if (params.has("access_token")) {
        accessToken = params.get("access_token");
        console.log("Access Token found:", accessToken);
        window.history.pushState({}, document.title, window.location.pathname); // Clear token from URL
    }
}

// Check for token if redirected back from authentication
window.onload = function () {
    handleAuthToken();
};
