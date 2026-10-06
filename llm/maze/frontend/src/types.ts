export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export interface AskResponse {
  session_id: string;
  reply: string;
  turns: number;
}
