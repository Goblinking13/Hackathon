import {useEffect, useState} from "react";
import {PanelGroup, Panel, PanelResizeHandle} from "react-resizable-panels";

import ChatPage from "./pages/ChatPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PredictionPage from "./pages/PredictionPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

import Sidebar from "./Sidebar.jsx";
import "./styles/App.css";

function App() {
    const [active, setActive] = useState(
        () => localStorage.getItem("activeTab") || "ai-chat"
    );
    useEffect(() => localStorage.setItem("activeTab", active), [active]);

    const [text, setText] = useState("");
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        const uuid = "3fsdhjbfsdhj123123";
        setSessionId(uuid);
    }, []);

    const handleSend = (promptText) => setText(promptText);

    const renderContent = () => {
        switch (active) {
            case "profile":
                return <ProfilePage/>;
            case "prediction":
                return <PredictionPage/>;
            case "settings":
                return <SettingsPage/>;
            case "login":
                return <LoginPage onSubmit={() => setActive("ai-chat")}/>;
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

    const handleLogout = () => {
        localStorage.removeItem("activeTab");
        setActive("login");
    };

    const showSidebar = active !== "login";

    return showSidebar ? (
        <PanelGroup direction="horizontal" style={{height: "100vh"}}>
            <Panel defaultSize={22} minSize={18} maxSize={35}>
                <Sidebar active={active} onNavigate={setActive} onLogout={handleLogout}/>
            </Panel>

            <PanelResizeHandle className="PanelResizeHandle"/>

            <Panel defaultSize={78} minSize={50}>
                <div style={{height: "100%", overflow: "auto"}}>{renderContent()}</div>
            </Panel>
        </PanelGroup>
    ) : (
        <div style={{height: "100vh", overflow: "auto"}}>{renderContent()}</div>
    );
}

export default App;
