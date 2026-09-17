import React, { useState, useRef } from "react";
import Header from "./Header";
import Nav from "./Nav";

const mockProfiles = [
  {
    id: 1,
    full_name: "Ammar Ahmed",
    role_type: "Developer",
    bio: "Web Developer @ Sphinx | Computers",
    connected_count: 0,
    avatar_url:
      "https://eng-amar.com/info/uploads/profiles/1726053350_IMG_9776.png",
    bg_color: "white",
    is_direct: true,
  },
  {
    id: 2,
    full_name: "Ammar Ahmed",
    role_type: "Developer",
    bio: "Web Developer @ Sphinx | Computers",
    connected_count: 0,
    avatar_url:
      "https://eng-amar.com/info/uploads/profiles/1726053350_IMG_9776.png",
    bg_color: "#101112",
    is_direct: true,
  },
  {
    id: 3,
    full_name: "Ammar Ahmed",
    role_type: "Developer",
    bio: "Web Developer @ Sphinx | Computers",
    connected_count: 0,
    avatar_url:
      "https://eng-amar.com/info/uploads/profiles/1726053350_IMG_9776.png",
    bg_color: "#C8F331",
    is_direct: true,
  },
];

const mockSocials = [
  {
    id: 1,
    platform_name: "Facebook",
    bg_color: "#1877F2",
    icon_class: "fa-brands fa-facebook-f",
    url: "#",
  },
  {
    id: 2,
    platform_name: "Instagram",
    bg_color: "#E1306C",
    icon_class: "fa-brands fa-instagram",
    url: "#",
  },
  {
    id: 3,
    platform_name: "WhatsApp",
    bg_color: "#25D366",
    icon_class: "fa-brands fa-whatsapp",
    url: "#",
  },
];

