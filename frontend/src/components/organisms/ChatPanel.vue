<template>
  <Analize />
  <v-card
    class="pa-4 d-flex flex-column justify-space-between mx-auto rounded-2xl"
    elevation="8"
    style="width: 100%; max-width: 1200px; min-height: 70vh; height: 90vh"
  >
    <v-card-title class="d-flex align-center rounded-2xl">
      <div class="text-h6 text-primary basis-auto font-bold animate-pulse">
        Chat
      </div>
      <v-spacer></v-spacer>
      <v-btn text @click="clearChatSession" color="error" :disabled="isLoading">
        Limpar Sessão
      </v-btn>
    </v-card-title>

    <div class="flex-grow-1 overflow-auto">
      <ChatMessagesList :messages="messages" :isLoading="isLoading" />
    </div>

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
import Analize from "../molecules/Analize.vue";

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

<style scoped>
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.flex-grow-1 {
  flex-grow: 1;
}
.overflow-auto {
  overflow-y: auto;
}
</style>
