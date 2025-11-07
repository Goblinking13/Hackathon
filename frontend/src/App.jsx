// App.jsx
import { useEffect, useState } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import ChatPage from "./pages/ChatPage.jsx";
import Button from "react-bootstrap/Button";
import Sidebar from "./Sidebar";
import "./App.css";

function TextArea({ text, onTextChange }) {
    return (
        <div className="text-container">
            <h1>Write Area:</h1>
            <textarea
                placeholder="Enter your text..."
                className="text-area"
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
            ></textarea>
        </div>
    );
}

function App() {
    const [text, setText] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [active, setActive] = useState("assistant");

    useEffect(() => {
        const uuid = "3fsdhjbfsdhj123123";
        setSessionId(uuid);
        console.log("Session ID:", uuid);
    }, []);

    const handleSend = (promptText) => setText(promptText);

    return (
        <PanelGroup direction="horizontal" style={{ height: "100vh" }}>
            {/* LEFT: Sidebar */}
            <Panel defaultSize={22} minSize={18} maxSize={35}>
                <Sidebar active={active} onNavigate={setActive} />
            </Panel>

            {/* RIGHT: content */}
            <Panel defaultSize={78} minSize={50}>
                {/*<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>*/}
                {/*    <div style={{ flex: 1, overflowY: "auto" }}>*/}
                {/*        <TextArea text={text} onTextChange={setText} />*/}
                {/*    </div>*/}
                {/*    <div style={{ borderTop: "1px solid #ccc" }}>*/}
                {/*        <PromptArea onSend={handleSend} sessionId={sessionId} />*/}
                {/*    </div>*/}
                {/*</div>*/}
                <ChatPage sessionId={sessionId} handleSend={handleSend} text={text} setText={setText} />
            </Panel>
        </PanelGroup>
    );
}

export default App;
