import { AiMessage } from "@/types/types";

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
      stream: false
    })
  })

  const body = await res.json()

  messages.push(body.message)

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
