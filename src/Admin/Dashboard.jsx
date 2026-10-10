import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Link } from "react-router-dom";

/* ================================================================== */
/*  CONFIG                                                             */
/* ================================================================== */
const API = `http://${window.location.hostname}:5001/api`;
// الدومين الحقيقي اللي هيتكتب على كارت NFC (مثلاً https://yourdomain.com)
// حطه في .env بتاع الفرونت: REACT_APP_SITE_URL=https://yourdomain.com
const SITE_URL = (
  process.env.REACT_APP_SITE_URL || window.location.origin
).replace(/\/$/, "");

const CATEGORIES = [
  { id: "popular", label: "Popular" },
  { id: "social", label: "Social" },
  { id: "video", label: "Video" },
  { id: "messaging", label: "Messaging" },
  { id: "contact", label: "Contact" },
  { id: "music", label: "Music" },
  { id: "dev", label: "Dev & Design" },
  { id: "work", label: "Freelance & Jobs" },
  { id: "shop", label: "Shop & Support" },
  { id: "eg_wallets", label: "Egypt Wallets" },
  { id: "global_wallets", label: "Global Wallets" },
  { id: "crypto", label: "Crypto" },
  { id: "web", label: "Websites" },
];

const POPULAR = [
  "WhatsApp",
  "Instagram",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "Telegram",
  "YouTube",
  "Binance",
  "InstaPay",
  "Vodafone Cash",
  "Portfolio",
  "GitHub",
  "Email",
  "Phone",
];

// P(category, name, icon, color, urlTemplate, hint)
// urlTemplate: لو موجود اللينك بيتكتب أوتوماتيك من اليوزر
const B = "fa-brands fa-";
const S = "fa-solid fa-";
const P = (cat, name, icon, color, urlTemplate, hint) => ({
  cat,
  name,
  icon,
  color,
  urlTemplate,
  hint,
});

