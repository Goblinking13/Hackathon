import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import "../styles/ChatPage.css";
import aiAvatar from "../assets/ai-avatar.png"
import { FaArrowUp } from "react-icons/fa";

function uid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatPage({ sessionId, onAssistantReply }) {
    const [messages, setMessages] = useState([
        { id: uid(), role: "assistant", content: "👋 Hi there! I'm your AI financial assistant - ready to help you manage your money smarter.\n" },
    ]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const listRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isSending]);

    const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

    // 🔹 автоматическое изменение высоты поля
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto"; // сбрасываем
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"; // ограничим макс. высотой
    }, [input]);

    const sendMessage = async () => {
        const prompt = input.trim();
        if (!prompt) return;
        setInput("");

        const userMsg = { id: uid(), role: "user", content: prompt };
        setMessages((prev) => [...prev, userMsg]);
        setIsSending(true);

        try {
            const res = await fetch("http://localhost:8080/send/prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, prompt }),
            });
            if (!res.ok) throw new Error("Server error");
            const data = await res.text();

            const asstMsg = { id: uid(), role: "assistant", content: data || "…(empty answer)" };
            setMessages((prev) => [...prev, asstMsg]);
            if (onAssistantReply) onAssistantReply(data);
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
                {messages.map((m) => (
                    <Bubble key={m.id} role={m.role} text={m.content} />
                ))}
                {isSending && <Bubble role="assistant" text="Thinking.." subtle />}
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

function Bubble({ role, text, subtle }) {
    const isUser = role === "user";
    const assistantAvatar = aiAvatar;
    return (
        <div className={`ec-bubble-row ${isUser ? "right" : "left"}`}>
            {!isUser && (
                <div className="ec-avatar">
                    <img src={assistantAvatar} alt="AI Avatar" className="ec-avatar-img" />
                </div>
            )}
            <div className={`ec-bubble ${isUser ? "user" : "asst"} ${subtle ? "subtle" : ""}`}>
                {text}
            </div>
        </div>
    );
}

function parseImageFromText(text) {
    if (!text) return null;

    // markdown ![alt](url)
    const md = text.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/i);
    if (md) return { type: "url", src: md[1], alt: "image" };

    // прямой http(s) URL на картинку
    if (/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(text)) {
        return { type: "url", src: text, alt: "image" };
    }

    // серверный роут типа: image/generate/cat
    if (/^image\//i.test(text)) {
        return { type: "server", path: text.replace(/^\/+/, "") };
    }

    return null;
}

function ChatImage({ descriptor }) {
    const [src, setSrc] = React.useState(null);
    const [loading, setLoading] = React.useState(descriptor.type === "server");
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        let revoked = false;
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
                if (!revoked) setSrc(objectUrl);
            } catch (e) {
                if (!revoked) setError(e?.message || "Load error");
            } finally {
                if (!revoked) setLoading(false);
            }
        }
        load();

        return () => {
            revoked = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [descriptor]);

    if (loading) {
        return <div className="ec-img-skeleton" aria-label="Loading image…" />;
    }
    if (error) {
        return (
            <div className="ec-img-error">
                <span>Failed to load image</span>
            </div>
        );
    }
    return (
        <a href={src} target="_blank" rel="noreferrer" className="ec-img-link">
            <img src={src} alt={descriptor.alt || "image"} className="ec-img" />
        </a>
    );
}
