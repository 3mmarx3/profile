import React from "react";
import Skeleton from "react-loading-skeleton";

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

const ActiveSection = ({ loading, onOpenSocialModal }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 items-stretch shrink-0 flex-1 min-h-[150px]">
        {/* Left Column Skeleton */}
        <div className="flex flex-col gap-3 h-full">
          <div className="bg-white rounded-[28px] p-4 flex-1 border border-gray-100">
            <div className="flex -space-x-3 overflow-hidden py-1 mb-3">
              <Skeleton circle width={34} height={34} />
              <Skeleton circle width={34} height={34} />
              <Skeleton circle width={34} height={34} />
              <Skeleton circle width={34} height={34} />
            </div>
            <Skeleton
              width={50}
              height={32}
              borderRadius={8}
              className="mb-1"
            />
            <Skeleton width={110} height={14} borderRadius={6} />
          </div>
          <Skeleton height={54} borderRadius={24} />
        </div>

        {/* Right Column Skeleton */}
        <div className="bg-white rounded-[28px] p-4 flex flex-col h-full border border-gray-100">
          <Skeleton width={120} height={18} borderRadius={6} className="mb-4" />
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={90} height={14} borderRadius={6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 items-stretch shrink-0 flex-1 min-h-[150px]">
      <div className="flex flex-col gap-3 h-full">
        <div
          onClick={onOpenSocialModal}
          className="bg-white rounded-[28px] p-4 flex-1 cursor-pointer hover:scale-[0.98] transition-transform border border-gray-100"
        >
          <div className="flex -space-x-3 overflow-hidden py-1 mb-2">
            {mockSocials.map((soc) => (
              <div
                key={soc.id}
                className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-full ring-[2.5px] ring-white flex items-center justify-center text-white relative"
                style={{ backgroundColor: soc.bg_color }}
              >
                <i className={`${soc.icon_class} text-[12px]`}></i>
              </div>
            ))}
            <div className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-full ring-[2.5px] ring-white bg-[#f4f5f7] flex items-center justify-center text-[#101112] font-semibold text-[11px] relative">
              4
            </div>
          </div>
          <div>
            <p className="text-[28px] sm:text-[32px] font-bold text-[#101112] leading-none tracking-tight">
              08
            </p>
            <p className="text-[12px] text-[#9A9EA6] font-normal mt-1">
              Active social links
            </p>
          </div>
        </div>

        <button className="bg-[#C8F331] rounded-[24px] h-[48px] sm:h-[54px] w-full flex items-center justify-center gap-2 font-medium text-[14px] text-[#101112] hover:bg-[#b8e321] transition-colors shrink-0">
          <i className="fa-solid fa-user-pen"></i>
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="bg-white rounded-[28px] p-4 flex flex-col h-full border border-gray-100">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h4 className="text-[14px] font-semibold text-[#101112]">
            Recent connected
          </h4>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
          <i className="fa-solid fa-users-slash text-[24px] text-[#9A9EA6] mb-2"></i>
          <p className="text-[12px] text-[#9A9EA6] font-normal">
            No profiles yet
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActiveSection;
