"use client"
import React, { useEffect, useState } from "react";
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
      <div className="size-full flex flex-col w-4/5 mx-auto py-2">
        <div className="grow w-full">
          {messages?.map((msg: AiMessage, idx: number) => <div key={idx}><h3>{msg.role}</h3>{msg.content}</div>) || "Loading..."}
        </div>
        <form onSubmit={handleAsk} className="w-full bg-zinc-800 px-4 py-1 rounded-full flex gap-2">
          <input placeholder="Ask AI..." value={prompt} onChange={e => setPrompt(e.currentTarget.value)} className="grow outline-none border-y-2 border-transparent focus:border-b-gray-400" />
          <button>Ask</button>
        </form>
      </div>
    </>
  );
}
