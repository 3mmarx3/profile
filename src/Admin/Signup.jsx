import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:5001/api";

const INPUT =
  "w-full px-3.5 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#101112] focus:bg-white transition-all text-base sm:text-sm";

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-[13px] font-semibold text-gray-700 mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-gray-400 mt-1.5">{hint}</span>}
  </label>
);

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (name.length < 2) return setError("Please enter your name.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    setBusy(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        navigate("/dashboard");
      } else if (res.status === 409) {
        setError("This email already has an account. Try signing in instead.");
      } else {
        setError(data.message || "Couldn't create the account. Please try again.");
      }
    } catch {
      setError("Server error, please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4 font-sans" dir="ltr">
      <div className="max-w-md w-full bg-white rounded-[32px] border border-gray-200 p-7 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#101112] text-[#C8F331] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#101112] tracking-tight">Create your account</h1>
          <p className="text-sm text-gray-500 mt-2">Get your own profile page in a minute</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-semibold text-center border border-red-100">
              {error}
            </div>
          )}

          <Field label="Name">
            <input
              type="text"
              required
              autoComplete="name"
              placeholder="e.g. Ammar Ahmed"
              value={form.name}
              onChange={set("name")}
              className={INPUT}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              className={INPUT}
            />
          </Field>

          <Field label="Password" hint="At least 8 characters.">
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={set("password")}
              className={INPUT}
            />
          </Field>

          <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
            Show password
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#C8F331] text-[#101112] font-black text-base py-4 rounded-2xl hover:bg-[#b8e321] transition-all disabled:opacity-70 outline-none"
          >
            {busy ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/dashboard" className="font-bold text-[#101112] underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
