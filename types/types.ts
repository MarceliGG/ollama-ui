export type AiMessage = {
  role: "system" | "user" | "assistant" | "tool",
  content: string,
  
}

export type AiResponse = {
  model: string,
  created_at: string,
  message: AiMessage,
  done: false,
} | {
  model: string,
  created_at: string,
  message: AiMessage,
  done: true,
  done_reason: string,
  total_duration: number,
  load_duration: number,
  prompt_eval_count: number,
  prompt_eval_duration: number,
  eval_count: number,
  eval_duration: number
}

export type ChatRequest = {
  model: string,
  messages: AiMessage[],
  stream: boolean
}
