<template>
  <v-card
    class="pa-4 d-flex flex-column justify-space-between"
    elevation="8"
    height="90vh"
    style="min-width: 900px; max-width: 90vw; width: auto"
  >
    <v-card-title class="d-flex align-center">
      <div class="text-h6 text-primary">Chat</div>
      <v-spacer></v-spacer>
      <v-btn text @click="clearChatSession" color="error" :disabled="isLoading">
        Limpar Sessão
      </v-btn>
    </v-card-title>

    <ChatMessagesList :messages="messages" :isLoading="isLoading" />

    <ChatInput @sendMessage="handleSendMessage" :isLoading="isLoading" />

    <v-alert v-if="error" type="error" class="mt-2" density="compact">
      {{ error }}
    </v-alert>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useChatStore } from "@/service/chat";
import ChatMessagesList from "@/components/molecules/ChatMessagesList.vue";
import ChatInput from "@/components/molecules/ChatInput.vue";

const chat = useChatStore();

const handleSendMessage = async (msg: string) => {
  await chat.sendMessage(msg);
};

const messages = computed(() => chat.messages);
const isLoading = computed(() => chat.isLoading);
const error = computed(() => chat.error);

const clearChatSession = () => {
  localStorage.removeItem("chat-session-id");
  chat.$reset();

  window.location.reload();
};
</script>