const PLATFORMS = [
  // ---- Social ----
  P(
    "social",
    "Facebook",
    B + "facebook",
    "#1877F2",
    "https://facebook.com/{u}",
    "username",
  ),
  P(
    "social",
    "Facebook Group",
    S + "users",
    "#1877F2",
    undefined,
    "group name",
  ),
  P(
    "social",
    "Instagram",
    B + "instagram",
    "#E4405F",
    "https://instagram.com/{u}",
    "username",
  ),
  P(
    "social",
    "X / Twitter",
    B + "x-twitter",
    "#000000",
    "https://x.com/{u}",
    "username",
  ),
  P(
    "social",
    "Threads",
    B + "threads",
    "#000000",
    "https://threads.net/@{u}",
    "username",
  ),
  P(
    "social",
    "LinkedIn",
    B + "linkedin",
    "#0A66C2",
    "https://linkedin.com/in/{u}",
    "username",
  ),
  P(
    "social",
    "Snapchat",
    B + "snapchat",
    "#FFFC00",
    "https://snapchat.com/add/{u}",
    "username",
  ),
  P(
    "social",
    "Pinterest",
    B + "pinterest",
    "#E60023",
    "https://pinterest.com/{u}",
    "username",
  ),
  P(
    "social",
    "Reddit",
    B + "reddit",
    "#FF4500",
    "https://reddit.com/user/{u}",
    "username",
  ),
  P(
    "social",
    "Tumblr",
    B + "tumblr",
    "#36465D",
    "https://{u}.tumblr.com",
    "username",
  ),
  P("social", "Mastodon", B + "mastodon", "#6364FF", undefined, "@name@server"),
  P(
    "social",
    "Bluesky",
    B + "bluesky",
    "#0085FF",
    "https://bsky.app/profile/{u}",
    "name.bsky.social",
  ),
  P(
    "social",
    "Quora",
    B + "quora",
    "#B92B27",
    "https://quora.com/profile/{u}",
    "username",
  ),
  P("social", "VK", B + "vk", "#0077FF", "https://vk.com/{u}", "username"),

  // ---- Video ----
  P(
    "video",
    "YouTube",
    B + "youtube",
    "#FF0000",
    "https://youtube.com/@{u}",
    "channel name",
  ),
  P(
    "video",
    "TikTok",
    B + "tiktok",
    "#000000",
    "https://tiktok.com/@{u}",
    "username",
  ),
  P(
    "video",
    "Twitch",
    B + "twitch",
    "#9146FF",
    "https://twitch.tv/{u}",
    "username",
  ),
  P(
    "video",
    "Vimeo",
    B + "vimeo-v",
    "#1AB7EA",
    "https://vimeo.com/{u}",
    "username",
  ),
  P("video", "Kick", S + "play", "#53FC18", "https://kick.com/{u}", "username"),
  P(
    "video",
    "Dailymotion",
    B + "dailymotion",
    "#0066DC",
    "https://dailymotion.com/{u}",
    "username",
  ),
  P(
    "video",
    "Rumble",
    S + "circle-play",
    "#85C742",
    "https://rumble.com/user/{u}",
    "username",
  ),

  // ---- Messaging ----
  P(
    "messaging",
    "WhatsApp",
    B + "whatsapp",
    "#25D366",
    "https://wa.me/{u}",
    "201070479599",
  ),
  P(
    "messaging",
    "WhatsApp Channel",
    B + "whatsapp",
    "#25D366",
    undefined,
    "channel link",
  ),
  P(
    "messaging",
    "Telegram",
    B + "telegram",
    "#26A5E4",
    "https://t.me/{u}",
    "username",
  ),
  P(
    "messaging",
    "Messenger",
    B + "facebook-messenger",
    "#0084FF",
    "https://m.me/{u}",
    "username",
  ),
  P(
    "messaging",
    "Signal",
    B + "signal-messenger",
    "#3A76F0",
    undefined,
    "username / phone",
  ),
  P("messaging", "WeChat", B + "weixin", "#07C160", undefined, "WeChat ID"),
  P("messaging", "Viber", B + "viber", "#7360F2", undefined, "phone number"),
  P("messaging", "Line", B + "line", "#06C755", undefined, "LINE ID"),
  P("messaging", "Skype", B + "skype", "#00AFF0", undefined, "Skype name"),
  P(
    "messaging",
    "Discord",
    B + "discord",
    "#5865F2",
    undefined,
    "username / server link",
  ),
  P("messaging", "Slack", B + "slack", "#4A154B", undefined, "workspace link"),

  // ---- Contact ----
  P(
    "contact",
    "Email",
    S + "envelope",
    "#EA4335",
    "mailto:{u}",
    "name@email.com",
  ),
  P("contact", "Phone", S + "phone", "#16A34A", "tel:{u}", "+201070479599"),
  P("contact", "SMS", S + "comment-sms", "#0EA5E9", "sms:{u}", "+201070479599"),
  P(
    "contact",
    "Location",
    S + "location-dot",
    "#EA4335",
    undefined,
    "Google Maps link",
  ),
  P(
    "contact",
    "Calendly",
    S + "calendar-check",
    "#006BFF",
    "https://calendly.com/{u}",
    "username",
  ),

  // ---- Music ----
  P(
    "music",
    "Spotify",
    B + "spotify",
    "#1DB954",
    "https://open.spotify.com/user/{u}",
    "user id",
  ),
  P(
    "music",
    "SoundCloud",
    B + "soundcloud",
    "#FF5500",
    "https://soundcloud.com/{u}",
    "username",
  ),
  P("music", "Apple Music", S + "music", "#FA243C", undefined, "profile link"),
  P("music", "Anghami", S + "music", "#7B2CBF", undefined, "profile link"),
  P(
    "music",
    "YouTube Music",
    S + "music",
    "#FF0000",
    undefined,
    "channel link",
  ),
  P("music", "Deezer", S + "music", "#A238FF", undefined, "profile link"),
  P(
    "music",
    "Bandcamp",
    B + "bandcamp",
    "#1DA0C3",
    "https://{u}.bandcamp.com",
    "username",
  ),
  P("music", "Podcast", S + "podcast", "#8E44AD", undefined, "podcast link"),

  // ---- Dev & Design ----
  P(
    "dev",
    "GitHub",
    B + "github",
    "#181717",
    "https://github.com/{u}",
    "username",
  ),
  P(
    "dev",
    "GitLab",
    B + "gitlab",
    "#FC6D26",
    "https://gitlab.com/{u}",
    "username",
  ),
  P(
    "dev",
    "Behance",
    B + "behance",
    "#1769FF",
    "https://behance.net/{u}",
    "username",
  ),
  P(
    "dev",
    "Dribbble",
    B + "dribbble",
    "#EA4C89",
    "https://dribbble.com/{u}",
    "username",
  ),
  P(
    "dev",
    "CodePen",
    B + "codepen",
    "#000000",
    "https://codepen.io/{u}",
    "username",
  ),
  P(
    "dev",
    "Figma",
    B + "figma",
    "#F24E1E",
    "https://figma.com/@{u}",
    "username",
  ),
  P(
    "dev",
    "Stack Overflow",
    B + "stack-overflow",
    "#F58025",
    undefined,
    "profile link",
  ),
  P(
    "dev",
    "LeetCode",
    S + "code",
    "#FFA116",
    "https://leetcode.com/{u}",
    "username",
  ),
  P(
    "dev",
    "Kaggle",
    B + "kaggle",
    "#20BEFF",
    "https://kaggle.com/{u}",
    "username",
  ),
  P("dev", "npm", B + "npm", "#CB3837", "https://npmjs.com/~{u}", "username"),
  P(
    "dev",
    "Medium",
    B + "medium",
    "#000000",
    "https://medium.com/@{u}",
    "username",
  ),
  P("dev", "Dev.to", B + "dev", "#0A0A0A", "https://dev.to/{u}", "username"),
  P(
    "dev",
    "Hashnode",
    S + "hashtag",
    "#2962FF",
    "https://hashnode.com/@{u}",
    "username",
  ),
  P("dev", "Notion", S + "file-lines", "#000000", undefined, "page link"),
  P(
    "dev",
    "Google Play",
    B + "google-play",
    "#34A853",
    undefined,
    "developer page link",
  ),
  P(
    "dev",
    "App Store",
    B + "app-store-ios",
    "#0D96F6",
    undefined,
    "developer page link",
  ),

  // ---- Freelance & Jobs ----
  P("work", "Upwork", B + "upwork", "#14A800", undefined, "profile link"),
  P(
    "work",
    "Fiverr",
    B + "fiverr",
    "#1DBF73",
    "https://fiverr.com/{u}",
    "username",
  ),
  P(
    "work",
    "Khamsat",
    S + "briefcase",
    "#1F9D55",
    "https://khamsat.com/user/{u}",
    "username",
  ),
  P(
    "work",
    "Mostaql",
    S + "briefcase",
    "#2D6CDF",
    "https://mostaql.com/u/{u}",
    "username",
  ),
  P(
    "work",
    "Freelancer",
    B + "freelancer",
    "#29B2FE",
    "https://freelancer.com/u/{u}",
    "username",
  ),
  P("work", "Wuzzuf", S + "briefcase", "#1F4E9C", undefined, "profile link"),

  // ---- Shop & Support ----
  P("shop", "Amazon", B + "amazon", "#FF9900", undefined, "store link"),
  P(
    "shop",
    "Etsy",
    B + "etsy",
    "#F1641E",
    "https://etsy.com/shop/{u}",
    "shop name",
  ),
  P("shop", "Shopify Store", B + "shopify", "#95BF47", undefined, "store link"),
  P("shop", "Online Store", S + "store", "#101112", undefined, "store link"),
  P("shop", "Jumia", S + "bag-shopping", "#F68B1E", undefined, "store link"),
  P("shop", "Noon", S + "bag-shopping", "#FEEE00", undefined, "store link"),
  P(
    "shop",
    "Patreon",
    B + "patreon",
    "#FF424D",
    "https://patreon.com/{u}",
    "username",
  ),
  P(
    "shop",
    "Buy Me a Coffee",
    S + "mug-saucer",
    "#FFDD00",
    "https://buymeacoffee.com/{u}",
    "username",
  ),
  P(
    "shop",
    "Ko-fi",
    S + "mug-hot",
    "#FF5E5B",
    "https://ko-fi.com/{u}",
    "username",
  ),
  P(
    "shop",
    "Gumroad",
    S + "bag-shopping",
    "#FF90E8",
    "https://{u}.gumroad.com",
    "username",
  ),

  // ---- Egypt wallets ----
  P(
    "eg_wallets",
    "Vodafone Cash",
    S + "mobile-screen-button",
    "#E60000",
    undefined,
    "010xxxxxxxx",
  ),
  P(
    "eg_wallets",
    "InstaPay",
    S + "bolt",
    "#6B2D8F",
    "https://ipn.eg/S/{u}",
    "name@instapay",
  ),
  P(
    "eg_wallets",
    "Orange Cash",
    S + "wallet",
    "#FF7900",
    undefined,
    "012xxxxxxxx",
  ),
  P(
    "eg_wallets",
    "Etisalat Cash",
    S + "wallet",
    "#E4002B",
    undefined,
    "011xxxxxxxx",
  ),
  P("eg_wallets", "WE Pay", S + "wallet", "#5B2C83", undefined, "015xxxxxxxx"),
  P(
    "eg_wallets",
    "Phone Cash",
    S + "wallet",
    "#0B7A3E",
    undefined,
    "wallet number",
  ),
  P(
    "eg_wallets",
    "Telda",
    S + "credit-card",
    "#101112",
    undefined,
    "Telda tag",
  ),
  P(
    "eg_wallets",
    "Meeza",
    S + "credit-card",
    "#00A651",
    undefined,
    "card / account",
  ),
  P("eg_wallets", "MyFawry", S + "receipt", "#FFB800", undefined, "account"),
  P("eg_wallets", "Blink", S + "credit-card", "#00A3E0", undefined, "account"),
  P("eg_wallets", "ValU", S + "credit-card", "#E5007D", undefined, "account"),

  // ---- Global wallets ----
  P(
    "global_wallets",
    "PayPal",
    B + "paypal",
    "#003087",
    "https://paypal.me/{u}",
    "paypal.me name",
  ),
  P(
    "global_wallets",
    "Payoneer",
    S + "money-bill-transfer",
    "#FF4800",
    undefined,
    "account email",
  ),
  P(
    "global_wallets",
    "Wise",
    S + "money-bill-transfer",
    "#9FE870",
    undefined,
    "account email",
  ),
  P(
    "global_wallets",
    "Skrill",
    S + "wallet",
    "#862165",
    undefined,
    "account email",
  ),
  P(
    "global_wallets",
    "Neteller",
    S + "wallet",
    "#83BA3B",
    undefined,
    "account email",
  ),
  P(
    "global_wallets",
    "Apple Pay",
    B + "apple-pay",
    "#000000",
    undefined,
    "phone / email",
  ),
  P(
    "global_wallets",
    "Google Pay",
    B + "google-pay",
    "#4285F4",
    undefined,
    "phone / email",
  ),
  P(
    "global_wallets",
    "Venmo",
    S + "dollar-sign",
    "#3D95CE",
    "https://venmo.com/{u}",
    "username",
  ),
  P(
    "global_wallets",
    "Cash App",
    S + "dollar-sign",
    "#00D64F",
    "https://cash.app/$" + "{u}",
    "cashtag",
  ),
  P(
    "global_wallets",
    "Revolut",
    S + "credit-card",
    "#0666EB",
    "https://revolut.me/{u}",
    "username",
  ),
  P(
    "global_wallets",
    "Western Union",
    S + "money-bill-transfer",
    "#FFDD00",
    undefined,
    "details",
  ),
  P(
    "global_wallets",
    "Bank Account",
    S + "building-columns",
    "#334155",
    undefined,
    "IBAN / account number",
  ),

  // ---- Crypto ----
  P("crypto", "Binance", S + "coins", "#F0B90B", undefined, "Binance ID / UID"),
  P("crypto", "Binance Pay", S + "coins", "#F0B90B", undefined, "Pay ID"),
  P("crypto", "Bybit", S + "coins", "#F7A600", undefined, "UID"),
  P("crypto", "OKX", S + "coins", "#000000", undefined, "UID"),
  P("crypto", "Coinbase", S + "coins", "#0052FF", undefined, "username"),
  P(
    "crypto",
    "Trust Wallet",
    S + "wallet",
    "#3375BB",
    undefined,
    "wallet address",
  ),
  P("crypto", "MetaMask", S + "wallet", "#F6851B", undefined, "wallet address"),
  P("crypto", "Bitcoin", B + "bitcoin", "#F7931A", undefined, "BTC address"),
  P("crypto", "Ethereum", B + "ethereum", "#627EEA", undefined, "ETH address"),
  P(
    "crypto",
    "USDT",
    S + "coins",
    "#26A17B",
    undefined,
    "address (TRC20 / ERC20)",
  ),

  // ---- Websites ----
  P("web", "Portfolio", S + "briefcase", "#101112", undefined, "site name"),
  P("web", "Personal Website", S + "globe", "#2563EB", undefined, "site name"),
  P("web", "Blog", B + "wordpress", "#21759B", undefined, "blog name"),
  P(
    "web",
    "Substack",
    S + "newspaper",
    "#FF6719",
    "https://{u}.substack.com",
    "name",
  ),
  P("web", "Resume / CV", S + "file-lines", "#475569", undefined, "file link"),
  P(
    "web",
    "Google Drive",
    B + "google-drive",
    "#1FA463",
    undefined,
    "folder / file link",
  ),
  P(
    "web",
    "Linktree",
    S + "link",
    "#43E55E",
    "https://linktr.ee/{u}",
    "username",
  ),
];

