import React, { useEffect, useState } from "react";
// import ImageBox from "./ImageBox";
import Folder from "./Folder";

const App = () => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-files");
        const data = await response.json();
        if (data.success) {
          setFolders(data.data);
        } else {
          console.error("Error fetching files:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <h1 className="underline">Files and Folders</h1>
      <Folder folders={folders}/>
      {/* <ImageBox /> */}
    </div>
  );
};

export default App;