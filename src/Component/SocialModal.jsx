import React, { useEffect } from "react";

const SocialModal = ({ isOpen, onClose, socialLinks = [] }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[#101112]/40 backdrop-blur-sm overscroll-none">
      <div
        className="relative w-full max-w-[360px]"
        style={{ touchAction: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-14 right-2 flex items-center z-50">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-[#101112] shadow-sm"
          >
            <i className="fa-solid fa-xmark text-[18px]"></i>
          </button>
        </div>

        <div className="bg-white w-full rounded-[32px] p-5 sm:p-6 mt-2 animate-[slideUp_0.3s_ease-out] shadow-xl">
          <h3 className="text-[16px] font-bold tracking-wide text-center mb-5 text-[#101112]">
            Active Links
          </h3>

          <div className="flex flex-col gap-3.5 max-h-[60vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* بنعمل Loop على البيانات اللي جاية من الداتابيز */}
            {socialLinks && socialLinks.length > 0 ? (
              socialLinks.map((soc, index) => (
                <a
                  key={soc._id || index}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 w-full cursor-pointer"
                >
                  <div className="w-[48px] h-[48px] rounded-full bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <div
                      className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white overflow-hidden"
                      style={{ backgroundColor: soc.bg_color }}
                    >
                      {/* لو في رابط صورة/SVG هيعرضه، لو مفيش هيعرض كلاس الأيقونة */}
                      {soc.image_url ? (
                        <img
                          src={soc.image_url}
                          alt={soc.platform_name}
                          className="w-5 h-5 object-contain"
                        />
                      ) : (
                        <i className={`${soc.icon_class} text-[16px]`}></i>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 h-[48px] rounded-full bg-[#F4F5F7] flex items-center justify-between px-4 hover:bg-gray-100 transition-colors min-w-0">
                    <div className="flex flex-col justify-center min-w-0 pr-2">
                      <span className="font-bold text-[#101112] text-[14px] leading-tight truncate">
                        {soc.platform_name}
                      </span>
                      <span className="text-[12px] text-[#9A9EA6] leading-tight truncate mt-0.5">
                        {soc.username}
                      </span>
                    </div>

                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: soc.bg_color,
                        color: "white",
                      }}
                    >
                      <i className="fa-solid fa-arrow-right -rotate-45 text-[11px]"></i>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-center text-sm text-gray-400"></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialModal;
