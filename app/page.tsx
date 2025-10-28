"use client"
import React, { useEffect, useState } from "react";
import "./page.css"
import { AiMessage } from "@/types/types";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>();
  const handleAsk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setPrompt("")

    const res = await fetch("/api/prompt", {
      method: "POST",
      body: JSON.stringify({ prompt })
    });

    const body = await res.json();

    setMessages([...messages || [], {
      role: "user",
      content: prompt
    }, body.message]);
  }
  useEffect(() => {
    fetch("/api/prompt").then(async (res: Response) => {
      const body = await res.json()
      console.log(body)
      setMessages(body.messages)
    });
  }, [])
  return (
    <>
      <div id="chat-container">
        <div id="chat">
          {messages?.map((msg: AiMessage, idx: number) => <div key={idx}><h3>{msg.role}</h3>{msg.content}</div>) || "Loading..."}
        </div>
        <form onSubmit={handleAsk} id="prompt">
          <input placeholder="Ask AI..." value={prompt} onChange={e => setPrompt(e.currentTarget.value)} />
          <button>Ask</button>
        </form>
      </div>
    </>
  );
}
