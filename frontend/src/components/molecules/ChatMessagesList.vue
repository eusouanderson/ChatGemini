<template>
  <!-- 1. Adicione a classe "messages-container-scroll" aqui -->
  <v-card-text
    ref="messagesContainer"
    class="overflow-y-auto flex-grow-1 mb-4 messages-container-scroll"
  >
    <v-list density="comfortable">
      <ChatMessage v-for="(msg, index) in messages" :key="index" :msg="msg" />

      <v-list-item v-if="isLoading" class="justify-start text-left mb-4">
        <ThinkingIndicator />
      </v-list-item>
    </v-list>
  </v-card-text>
</template>

<script setup lang="ts">
import { watch, nextTick, ref, onMounted } from "vue";
import ChatMessage from "@/components/molecules/ChatMessage.vue";
import ThinkingIndicator from "@/components/molecules/ThinkingIndicator.vue";

interface Message {
  sender: "user" | "gemini";
  content: string;
}

const props = defineProps<{
  messages: Message[];
  isLoading: boolean;
}>();

const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(
  () => props.messages.length,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { flush: "post" }
);

watch(
  () => props.isLoading,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      nextTick(() => {
        scrollToBottom();
      });
    }
  },
  { flush: "post" }
);

onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<style scoped>
.messages-container-scroll {
  /*
    CRÍTICO: Definir uma altura máxima para que "overflow-y-auto" funcione.
    Esta altura deve ser o "espaço restante" no seu ChatPanel.

    Lembre-se do cálculo que fizemos:
    ChatPanel (pai) tem height="90vh".
    Dentro do ChatPanel, temos:
    - v-card-title (altura padrão do Vuetify, ex: ~64px)
    - ChatInput (altura que você definiu para ele, ex: ~80px com paddings)
    - v-alert (se estiver visível, adicione sua altura, ex: ~48px. Se não, adicione 0 ou um valor pequeno.)
    - padding do v-card do ChatPanel (pa-4 = 16px top + 16px bottom = 32px vertical)
    - `mb-4` no próprio v-card-text = 16px de margin-bottom.

    Então, a fórmula é:
    max-height: calc(90vh
                     - ALTURA_V_CARD_TITLE
                     - ALTURA_CHAT_INPUT
                     - PADDING_V_CARD_VERTICAL
                     - MARGIN_BOTTOM_V_CARD_TEXT
                     - (OPCIONAL: ALTURA_V_ALERT_SE_VISIVEL));
  */
  max-height: calc(
    90vh - 64px - 80px - 32px - 16px
  ); /* EX: 90vh - título - input - padding do card - margin do v-card-text */
  /* Ajuste os valores 64px, 80px, 32px, 16px baseados na **inspeção real** do seu navegador! */

  min-height: 0; /* Ajuda o flex-grow a funcionar corretamente em flexbox */

  scroll-behavior: smooth; /* Para uma rolagem suave */

  /* Estilos personalizados para a barra de rolagem */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}
</style>
