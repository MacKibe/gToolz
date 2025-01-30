const Folder = ({ folders }) => {
  return (
    <>
      <ul className="flex flex-col items-center p-4 w-1/6 ">
        <h2 className="p-4 ">Folders</h2>
        {folders.map((folder, index) => (
          <li
            key={index}
            className="flex items-center p-2 hover:bg-gray-200 rounded-md transition-colors duration-200"
          >
            <span className="mr-4">📁</span> {/* Folder icon */}
            <span className="text-gray-700">{folder.folderName}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Folder;
