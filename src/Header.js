import React from "react";

const Header = () => {
  return (
    <div className="flex items-center justify-between shrink-0 pt-1">
      <button className="w-[46px] h-[46px] rounded-full bg-white flex items-center justify-center text-[#101112] hover:scale-105 transition-transform">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>

      <h1 className="text-[17px] font-semibold text-[#101112]">Home</h1>

      <button className="w-[46px] h-[46px] rounded-full bg-white flex items-center justify-center text-[#101112] hover:scale-105 transition-transform">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-ml-1 -mt-1"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  );
};

export default Header;
