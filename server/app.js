// Import necessary libraries
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

// Create an instance of Express
const app = express();

// Enable CORS for all routes
app.use(cors());

// Your OAuth2 credentials
const REFRESH_TOKEN =
  "1//04w12tnQQThihCgYIARAAGAQSNwF-L9IrMPKlywztAWTmt5_KNeGcUac4txbUTt2usezqA1d553kOtbTpNJNKsh8CmjSoFm3g7t4";
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
  version: "v3",
  auth: oauthClient,
});

// Function to get the folder ID of "Waweru Documents"
const getFolderId = async (folderName) => {
  const res = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and 'root' in parents`,
    fields: "files(id, name)",
  });

  const folders = res.data.files;
  if (folders.length) {
    return folders[0].id; // Return the first matching folder's ID
  } else {
    throw new Error(`Folder named '${folderName}' not found in root.`);
  }
};

// Function to list files inside the specified folder and its subfolders
const listFilesInFolder = async (folderId) => {
  const res = await drive.files.list({
    q: `'${folderId}' in parents`, // Fetch all files and subfolders
    fields: "files(id, name, mimeType, permissions, webContentLink)",
  });

  const files = res.data.files;

  // Create an array to hold folder data
  const folderData = [];

  // Recursively search for files in subfolders
  for (const file of files) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      // Search for files in subfolder
      const subfolderFiles = await listFilesInFolder(file.id);
      folderData.push({
        folderName: file.name,
        folderId: file.id,
        files: subfolderFiles.map(f => f.files).flat(), // Flatten files in the subfolder
      });
    } else {
      // Add file directly to the folder data if there are no subfolders
      folderData.push({ files: [file] }); // Add file as an object with files array
    }
  }

  // Sort the folderData array by folder name numerically
  folderData.sort((a, b) => parseInt(a.folderName) - parseInt(b.folderName));

  return folderData;
};

// Create an async function to handle the logic
const main = async () => {
  try {
    // Get the folder ID of "Waweru Documents"
    const folderId = await getFolderId("Waweru Documents");
    console.log("1. Waweru's folder Id is:", folderId);

    // List files in the specified folder and its subfolders
    const files = await listFilesInFolder(folderId);
    console.log("2. Files data:", JSON.stringify(files, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
};
// Call the main function
main();

// Define the PORT and start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