const findPlatform = (name) => PLATFORMS.find((p) => p.name === name);
const buildUrl = (platform, username) =>
  platform?.urlTemplate && username
    ? platform.urlTemplate.replace("{u}", () =>
        username.replace(/^@/, "").trim(),
      )
    : "";

/* ================================================================== */
/*  SMALL HELPERS                                                      */
/* ================================================================== */
let keyCounter = 0;
const newKey = () => `k${Date.now().toString(36)}${keyCounter++}`;

const EMPTY_PROFILE = {
  name: "",
  slug: "",
  role: "",
  bio: "",
  avatar_url: "",
  connected_count: "",
  skills: "",
  headerLeftLink: "",
  headerRightLink: "",
  navPhone: "",
  navWhatsapp: "",
};

const stripKeys = (links) => links.map(({ _key, ...rest }) => rest);
const makeSnapshot = (profile, links) =>
  JSON.stringify({ profile, links: stripKeys(links) });

const authFetch = (path, options = {}) =>
  fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      ...(options.headers || {}),
    },
  });

const readFileAsDataURL = (file, cb) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => cb(reader.result);
  reader.onerror = (err) => console.error("Error reading file:", err);
  reader.readAsDataURL(file);
};

/* ================================================================== */
/*  UI PRIMITIVES (defined once, reused everywhere)                    */
/* ================================================================== */
const ICONS = {
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  upload: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  trash:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  plus: "M12 4v16m8-8H4",
  up: "M5 15l7-7 7 7",
  down: "M19 9l-7 7-7-7",
  back: "M10 19l-7-7m0 0l7-7m-7 7h18",
  logout:
    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  check: "M5 13l4 4L19 7",
  close: "M6 18L18 6M6 6l12 12",
  edit: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  nfc: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0",
};

const Icon = ({ name, className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d={ICONS[name]}
    />
  </svg>
);

const GripIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    {[6, 12, 18].map((y) => (
      <React.Fragment key={y}>
        <circle cx="9" cy={y} r="1.6" />
        <circle cx="15" cy={y} r="1.6" />
      </React.Fragment>
    ))}
  </svg>
);

const INPUT =
  "w-full px-3.5 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#101112] focus:bg-white transition-all text-base sm:text-sm";

const TextInput = ({ className = "", ...props }) => (
  <input className={`${INPUT} ${className}`} {...props} />
);

