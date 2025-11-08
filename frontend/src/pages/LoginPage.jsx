import React, { useId, useState } from "react";
import Button from "react-bootstrap/Button";
import "../styles/LoginPage.css";
import appLogo from "../assets/logo.png";
import appbarIco from "../assets/appbarIco.png";

export default function LoginPage({ onSubmit, brand = "EternaCapital" }) {
    const emailId = useId();
    const passId = useId();
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
        if (!pwd || pwd.length < 6) e.pwd = "Min 6 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        onSubmit?.({ email, password: pwd });
        // demo:
        // alert(JSON.stringify({ email, password: pwd }, null, 2));
    };

    return (
        <main className="lp-grid">
            {/* Left brand panel */}
            <section className="lp-brand">
                <div className="lp-brand-badge">
                    <img src={appLogo} alt="EternaCapital logo" className="ec-logo-img" />
                    <span className="lp-brand-text">{brand}</span>
                </div>
                <img src={appbarIco} alt="EternaCapital application bar-logo" className="ec-app-bar-logo-img" />
            </section>
            {/* Right auth card */}
            <section className="lp-auth">
                <form className="lp-card" onSubmit={handleSubmit} noValidate>
                    <h1 className="lp-title">Login</h1>

                    <label className="lp-label" htmlFor={emailId}>Email</label>
                    <div className={`lp-control ${errors.email ? "invalid" : ""}`}>
                        <input
                            id={emailId}
                            type="email"
                            placeholder="username@gmail.com"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {errors.email && <p className="lp-error">{errors.email}</p>}

                    <label className="lp-label" htmlFor={passId}>Password</label>
                    <div className={`lp-control ${errors.pwd ? "invalid" : ""}`}>
                        <input
                            id={passId}
                            type={showPwd ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="current-password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            minLength={6}
                        />
                        <button
                            type="button"
                            aria-label={showPwd ? "Hide password" : "Show password"}
                            className="lp-eye"
                            onClick={() => setShowPwd((v) => !v)}
                        >
                            {/* simple eye icon */}
                            <svg viewBox="0 0 24 24">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                    </div>
                    {errors.pwd && <p className="lp-error">{errors.pwd}</p>}

                    <div className="lp-helper">
                        <label className="lp-remember">
                            <input type="checkbox" /> Remember me
                        </label>
                        <a className="lp-link" href="#">Forgot password?</a>
                    </div>

                    <Button type="submit" className="lp-btn">Sign in</Button>
                </form>
            </section>
        </main>
    );
}