import {useState} from "react";
import Button from "react-bootstrap/Button";

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

export default function ChatPage({text, setText, handleSend, sessionId}) {
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <div style={{flex: 1, overflowY: "auto"}}>
                <TextArea text={text} onTextChange={setText}/>
            </div>
            <div style={{borderTop: "1px solid #ccc"}}>
                <PromptPage onSend={handleSend} sessionId={sessionId}/>
            </div>
        </div>
    )
}
function PromptPage({onSend, sessionId}) {
    const [prompt, setPrompt] = useState("");

    const handleSend = async () => {
        try {
            const res = await fetch("http://localhost:8080/send/prompt", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({sessionId, prompt}),
            });
            if (!res.ok) throw new Error("Server error");
            const data = await res.text();
            onSend(data);
            setPrompt("");
        } catch (err) {
            console.error("Request failed:", err);
            onSend("Error: cannot connect to server");
        }
    };

    return (
        <div className="text-container">
            <h1>Enter your request:</h1>
            <textarea
                placeholder="Enter your text..."
                className="text-prompt-area"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            <Button className="my-button" onClick={handleSend}>
                Send prompt
            </Button>
        </div>
    );
}