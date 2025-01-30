// Import necessary libraries
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

// Create an instance of Express
const app = express();

// Enable CORS for all routes
app.use(cors());

// Load environment variables (if using dotenv)
require("dotenv").config();

// Your OAuth2 credentials (use environment variables)
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

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
    fields: "files(id, name, mimeType, webContentLink)",
  });

  const files = res.data.files;

  // Create an array to hold folder data
  const folderData = [];

  // Process files and subfolders
  for (const file of files) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      // Recursively fetch files in subfolder
      const subfolderFiles = await listFilesInFolder(file.id);
      folderData.push({
        folderName: file.name,
        folderId: file.id,
        files: subfolderFiles,
      });
    } else {
      // Add file directly to the folder data
      folderData.push({
        fileName: file.name,
        fileId: file.id,
        fileUrl: file.webContentLink,
      });
    }
  }

  // Sort folders by name (assuming folder names are numeric)
  folderData.sort((a, b) => parseInt(a.folderName) - parseInt(b.folderName));

  return folderData;
};

// Define an API endpoint to fetch files
app.get("/get-files", async (req, res) => {
  try {
    // Get the folder ID of "Waweru Documents"
    const folderId = await getFolderId("Waweru Documents");

    // List files in the specified folder and its subfolders
    const files = await listFilesInFolder(folderId);

    // Send the response
    res.status(200).json({ success: true, data: files });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Define the PORT and start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});