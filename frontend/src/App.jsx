// App.jsx
import { useEffect, useState } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import ChatPage from "./pages/ChatPage.jsx";
import Sidebar from "./Sidebar";
import "./styles/App.css";

// Временные заглушки страниц — вынеси потом в ./pages/*.jsx
function ProfilePage()       { return <div style={{padding:16,color:"#0e1c57"}}>Profile page</div>; }
function PredictionPage()    { return <div style={{padding:16,color:"#0e1c57"}}>Prediction page</div>; }
function SettingsPage()      { return <div style={{padding:16,color:"#0e1c57"}}>Settings page</div>; }

function App() {
    const [text, setText] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [active, setActive] = useState("ai-chat");

    useEffect(() => {
        const uuid = "3fsdhjbfsdhj123123";
        setSessionId(uuid);
        console.log("Session ID:", uuid);
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

            {/* RIGHT: content */}
            <Panel defaultSize={78} minSize={50}>
                {renderContent()}
            </Panel>
        </PanelGroup>
    );
}

export default App;
