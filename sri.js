let accessToken = ""; 

const uploadUrl = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
const folderId = "1lkq3UdLDd9-aS8J7WrPUCkyJmLscB3HQ"; 

document.getElementById("uploadButton").addEventListener("click", async () => {
    if (!accessToken) {
        authenticate(); 
    } else {
        const fileInput = document.getElementById("fileUpload");
        const file = fileInput.files[0];
        if (file) {
            try {
                await uploadFileToDrive(file);
            } catch (error) {
                console.error("File upload failed:", error);
                alert("Error uploading file. Please try again.");
            }
        } else {
            alert("Please select a file.");
        }
    }
});

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
    // Lakukan update izin di sini jika diperlukan
}

function authenticate() {
    const clientId = "21812121373-ehtg2sccmgirt697mtmu37kmcs0dgs9c.apps.googleusercontent.com"; 
    const redirectUri = "https://testgoogle-drive.vercel.app"; 
    const scope = "https://www.googleapis.com/auth/drive.file";
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

    window.location.href = authUrl;
}

function handleAuthToken() {
    const params = new URLSearchParams(window.location.hash.replace("#", ""));
    if (params.has("access_token")) {
        accessToken = params.get("access_token");
        console.log("Access Token found:", accessToken);
        window.history.pushState({}, document.title, window.location.pathname); 
    }
}

window.onload = function () {
    handleAuthToken();
};
