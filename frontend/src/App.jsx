// App.jsx
import { useEffect, useState } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import ChatPage from "./pages/ChatPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PredictionPage from "./pages/PredictionPage.jsx";   // ← добавили
import SettingsPage from "./pages/SettingsPage.jsx";       // ← добавили

import Sidebar from "./Sidebar.jsx";
import "./styles/App.css";

function App() {
    // сохраняем активную вкладку между перезагрузками
    const [active, setActive] = useState(
        () => localStorage.getItem("activeTab") || "ai-chat"
    );
    useEffect(() => localStorage.setItem("activeTab", active), [active]);

    const [text, setText] = useState("");
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        const uuid = "3fsdhjbfsdhj123123"; // подставь реальный id, если есть
        setSessionId(uuid);
    }, []);

    const handleSend = (promptText) => setText(promptText);

    const renderContent = () => {
        switch (active) {
            case "profile":
                return <ProfilePage />;
            case "prediction":
                return <PredictionPage />;
            case "settings":
                return <SettingsPage />;
            case "ai-chat":
            default:
                return (
                    <ChatPage
                        sessionId={sessionId}
                        // Если ChatPage использует onAssistantReply — пробрось так:
                        // onAssistantReply={handleSend}
                        handleSend={handleSend}
                        text={text}
                        setText={setText}
                    />
                );
        }
    };

    return (
        <PanelGroup direction="horizontal" style={{ height: "100vh" }}>
            {/* LEFT: Sidebar */}
            <Panel defaultSize={22} minSize={18} maxSize={35}>
                <Sidebar active={active} onNavigate={setActive} />
            </Panel>

            {/* Делаем разделитель реально перетаскиваемым */}
            <PanelResizeHandle className="PanelResizeHandle" />

            {/* RIGHT: content */}
            <Panel defaultSize={78} minSize={50}>
                <div style={{ height: "100%", overflow: "auto" }}>{renderContent()}</div>
            </Panel>
        </PanelGroup>
    );
}

export default App;
