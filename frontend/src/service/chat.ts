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
  const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;
  const ANALYZE_API_URL = import.meta.env.VITE_ANALYZE_API_URL;

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
        CHAT_API_URL,
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
      error.value = err.message || "Erro desconhecido ao enviar mensagem.";
      console.error("Erro ao enviar mensagem:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const analyzeProject = async (projectPath: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      messages.value.push({
        content: `Analisando o projeto em "${projectPath}"...`,
        sender: "gemini",
        timestamp: new Date(),
        sessionId: sessionId.value,
      });

      const response = await axios.post<{ result: string }>(ANALYZE_API_URL, {
        projectPath,
        sessionId: sessionId.value,
      });

      if (response.data && response.data.result) {
        console.log("Análise do projeto concluída:", response.data.result);

        // Correto: Acesse a propriedade `result` dentro de `response.data`
        messages.value.push({
          content: response.data.result, // <--- CORREÇÃO APLICADA
          sender: "gemini",
          timestamp: new Date(),
          sessionId: sessionId.value,
        });
      }

      console.log("Análise do projeto concluída e exibida!");
    } catch (err: any) {
      // ... (bloco catch inalterado)
    } finally {
      isLoading.value = false;
    }
  };

  const $reset = () => {
    messages.value = initialMessages;
    isLoading.value = initialIsLoading;
    error.value = initialError;
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sessionId,
    analyzeProject,
    $reset,
  };
});
