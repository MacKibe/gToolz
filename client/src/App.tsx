import { useState, useEffect } from "react";
const App = () => {
  //
  // Stores the state.
  const [images, setImages] = useState([]);
  //
  // Get data.
  useEffect(() => {
    fetch("http://localhost:5000/images") // Your Node.js server endpoint
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
      .catch((error) => console.log("Error fetching images:", error));
  }, []);
  return (
    <div>
      {/* <img src={imageUrl} alt="" />
      <a href={imageUrl}  target="_blank" rel="noopener noreferrer">Link</a>
      <iframe src={imageUrl} height="550" width="500"/> */}
      <h1>Waweru!</h1>
    </div>
  );
};
export default App;
