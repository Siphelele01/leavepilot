import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { ROLE_HOME, type Role } from "../types";
import { LOGO_PATH } from "../config";

const COPY: Record<Role, { title: string; subtitle: string; tagline: string }> = {
  employee: {
    title: "Employee",
    subtitle: "Enter your credentials to access your account",
    tagline: "HR Leave Management System",
  },
  manager: {
    title: "Manager",
    subtitle: "Sign in to review and approve your team's leave",
    tagline: "Manager / Supervisor Portal",
  },
  hr: {
    title: "HR Administrator",
    subtitle: "Sign in to manage employees, leave and payroll",
    tagline: "HR Administration Portal",
  },
};

export default function LoginPage({ role }: { role: Role }) {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const copy = COPY[role];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "dark");

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const user = await login(email, password, role);
      navigate(ROLE_HOME[user.role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <button type="button" className="theme-btn" onClick={toggleTheme} aria-label="Switch theme">
        {theme === "dark" ? "☀" : "☾"}
      </button>

      <div className="brand">
        {LOGO_PATH === "Logo" ? (
          <div className="logo-placeholder">Logo</div>
        ) : (
          <img src={LOGO_PATH} alt="LeavePilot" className="logo" />
        )}
        <p className="tagline">{copy.tagline}</p>
      </div>

      <form className="card" onSubmit={onSubmit}>
        <h1>{copy.title}</h1>
        <p className="muted">{copy.subtitle}</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="name@company.co.za"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <div className="password-wrap">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button type="button" className="show-btn" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <label className="check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>
            I agree to the <a href="#terms">Terms &amp; Conditions</a>
            <small>By signing in, you agree to our POPIA-compliant privacy policy</small>
          </span>
        </label>

        {error && <p className="error">{error}</p>}
        {notice && <p className="muted">{notice}</p>}

        <button type="submit" className="primary" disabled={!agreed || busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>

        <button
          type="button"
          className="link-btn"
          onClick={() => setNotice("Password reset is coming soon. Please contact your HR administrator.")}
        >
          Forgot your password?
        </button>
      </form>

      {/* Developer shortcuts: only shown with `npm run dev`, never in production */}
      {import.meta.env.DEV && role === "employee" && (
        <div className="dev-box">
          <strong>Developer shortcuts</strong>
          <span className="muted">Visible only while developing</span>
          <div className="dev-links">
            <Link href="/manager/login">Manager login</Link>
            <Link href="/hr/login">HR login</Link>
          </div>
          <small className="muted">
            employee@company.co.za / Employee@123<br />
            manager@company.co.za / Manager@123<br />
            hr@company.co.za / HR@12345
          </small>
        </div>
      )}

      <p className="footer-note">Secure HR management for South African businesses</p>
    </div>
  );
}