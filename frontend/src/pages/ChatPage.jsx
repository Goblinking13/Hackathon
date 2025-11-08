import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import "../styles/ChatPage.css";
import aiAvatar from "../assets/ai-avatar.png";
import { FaArrowUp } from "react-icons/fa";
import { marked } from "marked";
import DOMPurify from "dompurify";

const SEND_URL = "http://localhost:8080/send/prompt";

function uid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── ChatPage ───────────────────────────────────────────────────────────────────
export default function ChatPage({ sessionId, onAssistantReply }) {
    const [messages, setMessages] = useState([
        { id: uid(), role: "assistant", content: "That’s a unique and exciting goal, Islam! Let’s see how you can plan for buying a camel based on your financial situation.\n" +
                "\n" +
                "### Your Financial Snapshot:\n" +
                "- Monthly Income: $1,000\n" +
                "- Monthly Expenses: $900–$1,000 (leaving little room for savings).\n" +
                "- Savings & Debts: Not specified.\n" +
                "\n" +
                "### Camel Costs:\n" +
                "The price of a camel can vary greatly depending on the type, age, and region. On average:\n" +
                "- Basic camel: $1,000–$3,000\n" +
                "- High-quality camel (breeding, racing): $5,000–$10,000 or more\n" +
                "\n" +
                "Let’s assume you’re aiming for a camel worth $2,000 for this plan.\n" +
                "\n" +
                "---\n" +
                "\n" +
                "### Steps to Buy a Camel:\n" +
                "\n" +
                "1. Cut Transportation Costs (Taxi):\n" +
                "   - You currently spend $30/day on taxis, which amounts to $900/month.\n" +
                "   - If you buy a camel, you can potentially eliminate most taxi expenses while saving money on transport.\n" +
                "   - Start by cutting your taxi budget in half ($450/month saved) while working towards the camel purchase.\n" +
                "\n" +
                "2. Set a Savings Goal:\n" +
                "   - If you save $500/month, you could reach $2,000 within 4 months.\n" +
                "   - If you save less, let’s say $200/month, you’ll need 10 months to save $2,000.\n" +
                "\n" +
                "3. Explore Affordable Options:\n" +
                "   - Look for local sellers or markets that offer good-quality camels within your budget.\n" +
                "   - You might find a younger camel or one better suited to your needs for $1,500-$2,000.\n" +
                "\n" +
                "4. Avoid Debt: \n" +
                "   - Since your income is modest, avoid taking loans for the camel. Stick to saving to avoid financial strain.\n" +
                "\n" +
                "---\n" +
                "\n" +
                "### Benefits of Owning a Camel:\n" +
                "- Reduce Transport Costs: A camel might help you cut down on taxi expenses, saving up to $900/month.\n" +
                "- Cultural Value: Camels often hold cultural significance and can be a source of pride.\n" +
                "- Long-Term Investment: Depending on your goals (breeding, selling, etc.), camels could even be profitable.\n" +
                "\n" +
                "---\n" +
                "\n" +
                "### Action Plan:\n" +
                "1. Start saving $500/month by cutting transportation and other non-essential expenses.\n" +
                "2. Research camel sellers and prices in your region.\n" +
                "3. You can buy a $2,000 camel in 4 months if you stick to your savings plan.\n" +
                "\n" +
                "Let me know if you’d like help creating a detailed savings plan or comparing camel prices! 🐪" },
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
function MarkdownLite({ text }) {
    const raw = typeof text === "string" ? text : String(text ?? "");
    // GFM + переносы строк как в чате
    const html = marked.parse(raw, { gfm: true, breaks: true });
    const safe = DOMPurify.sanitize(html);
    return <div className="ec-md" dangerouslySetInnerHTML={{ __html: safe }} />;
}

function Bubble({ role, text, subtle }) {
    const isUser = role === "user";

    // 1) Готовим текст
    const raw = typeof text === "string" ? text : String(text ?? "");
    const imgUrls = extractImageUrls(raw);

    // 2) Чтобы не дублировать картинки: вырезаем URL картинок из текста
    const cleanedText = raw.replace(/https?:\/\/[^\s)]+/g, "").trim();

    return (
        <div className={`ec-bubble-row ${isUser ? "right" : "left"}`}>
            {!isUser && (
                <div className="ec-avatar">
                    <img src={aiAvatar} alt="AI Avatar" className="ec-avatar-img" />
                </div>
            )}

            <div className={`ec-bubble ${isUser ? "user" : "asst"} ${subtle ? "subtle" : ""}`}>
                {/* Markdown-текст (жирный, курсив, списки, код-блоки и т.д.) */}
                {cleanedText && <MarkdownLite text={cleanedText} />}

                {/* Картинки отдельными превью ниже текста */}
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
