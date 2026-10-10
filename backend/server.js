require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const { MONGO_URI, SECRET_KEY } = process.env;
if (!MONGO_URI || !SECRET_KEY) {
  console.error("❌ Missing MONGO_URI or SECRET_KEY in your .env file");
  process.exit(1);
}

const socialLinkSchema = new mongoose.Schema(
  {
    platform_name: String,
    username: String,
    url: String,
    bg_color: String,
    icon_class: String,
    image_url: String,
    active: { type: Boolean, default: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    bio: { type: String, default: "" },
    avatar_url: { type: String, default: "" },
    connected_count: { type: String, default: "" },
    skills: { type: [String], default: [] },
    headerLeftLink: { type: String, default: "" },
    headerRightLink: { type: String, default: "" },
    navPhone: { type: String, default: "" },
    navWhatsapp: { type: String, default: "" },
    socialLinks: { type: [socialLinkSchema], default: [] },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);

const LegacyProfile = mongoose.model(
  "Profile",
  new mongoose.Schema({}, { strict: false }),
);

const RESERVED_SLUGS = ["dashboard", "signup", "login", "admin", "api", "u"];
const SLUG_RE = /^[a-z0-9_-]{3,30}$/;

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 24) || "user";

async function uniqueSlug(name) {
  const base = slugify(name);
  let slug = base;
  while (
    slug.length < 3 ||
    RESERVED_SLUGS.includes(slug) ||
    (await User.exists({ slug }))
  ) {
    slug = `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  return slug;
}

const signToken = (user) =>
  jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "24h" });

const toProfile = (user) => {
  const { password, email, __v, ...profile } = user.toObject();
  return profile;
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Too many attempts, please try again later." },
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err || !payload.id) {
      return res.status(403).json({ message: "Invalid or Expired Token" });
    }
    req.userId = payload.id;
    next();
  });
};

app.post("/api/register", authLimiter, async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (name.length < 2)
      return res.status(400).json({ message: "Please enter your name." });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: "Invalid email address." });
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    if (await User.exists({ email }))
      return res.status(409).json({ message: "Email already registered." });

    const user = await User.create({
      email,
      name,
      password: await bcrypt.hash(password, 10),
      slug: await uniqueSlug(name),
    });

    res.status(201).json({ token: signToken(user), slug: user.slug });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/login", authLimiter, async (req, res) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const password = req.body.password ? req.body.password.trim() : "";

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: signToken(user) });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/change-password", authenticateToken, async (req, res) => {
  try {
    const currentPassword = (req.body.currentPassword || "").trim();
    const newPassword = (req.body.newPassword || "").trim();

    const user = await User.findById(req.userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    console.error("Change Password Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/profile/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: "Account not found" });
    res.json(toProfile(user));
  } catch (err) {
    console.error("GET me Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/profile", authenticateToken, async (req, res) => {
  try {
    const {
      name,
      role,
      bio,
      avatar_url,
      connected_count,
      skills,
      headerLeftLink,
      headerRightLink,
      navPhone,
      navWhatsapp,
      socialLinks,
      slug,
    } = req.body;

    const update = {
      name,
      role,
      bio,
      avatar_url,
      connected_count: String(connected_count ?? ""),
      skills: Array.isArray(skills) ? skills : [],
      headerLeftLink,
      headerRightLink,
      navPhone,
      navWhatsapp,
      socialLinks: Array.isArray(socialLinks) ? socialLinks : [],
    };

    if (slug) {
      const clean = String(slug).trim().toLowerCase();
      if (!SLUG_RE.test(clean) || RESERVED_SLUGS.includes(clean)) {
        return res.status(400).json({
          message: "Page address must be 3-30 letters, numbers, - or _.",
        });
      }
      if (await User.exists({ slug: clean, _id: { $ne: req.userId } })) {
        return res
          .status(409)
          .json({ message: "This page address is already taken." });
      }
      update.slug = clean;
    }

    const user = await User.findByIdAndUpdate(req.userId, update, {
      new: true,
    });
    if (!user) return res.status(401).json({ message: "Account not found" });
    res.json(toProfile(user));
  } catch (err) {
    console.error("POST Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/profile/:slug", async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug.toLowerCase() });
    if (!user) return res.status(404).json({ message: "Profile not found" });

    const profile = toProfile(user);
    profile.socialLinks = (profile.socialLinks || []).filter(
      (l) => l.active !== false,
    );
    res.json(profile);
  } catch (err) {
    console.error("GET slug Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const user = await User.findOne().sort({ createdAt: 1 });
    if (!user) {
      return res.json({
        name: "Ammar Ahmed",
        role: "Full-Stack Developer",
        bio: "Web Developer @ Sphinx | Computers",
        avatar_url: "",
        connected_count: "0",
        skills: ["React", "Node.js", "PHP"],
        headerLeftLink: "",
        headerRightLink: "",
        navPhone: "",
        navWhatsapp: "",
        socialLinks: [],
      });
    }
    const profile = toProfile(user);
    profile.socialLinks = (profile.socialLinks || []).filter(
      (l) => l.active !== false,
    );
    res.json(profile);
  } catch (err) {
    console.error("GET Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

async function migrateLegacyProfile() {
  if (await User.estimatedDocumentCount()) return;

  const legacy = await LegacyProfile.findOne().lean();
  if (!legacy) return;

  const password = (process.env.ADMIN_PASSWORD || "").trim();
  if (password.length < 8) {
    console.warn(
      "⚠️ Legacy profile found, but ADMIN_PASSWORD is missing or too short.",
    );
    return;
  }

  const { _id, __v, ...data } = legacy;
  await User.create({
    ...data,
    email: (process.env.ADMIN_EMAIL || "ammar@profile.com")
      .trim()
      .toLowerCase(),
    password: await bcrypt.hash(password, 10),
    slug: await uniqueSlug(data.name || "ammar"),
  });
  console.log("✅ Old profile migrated to an account.");
}

const PORT = 5001;

async function startServer() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    await migrateLegacyProfile();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:");
    console.error(err.message);
    console.log("\n🔧 الحل:");
    console.log("1. روح على MongoDB Atlas → Network Access");
    console.log(
      "2. اضغط Add IP Address → Allow Access from Anywhere (0.0.0.0/0)",
    );
    console.log("3. تأكد إن الباسورد صحيح في الـ Connection String");
    process.exit(1);
  }
}

startServer();
