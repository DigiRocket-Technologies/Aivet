"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { authApi, projectsApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth     = useAuthStore((s) => s.setAuth);
  const setProjects = useAuthStore((s) => s.setProjects);

  const [showPass, setShowPass] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [busy,     setBusy]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }

    setBusy(true);
    try {
      const res = await authApi.register(email.trim().toLowerCase(), password, fullName.trim());
      setAuth(res.token, { id: res.userId, email: res.email, fullName: res.fullName });

      try {
        setProjects(await projectsApi.list());
      } catch {
        setProjects([]);
      }

      router.replace("/overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed.");
      setBusy(false);
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0E0F11" }}
    >
      <div className="w-full max-w-[400px] space-y-6">

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "#C9F31D" }}>
            <Bot size={22} color="#000" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-[22px] font-bold text-white">Create your account</h1>
            <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              Start tracking your AI visibility
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div
              className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[12px]"
              style={{
                background: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.30)",
                color: "#FCA5A5",
              }}
              role="alert"
            >
              <AlertCircle size={14} className="mt-px flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-[11px] font-medium mb-1.5"
              style={{ color: "rgba(255,255,255,0.55)" }}>
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Cooper"
              className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none placeholder:text-[rgba(255,255,255,0.25)]"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[11px] font-medium mb-1.5"
              style={{ color: "rgba(255,255,255,0.55)" }}>
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none placeholder:text-[rgba(255,255,255,0.25)]"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-medium mb-1.5"
              style={{ color: "rgba(255,255,255,0.55)" }}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2.5 pr-10 rounded-xl text-[13px] outline-none placeholder:text-[rgba(255,255,255,0.25)]"
                style={inputStyle}
              />
              <button
                type="button"
                aria-label={showPass ? "Hide password" : "Show password"}
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPass
                  ? <EyeOff size={14} style={{ color: "rgba(255,255,255,0.40)" }} />
                  : <Eye size={14} style={{ color: "rgba(255,255,255,0.40)" }} />
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold btn-lime disabled:opacity-60"
          >
            {busy
              ? <><Loader2 size={14} className="animate-spin" /> Creating account…</>
              : <>Create account <ArrowRight size={14} /></>
            }
          </button>
        </form>

        <p className="text-center text-[12px]" style={{ color: "rgba(255,255,255,0.40)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#C9F31D" }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
