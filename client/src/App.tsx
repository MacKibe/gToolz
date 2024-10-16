import { useEffect, useState } from "react";

const App = () => {
  // State for storing folder data
  const [folderData, setFolderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch folder and file data from the server
  useEffect(() => {
    fetch("http://localhost:3000/folders")
      .then((response) => response.json())
      .then((data) => {
        setFolderData(data); // Set the fetched data to the state
        setLoading(false); // Data is loaded
      })
      .catch((err) => {
        setError(err.message); // Capture any errors
        setLoading(false); // Stop loading
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Display an error message if something goes wrong
  }

  // Check if there's valid data to display
  if (!folderData || !folderData.subfolders) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      {/* Display the root folder name */}
      <h1>{folderData.folder.name} Folder</h1>
      <ul>
        {/* Loop through each subfolder */}
        {folderData.subfolders.map((subfolder, index) => (
          <li key={index}>
            <h2>{subfolder.subfolder.name}</h2>
            <ul>
              {/* Check if there are files in the subfolder */}
              {Array.isArray(subfolder.files) ? (
                subfolder.files.map((file, id) => (
                  <li key={id}>
                    <span>{file.name}</span>
                  </li>
                ))
              ) : (
                <li>{subfolder.files}</li> // If no files found, display the message
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
