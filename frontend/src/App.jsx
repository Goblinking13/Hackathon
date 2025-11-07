import { useEffect, useState } from "react";
import {PanelGroup, Panel, PanelResizeHandle} from "react-resizable-panels"
import Button from 'react-bootstrap/Button';
import "./App.css"


function TextArea({text, onTextChange})
{

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




function PromptArea({onSend, sessionId})
{
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState("");

  const handleSend = async () => {
    try {
      const res = await fetch("http://localhost:8080/send/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, prompt:prompt })
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

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
      <Button
        className="my-button"
        onClick={handleSend}
      >
        Send prompt
      </Button>


    </div>
  );


}

function App() {

  const [text, setText] = useState("");

  const [sessionId, setSessionId] = useState("");

  useEffect(() => {

    const uuid = crypto.randomUUID();
    setSessionId(uuid);
    console.log("Session ID:", uuid);
  }, []);

  const handleSend = (promptText) => {
    setText(promptText);
  };

  return (

    <PanelGroup direction="horizontal" style={{height: "100vh"}}>
      <Panel defaultSize={50} minSize={20}>
        <div style={{backgroundColor: "blue", height: "100%"}}>
          {/* Содержимое панели */}
        </div>
      </Panel>


      <PanelGroup direction="horizontal" style={{ height: "100vh" }}>
        <Panel defaultSize={50} minSize={20}>
          <div style={{ backgroundColor: "blue", height: "100%" }}>
            {/* Содержимое панели */}
          </div>
        </Panel>

        <Panel defaultSize={50} minSize={20}>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Основная область текста */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              <TextArea text={text} onTextChange={setText} />
            </div>

            {/* Зона промпта */}
            <div style={{ borderTop: "1px solid #ccc" }}>
              <PromptArea onSend={handleSend} sessionId={sessionId} />
            </div>
          </div>
        </Panel>
      </PanelGroup>

    </PanelGroup>


  );
}

export default App;
