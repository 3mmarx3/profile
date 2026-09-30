import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    bio: "",
    avatar_url: "",
    connected_count: "",
    skills: "",
    headerLeftLink: "",
    headerRightLink: "",
    navPhone: "",
    navWhatsapp: "",
  });

  const [socialLinks, setSocialLinks] = useState([]);

  // أول ما الصفحة تفتح، بنشوف لو الأدمن مسجل دخوله قبل كده
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("http://localhost:5001/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          name: data.name || "",
          role: data.role || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
          connected_count: data.connected_count || "",
          skills: data.skills ? data.skills.join(", ") : "",
          headerLeftLink: data.headerLeftLink || "",
          headerRightLink: data.headerRightLink || "",
          navPhone: data.navPhone || "",
          navWhatsapp: data.navWhatsapp || "",
        });
        setSocialLinks(data.socialLinks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token); // حفظ المفتاح في المتصفح
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      setLoginError("Server error, please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // مسح المفتاح
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  const addSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      {
        platform_name: "",
        username: "",
        url: "",
        bg_color: "#101112",
        icon_class: "",
        image_url: "",
      },
    ]);
  };

  const removeSocialLink = (index) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
  };

  const handleSocialChange = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("adminToken"); // بنجيب المفتاح

    const payload = {
      ...profile,
      skills: profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((s) => s),
      socialLinks: socialLinks,
    };

    try {
      const response = await fetch("http://localhost:5001/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // بنبعت المفتاح للسيرفر عشان يوافق
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Data saved successfully!");
      } else if (response.status === 401 || response.status === 403) {
        alert("❌ Session expired. Please login again.");
        handleLogout();
      } else {
        alert("❌ Error saving data.");
      }
    } catch (error) {
      alert("❌ Server is not responding.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-[#f4f5f7] flex flex-col justify-center items-center p-4 font-sans select-none"
        dir="ltr"
      >
        <div className="max-w-md w-full bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 sm:p-10 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#101112] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-black text-[#101112] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-semibold text-center border border-red-100">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="ammar@profile.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#C8F331] text-[#101112] font-black text-lg py-4 rounded-2xl hover:bg-[#b8e321] transition-all mt-4 shadow-sm"
            >
              Login to Dashboard
            </button>
            <div className="text-center mt-6">
              <Link
                to="/"
                className="text-sm font-bold text-gray-400 hover:text-[#101112] transition-colors"
              >
                &larr; Back to Live Profile
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f5f7]">
        <div className="text-lg font-bold text-gray-600 animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen bg-[#f4f5f7] py-10 px-4 sm:px-6 font-sans select-none"
      dir="ltr"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[80vh]">
        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#101112] tracking-tight">
              Dashboard
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors px-3 py-1"
              >
                Logout
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
              >
                &larr; Live Profile
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === "profile" ? "bg-white text-[#101112] shadow-sm" : "text-gray-400 hover:text-[#101112] hover:bg-gray-100"}`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab("actions")}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === "actions" ? "bg-white text-[#101112] shadow-sm" : "text-gray-400 hover:text-[#101112] hover:bg-gray-100"}`}
            >
              Action Links
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === "social" ? "bg-white text-[#101112] shadow-sm" : "text-gray-400 hover:text-[#101112] hover:bg-gray-100"}`}
            >
              Social Media
            </button>
          </div>

          <form onSubmit={handleSave} className="flex-1 flex flex-col">
            <div className="flex-1 mb-8">
              {activeTab === "profile" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ammar Ahmed"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                        Role Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Developer"
                        value={profile.role}
                        onChange={(e) =>
                          setProfile({ ...profile, role: e.target.value })
                        }
                        className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                      Bio / Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Web Developer @ Sphinx | Computers"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                        Avatar Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={profile.avatar_url}
                        onChange={(e) =>
                          setProfile({ ...profile, avatar_url: e.target.value })
                        }
                        className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                        Connected Count
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={profile.connected_count}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            connected_count: e.target.value,
                          })
                        }
                        className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                      Skills (comma separated)
                    </label>
                    <textarea
                      placeholder="React, Node.js, PHP"
                      value={profile.skills}
                      onChange={(e) =>
                        setProfile({ ...profile, skills: e.target.value })
                      }
                      rows="3"
                      className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === "actions" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-5">
                    <h3 className="font-bold text-[#101112] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Top Header Icons
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                          Left Icon Link (Eye)
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={profile.headerLeftLink}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              headerLeftLink: e.target.value,
                            })
                          }
                          className="w-full p-3.5 bg-white rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                          Right Icon Link (Send)
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={profile.headerRightLink}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              headerRightLink: e.target.value,
                            })
                          }
                          className="w-full p-3.5 bg-white rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-green-50/50 border border-green-100 rounded-2xl space-y-5">
                    <h3 className="font-bold text-[#101112] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Bottom Swipe Bar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                          Phone Number (Call)
                        </label>
                        <input
                          type="text"
                          placeholder="+201070479599"
                          value={profile.navPhone}
                          onChange={(e) =>
                            setProfile({ ...profile, navPhone: e.target.value })
                          }
                          className="w-full p-3.5 bg-white rounded-xl border border-gray-200 outline-none focus:border-green-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="text"
                          placeholder="201070479599"
                          value={profile.navWhatsapp}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              navWhatsapp: e.target.value,
                            })
                          }
                          className="w-full p-3.5 bg-white rounded-xl border border-gray-200 outline-none focus:border-green-500 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="bg-[#101112] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                      Add New Link
                    </button>
                  </div>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 pb-4">
                    {socialLinks.map((link, index) => (
                      <div
                        key={index}
                        className="group bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden transition-all hover:border-blue-200"
                      >
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="absolute top-4 right-4 text-red-500 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              Platform Name
                            </label>
                            <input
                              type="text"
                              placeholder="Facebook"
                              value={link.platform_name}
                              onChange={(e) =>
                                handleSocialChange(
                                  index,
                                  "platform_name",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              Username
                            </label>
                            <input
                              type="text"
                              placeholder="username"
                              value={link.username}
                              onChange={(e) =>
                                handleSocialChange(
                                  index,
                                  "username",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              Page URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://..."
                              value={link.url}
                              onChange={(e) =>
                                handleSocialChange(index, "url", e.target.value)
                              }
                              className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              Background Color
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={link.bg_color || "#101112"}
                                onChange={(e) =>
                                  handleSocialChange(
                                    index,
                                    "bg_color",
                                    e.target.value,
                                  )
                                }
                                className="w-10 h-10 p-1 rounded-lg border border-gray-200 cursor-pointer bg-gray-50"
                              />
                              <input
                                type="text"
                                placeholder="#1877F2"
                                value={link.bg_color}
                                onChange={(e) =>
                                  handleSocialChange(
                                    index,
                                    "bg_color",
                                    e.target.value,
                                  )
                                }
                                className="flex-1 p-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm uppercase"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              FontAwesome Class
                            </label>
                            <input
                              type="text"
                              placeholder="fa-brands fa-facebook"
                              value={link.icon_class}
                              onChange={(e) =>
                                handleSocialChange(
                                  index,
                                  "icon_class",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              Image/SVG URL
                            </label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={link.image_url}
                              onChange={(e) =>
                                handleSocialChange(
                                  index,
                                  "image_url",
                                  e.target.value,
                                )
                              }
                              className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {socialLinks.length === 0 && (
                      <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300 shadow-sm">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            ></path>
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm font-semibold">
                          No social links added yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-auto border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#C8F331] text-[#101112] font-black text-lg py-4 rounded-2xl hover:bg-[#b8e321] transition-all flex justify-center items-center gap-3 disabled:opacity-70 shadow-sm"
              >
                {saving ? "Saving Changes..." : "Save to Database"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
