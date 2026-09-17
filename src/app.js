import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "./includes/Header";
import Nav from "./includes/Nav";
import ProfileCards from "./Component/ProfileCards";
import ActiveSection from "./Component/ActiveSection";
import SocialModal from "./Component/SocialModal";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="app-container w-full max-w-md mx-auto relative h-[100dvh] flex flex-col overflow-hidden bg-[#f4f5f7] select-none touch-none"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className="px-4 sm:px-5 pt-4 sm:pt-5 pb-[110px] flex-1 flex flex-col gap-4 overflow-hidden"
        style={{ touchAction: "none" }}
      >
        <Header loading={loading} />

        <ProfileCards loading={loading} />

        <div className="relative flex justify-between items-center z-10 shrink-0 px-2 mt-8">
          {loading ? (
            <>
              <div className="flex-1 mr-4">
                <Skeleton
                  width={80}
                  height={22}
                  borderRadius={6}
                  className="mb-1"
                />
                <Skeleton width={200} height={16} borderRadius={6} />
              </div>
              <Skeleton circle width={48} height={48} />
            </>
          ) : (
            <>
              <div className="flex-1 mr-4">
                <h3 className="text-[18px] sm:text-[19px] font-medium text-[#101112] mb-0.5">
                  Search
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#9A9EA6] font-normal truncate">
                  Find new friends and explore profiles
                </p>
              </div>
              <button className="w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] flex-shrink-0 rounded-full bg-white flex items-center justify-center text-[#101112] cursor-pointer hover:scale-105 transition-transform border border-gray-100">
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
            </>
          )}
        </div>

        <ActiveSection
          loading={loading}
          onOpenSocialModal={() => setIsSocialModalOpen(true)}
        />
      </div>

      <Nav loading={loading} />

      <SocialModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
      />
    </div>
  );
};

export default Index;
