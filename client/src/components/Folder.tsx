import ImageBox from "./ImageBox";

const Folder = ({ folders }) => {
  return (
    <>
      <span className="flex justify-end p-2">
        <form action="">
          <input
            type="text"
            name="searchTerm"
            placeholder="search..."
            className="border-4 border-[]"
          />
        </form>
      </span>
      <div className="flex">
        <ul className="flex flex-col p-4 w-[12%] bg-slate-100">
          <h2 className="p-4 text-[#aa80ff]">Folders</h2>
          <div className="flex">
            {folders.map((folder, index) => (
              <a
                href="#"
                key={index}
                className="flex items-center p-2 hover:bg-gray-200 ative:bg-[#ffaa80] rounded-md transition-colors duration-200"
              >
                <span className="mr-1">📁</span>
                <span className="text-[#ffaa80]">{folder.folderName}</span>
              </a>
            ))}
          </div>
        </ul>
        <ImageBox />
      </div>
    </>
  );
};

export default Folder;
