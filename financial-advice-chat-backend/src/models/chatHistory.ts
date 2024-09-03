export interface ChatMessage {
  sender: "user" | "assistant";
  message: string;
  timestamp: FirebaseFirestore.Timestamp;
}

export interface ChatHistory {
  uid: string;
  messages: ChatMessage[];
}