const Field = ({ label, hint, children, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="block text-[13px] font-semibold text-gray-700 mb-1.5">
      {label}
    </span>
    {children}
    {hint && (
      <span className="block text-[11px] text-gray-400 mt-1.5">{hint}</span>
    )}
  </label>
);

const Panel = ({ title, description, children }) => (
  <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    {(title || description) && (
      <header className="px-5 sm:px-6 py-4 border-b border-gray-100">
        {title && (
          <h3 className="text-sm font-extrabold text-[#101112]">{title}</h3>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </header>
    )}
    <div className="p-5 sm:p-6">{children}</div>
  </section>
);

const PageHeader = ({ title, description }) => (
  <div className="mb-5">
    <h1 className="text-xl font-black text-[#101112] tracking-tight">
      {title}
    </h1>
    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
  </div>
);

const UploadButton = ({ onFile, label, compact }) => (
  <span className="relative inline-flex shrink-0">
    <input
      type="file"
      accept="image/*"
      onChange={(e) => readFileAsDataURL(e.target.files[0], onFile)}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <span
      className={`inline-flex items-center justify-center gap-2 font-bold bg-[#101112] text-white rounded-xl pointer-events-none ${
        compact ? "px-3 py-2.5 text-xs" : "px-4 py-3 text-sm w-full sm:w-auto"
      }`}
    >
      <Icon name="upload" />
      {label}
    </span>
  </span>
);

const Avatar = ({ src, name, size = "w-10 h-10" }) =>
  src ? (
    <img
      src={src}
      alt=""
      className={`${size} rounded-full object-cover bg-gray-100`}
    />
  ) : (
    <span
      className={`${size} rounded-full bg-[#101112] text-[#C8F331] font-black flex items-center justify-center`}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );

const PlatformBadge = ({ link, size = "w-10 h-10" }) => {
  const light = link.bg_color?.toUpperCase() === "#FFFC00";
  return (
    <span
      className={`${size} rounded-xl flex items-center justify-center text-white shrink-0`}
      style={{
        backgroundColor: link.bg_color || "#101112",
        color: light ? "#000" : undefined,
      }}
    >
      {link.image_url ? (
        <img src={link.image_url} alt="" className="w-5 h-5 object-contain" />
      ) : link.icon_class ? (
        <i className={link.icon_class}></i>
      ) : (
        <span className="font-black text-sm">
          {(link.platform_name || "?").charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
};

const Toast = ({ toast }) =>
  toast ? (
    <div
      className={`fixed bottom-44 md:bottom-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 px-5 py-3 rounded-xl text-sm font-bold animate-in fade-in duration-200 ${
        toast.type === "error"
          ? "bg-red-600 text-white"
          : "bg-[#101112] text-white"
      }`}
    >
      <span>
        {toast.type !== "error" && (
          <span className="text-[#C8F331] mr-2">●</span>
        )}
        {toast.text}
      </span>
      {toast.action && (
        <button
          type="button"
          onClick={toast.action.onClick}
          className="text-[#C8F331] underline outline-none"
        >
          {toast.action.label}
        </button>
      )}
    </div>
  ) : null;

/* ================================================================== */
/*  NFC (Web NFC — Chrome Android + HTTPS only)                        */
/* ================================================================== */
const normalizeUrl = (u) =>
  /^[a-z][a-z0-9+.-]*:/i.test(u.trim()) ? u.trim() : `https://${u.trim()}`;

const decodeRecord = (record) => {
  if (!["url", "absolute-url", "text"].includes(record.recordType)) return "";
  return new TextDecoder(record.encoding || "utf-8").decode(record.data);
};

const nfcErrorMessage = (err) =>
  err?.name === "NotAllowedError"
    ? "NFC permission denied. Allow NFC for this site."
    : err?.name === "NotSupportedError"
      ? "NFC is turned off or not available."
      : err?.message || "NFC error";

const useNfc = (notify) => {
  const supported = typeof window !== "undefined" && "NDEFReader" in window;
  // starting | listening | writing | idle
  const [status, setStatus] = useState(supported ? "starting" : "idle");
  const [needsPermission, setNeedsPermission] = useState(false);
  const abortRef = useRef(null);
  const onReadRef = useRef(null);
  const mounted = useRef(true);

  const abort = () => {
    abortRef.current?.abort();
    abortRef.current = null;
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      abort();
    };
  }, []);

  // سمع للكارت باستمرار (من غير ما تدوس Read)
  const listen = useCallback(
    async (onRead) => {
      if (!supported) return;
      if (onRead) onReadRef.current = onRead;
      abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setStatus("starting");
      try {
        const reader = new window.NDEFReader();
        // الـ handlers قبل scan عشان منفوتش أول قراءة
        reader.onreadingerror = () =>
          notify("Couldn't read this card", "error");
        reader.onreading = (e) => {
          const value =
            Array.from(e.message.records).map(decodeRecord).find(Boolean) || "";
          onReadRef.current?.(value);
        };
        await reader.scan({ signal: ctrl.signal });
        if (!mounted.current || ctrl.signal.aborted) return;
        setStatus("listening");
        setNeedsPermission(false);
      } catch (err) {
        if (err?.name === "AbortError" || !mounted.current) return;
        setStatus("idle");
        if (err?.name === "NotAllowedError") setNeedsPermission(true);
        else notify(nfcErrorMessage(err), "error");
      }
    },
    [supported, notify],
  );

  // اكتب لينك على الكارت، وبعدها ارجع اسمع تاني
  const write = async (url, onDone) => {
    if (!supported)
      return notify("NFC works on Chrome for Android only.", "error");
    if (!url?.trim()) return notify("Add a link first.", "error");
    abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setStatus("writing");
    try {
      const finalUrl = normalizeUrl(url);
      await new window.NDEFReader().write(
        { records: [{ recordType: "url", data: finalUrl }] },
        { overwrite: true, signal: ctrl.signal },
      );
      onDone?.(finalUrl);
      notify("Card updated ✓");
    } catch (err) {
      if (err?.name !== "AbortError") notify(nfcErrorMessage(err), "error");
    } finally {
      if (mounted.current) listen();
    }
  };

  const cancelWrite = () => {
    abort();
    listen();
  };

  return { supported, status, needsPermission, listen, write, cancelWrite };
};

/* تاب NFC: يقرأ الكارت تلقائي، ويكتب لينك جديد (أو اللينك الأساسي) */
const NfcTab = ({ profile, notify }) => {
  const nfc = useNfc(notify);
  const { listen } = nfc;
  const [onCard, setOnCard] = useState(null); // null = لسه ماقريناش كارت
  const [newLink, setNewLink] = useState("");

  const pageUrl = profile.slug ? `${SITE_URL}/u/${profile.slug}` : "";
  const target = newLink.trim() || pageUrl;
  const writing = nfc.status === "writing";
  const matches =
    onCard &&
    pageUrl &&
    onCard.replace(/\/$/, "") === pageUrl.replace(/\/$/, "");

  const handleRead = useCallback(
    (value) => {
      setOnCard(value);
      if (value) notify("Card read");
      else notify("The card is empty", "error");
    },
    [notify],
  );

  // ابدأ السمع أول ما التاب يفتح
  useEffect(() => {
    if (nfc.supported) listen(handleRead);
  }, [nfc.supported, listen, handleRead]);

  return (
    <div className="space-y-5 max-w-xl">
      <Panel
        title="Your main link"
        description="This is the link that will be written to your NFC card."
      >
        {pageUrl ? (
          <p className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-[#101112] break-all">
            {pageUrl}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Set your page address in the Profile tab first.
          </p>
        )}
      </Panel>

      <Panel
        title="NFC card"
        description="Tap your card on the back of your phone to see the link saved on it."
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`w-11 h-11 rounded-full bg-[#101112] text-[#C8F331] flex items-center justify-center shrink-0 ${
              nfc.status === "listening" ? "animate-pulse" : ""
            }`}
          >
            <Icon name="nfc" className="w-5 h-5" />
          </span>
          <p className="text-xs text-gray-500">
            {writing
              ? "Writing — hold the card near your phone…"
              : nfc.status === "listening"
                ? "Listening — tap your card now."
                : nfc.status === "starting"
                  ? "Starting…"
                  : "Not listening."}
          </p>
        </div>

        {!nfc.supported ? (
          <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl p-3">
            NFC isn't available here. Open this page in Chrome on an Android
            phone (HTTPS).
          </p>
        ) : nfc.needsPermission || nfc.status === "idle" ? (
          <button
            type="button"
            onClick={() => nfc.listen(handleRead)}
            className="w-full py-3 rounded-xl bg-[#101112] text-sm font-bold text-white outline-none"
          >
            Enable NFC & start listening
          </button>
        ) : null}

        {onCard !== null && (
          <div className="mt-4 rounded-xl border border-gray-200 p-3">
            <p className="text-[11px] font-bold text-gray-400 mb-1">
              On the card
            </p>
            {onCard ? (
              <>
                <p className="text-sm font-semibold text-[#101112] break-all">
                  {onCard}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p
                    className={`text-xs font-bold ${matches ? "text-green-600" : "text-amber-600"}`}
                  >
                    {matches
                      ? "Matches your main link"
                      : "Different from your main link"}
                  </p>
                  <a
                    href={normalizeUrl(onCard)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#101112] underline"
                  >
                    Open
                  </a>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">The card is empty.</p>
            )}
          </div>
        )}
      </Panel>

      <Panel
        title="Write a link to the card"
        description="Leave it empty to use your main profile link."
      >
        <TextInput
          type="url"
          placeholder={pageUrl || "https://..."}
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          className="mb-3"
        />
        {writing ? (
          <button
            type="button"
            onClick={nfc.cancelWrite}
            className="w-full py-3 rounded-xl bg-red-50 text-sm font-bold text-red-500 outline-none"
          >
            Cancel — waiting for the card…
          </button>
        ) : (
          <button
            type="button"
            disabled={!target || !nfc.supported}
            onClick={() =>
              nfc.write(target, (written) => {
                setOnCard(written);
                setNewLink("");
              })
            }
            className="w-full py-3 rounded-xl bg-[#C8F331] text-sm font-black text-[#101112] hover:bg-[#b8e321] transition-colors disabled:opacity-40 outline-none"
          >
            Write to card
          </button>
        )}
        <p className="text-[11px] text-gray-400 mt-2">
          Press the button, then tap the card — it's written as soon as the
          phone detects it.
        </p>
      </Panel>
    </div>
  );
};

/* ================================================================== */
/*  LOGIN                                                              */
/* ================================================================== */
const LoginScreen = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("adminToken", data.token);
        onSuccess();
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Server error, please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4 font-sans"
      dir="ltr"
    >
      <div className="max-w-md w-full bg-white rounded-[32px] border border-gray-200 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#101112] text-[#C8F331] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="lock" className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#101112] tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to manage your profile
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-semibold text-center border border-red-100">
              {error}
            </div>
          )}
          <Field label="Email">
            <TextInput
              type="email"
              required
              placeholder="ammar@profile.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#C8F331] text-[#101112] font-black text-base py-4 rounded-2xl hover:bg-[#b8e321] transition-all disabled:opacity-70"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-center text-sm text-gray-500">
            New here?{" "}
            <Link to="/signup" className="font-bold text-[#101112] underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

/* ================================================================== */
/*  TABS                                                               */
/* ================================================================== */
const ProfileTab = ({ profile, setField, notify }) => {
  const pageUrl = profile.slug
    ? `${window.location.origin}/u/${profile.slug}`
    : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      notify("Link copied");
    } catch {
      notify("Couldn't copy the link", "error");
    }
  };

  const onSlug = (e) =>
    setField("slug")({
      target: {
        value: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
      },
    });

  return (
    <div className="space-y-5">
      <Panel
        title="Your page"
        description="The public address of your profile. Share it anywhere."
      >
        <Field label="Page address">
          <div className="flex items-stretch rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#101112] focus-within:bg-white transition-all overflow-hidden">
            <span className="px-3 flex items-center text-xs text-gray-400 border-r border-gray-200 whitespace-nowrap">
              <span className="hidden sm:inline">{window.location.host}</span>
              /u/
            </span>
            <input
              value={profile.slug}
              onChange={onSlug}
              placeholder="your-name"
              maxLength={30}
              className="flex-1 min-w-0 px-3 py-3 bg-transparent outline-none text-base sm:text-sm"
            />
          </div>
        </Field>
        {pageUrl && (
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={copyLink}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors outline-none"
            >
              Copy link
            </button>
            <Link
              to={`/u/${profile.slug}`}
              className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl bg-[#101112] text-xs font-bold text-white hover:bg-gray-800 transition-colors"
            >
              Open page
            </Link>
          </div>
        )}
      </Panel>

      <Panel title="Basic info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full name">
            <TextInput
              placeholder="e.g. Ammar Ahmed"
              value={profile.name}
              onChange={setField("name")}
            />
          </Field>
          <Field label="Role">
            <TextInput
              placeholder="e.g. Developer"
              value={profile.role}
              onChange={setField("role")}
            />
          </Field>
          <Field label="Bio / headline" className="md:col-span-2">
            <TextInput
              placeholder="e.g. Web Developer @ Sphinx | Computers"
              value={profile.bio}
              onChange={setField("bio")}
            />
          </Field>
        </div>
      </Panel>

      <Panel title="Avatar & stats">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <Avatar
            src={profile.avatar_url}
            name={profile.name}
            size="w-16 h-16"
          />
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-2">
            <TextInput
              className="flex-1"
              placeholder="Image URL (https://...)"
              value={profile.avatar_url}
              onChange={setField("avatar_url")}
            />
            <UploadButton
              label="Upload"
              onFile={(b64) =>
                setField("avatar_url")({ target: { value: b64 } })
              }
            />
          </div>
        </div>
        <Field label="Connected count">
          <TextInput
            type="number"
            placeholder="0"
            value={profile.connected_count}
            onChange={setField("connected_count")}
          />
        </Field>
      </Panel>

      <Panel title="Skills" description="Separate skills with commas.">
        <textarea
          rows="3"
          placeholder="React, Node.js, PHP"
          value={profile.skills}
          onChange={setField("skills")}
          className={`${INPUT} resize-none`}
        />
        {profile.skills.trim() && (
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600"
                >
                  {s}
                </span>
              ))}
          </div>
        )}
      </Panel>
    </div>
  );
};

