import axios from "axios";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

interface ChatMessage {
  sessionId?: string;
  content: string;
  sender: "user" | "gemini";
  timestamp: Date;
}

export const useChatStore = defineStore("chat", () => {
  // Definindo os estados iniciais para fácil reuso no $reset()
  const initialMessages: ChatMessage[] = [];
  const initialIsLoading = false;
  const initialError: string | null = null;
  const SESSION_KEY = "chat-session-id";

  let currentSessionId = localStorage.getItem(SESSION_KEY);
  if (!currentSessionId) {
    currentSessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, currentSessionId);
  }
  const sessionId = ref<string>(currentSessionId);

  const messages = ref<ChatMessage[]>(initialMessages);
  const isLoading = ref(initialIsLoading);
  const error = ref<string | null>(initialError);

  const API_URL = "http://localhost:3000/api/chat";

  const sendMessage = async (content: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;

      messages.value.push({
        content,
        sessionId: sessionId.value,
        sender: "user",
        timestamp: new Date(),
      });

      const response = await axios.post<{ content: string; sessionId: string }>(
        API_URL,
        {
          content,
          sessionId: sessionId.value,
        }
      );

      messages.value.push({
        sessionId: sessionId.value,
        content: response.data.content,
        sender: "gemini",
        timestamp: new Date(),
      });
    } catch (err: any) {
      error.value = err.message || "Erro desconhecido";
      console.error("Erro ao enviar mensagem:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const $reset = () => {
    messages.value = initialMessages;
    isLoading.value = initialIsLoading;
    error.value = initialError;
  };

  return { messages, isLoading, error, sendMessage, sessionId, $reset };
});
