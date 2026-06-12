// Simplified LLM helper for standalone deployment
// Connects to any OpenAI-compatible API.

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type MessageContent = string | TextContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
};

export type InvokeParams = {
  messages: Message[];
  model?: string;
  max_tokens?: number;
};

export type InvokeResult = {
  id: string;
  choices: Array<{
    message: {
      role: Role;
      content: string;
    };
  }>;
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: params.model || "gpt-4o",
      messages: params.messages,
      max_tokens: params.max_tokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM invoke failed: ${response.status} – ${errorText}`);
  }

  return (await response.json()) as InvokeResult;
}
