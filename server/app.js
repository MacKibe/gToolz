// Import Express
const express = require("express");
// Import CORS
const cors = require("cors");
// Import the Google APIs client library
const { google } = require("googleapis");
// Create an instance of Express
const app = express();
// Enable CORS for all routes
app.use(cors());

// Your OAuth2 credentials
const REFRESH_TOKEN =
  "1//04qH8m1xBKQQNCgYIARAAGAQSNwF-L9IrM17Gq9ZBzfjKj0C84ltBQuKqlPyPebFZR3sglAy9DvqagI4_Rlhy_PdMYVKYtemay80";
const CLIENT_ID =
  "29587586519-r0pg7nbaeish65duob4d8dl0ngeetq7e.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";

// Create an OAuth2 client using the credentials
const oauthClient = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

// Set the refresh token in the OAuth2 client to allow access to the Drive API
oauthClient.setCredentials({ refresh_token: REFRESH_TOKEN });

// Initialize the Google Drive API client
const drive = google.drive({
  version: "v3", // Specify Drive API version
  auth: oauthClient, // OAuth2 client for authorization
});

// Function to get the folder ID of "Waweru Documents"
const getFolderId = async (folderName) => {
  const res = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and 'root' in parents`,
    fields: "files(id, name)",
  });

  const folders = res.data.files;
  if (folders.length) {
    const folder = folders[0]; // Assuming there's only one "Waweru Documents" folder
    return folder.id;
  } else {
    throw new Error(`Folder named '${folderName}' not found in root.`);
  }
};

// Function to list folders inside the "Waweru Documents" folder
const listSubFolders = async (folderId) => {
  const res = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and '${folderId}' in parents`,
    fields: "files(id, name)",
  });

  const subfolders = res.data.files;
  if (subfolders.length) {
    console.log(`Folders in 'Waweru Documents':`);
    for (const folder of subfolders) {
      console.log(`${folder.name} (${folder.id})`);
      await listFilesInSubfolder(folder.id); // List files within the subfolder
    }
  } else {
    console.log("No subfolders found.");
  }
};

// Function to list files inside a specific subfolder
const listFilesInSubfolder = async (folderId) => {
  const res = await drive.files.list({
    q: `'${folderId}' in parents`,
    fields: "files(id, name )",
  });

  const files = res.data.files;
  if (files.length) {
    console.log(`Files in folder ID: ${folderId}`);
    files.forEach((file) => {
      console.log(`${file.name} (${file.id})`);
    });
  } else {
    console.log(`No files found in folder ID: ${folderId}`);
  }
};

// Call the function to list folders and files inside "Waweru Documents"
const listFoldersAndFilesInWaweruDocuments = async () => {
  try {
    const folderId = await getFolderId("Waweru Documents");
    await listSubFolders(folderId);
  } catch (error) {
    console.error(error.message);
  }
};

// Define the PORT and start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await listFoldersAndFilesInWaweruDocuments();
});
