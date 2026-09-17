import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Nav = ({ loading = false }) => {
  if (loading) {
    return (
      <div className="absolute bottom-5 left-5 right-5 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-full px-6 py-2.5 flex items-center justify-between">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden leading-none">
            <Skeleton
              circle
              width={40}
              height={40}
              containerClassName="flex items-center justify-center w-full h-full"
            />
          </div>
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden leading-none">
            <Skeleton
              circle
              width={40}
              height={40}
              containerClassName="flex items-center justify-center w-full h-full"
            />
          </div>
          <div className="w-[44px] h-[44px] flex items-center justify-center overflow-hidden leading-none">
            <Skeleton
              circle
              width={44}
              height={44}
              containerClassName="flex items-center justify-center w-full h-full"
            />
          </div>
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden leading-none">
            <Skeleton
              circle
              width={40}
              height={40}
              containerClassName="flex items-center justify-center w-full h-full"
            />
          </div>
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden leading-none">
            <Skeleton
              circle
              width={40}
              height={40}
              containerClassName="flex items-center justify-center w-full h-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xl border border-white/60 rounded-full px-6 py-2.5 flex items-center justify-between z-50">
      <button className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-100 relative group">
        <i className="fa-solid fa-house text-[18px] text-[#9A9EA6] transition-transform group-hover:scale-110"></i>
      </button>

      <button className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-100 group">
        <i className="fa-regular fa-comment-dots text-[18px] text-[#9A9EA6] transition-transform group-hover:scale-110"></i>
      </button>

      <button className="w-[44px] h-[44px] bg-[#101112] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95">
        <i className="fa-solid fa-plus text-[16px] text-[#C8F331]"></i>
      </button>

      <button className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-100 group">
        <i className="fa-regular fa-bell text-[18px] text-[#9A9EA6] transition-transform group-hover:scale-110"></i>
      </button>

      <button className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-100 relative group">
        <i className="fa-solid fa-sliders text-[18px] text-[#9A9EA6] transition-transform group-hover:scale-110"></i>
      </button>
    </div>
  );
};

export default Nav;
