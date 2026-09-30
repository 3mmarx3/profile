const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI =
  "mongodb+srv://ammar132804_db_user:AmmarDev2026@cluster0.tuu7egn.mongodb.net/profileDB?retryWrites=true&w=majority&appName=Cluster0";
const SECRET_KEY = "Ammar_Super_Secret_Key_2026"; // ده مفتاح التشفير الخاص بيك

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const profileSchema = new mongoose.Schema({
  name: String,
  role: String,
  bio: String,
  avatar_url: String,
  connected_count: String,
  skills: [String],
  headerLeftLink: String,
  headerRightLink: String,
  navPhone: String,
  navWhatsapp: String,
  socialLinks: [
    {
      platform_name: String,
      username: String,
      bg_color: String,
      icon_class: String,
      image_url: String,
      url: String,
    },
  ],
});

const Profile = mongoose.model("Profile", profileSchema);

// 1. مسار تسجيل الدخول (السيرفر بيتأكد من البيانات ويبعت التوكن)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // البيانات دي متأمنة جوه السيرفر ومحدش يقدر يشوفها في المتصفح
  if (email === "ammar@profile.com" && password === "AmmarDev2026") {
    // لو صح، السيرفر بيعمل مفتاح (Token) صالح لمدة 24 ساعة
    const token = jwt.sign({ role: "admin" }, SECRET_KEY, { expiresIn: "24h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// 2. حارس الأمان (Middleware) بيتأكد إن الشخص معاه التوكن قبل ما يعدل
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or Expired Token" });
    req.user = user;
    next();
  });
};

// مسار جلب البيانات (مفتوح للكل عشان الموقع يشتغل)
app.get("/api/profile", async (req, res) => {
  try {
    let profileData = await Profile.findOne();
    if (!profileData) {
      profileData = {
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
      };
    }
    res.json(profileData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// مسار حفظ البيانات (محمي بـ authenticateToken)
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
    } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      {
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
      },
      { new: true, upsert: true },
    );
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
