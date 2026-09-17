import React, { useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import ammarImg from "../assets/images/Ammar_Ahmed.PNG";

const mockProfiles = [
  {
    id: 1,
    full_name: "Ammar Ahmed",
    role_type: "Developer",
    bio: "Web Developer @ Sphinx | Computers",
    connected_count: 0,
    avatar_url: ammarImg,
    bg_color: "white",
    is_direct: true,
  },
  {
    id: 2,
    full_name: "Ammar Ahmed",
    role_type: "Developer",
    bio: "Web Developer @ Sphinx | Computers",
    connected_count: 0,
    avatar_url: ammarImg,
    bg_color: "#101112",
    is_direct: true,
  },
  {
    id: 3,
    full_name: "Ammar Ahmed",
    role_type: "Developer",
    bio: "Web Developer @ Sphinx | Computers",
    connected_count: 0,
    avatar_url: ammarImg,
    bg_color: "#C8F331",
    is_direct: true,
  },
];

const ProfileCards = ({ loading }) => {
  const [stackOrder, setStackOrder] = useState([0, 1, 2]);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [animatingCard, setAnimatingCard] = useState(null);

  const touchStartRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    if (animatingCard || loading) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || animatingCard || loading) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartRef.current.x;
    setDragOffset(diffX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || animatingCard || loading) return;
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

  const renderCardSkeleton = () => (
    <div className="absolute top-0 left-0 w-full h-full rounded-[36px] p-5 sm:p-6 border border-gray-100 flex flex-col items-center justify-between bg-white">
      <div className="flex justify-between w-full items-start">
        <div className="flex flex-col text-left flex-1 gap-1">
          <Skeleton width={70} height={16} borderRadius={6} />
          <Skeleton width={50} height={14} borderRadius={6} />
        </div>
        <Skeleton
          circle
          width={70}
          height={70}
          className="mx-2 flex-shrink-0"
        />
        <div className="flex flex-col text-right flex-1 items-end gap-1">
          <Skeleton width={40} height={24} borderRadius={6} />
          <Skeleton width={70} height={14} borderRadius={6} />
        </div>
      </div>

      <div className="text-center flex-1 flex flex-col justify-center items-center gap-2">
        <Skeleton width={160} height={26} borderRadius={8} />
        <Skeleton width={200} height={16} borderRadius={6} />
      </div>

      <div className="w-full border-t border-gray-100 pt-4 flex items-center justify-between">
        <Skeleton width={80} height={18} borderRadius={6} />
        <div className="flex items-center gap-2">
          <Skeleton width={16} height={16} borderRadius={4} />
          <Skeleton width={45} height={16} borderRadius={6} />
          <Skeleton width={48} height={28} borderRadius={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full flex-none h-[255px] sm:h-[275px] cursor-grab active:cursor-grabbing select-none touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {loading
        ? renderCardSkeleton()
        : mockProfiles.map((p, index) => {
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
                className={`absolute top-0 left-0 w-full h-full rounded-[36px] p-5 sm:p-6 border ${borderClass} flex flex-col items-center justify-between bg-white`}
                style={{
                  backgroundColor: p.bg_color,
                  ...getCardStyle(index),
                }}
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
                    className="w-[75px] h-[75px] sm:w-[75px] sm:h-[75px] rounded-full flex-shrink-0 mx-2 bg-cover bg-center border-[3px] border-white z-10"
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
                  className={`w-full border-t ${
                    isDark ? "border-gray-800" : "border-gray-100"
                  } pt-4 flex items-center justify-between pointer-events-none`}
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
  );
};

export default ProfileCards;
