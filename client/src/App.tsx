import { useQuery } from "@tanstack/react-query";

const fetchImages = async () => {
  const response = await fetch("/images");
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  return response.json();
};

const App = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['images'],
    queryFn: fetchImages,
  })
  console.log(data);
  
  //
  // Display loading before data is fetched
  if (isLoading) {
    return <div>Loading images...</div>;
  }
  //
  // Display error when an error occurs
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      {data.length > 0 ? (
        data.map((image) => (
          <div key={image.id}>
            <img
              src={image.webContentLink}
              alt={image.name}
              style={{ width: "200px", height: "200px" }}
            />
            <p>{image.name}</p>
          </div>
        ))
      ) : (
        <div>No images found.</div>
      )}
    </div>
  );
};

export default App;
