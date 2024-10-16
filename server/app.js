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

// Endpoint to handle the API request from the client
app.get("/folders", async (req, res) => {
  //
  // List files in folder
  const listFilesInFolder = async (folderId) => {
    const filesResponse = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: "files(id, name, mimeType, size)",
    });
    return filesResponse.data.files;
  };
  //
  // Lists folders in the folder
  const listSubfolders = async (folderId) => {
    const subfolderResponse = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: "files(id, name)", // Get the subfolder ID and name
    });
    return subfolderResponse.data.files;
  };

  try {
    //
    // Find the Waweru Documents folder by name
    const folderResponse = await drive.files.list({
      q: "'root' in parents and mimeType='application/vnd.google-apps.folder' and name='Waweru Documents'", // Get folder in drive root named Waweru Documents.
      fields: "files(id, name)",
    });
    const folders = folderResponse.data.files;

    if (folders.length > 0) {
      const waweruFolderId = folders[0].id; // Get the Waweru folder ID

      // Get all subfolders inside Waweru documents
      const subfolders = await listSubfolders(waweruFolderId);

      // Store the      result to send the client
      const folderData = [];

      for (const subfolder of subfolders) {
        // Get files inside each subfolder
        const filesInSubfolder = await listFilesInFolder(subfolder.id);

        folderData.push({
          subfolder: {
            id: subfolder.id,
            name: subfolder.name,
          },
          files:
            filesInSubfolder.length > 0 ? filesInSubfolder : "No files found",
        });
      }

      res.json({
        folder: {
          id: waweruFolderId,
          name: "Waweru Documents",
        },
        subfolders: folderData.length > 0 ? folderData : "No subfolders found",
      });
    } else {
      res.json({ message: "'Waweru Documents' folder not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred", details: error });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
