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
    bg_color: "#C8F331",
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
    bg_color: "#101112",
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
        transition: isDragging
          ? "none"
          : "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      };
    }
    if (pos === 1) {
      return {
        transform: "translateY(12px) rotate(3deg) scale(0.98)",
        zIndex: 20,
        opacity: 1,
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      };
    }
    if (pos === 2) {
      return {
        transform: "translateY(22px) rotate(-2deg) scale(0.95)",
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
        className="px-4 sm:px-5 pt-4 sm:pt-5 pb-[110px] flex-1 flex flex-col gap-4 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Header />

        {/* Responsive Profile Stack */}
        <div
          className="relative w-full aspect-[4/3] min-h-[250px] max-h-[320px] shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
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
                : "border-gray-200";

            return (
              <div
                key={p.id}
                className={`absolute top-0 left-0 w-full h-full rounded-[32px] p-5 border ${borderClass} flex flex-col items-center justify-between`}
                style={{ backgroundColor: p.bg_color, ...getCardStyle(index) }}
              >
                <div className="flex justify-between w-full items-start pointer-events-none">
                  <div className="text-left leading-tight mt-1 flex-1">
                    <span
                      className={`font-semibold ${textColor} text-[13px] sm:text-[14px] block`}
                    >
                      {p.role_type}
                    </span>
                    <span className={`${subColor} text-[12px] sm:text-[13px]`}>
                      profile
                    </span>
                  </div>
                  <div
                    className="w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-full flex-shrink-0 mx-2 bg-cover bg-center border-[2px] border-white"
                    style={{ backgroundImage: `url(${p.avatar_url})` }}
                  ></div>
                  <div className="text-right leading-tight mt-1 flex-1">
                    <span
                      className={`font-bold ${textColor} text-[20px] sm:text-[22px] block`}
                    >
                      {p.connected_count}
                    </span>
                    <span
                      className={`${subColor} text-[11px] sm:text-[12px] font-medium`}
                    >
                      Connected
                    </span>
                  </div>
                </div>

                <div className="text-center pointer-events-none my-2">
                  <h2
                    className={`text-[18px] sm:text-[20px] font-bold ${textColor} tracking-tight`}
                  >
                    {p.full_name}
                  </h2>
                  <p
                    className={`text-[11px] sm:text-[12px] ${subColor} mt-0.5 font-medium`}
                  >
                    {p.bio}
                  </p>
                </div>

                <div
                  className={`w-full border-t ${isDark ? "border-gray-800" : "border-gray-200"} pt-3 flex items-center justify-between pointer-events-none`}
                >
                  <span
                    className={`text-[12px] sm:text-[13px] font-medium ${subColor}`}
                  >
                    Your Links
                  </span>
                  <div className="flex items-center gap-2">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isDark ? "white" : "#101112"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span
                      className={`text-[12px] sm:text-[13px] ${textColor} font-semibold mr-1`}
                    >
                      Direct
                    </span>

                    <div className="relative inline-flex items-center">
                      <div
                        className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${isDark ? "bg-[#C8F331]" : "bg-[#101112]"}`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full transform translate-x-5 transition-transform"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search Section */}
        <div className="relative flex justify-between items-center z-10 shrink-0 px-1 mt-1">
          <div className="flex-1 mr-4">
            <h3 className="text-[16px] sm:text-[17px] font-medium text-[#101112]">
              Search
            </h3>
            <p className="text-[11px] sm:text-[12px] text-[#9A9EA6] mt-0.5 font-normal leading-[1.3] truncate">
              Find new friends and explore profiles
            </p>
          </div>
          <button className="w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#101112] cursor-pointer hover:scale-105 transition-transform border border-gray-100">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Bottom Bento Grid */}
        <div className="grid grid-cols-2 gap-3 items-stretch shrink-0 flex-1 min-h-[180px]">
          {/* Left Column */}
          <div className="flex flex-col gap-3 h-full">
            <div
              onClick={() => setIsSocialModalOpen(true)}
              className="bg-white rounded-[24px] p-4 flex-1 flex flex-col justify-center cursor-pointer hover:scale-95 transition-transform border border-gray-100"
            >
              <div className="flex -space-x-2 overflow-hidden py-1">
                {mockSocials.map((soc) => (
                  <div
                    key={soc.id}
                    className="w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] rounded-full ring-[2px] ring-white flex items-center justify-center text-white relative"
                    style={{ backgroundColor: soc.bg_color }}
                  >
                    <i className={`${soc.icon_class} text-[12px]`}></i>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <p className="text-[26px] sm:text-[30px] font-semibold text-[#101112] leading-none tracking-tight">
                  08
                </p>
                <p className="text-[11px] sm:text-[12px] text-[#9A9EA6] font-normal mt-1.5">
                  Active social links
                </p>
              </div>
            </div>

            <button className="bg-[#C8F331] rounded-[20px] h-[48px] sm:h-[52px] w-full flex items-center justify-center gap-2 font-medium text-[13px] sm:text-[14px] text-[#101112]">
              <i className="fa-solid fa-user-pen"></i>
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-[24px] p-4 flex flex-col h-full border border-gray-100">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h4 className="text-[12px] sm:text-[13px] font-semibold text-[#101112]">
                Recent connected
              </h4>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <i className="fa-solid fa-users-slash text-[20px] sm:text-[22px] text-[#9A9EA6] mb-2"></i>
              <p className="text-[10px] sm:text-[11px] text-[#9A9EA6] font-normal">
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
