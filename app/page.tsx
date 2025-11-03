"use client"
import React, { useEffect, useState } from "react";
import { AiMessage, AiResponse } from "@/types/types";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>();
  const [currentMessage, setCurrentMessage] = useState<AiMessage | null>(null);

  const handleAsk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setPrompt("")

    setMessages([...messages || [], {
      role: "user",
      content: prompt
    }]);

    const res = await fetch("/api/prompt", {
      method: "POST",
      body: JSON.stringify({ prompt })
    });

    const reader = res.body?.getReader()
    let done = false;

    let msg = ""
    let thoughts = ""

    if (reader) {
      while (!done) {
        const { value, done: isDone } = await reader.read();
        const text = new TextDecoder().decode(value);

        if (text) {
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.trim()) {
              try {
                const aiRes: AiResponse = JSON.parse(line);
                msg += aiRes.message.content || '';
                thoughts += aiRes.message?.thinking || '';
                setCurrentMessage({ role: "assistant", content: msg, thinking: thoughts });
              } catch (error) {
                console.error("Failed to parse line:", error);
              }
            }
          }
        }
        done = isDone;
      }
    }
    setCurrentMessage(null)
    setMessages([...messages || [], {
      role: "user",
      content: prompt
    }, { role: "assistant", thinking: thoughts, content: msg }]);
  }
  useEffect(() => {
    fetch("/api/prompt").then(async (res: Response) => {
      const body = await res.json()
      setMessages(body.messages)
    });
  }, [])

  return (
    <>
      <div className="size-full flex flex-col w-4/5 mx-auto py-2">
        <div className="grow w-full flex flex-col gap-2">
          {messages?.map((msg: AiMessage, idx: number) =>
            <div key={idx} className={` flex flex-col p-4 rounded-2xl w-fit ${msg.role === "user" ? "bg-gray-800" : "bg-zinc-800"}`}>
              <span className="text-xs text-zinc-400">{msg.role}</span>
              {msg.thinking && <p className="text-sm text-gray-500 p-1">{msg.thinking}</p>}
              {msg.content}
            </div>
          ) || "Loading..."}
          {currentMessage && <div>{currentMessage.thinking} <div>{currentMessage.content}</div></div>}
        </div>
        <form onSubmit={handleAsk} className="w-full bg-zinc-800 px-4 py-1 rounded-full flex gap-2">
          <input placeholder="Ask AI..." value={prompt} onChange={e => setPrompt(e.currentTarget.value)} className="grow outline-none border-y-2 border-transparent focus:border-b-gray-400" />
          <button>Ask</button>
        </form>
      </div>
    </>
  );
}