const ActionsTab = ({ profile, setField }) => (
  <div className="space-y-5">
    <Panel
      title="Top header icons"
      description="Where the eye and send icons at the top of your profile lead to."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Left icon link (eye)">
          <TextInput
            type="url"
            placeholder="https://..."
            value={profile.headerLeftLink}
            onChange={setField("headerLeftLink")}
          />
        </Field>
        <Field label="Right icon link (send)">
          <TextInput
            type="url"
            placeholder="https://..."
            value={profile.headerRightLink}
            onChange={setField("headerRightLink")}
          />
        </Field>
      </div>
    </Panel>

    <Panel
      title="Bottom swipe bar"
      description="The call and WhatsApp buttons at the bottom of your profile."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Phone number (call)">
          <TextInput
            placeholder="+201070479599"
            value={profile.navPhone}
            onChange={setField("navPhone")}
          />
        </Field>
        <Field
          label="WhatsApp number"
          hint="Adding WhatsApp in Links will reuse this number."
        >
          <TextInput
            placeholder="201070479599"
            value={profile.navWhatsapp}
            onChange={setField("navWhatsapp")}
          />
        </Field>
      </div>
    </Panel>
  </div>
);

/* ---------- Links tab ---------- */
const Switch = ({ checked, onChange, label, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    data-noswipe
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    className={`relative shrink-0 w-[52px] h-7 rounded-full transition-colors outline-none disabled:opacity-40 ${
      checked ? "bg-[#C8F331]" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : ""
      }`}
    />
  </button>
);

/* plain = بدون هيدر، مجرد handle صغير فوق (زي التصميم) */
const Sheet = ({ title, onClose, plain, children }) => {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      dir="ltr"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-3xl max-h-[92vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        {plain ? (
          <div className="flex justify-center pt-3">
            <span className="w-12 h-1.5 rounded-full bg-gray-300" />
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-extrabold text-[#101112]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center outline-none"
            >
              <Icon name="close" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

/* ---------- Add / edit link screen (like the design) ---------- */
const BARE =
  "w-full bg-transparent outline-none text-lg font-semibold text-[#101112] placeholder:text-gray-300 placeholder:font-normal";

const FloatField = ({ label, children }) => (
  <label className="block bg-gray-50 border border-gray-200 rounded-2xl px-4 pt-2.5 pb-2 focus-within:border-[#101112] focus-within:bg-white transition-all">
    <span className="block text-[11px] text-gray-400">{label}</span>
    {children}
  </label>
);

const BigLogo = ({ link }) => {
  const light = link.bg_color?.toUpperCase() === "#FFFC00";
  return (
    <span
      className="w-28 h-28 rounded-full flex items-center justify-center text-5xl"
      style={{
        backgroundColor: link.bg_color || "#101112",
        color: light ? "#000" : "#fff",
      }}
    >
      {link.image_url ? (
        <img src={link.image_url} alt="" className="w-14 h-14 object-contain" />
      ) : link.icon_class ? (
        <i className={link.icon_class}></i>
      ) : (
        <span className="font-black text-4xl">
          {(link.platform_name || "?").charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
};

/* NOTE: not a <form> on purpose (it lives inside the main form). */
const LinkFormSheet = ({ mode, initial, onSave, onDelete, onClose }) => {
  const [link, setLink] = useState(initial);
  const [error, setError] = useState("");
  const [showStyle, setShowStyle] = useState(false);
  // المنصة ثابتة من أول فتح الشاشة (حتى لو اليوزر عدّل اسم المنصة)
  const [platform] = useState(() => findPlatform(initial.platform_name));

  const set = (field, value) =>
    setLink((prev) => {
      const next = { ...prev, [field]: value };
      if (
        field === "username" &&
        platform?.urlTemplate &&
        (!prev.url || prev.url === buildUrl(platform, prev.username))
      ) {
        next.url = buildUrl(platform, value);
      }
      return next;
    });

  const submit = () => {
    if (!link.platform_name.trim()) return setError("Add a platform name.");
    if (!link.username.trim() && !link.url.trim())
      return setError("Add a username or a link.");
    onSave(link);
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Sheet plain onClose={onClose}>
      <div className="space-y-3" onKeyDown={onEnter}>
        {/* logo + name */}
        <div className="flex flex-col items-center text-center pt-3 pb-4">
          <BigLogo link={link} />
          <h3 className="mt-4 text-2xl font-black text-[#101112] truncate max-w-full">
            {link.platform_name || "Custom link"}
          </h3>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-semibold border border-red-100">
            {error}
          </div>
        )}

        <FloatField label="Platform name">
          <input
            className={BARE}
            placeholder="e.g. My Store"
            value={link.platform_name}
            onChange={(e) => set("platform_name", e.target.value)}
          />
        </FloatField>

        <FloatField label="Username">
          <input
            autoFocus
            className={BARE}
            placeholder={platform?.hint || "username"}
            value={link.username}
            onChange={(e) => set("username", e.target.value)}
          />
        </FloatField>

        <FloatField label="Profile link">
          <input
            className={BARE}
            placeholder="https://..."
            value={link.url}
            onChange={(e) => set("url", e.target.value)}
          />
        </FloatField>
        {platform?.urlTemplate && (
          <p className="text-[11px] text-gray-400 px-1 -mt-1">
            Filled in automatically from the username. You can edit it.
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowStyle((v) => !v)}
          className="text-xs font-bold text-gray-400 hover:text-[#101112] transition-colors outline-none"
        >
          {showStyle
            ? "Hide style options"
            : "Style options (color, icon, image)"}
        </button>

        {showStyle && (
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <FloatField label="Background color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={link.bg_color || "#101112"}
                  onChange={(e) => set("bg_color", e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-lg border border-gray-200 cursor-pointer bg-white"
                />
                <input
                  className={`${BARE} uppercase`}
                  placeholder="#1877F2"
                  value={link.bg_color}
                  onChange={(e) => set("bg_color", e.target.value)}
                />
              </div>
            </FloatField>
            <FloatField label="FontAwesome class">
              <input
                className={`${BARE} font-mono text-base`}
                placeholder="fa-brands fa-facebook"
                value={link.icon_class}
                onChange={(e) => set("icon_class", e.target.value)}
              />
            </FloatField>
            <FloatField label="Image / SVG">
              <div className="flex items-center gap-2">
                <input
                  className={`${BARE} text-base`}
                  placeholder="https://..."
                  value={link.image_url}
                  onChange={(e) => set("image_url", e.target.value)}
                />
                <UploadButton
                  compact
                  label=""
                  onFile={(b64) => set("image_url", b64)}
                />
              </div>
            </FloatField>
          </div>
        )}

        <div className="pt-3 space-y-2">
          <button
            type="button"
            onClick={submit}
            className="w-full bg-[#101112] text-white font-bold text-base py-4 rounded-full hover:bg-gray-800 transition-all outline-none"
          >
            Save link
          </button>
          {mode === "edit" && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full text-red-500 font-bold text-sm py-3 rounded-full hover:bg-red-50 transition-colors outline-none"
            >
              Delete link
            </button>
          )}
        </div>
      </div>
    </Sheet>
  );
};

/* Full catalog: categories + search + custom */
const PickerSheet = ({ onPick, onCustom, onClose }) => {
  const [category, setCategory] = useState("popular");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q) return PLATFORMS.filter((p) => p.name.toLowerCase().includes(q));
    if (category === "popular")
      return POPULAR.map(findPlatform).filter(Boolean);
    return PLATFORMS.filter((p) => p.cat === category);
  }, [category, search]);

  return (
    <Sheet title="Add new social link" onClose={onClose}>
      <TextInput
        className="mb-3"
        autoFocus
        placeholder="Search (whatsapp, binance, instapay...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {!search && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all outline-none ${
                category === c.id
                  ? "bg-[#101112] text-white"
                  : "bg-gray-100 text-gray-500 hover:text-[#101112]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1">
        {visible.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => onPick(p)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left outline-none"
          >
            <PlatformBadge
              link={{
                bg_color: p.color,
                icon_class: p.icon,
                platform_name: p.name,
              }}
            />
            <span className="flex-1 text-sm font-bold text-[#101112]">
              {p.name}
            </span>
            <span className="w-8 h-8 rounded-full border-2 border-[#101112] flex items-center justify-center text-[#101112]">
              <Icon name="plus" className="w-4 h-4" />
            </span>
          </button>
        ))}
        {visible.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">
            Nothing found.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onCustom}
        className="w-full mt-4 py-3 rounded-xl bg-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors outline-none"
      >
        Custom link
      </button>
    </Sheet>
  );
};

/* Swipe right → edit, swipe left → delete (touch + mouse). Tap → edit. */
const SwipeRow = ({ onEdit, onDelete, disabled, children }) => {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef(null);
  const moved = useRef(false);
  const MAX = 120;
  const TRIGGER = 80;

  const onPointerDown = (e) => {
    if (disabled || e.target.closest("[data-noswipe]")) return;
    start.current = { x: e.clientX, y: e.clientY, locked: false };
    moved.current = false;
  };

  const onPointerMove = (e) => {
    const s = start.current;
    if (!s) return;
    const ddx = e.clientX - s.x;
    const ddy = e.clientY - s.y;
    if (!s.locked) {
      if (Math.abs(ddx) > 8 && Math.abs(ddx) > Math.abs(ddy)) {
        s.locked = true;
        moved.current = true;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      } else if (Math.abs(ddy) > 8) {
        start.current = null;
        return;
      }
    }
    if (s.locked) setDx(Math.max(-MAX, Math.min(MAX, ddx)));
  };

  const finish = () => {
    const s = start.current;
    start.current = null;
    if (s?.locked) {
      if (dx >= TRIGGER) onEdit();
      else if (dx <= -TRIGGER) onDelete();
    }
    setDx(0);
    setDragging(false);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {dx > 0 && (
        <div className="absolute inset-0 bg-[#101112] text-white flex items-center pl-5 gap-2 text-sm font-bold">
          <Icon name="edit" /> Edit
        </div>
      )}
      {dx < 0 && (
        <div className="absolute inset-0 bg-red-500 text-white flex items-center justify-end pr-5 gap-2 text-sm font-bold">
          Delete <Icon name="trash" />
        </div>
      )}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
        onClick={(e) => {
          if (disabled || moved.current || e.target.closest("[data-noswipe]"))
            return;
          onEdit();
        }}
        style={{
          transform: `translateX(${dx}px)`,
          transition: dragging ? "none" : "transform 200ms ease",
          touchAction: "pan-y",
        }}
        className={`relative bg-white ${disabled ? "" : "cursor-pointer"}`}
      >
        {children}
      </div>
    </div>
  );
};

const CardShell = ({ title, right, children }) => (
  <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
      <h3 className="font-extrabold text-[#101112]">{title}</h3>
      {right}
    </header>
    <div className="p-3">{children}</div>
  </section>
);

const LinksTab = ({ links, setLinks, profile, notify, onCommit }) => {
  const [sheet, setSheet] = useState(null); // {type:'picker'} | {type:'form', mode, link}
  const [reorder, setReorder] = useState(false);
  const [dragKey, setDragKey] = useState(null);
  const [overKey, setOverKey] = useState(null);

  const allActive = links.length > 0 && links.every((l) => l.active !== false);
  const recommended = POPULAR.map(findPlatform)
    .filter((p) => p && !links.some((l) => l.platform_name === p.name))
    .slice(0, 5);

  // أي تغيير في التفعيل بيتحفظ في الداتابيز فوراً عشان يتحدث في الصفحة العامة
  const commit = (next) => {
    setLinks(next);
    onCommit?.(next);
  };
  const setAll = (value) => commit(links.map((l) => ({ ...l, active: value })));
  const setActive = (key, value) =>
    commit(links.map((l) => (l._key === key ? { ...l, active: value } : l)));

  const move = useCallback(
    (from, to) =>
      setLinks((prev) => {
        if (from === to || to < 0 || to >= prev.length) return prev;
        const copy = [...prev];
        const [item] = copy.splice(from, 1);
        copy.splice(to, 0, item);
        return copy;
      }),
    [setLinks],
  );

  const handleDrop = (targetKey) => {
    if (dragKey && dragKey !== targetKey) {
      move(
        links.findIndex((l) => l._key === dragKey),
        links.findIndex((l) => l._key === targetKey),
      );
    }
    setDragKey(null);
    setOverKey(null);
  };

  const makeDraft = (p) => {
    const draft = {
      _key: newKey(),
      active: true,
      platform_name: p.name,
      username: "",
      url: "",
      bg_color: p.color,
      icon_class: p.icon,
      image_url: "",
    };
    // WhatsApp يستخدم الرقم اللي في Action links تلقائياً
    if (p.name === "WhatsApp" && profile.navWhatsapp) {
      draft.username = profile.navWhatsapp.replace(/\D/g, "");
      draft.url = buildUrl(p, draft.username);
    }
    return draft;
  };

  const openAdd = (p) =>
    setSheet({ type: "form", mode: "add", link: makeDraft(p) });
  const openCustom = () =>
    setSheet({
      type: "form",
      mode: "add",
      link: {
        _key: newKey(),
        active: true,
        platform_name: "",
        username: "",
        url: "",
        bg_color: "#101112",
        icon_class: "",
        image_url: "",
      },
    });
  const openEdit = (link) => setSheet({ type: "form", mode: "edit", link });

  const saveLink = (link) => {
    const mode = sheet?.mode;
    const next =
      mode === "edit"
        ? links.map((l) => (l._key === link._key ? link : l))
        : [...links, link];
    setLinks(next);
    setSheet(null);
    onCommit?.(next); // يحفظ في الداتابيز فوراً عشان يظهر في الصفحة العامة
  };

  const removeLink = (key) => {
    const index = links.findIndex((l) => l._key === key);
    if (index < 0) return;
    const removed = links[index];
    const next = links.filter((l) => l._key !== key);
    commit(next);
    setSheet(null);
    notify(`${removed.platform_name || "Link"} deleted`, "success", {
      label: "Undo",
      onClick: () => {
        const restored = [...next];
        restored.splice(Math.min(index, restored.length), 0, removed);
        commit(restored);
      },
    });
  };

  return (
    <div className="space-y-5 max-w-xl">
      {/* ---------- active links ---------- */}
      <CardShell
        title="Active all"
        right={
          <div className="flex items-center gap-3">
            {links.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  if (reorder) onCommit?.(links); // حفظ الترتيب الجديد
                  setReorder((v) => !v);
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors outline-none ${
                  reorder
                    ? "bg-[#101112] text-white"
                    : "bg-gray-100 text-gray-500 hover:text-[#101112]"
                }`}
              >
                {reorder ? "Done" : "Reorder"}
              </button>
            )}
            <Switch
              checked={allActive}
              onChange={setAll}
              label="Activate all links"
              disabled={links.length === 0}
            />
          </div>
        }
      >
        <div className="space-y-1" onDragLeave={() => setOverKey(null)}>
          {links.map((link, index) => {
            const on = link.active !== false;
            return (
              <div
                key={link._key}
                data-row
                onDragOver={(e) => {
                  if (reorder) {
                    e.preventDefault();
                    setOverKey(link._key);
                  }
                }}
                onDrop={(e) => {
                  if (reorder) {
                    e.preventDefault();
                    handleDrop(link._key);
                  }
                }}
                className={`rounded-xl ${overKey === link._key && dragKey !== link._key ? "bg-[#C8F331]/20" : ""}`}
              >
                <SwipeRow
                  disabled={reorder}
                  onEdit={() => openEdit(link)}
                  onDelete={() => removeLink(link._key)}
                >
                  <div className="flex items-center gap-3 px-2 py-2.5">
                    {reorder && (
                      <div
                        data-noswipe
                        className="flex items-center gap-0.5 text-gray-400 shrink-0"
                      >
                        <span
                          draggable
                          onDragStart={(e) => {
                            const row = e.currentTarget.closest("[data-row]");
                            if (row) e.dataTransfer.setDragImage(row, 20, 20);
                            e.dataTransfer.effectAllowed = "move";
                            setDragKey(link._key);
                          }}
                          onDragEnd={() => {
                            setDragKey(null);
                            setOverKey(null);
                          }}
                          title="Drag to reorder"
                          className="hidden sm:block cursor-grab active:cursor-grabbing p-1 hover:text-[#101112]"
                        >
                          <GripIcon />
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => move(index, index - 1)}
                            className="hover:text-[#101112] disabled:opacity-25 outline-none"
                          >
                            <Icon name="up" />
                          </button>
                          <button
                            type="button"
                            disabled={index === links.length - 1}
                            onClick={() => move(index, index + 1)}
                            className="hover:text-[#101112] disabled:opacity-25 outline-none"
                          >
                            <Icon name="down" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-3 flex-1 min-w-0 transition-opacity ${on ? "" : "opacity-40"}`}
                    >
                      <PlatformBadge link={link} />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-[#101112] truncate">
                          {link.platform_name || "Custom link"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {link.username || link.url || "No details yet"}
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={on}
                      onChange={(v) => setActive(link._key, v)}
                      label={`Show ${link.platform_name}`}
                    />
                  </div>
                </SwipeRow>
              </div>
            );
          })}

          {links.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm font-semibold">
                No links yet
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Add one below to get started.
              </p>
            </div>
          )}
        </div>
      </CardShell>

      {links.length > 0 && !reorder && (
        <p className="text-center text-[11px] text-gray-400 -mt-2">
          Swipe right to edit · Swipe left to delete
        </p>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setSheet({ type: "picker" })}
          className="bg-[#101112] text-white text-sm font-bold px-6 py-3.5 rounded-full hover:bg-gray-800 transition-colors outline-none"
        >
          Add new social link
        </button>
      </div>

      {/* ---------- recommended ---------- */}
      {recommended.length > 0 && (
        <CardShell title="Recommended for you">
          <div className="space-y-1">
            {recommended.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => openAdd(p)}
                className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left outline-none"
              >
                <PlatformBadge
                  link={{
                    bg_color: p.color,
                    icon_class: p.icon,
                    platform_name: p.name,
                  }}
                />
                <span className="flex-1 font-bold text-sm text-[#101112]">
                  {p.name}
                </span>
                <span className="w-9 h-9 rounded-full border-2 border-[#101112] flex items-center justify-center text-[#101112]">
                  <Icon name="plus" />
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSheet({ type: "picker" })}
            className="w-full mt-1 py-2.5 text-xs font-bold text-gray-500 hover:text-[#101112] transition-colors outline-none"
          >
            See all {PLATFORMS.length} platforms
          </button>
        </CardShell>
      )}

      {sheet?.type === "picker" && (
        <PickerSheet
          onPick={openAdd}
          onCustom={openCustom}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet?.type === "form" && (
        <LinkFormSheet
          key={sheet.link._key}
          mode={sheet.mode}
          initial={sheet.link}
          onSave={saveLink}
          onDelete={() => removeLink(sheet.link._key)}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  );
};

/* ---------- Security tab (change password) ---------- */
const SecurityTab = ({ notify, onSessionExpired }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const type = show ? "text" : "password";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword.length < 8)
      return setError("New password must be at least 8 characters.");
    if (form.newPassword !== form.confirm)
      return setError("New passwords don't match.");
    if (form.newPassword === form.currentPassword)
      return setError("New password must be different from the current one.");

    setBusy(true);
    try {
      const res = await authFetch("/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      if (res.ok) {
        setForm({ currentPassword: "", newPassword: "", confirm: "" });
        notify("Password updated");
      } else if (res.status === 401 || res.status === 403) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Current password is incorrect.");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Couldn't update the password.");
      }
    } catch {
      setError("Network error, please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <Panel
        title="Change password"
        description="You'll stay signed in on this device."
      >
        <div className="space-y-4 max-w-md">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-semibold border border-red-100">
              {error}
            </div>
          )}
          <Field label="Current password">
            <TextInput
              type={type}
              required
              autoComplete="current-password"
              placeholder="Enter your current password"
              value={form.currentPassword}
              onChange={set("currentPassword")}
            />
          </Field>
          <Field label="New password" hint="At least 8 characters.">
            <TextInput
              type={type}
              required
              autoComplete="new-password"
              placeholder="Enter a new password"
              value={form.newPassword}
              onChange={set("newPassword")}
            />
          </Field>
          <Field label="Confirm new password">
            <TextInput
              type={type}
              required
              autoComplete="new-password"
              placeholder="Re-enter the new password"
              value={form.confirm}
              onChange={set("confirm")}
            />
          </Field>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={show}
              onChange={(e) => setShow(e.target.checked)}
            />
            Show passwords
          </label>
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={busy}
              className="bg-[#101112] text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-60"
            >
              {busy ? "Updating..." : "Update password"}
            </button>
          </div>
        </div>
      </Panel>
    </form>
  );
};

/* ================================================================== */
/*  MAIN DASHBOARD                                                     */
/* ================================================================== */
const TABS = [
  {
    id: "profile",
    label: "Profile",
    icon: "user",
    desc: "Your name, photo and skills as they appear on your profile.",
  },
  {
    id: "actions",
    label: "Action links",
    icon: "bolt",
    desc: "Header icons and the call / WhatsApp buttons.",
  },
  {
    id: "links",
    label: "Links",
    icon: "link",
    desc: "Turn links on or off, swipe to edit or delete, and add new ones.",
  },
  {
    id: "nfc",
    label: "NFC",
    icon: "nfc",
    desc: "Tap your NFC card to see its link, or write a new link to it.",
  },
  {
    id: "security",
    label: "Security",
    icon: "lock",
    desc: "Update the password you use to sign in here.",
  },
];

const SideNav = ({ tabs, active, onChange, linkCount }) => (
  <nav className="hidden md:flex md:flex-col gap-1 w-56 shrink-0 sticky top-24 self-start bg-white border border-gray-200 rounded-2xl p-2">
    {tabs.map((t) => (
      <button
        key={t.id}
        type="button"
        onClick={() => onChange(t.id)}
        className={`flex items-center gap-3 whitespace-nowrap px-4 py-3 rounded-xl text-sm font-bold transition-all outline-none ${
          active === t.id
            ? "bg-[#101112] text-white"
            : "text-gray-500 hover:text-[#101112] hover:bg-gray-100"
        }`}
      >
        <Icon name={t.icon} />
        {t.label}
        {t.id === "links" && linkCount > 0 && (
          <span
            className={`ml-auto text-[10px] font-black rounded-full px-2 py-0.5 ${active === t.id ? "bg-[#C8F331] text-[#101112]" : "bg-gray-200 text-gray-500"}`}
          >
            {linkCount}
          </span>
        )}
      </button>
    ))}
  </nav>
);

const BottomNav = ({ tabs, active, onChange }) => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
    <div className="grid grid-cols-5">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-bold outline-none ${
            active === t.id ? "text-[#101112]" : "text-gray-400"
          }`}
        >
          <span
            className={`px-5 py-1 rounded-full transition-colors ${active === t.id ? "bg-[#C8F331]" : ""}`}
          >
            <Icon name={t.icon} className="w-5 h-5" />
          </span>
          {t.label}
        </button>
      ))}
    </div>
  </nav>
);

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("adminToken"),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [links, setLinks] = useState([]);
  const [savedSnapshot, setSavedSnapshot] = useState("");

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((text, type = "success", action = null) => {
    setToast({
      text,
      type,
      action: action && {
        label: action.label,
        onClick: () => {
          action.onClick();
          setToast(null);
        },
      },
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), action ? 5000 : 2600);
  }, []);

  const setField = (key) => (e) =>
    setProfile((p) => ({ ...p, [key]: e.target.value }));

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    authFetch("/profile/me")
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          logout();
          throw new Error("unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        const nextProfile = {
          ...EMPTY_PROFILE,
          ...Object.fromEntries(
            Object.keys(EMPTY_PROFILE).map((k) => [
              k,
              k === "skills" ? (data.skills || []).join(", ") : data[k] || "",
            ]),
          ),
        };
        const nextLinks = (data.socialLinks || []).map((l) => ({
          ...l,
          active: l.active !== false,
          _key: newKey(),
        }));
        setProfile(nextProfile);
        setLinks(nextLinks);
        setSavedSnapshot(makeSnapshot(nextProfile, nextLinks));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, logout]);

  const dirty = useMemo(
    () =>
      savedSnapshot !== "" && makeSnapshot(profile, links) !== savedSnapshot,
    [profile, links, savedSnapshot],
  );

  // تحذير لو حاول يقفل الصفحة وفيه تعديلات مش محفوظة
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const handleSave = (e) => {
    e.preventDefault();
    persist(links);
  };

  const persist = async (nextLinks) => {
    setSaving(true);

    // شيل الكروت الفاضية (اتضافت ومتملتش)
    const cleaned = nextLinks.filter(
      (l) => l.username?.trim() || l.url?.trim(),
    );

    const payload = {
      ...profile,
      slug: profile.slug.trim().toLowerCase(),
      skills: profile.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      socialLinks: stripKeys(cleaned),
    };

    try {
      const res = await authFetch("/profile", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        if (cleaned.length !== nextLinks.length) setLinks(cleaned);
        setSavedSnapshot(makeSnapshot(profile, cleaned));
        notify("Saved successfully");
      } else if (res.status === 401 || res.status === 403) {
        notify("Session expired. Please sign in again.", "error");
        logout();
      } else {
        const err = await res.json().catch(() => ({}));
        notify(err.message || "Server error", "error");
      }
    } catch (error) {
      notify(`Network error: ${error.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated)
    return <LoginScreen onSuccess={() => setIsAuthenticated(true)} />;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f5f7]">
        <div className="text-lg font-bold text-gray-600 animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const showSaveBar = activeTab !== "security" && activeTab !== "nfc";
  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans" dir="ltr">
      {/* top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={profile.avatar_url} name={profile.name} />
            <div className="min-w-0">
              <p className="font-extrabold text-[#101112] text-sm truncate">
                {profile.name || "Your profile"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {profile.role || "Dashboard"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {profile.slug && (
              <Link
                to={`/u/${profile.slug}`}
                className="flex items-center gap-2 text-xs font-bold text-[#101112] bg-[#C8F331] px-3.5 sm:px-4 py-2.5 rounded-full hover:bg-[#b8e321] transition-colors"
              >
                <Icon name="eye" />{" "}
                <span className="hidden sm:inline">View profile</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-red-500 px-3 py-2.5 rounded-full transition-colors"
              title="Logout"
            >
              <Icon name="logout" />{" "}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-28 md:pt-6 md:pb-8 flex flex-col md:flex-row gap-6">
        <SideNav
          tabs={TABS}
          active={activeTab}
          onChange={setActiveTab}
          linkCount={links.length}
        />

        {/* content */}
        <main className="flex-1 min-w-0">
          <PageHeader title={currentTab.label} description={currentTab.desc} />
          {activeTab === "security" ? (
            <SecurityTab notify={notify} />
          ) : activeTab === "nfc" ? (
            <NfcTab profile={profile} notify={notify} />
          ) : (
            <form onSubmit={handleSave}>
              {activeTab === "profile" && (
                <ProfileTab
                  profile={profile}
                  setField={setField}
                  notify={notify}
                />
              )}
              {activeTab === "actions" && (
                <ActionsTab profile={profile} setField={setField} />
              )}
              {activeTab === "links" && (
                <LinksTab
                  links={links}
                  setLinks={setLinks}
                  profile={profile}
                  notify={notify}
                  onCommit={persist}
                />
              )}

              {showSaveBar && (
                <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-4 mt-6 z-20">
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-3">
                    <p className="flex-1 text-xs font-semibold pl-2 text-gray-500">
                      {dirty ? (
                        <span className="text-amber-600">
                          ● You have unsaved changes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <Icon
                            name="check"
                            className="w-3.5 h-3.5 text-green-600"
                          />{" "}
                          All changes saved
                        </span>
                      )}
                    </p>
                    <button
                      type="submit"
                      disabled={saving || !dirty}
                      className="bg-[#C8F331] text-[#101112] font-black text-sm px-8 py-3 rounded-xl hover:bg-[#b8e321] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </main>
      </div>

      <BottomNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <Toast toast={toast} />
    </div>
  );
};

export default Dashboard;