const Index = () => {
  const [stackOrder, setStackOrder] = useState([0, 1, 2]);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [animatingCard, setAnimatingCard] = useState(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  const touchStartRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    if (animatingCard) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || animatingCard) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartRef.current.x;
    setDragOffset(diffX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || animatingCard) return;
    setIsDragging(false);

    if (dragOffset > 80) {
      swipeCard("right");
    } else if (dragOffset < -80) {
      swipeCard("left");
    } else {
      setDragOffset(0);
    }
  };

  const swipeCard = (direction) => {
    const topCardIndex = stackOrder[0];
    setAnimatingCard({ index: topCardIndex, direction });
    setDragOffset(0);

    setTimeout(() => {
      setStackOrder((prev) => {
        const newOrder = [...prev];
        newOrder.push(newOrder.shift());
        return newOrder;
      });
      setAnimatingCard(null);
    }, 300);
  };

  const getCardStyle = (index) => {
    const pos = stackOrder.indexOf(index);

    if (animatingCard && animatingCard.index === index) {
      const isRight = animatingCard.direction === "right";
      return {
        transform: `translateX(${isRight ? 150 : -150}%) rotate(${isRight ? 20 : -20}deg)`,
        opacity: 0,
        zIndex: 40,
        transition: "all 0.3s ease-out",
      };
    }

    if (pos === 0) {
      const rotate = dragOffset * 0.05;
      return {
        transform: `translateX(${dragOffset}px) translateY(0) rotate(${rotate}deg) scale(1)`,
        zIndex: 30,
        opacity: 1,
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
        transition: isDragging
          ? "none"
          : "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      };
    }
    if (pos === 1) {
      return {
        transform: "translateY(16px) rotate(-3deg) scale(0.96)",
        zIndex: 20,
        opacity: 1,
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      };
    }
    if (pos === 2) {
      return {
        transform: "translateY(32px) rotate(3deg) scale(0.92)",
        zIndex: 10,
        opacity: 1,
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      };
    }
    return { display: "none" };
  };

  return (
    <div
      className="app-container w-full max-w-md mx-auto relative h-[100dvh] flex flex-col overflow-hidden bg-[#f4f5f7]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Scrollable Area */}
      <div
        className="px-4 sm:px-5 pt-4 sm:pt-5 pb-[110px] flex-1 flex flex-col gap-6 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Header />

        {/* Responsive Profile Stack */}
        <div
          className="relative w-full h-[280px] sm:h-[300px] shrink-0 cursor-grab active:cursor-grabbing select-none touch-none mb-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {mockProfiles.map((p, index) => {
            const isDark = p.bg_color === "#101112";
            const isNeon = p.bg_color === "#C8F331";
            const textColor = isDark ? "text-white" : "text-[#101112]";
            const subColor = isDark
              ? "text-gray-400"
              : isNeon
                ? "text-[#101112]/70"
                : "text-[#9A9EA6]";
            const borderClass = isDark
              ? "border-gray-800"
              : isNeon
                ? "border-[#b8e321]"
                : "border-gray-100";

            return (
              <div
                key={p.id}
                className={`absolute top-0 left-0 w-full h-full rounded-[36px] p-6 sm:p-7 border ${borderClass} flex flex-col items-center justify-between bg-white`}
                style={{ backgroundColor: p.bg_color, ...getCardStyle(index) }}
              >
                <div className="flex justify-between w-full items-start pointer-events-none">
                  <div className="flex flex-col text-left flex-1">
                    <span
                      className={`font-bold ${textColor} text-[15px] sm:text-[16px]`}
                    >
                      {p.role_type}
                    </span>
                    <span
                      className={`${subColor} text-[13px] sm:text-[14px] mt-0.5`}
                    >
                      profile
                    </span>
                  </div>
                  <div
                    className="w-[60px] h-[60px] sm:w-[65px] sm:h-[65px] rounded-full flex-shrink-0 mx-2 bg-cover bg-center border-[3px] border-white z-10"
                    style={{ backgroundImage: `url(${p.avatar_url})` }}
                  ></div>
                  <div className="flex flex-col text-right flex-1">
                    <span
                      className={`font-bold ${textColor} text-[24px] sm:text-[26px] leading-none`}
                    >
                      {p.connected_count}
                    </span>
                    <span
                      className={`${subColor} text-[13px] sm:text-[14px] mt-1`}
                    >
                      Connected
                    </span>
                  </div>
                </div>

                <div className="text-center pointer-events-none flex-1 flex flex-col justify-center">
                  <h2
                    className={`text-[22px] sm:text-[24px] font-bold ${textColor} tracking-tight`}
                  >
                    {p.full_name}
                  </h2>
                  <p
                    className={`text-[13px] sm:text-[14px] ${subColor} mt-1.5`}
                  >
                    {p.bio}
                  </p>
                </div>

                <div
                  className={`w-full border-t ${isDark ? "border-gray-800" : "border-gray-100"} pt-4 flex items-center justify-between pointer-events-none`}
                >
                  <span
                    className={`text-[14px] sm:text-[15px] font-medium ${textColor}`}
                  >
                    Your Links
                  </span>
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={textColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span
                      className={`text-[14px] sm:text-[15px] ${textColor} font-bold mr-1`}
                    >
                      Direct
                    </span>

                    <div className="relative inline-flex items-center">
                      <div
                        className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
                          isDark ? "bg-[#C8F331]" : "bg-[#101112]"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full transform translate-x-5 transition-transform ${
                            isDark ? "bg-[#101112]" : "bg-white"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search Section */}
        <div className="relative flex justify-between items-center z-10 shrink-0 px-2">
          <div className="flex-1 mr-4">
            <h3 className="text-[18px] sm:text-[19px] font-medium text-[#101112] mb-0.5">
              Search
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#9A9EA6] font-normal truncate">
              Find new friends and explore profiles
            </p>
          </div>
          <button className="w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#101112] cursor-pointer hover:scale-105 transition-transform shadow-sm border border-gray-100">
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Bottom Bento Grid */}
        <div className="grid grid-cols-2 gap-3 items-stretch shrink-0 flex-1 min-h-[190px]">
          {/* Left Column */}
          <div className="flex flex-col gap-3 h-full">
            <div
              onClick={() => setIsSocialModalOpen(true)}
              className="bg-white rounded-[28px] p-5 flex-1 flex flex-col justify-center cursor-pointer hover:scale-[0.98] transition-transform shadow-sm border border-gray-100"
            >
              <div className="flex -space-x-3 overflow-hidden py-1 mb-3">
                {mockSocials.map((soc) => (
                  <div
                    key={soc.id}
                    className="w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-full ring-[2.5px] ring-white flex items-center justify-center text-white relative"
                    style={{ backgroundColor: soc.bg_color }}
                  >
                    <i className={`${soc.icon_class} text-[14px]`}></i>
                  </div>
                ))}
                <div className="w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-full ring-[2.5px] ring-white bg-[#f4f5f7] flex items-center justify-center text-[#101112] font-semibold text-[12px] relative">
                  4
                </div>
              </div>
              <div>
                <p className="text-[32px] sm:text-[36px] font-bold text-[#101112] leading-none tracking-tight">
                  08
                </p>
                <p className="text-[13px] text-[#9A9EA6] font-normal mt-1.5">
                  Active social links
                </p>
              </div>
            </div>

            <button className="bg-[#C8F331] rounded-[24px] h-[54px] sm:h-[60px] w-full flex items-center justify-center gap-2 font-medium text-[15px] text-[#101112] hover:bg-[#b8e321] transition-colors">
              <i className="fa-solid fa-user-pen"></i>
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-[28px] p-5 flex flex-col h-full shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h4 className="text-[15px] font-semibold text-[#101112]">
                Recent connected
              </h4>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <i className="fa-solid fa-users-slash text-[28px] text-[#9A9EA6] mb-3"></i>
              <p className="text-[13px] text-[#9A9EA6] font-normal">
                No profiles yet
              </p>
            </div>
          </div>
        </div>
      </div>

      <Nav activePage="home" />

      {/* Social Modal */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[#101112]/40 backdrop-blur-sm">
          <div className="relative w-full max-w-[360px]">
            <div className="absolute -top-16 right-2 flex items-center z-50">
              <button
                onClick={() => setIsSocialModalOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-[#101112]"
              >
                <i className="fa-solid fa-xmark text-[18px]"></i>
              </button>
            </div>
            <div className="bg-white w-full rounded-[36px] p-6 mt-2 animate-[slideUp_0.3s_ease-out]">
              <h3 className="text-[14px] font-bold tracking-wide text-center mb-6">
                Active Links
              </h3>
              <div
                className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-1"
                style={{ scrollbarWidth: "thin" }}
              >
                {mockSocials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    className="group flex items-center gap-3 w-full cursor-pointer"
                  >
                    <div className="w-[52px] h-[52px] rounded-full bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 z-10 relative">
                      <div
                        className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: soc.bg_color,
                          color: "white",
                        }}
                      >
                        <i className={`${soc.icon_class} text-[18px]`}></i>
                      </div>
                    </div>
                    <div className="flex-1 h-[52px] rounded-full bg-[#F4F5F7] flex items-center justify-between px-4 hover:bg-gray-100 transition-colors">
                      <span className="font-bold text-[#101112] text-[14px]">
                        {soc.platform_name}
                      </span>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: soc.bg_color,
                          color: "white",
                        }}
                      >
                        <i className="fa-solid fa-arrow-right -rotate-45 text-[11px]"></i>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
