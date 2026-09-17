import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const Nav = ({ loading = false, onPhoneSwipe, onWhatsAppSwipe }) => {
  const xPhone = useMotionValue(0);
  const isDraggingPhone = useMotionValue(0);
  const xWhatsApp = useMotionValue(0);
  const isDraggingWhatsApp = useMotionValue(0);
  const dragLimit = 140;

  const isDragging = useTransform(
    [isDraggingPhone, isDraggingWhatsApp],
    ([p, w]) => Math.max(p, w),
  );

  const glowOpacityPhone = useTransform(
    xPhone,
    [0, dragLimit * 0.6, dragLimit],
    [0, 0.45, 0.8],
  );
  const progressWidthPhone = useTransform(
    xPhone,
    (v) => `${Math.min(v + 48, dragLimit + 48)}px`,
  );
  const textOpacityPhone = useTransform(xPhone, [0, 40], [1, 0]);

  const glowOpacityWhatsApp = useTransform(
    xWhatsApp,
    [0, -dragLimit * 0.6, -dragLimit],
    [0, 0.45, 0.8],
  );
  const progressWidthWhatsApp = useTransform(
    xWhatsApp,
    (v) => `${Math.min(Math.abs(v) + 48, dragLimit + 48)}px`,
  );
  const textOpacityWhatsApp = useTransform(xWhatsApp, [0, -40], [1, 0]);

  const glassIntensity = useTransform(isDragging, [0, 1], [0, 1]);
  const backdropFilter = useTransform(
    glassIntensity,
    (v) => `blur(${24 + v * 12}px) saturate(${1.1 + v * 0.4})`,
  );

  const handlePhoneDragStart = () => {
    isDraggingPhone.set(1);
  };
  const handlePhoneDragEnd = (_event, info) => {
    isDraggingPhone.set(0);
    if (info.offset.x >= dragLimit * 0.4) {
      window.location.href = "tel:+201070479599";
      onPhoneSwipe?.();
    }
    animate(xPhone, 0, {
      type: "spring",
      stiffness: 420,
      damping: 32,
    });
  };

  const handleWhatsAppDragStart = () => {
    isDraggingWhatsApp.set(1);
  };
  const handleWhatsAppDragEnd = (_event, info) => {
    isDraggingWhatsApp.set(0);
    if (info.offset.x <= -dragLimit * 0.4) {
      window.open("https://wa.me/201070479599", "_blank");
      onWhatsAppSwipe?.();
    }
    animate(xWhatsApp, 0, {
      type: "spring",
      stiffness: 420,
      damping: 32,
    });
  };

  if (loading) {
    return (
      <div className="absolute bottom-5 left-5 right-5 z-50">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-full px-4 py-2.5 flex items-center min-h-[56px]">
          <div className="relative flex-1 h-12 flex items-center justify-between gap-3">
            <div className="flex-1 flex items-center">
              <Skeleton circle width={48} height={48} />
            </div>
            <div className="flex-1 flex items-center justify-end">
              <Skeleton circle width={48} height={48} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-5 left-5 right-5 z-50">
      <motion.div
        className="relative overflow-hidden rounded-full border border-white/50 bg-white/55 backdrop-blur-2xl"
        style={{
          backdropFilter: backdropFilter,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-white/15 pointer-events-none" />
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35), transparent 60%)",
            opacity: glassIntensity,
          }}
        />
        <div className="relative flex items-center px-3 py-2.5 min-h-[56px]">
          <div className="relative flex-1 h-12 flex items-center gap-2">
            <div className="relative flex-1 h-12 flex items-center overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-white/25"
                style={{ width: progressWidthPhone }}
              />
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: dragLimit }}
                dragElastic={0.05}
                onDragStart={handlePhoneDragStart}
                onDragEnd={handlePhoneDragEnd}
                style={{ x: xPhone }}
                className="relative z-10 w-[46px] h-[46px] bg-[#101112] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
                whileTap={{ scale: 0.96 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-white blur-md"
                  style={{ opacity: glowOpacityPhone }}
                />
                <i className="fa-solid fa-arrow-right text-[16px] text-white relative z-10 pointer-events-none" />
              </motion.div>
              <motion.span
                className="absolute left-14 text-sm font-medium text-black/55 select-none pointer-events-none whitespace-nowrap"
                style={{ opacity: textOpacityPhone }}
              >
                Swipe to call
              </motion.span>
            </div>

            <div className="w-px h-7 bg-black/20 self-center shrink-0" />

            <div className="relative flex-1 h-12 flex items-center justify-end overflow-hidden">
              <motion.div
                className="absolute inset-y-0 right-0 rounded-full bg-white/25"
                style={{ width: progressWidthWhatsApp }}
              />
              <motion.span
                className="absolute right-14 text-sm font-medium text-black/55 select-none pointer-events-none whitespace-nowrap"
                style={{ opacity: textOpacityWhatsApp }}
              >
                Swipe to Whats
              </motion.span>
              <motion.div
                drag="x"
                dragConstraints={{ left: -dragLimit, right: 0 }}
                dragElastic={0.05}
                onDragStart={handleWhatsAppDragStart}
                onDragEnd={handleWhatsAppDragEnd}
                style={{ x: xWhatsApp }}
                className="relative z-10 w-[46px] h-[46px] bg-[#101112] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
                whileTap={{ scale: 0.96 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-white blur-md"
                  style={{ opacity: glowOpacityWhatsApp }}
                />
                <i className="fa-solid fa-arrow-left text-[16px] text-white relative z-10 pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Nav;
