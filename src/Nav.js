import React from "react";

const Nav = ({
  activePage = "home",
  unreadMsgsCount = 2,
  pendingReqsCount = 5,
}) => {
  return (
    <div className="absolute bottom-5 left-5 right-5 bg-white/85 backdrop-blur-xl border border-white/60 rounded-full px-5 py-2.5 flex items-center justify-between z-50 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
      <button className="w-10 h-10 flex items-center justify-center rounded-full transition hover:bg-gray-100 relative">
        <i
          className="fa-solid fa-house text-[18px]"
          style={{ color: activePage === "home" ? "#C8F331" : "#9A9EA6" }}
        ></i>
      </button>

      <button className="relative w-10 h-10 flex items-center justify-center rounded-full transition hover:bg-gray-100">
        <i
          className={`${activePage === "message" ? "fa-solid" : "fa-regular"} fa-comment text-[18px]`}
          style={{ color: activePage === "message" ? "#C8F331" : "#9A9EA6" }}
        ></i>
        {unreadMsgsCount > 0 && (
          <span className="absolute top-1 right-0.5 w-4 h-4 bg-[#101112] text-[#C8F331] text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {unreadMsgsCount > 99 ? "99+" : unreadMsgsCount}
          </span>
        )}
      </button>

      <button className="w-[44px] h-[44px] bg-[#1a1b1e] rounded-full flex items-center justify-center transition hover:scale-105 shadow-md">
        <i
          className="fa-solid fa-plus text-[16px]"
          style={{ color: "#c8f331" }}
        ></i>
      </button>

      <button className="relative w-10 h-10 flex items-center justify-center rounded-full transition hover:bg-gray-100">
        <i
          className={`${activePage === "requests" ? "fa-solid" : "fa-regular"} fa-bell text-[18px]`}
          style={{ color: activePage === "requests" ? "#C8F331" : "#9A9EA6" }}
        ></i>
        {pendingReqsCount > 0 && (
          <span className="absolute top-1 right-0.5 w-4 h-4 bg-[#101112] text-[#C8F331] text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {pendingReqsCount > 99 ? "99+" : pendingReqsCount}
          </span>
        )}
      </button>

      <button className="w-10 h-10 flex items-center justify-center rounded-full transition hover:bg-gray-100 relative">
        <i
          className="fa-solid fa-gear text-[18px]"
          style={{ color: activePage === "settings" ? "#C8F331" : "#9A9EA6" }}
        ></i>
      </button>
    </div>
  );
};

export default Nav;
