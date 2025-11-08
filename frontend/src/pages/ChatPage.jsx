import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import "../styles/ChatPage.css";
import aiAvatar from "../assets/ai-avatar.png";
import { FaArrowUp } from "react-icons/fa";

const SEND_URL = "http://localhost:8080/send/prompt";

function uid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── ChatPage ───────────────────────────────────────────────────────────────────
export default function ChatPage({ sessionId, onAssistantReply }) {
    const [messages, setMessages] = useState([
        { id: uid(), role: "assistant", content: "👋 Hi there! I'm your AI financial assistant - ready to help you manage your money smarter.\n" },
    ]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const listRef = useRef(null);
    const textareaRef = useRef(null);

    // автопрокрутка
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, isSending]);

    // авто-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }, [input]);

    const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

    // ─── отправка сообщения ─────────────────────────────────────────────────────
    const sendMessage = async () => {
        const prompt = input.trim();
        if (!prompt) return;
        setInput("");

        const userMsg = { id: uid(), role: "user", content: prompt };
        setMessages((prev) => [...prev, userMsg]);
        setIsSending(true);

        try {
            const res = await fetch(SEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, prompt }),
            });
            if (!res.ok) throw new Error("Server error");
            const data = await res.text();

            const asstMsg = { id: uid(), role: "assistant", content: data || "…(empty answer)" };
            setMessages((prev) => [...prev, asstMsg]);
            onAssistantReply?.(data);
        } catch (e) {
            setMessages((prev) => [
                ...prev,
                { id: uid(), role: "assistant", content: "Error: Unable to contact the server." },
            ]);
            console.error(e);
        } finally {
            setIsSending(false);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (canSend) sendMessage();
        }
    };

    return (
        <div className="ec-chat-root">
            <div className="ec-chat-header">
                <div className="ec-chat-title">AI Chat Assistant</div>
            </div>

            <div className="ec-chat-list" ref={listRef}>
                {
                    messages.map((m) => <Bubble key={m.id} role={m.role} text={m.content} />)}

                {isSending && <Bubble role="assistant" text="Thinking…" subtle />}
            </div>

            <div className="ec-chat-input">
        <textarea
            ref={textareaRef}
            className="ec-input-area"
            placeholder="Ask anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
        />
                <Button
                    className="ec-send-btn"
                    onClick={sendMessage}
                    disabled={!canSend}
                    title="Send message"
                >
                    <FaArrowUp size={18} />
                </Button>
            </div>
        </div>
    );
}

// ─── UI: сообщение/аватар/картинки ────────────────────────────────────────────
function Bubble({ role, text, subtle }) {
    const isUser = role === "user";
    const imgUrls = extractImageUrls(text);
    const cleanedText = text.replace(/https?:\/\/[^\s)]+/g, "").trim();

    return (
        <div className={`ec-bubble-row ${isUser ? "right" : "left"}`}>
            {!isUser && (
                <div className="ec-avatar">
                    <img src={aiAvatar} alt="AI Avatar" className="ec-avatar-img" />
                </div>
            )}

            <div className={`ec-bubble ${isUser ? "user" : "asst"} ${subtle ? "subtle" : ""}`}>
                {cleanedText && <div className="ec-text">{cleanedText}</div>}
                {imgUrls.map((url, i) => (
                    <ChatImage key={i} descriptor={{ type: "url", src: url, alt: "image" }} />
                ))}
            </div>
        </div>
    );
}

function extractImageUrls(text) {
    if (!text) return [];
    const regex = /(https?:\/\/[^\s)]+?\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s)]*)?)/gi;
    return [...text.matchAll(regex)].map((m) => m[1]);
}

function ChatImage({ descriptor }) {
    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(descriptor.type === "server");
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        let objectUrl = null;

        async function load() {
            if (descriptor.type === "url") {
                setSrc(descriptor.src);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await fetch(new URL(descriptor.path, "http://localhost:8080/"), {
                    method: "GET",
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const blob = await res.blob();
                objectUrl = URL.createObjectURL(blob);
                if (!cancelled) setSrc(objectUrl);
            } catch (e) {
                if (!cancelled) setError(e?.message || "Load error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [descriptor]);

    if (loading) return <div className="ec-img-skeleton" aria-label="Loading image…" />;
    if (error) return <div className="ec-img-error">Failed to load image</div>;

    return (
        <a href={src} target="_blank" rel="noreferrer" className="ec-img-link">
            <img
                src={src}
                alt={descriptor.alt || "image"}
                className="ec-img"
                style={{
                    maxWidth: "300px",
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                    display: "block",
                    marginTop: "6px"
                }}
            />
            {/*<img src={src} alt={descriptor.alt || "image"} className="ec-img" />*/}
        </a>
    );
}
