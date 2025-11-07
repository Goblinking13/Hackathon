// Sidebar.jsx
import { useMemo } from "react";
import "./App.css";

export default function Sidebar({ active = "assistant", onNavigate = () => {} }) {
    const items = useMemo(
        () => [
            { key: "profile",    label: "Profile",    icon: "user" },
            { key: "prediction", label: "Prediction", icon: "bars" },
            { key: "settings",   label: "Settings",   icon: "sliders" },
            { key: "assistant",  label: "AI Chat Assistant", icon: "chat", prominent: true },
        ],
        []
    );

    return (
        <aside className="ec-sidebar">
            {/* Logo */}
            <div className="ec-logo">
                <div className="ec-logo-mark" aria-hidden>
                    {/* simple bot glyph */}
                    <svg viewBox="0 0 24 24" width="22" height="22" role="img">
                        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                        <rect x="6" y="9" width="12" height="8" rx="3" fill="currentColor" />
                        <circle cx="9.5" cy="13" r="1.2" fill="#fff" />
                        <circle cx="14.5" cy="13" r="1.2" fill="#fff" />
                        <rect x="11.2" y="5" width="1.6" height="3" rx="0.8" fill="currentColor" />
                    </svg>
                </div>
                <span className="ec-logo-text">EternaCapital</span>
            </div>

            {/* Nav */}
            <nav className="ec-nav">
                {items.map((it) => (
                    <button
                        key={it.key}
                        type="button"
                        className={
                            "ec-nav-item" +
                            (it.prominent ? " ec-nav-item--prominent" : "") +
                            (active === it.key ? " is-active" : "")
                        }
                        onClick={() => onNavigate(it.key)}
                    >
            <span className="ec-icon" aria-hidden>
              {it.icon === "user" && (
                  <svg viewBox="0 0 24 24">
                      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
                      <path d="M3 20a9 9 0 0 1 18 0" />
                  </svg>
              )}
                {it.icon === "bars" && (
                    <svg viewBox="0 0 24 24">
                        <rect x="4" y="10" width="3" height="10" rx="1" />
                        <rect x="10.5" y="6" width="3" height="14" rx="1" />
                        <rect x="17" y="3" width="3" height="17" rx="1" />
                    </svg>
                )}
                {it.icon === "sliders" && (
                    <svg viewBox="0 0 24 24">
                        <circle cx="8" cy="8" r="2.2" />
                        <path d="M8 3v2M8 11v10M16 6v-3M16 11v10" />
                        <circle cx="16" cy="11" r="2.2" />
                    </svg>
                )}
                {it.icon === "chat" && (
                    <svg viewBox="0 0 24 24">
                        <path d="M4 5h16v10a3 3 0 0 1-3 3H9l-5 3V5Z" />
                    </svg>
                )}
            </span>
                        <span className="ec-label">{it.label}</span>
                    </button>
                ))}
            </nav>

            {/* Divider + Logout */}
            <div className="ec-divider" />
            <button type="button" className="ec-logout">
                <span>Log out</span>
                <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M8 12h9" />
                    <path d="M13 7l4 5-4 5" />
                    <path d="M5 4v16" opacity=".45" />
                </svg>
            </button>
        </aside>
    );
}
