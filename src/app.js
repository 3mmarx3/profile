import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "./includes/Header";
import Nav from "./includes/Nav";
import ProfileCards from "./Component/ProfileCards";
import ActiveSection from "./Component/ActiveSection";
import SocialModal from "./Component/SocialModal";

// ديناميكي: لو فاتحه من جهاز تاني هيجيب الـ IP بتاع جهازك تلقائياً بنفس البورت 5001
const API = `http://${window.location.hostname}:5001/api`;

const App = () => {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setNotFound(false);
    setProfileData(null);

    const url = slug
      ? `${API}/profile/${encodeURIComponent(slug)}`
      : `${API}/profile`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProfileData({
            ...data,
            socialLinks: (data.socialLinks || []).filter(
              (l) => l.active !== false,
            ),
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    return () => controller.abort();
  }, [slug]);

  if (notFound) {
    return (
      <div
        className="app-container w-full max-w-md mx-auto h-[100dvh] flex flex-col items-center justify-center px-8 text-center bg-[#f4f5f7]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-5 text-2xl">
          🔍
        </div>
        <h1 className="text-[20px] font-semibold text-[#101112] mb-1">
          Profile not found
        </h1>
        <p className="text-[14px] text-[#9A9EA6] mb-6">
          This page doesn't exist or the address was changed.
        </p>
        <Link
          to="/signup"
          className="bg-[#C8F331] text-[#101112] font-bold text-[14px] px-6 py-3 rounded-full hover:bg-[#b8e321] transition-colors"
        >
          Create your own page
        </Link>
      </div>
    );
  }

  return (
    <div
      className="app-container w-full max-w-md mx-auto relative h-[100dvh] flex flex-col overflow-hidden bg-[#f4f5f7] select-none touch-none"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* وميض الرادار لزرار البلس */}
      <style>{`
        @keyframes radarPulse {
          0%   { transform: scale(1);   opacity: 0.9; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .radar-ring { animation: radarPulse 3.6s cubic-bezier(0.16, 0.6, 0.4, 1) infinite; }
      `}</style>

      <div
        className="px-4 sm:px-5 pt-4 sm:pt-5 pb-[110px] flex-1 flex flex-col gap-4 overflow-hidden"
        style={{ touchAction: "none" }}
      >
        <Header
          loading={loading}
          leftLink={profileData?.headerLeftLink}
          rightLink={profileData?.headerRightLink}
        />

        <ProfileCards loading={loading} profileData={profileData} />

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

              <div className="relative w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] flex-shrink-0">
                {[0, 1.2, 2.4].map((delay) => (
                  <span
                    key={delay}
                    aria-hidden="true"
                    className="radar-ring motion-reduce:hidden absolute inset-0 rounded-full bg-white shadow-[0_0_0_1px_rgba(16,17,18,0.06)] pointer-events-none"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
                <button className="relative w-full h-full rounded-full bg-white flex items-center justify-center text-[#101112] cursor-pointer hover:scale-105 transition-transform border border-gray-100">
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
            </>
          )}
        </div>

        <ActiveSection
          loading={loading}
          onOpenSocialModal={() => setIsSocialModalOpen(true)}
          socialLinks={profileData?.socialLinks || []}
        />
      </div>

      <Nav
        loading={loading}
        phoneNumber={profileData?.navPhone}
        whatsappNumber={profileData?.navWhatsapp}
      />

      <SocialModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        socialLinks={profileData?.socialLinks || []}
      />
    </div>
  );
};

export default App;
