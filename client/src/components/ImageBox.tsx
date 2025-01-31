import React from "react";

const ImageBox = () => {
  return (
    <div className="flex w-5/6 m-2 bg-[#aa80ff]">
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Image Container */}
        <div className="relative">
          <img src="https://drive.google.com/uc?id=11XMUmnEza_XlFJEsjhrI0Wi05MIaqgpv&export=download" alt="" />
          {/* Button to Open Image */}
          <a
            href="https://drive.google.com/uc?id=11XMUmnEza_XlFJEsjhrI0Wi05MIaqgpv&export=download"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 bg-white/80 rounded-full p-2 hover:bg-white/90 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Description Container */}
        <div className="p-4">
          <p className="text-gray-700 text-sm">
            This is a sample description for the image. It provides some context
            or details about the image.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageBox;
