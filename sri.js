const { google } = require('googleapis');

// Gantikan dengan informasi Service Account Anda
const SERVICE_ACCOUNT_EMAIL = "dialogika@dialogika-upload-file.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n";
const FOLDER_ID = "YOUR_FOLDER_ID"; // Ganti dengan ID folder di Google Drive

// Inisialisasi JWT client
const jwtClient = new google.auth.JWT(
  SERVICE_ACCOUNT_EMAIL,
  null,
  PRIVATE_KEY,
  ['https://www.googleapis.com/auth/drive.file']
);

// Fungsi untuk mengupload file
async function uploadFile(filePath, fileName) {
  await jwtClient.authorize();

  const drive = google.drive({ version: 'v3', auth: jwtClient });
  
  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID]
  };
  
  const media = {
    mimeType: 'application/octet-stream', // Ganti sesuai dengan jenis file yang diupload
    body: fs.createReadStream(filePath)
  };
  
  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
    console.log('File uploaded successfully, File ID:', response.data.id);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// Panggil fungsi upload
uploadFile('path/to/your/file.txt', 'file.txt');
