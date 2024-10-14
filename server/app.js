// import expreess
const express = require('express');
// Import the Google APIs client library
const { google } = require("googleapis");

// To access the Google Drive API, we need to authenticate using OAuth2
// We need the refresh token, client ID, client secret, and redirect URL

// The refresh token, is used to obtain new access tokens when the current one expires
// Get it from the google playground
const REFRESH_TOKEN =
  "1//04k7B68r323j4CgYIARAAGAQSNwF-L9IrGUjxeooEFt5HxwBnlyZXlzx3EnFFvUaQRJYcehCbHpIVkYKUsiR10RUd4RrRsHPktkc";

// Get the Client ID and client secret from Google Cloud Console.
const CLIENT_ID =
  "29587586519-r0pg7nbaeish65duob4d8dl0ngeetq7e.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

// Redirect URL for OAuth2 authentication, used during the token generation process
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

// Function to generate a public link for a file or folder on Google Drive
async function generatePublicLink() {
  // List the folders in the root directory of Google Drive
  await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder'", // Filter folders only
    fields: 'files', // Fields we are interested in (we want the folder ID and name)
    pageSize: 3 // Get 3 results
  }, (error, response) => {
    // Show any error that may occur during the request
    if (error) {
      console.error('An error occurred', error);
    }
    const data = response.data; // Response data
    console.log(data);// Testing purposes and seeing how our data looks like.
    
    // Get the folder data from the response
    const folders = response.data.files;
    
    if (folders.length) {
      console.log("List of folders:");
      // Log each folder's name and ID
      folders.forEach((folder) => {
        console.log(`${folder.name} ${folder.id}`);
      });
    } else {
      // If no folders are found, display this message
      console.log('No folders found!');
    }
  });
}
generatePublicLink();

// Code for future functionalities (commented out for now):
// You can use this to generate file IDs
// const link = await drive.files.generateIds();

// Set file permissions to allow sharing (set access to 'reader' and make it public)
// await drive.permissions.create(
//   fileId: fileid, // Replace with actual file ID
//   requestBody: {
//     role: 'reader', // Set the permission as a reader
//     type: 'anyone' // Allow anyone to view the file
//   }
// );

// Get the shareable link of the file after permission is granted
