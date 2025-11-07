import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import "../styles/ChatPage.css";
import aiAvatar from "../assets/ai-avatar.png"

function uid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatPage({ sessionId, onAssistantReply }) {
    const [messages, setMessages] = useState([
        { id: uid(), role: "assistant", content: "Привет! Пиши ниже 👇" },
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

            const asstMsg = { id: uid(), role: "assistant", content: data || "…(пустой ответ)" };
            setMessages((prev) => [...prev, asstMsg]);
            if (onAssistantReply) onAssistantReply(data);
        } catch (e) {
            setMessages((prev) => [
                ...prev,
                { id: uid(), role: "assistant", content: "Ошибка: не удалось связаться с сервером." },
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
                {isSending && <Bubble role="assistant" text="Печатаю…" subtle />}
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
                    🡅
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
