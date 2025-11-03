import { AiMessage, AiResponse } from "@/types/types";

const messages: AiMessage[] = []

export async function GET(_: Request) {
  return new Response(JSON.stringify({ messages }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function POST(req: Request) {
  const { prompt } = await req.json();

  console.log(messages.length)

  messages.push({
    role: "user",
    content: prompt
  })

  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: JSON.stringify({
      model: "deepseek-r1:1.5b",
      messages,
      stream: true
    })
  })


  const stream = new ReadableStream({
    async start(controller) {
      const reader = res.body?.getReader()

      let done = false;

      let msg = ""
      let thoughts = ""

      if (reader)
        while (!done) {
          const { value, done: isDone } = await reader.read();
          const text = new TextDecoder().decode(value);
          controller.enqueue(text);
          if (text) {
            const aiRes: AiResponse = JSON.parse(text);
            msg += aiRes.message.content;
            thoughts += aiRes.message?.thinking || '';
          }
          done = isDone
        }
      controller.close();
      messages.push(thoughts ? {
        role: "assistant",
        content: msg,
        thinking: thoughts
      } : {
        role: "assistant",
        content: msg,
      })
    }
  });


  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
