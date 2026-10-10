/**
 * Multi-user backend example (Express + MongoDB/Mongoose).
 * Adapt it to your existing server — you already have /login and /profile,
 * so merge these routes into them instead of running a second server.
 *
 *   npm i express cors mongoose bcryptjs jsonwebtoken
 */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // avatars / icons are sent as base64

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/profiles");

/* ------------------------------ models ------------------------------ */
const socialLinkSchema = new mongoose.Schema(
  {
    platform_name: String,
    username: String,
    url: String,
    bg_color: String,
    icon_class: String,
    image_url: String,
    active: { type: Boolean, default: true }, // the on/off switch in the dashboard
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash
    slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
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

/* ------------------------------ helpers ----------------------------- */
const RESERVED = ["dashboard", "signup", "login", "admin", "api", "u"];
const SLUG_RE = /^[a-z0-9_-]{3,30}$/;

const slugify = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "").slice(0, 24) || "user";

async function uniqueSlug(name) {
  const base = slugify(name);
  let slug = base;
  while (slug.length < 3 || RESERVED.includes(slug) || (await User.exists({ slug }))) {
    slug = `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  return slug;
}

const signToken = (user) => jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });

const auth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    req.userId = jwt.verify(token, JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const toProfile = (user) => {
  const { password, email, __v, ...rest } = user.toObject();
  return rest;
};

/* ------------------------------ routes ------------------------------ */

// Create account  ->  { token, slug }
app.post("/api/register", async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (name.length < 2) return res.status(400).json({ message: "Name is too short." });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Invalid email." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    if (await User.exists({ email })) return res.status(409).json({ message: "Email already registered." });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      slug: await uniqueSlug(name),
    });
    res.status(201).json({ token: signToken(user), slug: user.slug });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login  ->  { token }
app.post("/api/login", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ token: signToken(user) });
});

// The logged-in user's own profile (used by the dashboard)
app.get("/api/profile/me", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  res.json(toProfile(user));
});

// Save the logged-in user's profile
app.post("/api/profile", auth, async (req, res) => {
  try {
    const b = req.body;
    const update = {
      name: b.name, role: b.role, bio: b.bio, avatar_url: b.avatar_url,
      connected_count: String(b.connected_count ?? ""),
      skills: Array.isArray(b.skills) ? b.skills : [],
      headerLeftLink: b.headerLeftLink, headerRightLink: b.headerRightLink,
      navPhone: b.navPhone, navWhatsapp: b.navWhatsapp,
      socialLinks: Array.isArray(b.socialLinks) ? b.socialLinks : [],
    };

    if (b.slug) {
      const slug = String(b.slug).toLowerCase().trim();
      if (!SLUG_RE.test(slug) || RESERVED.includes(slug)) {
        return res.status(400).json({ message: "Page address must be 3-30 letters, numbers, - or _." });
      }
      if (await User.exists({ slug, _id: { $ne: req.userId } })) {
        return res.status(409).json({ message: "This page address is already taken." });
      }
      update.slug = slug;
    }

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true });
    res.json(toProfile(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password
app.post("/api/change-password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.userId);
  if (!user || !(await bcrypt.compare(currentPassword || "", user.password))) {
    return res.status(401).json({ message: "Current password is incorrect." });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ ok: true });
});

// PUBLIC profile page data  ->  /u/:slug on the frontend
app.get("/api/profile/:slug", async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug.toLowerCase() });
  if (!user) return res.status(404).json({ message: "Profile not found" });
  const profile = toProfile(user);
  profile.socialLinks = (profile.socialLinks || []).filter((l) => l.active !== false); // hide switched-off links
  res.json(profile);
});

app.listen(5001, () => console.log("API running on http://localhost:5001"));
