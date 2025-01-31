import React, { useEffect, useState } from "react";
// import ImageBox from "./ImageBox";
import Folder from "./Folder";
import Nav from "./Nav";
import ImageBox from "./ImageBox";

const App = () => {
  const [folders, setFolders] = useState([]);
  const [showImages, setShowImages] = useState(false)

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
  const displayImages = () => {

  }
  return (
    <>
      <Nav/>
      <Folder folders={folders}/>
    </>
  );
};

export default App;