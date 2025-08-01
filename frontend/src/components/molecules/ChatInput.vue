<template>
  <v-card-actions class="d-flex align-center">
    <v-text-field
      ref="inputRef"
      v-model="inputMessage"
      label="Digite uma mensagem"
      hide-details
      variant="outlined"
      class="flex-grow-1 mr-2"
      @keyup.enter.prevent="handleInternalSend"
      :disabled="isLoading"
      append-inner-icon="mdi-microphone"
      @click:append-inner="startVoiceInput"
    />
    <Button
      color="primary"
      width="w-32"
      @click="handleInternalSend"
      :loading="isLoading"
      :disabled="!inputMessage.trim() || isLoading"
    >
      Enviar
    </Button>
  </v-card-actions>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import Button from "@/components/atoms/Button.vue";

const inputMessage = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

defineProps<{
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "sendMessage", message: string): void;
}>();

const handleInternalSend = () => {
  if (!inputMessage.value.trim()) return;
  emit("sendMessage", inputMessage.value);
  inputMessage.value = "";

  nextTick(() => {
    inputRef.value?.focus();
  });
};

const startVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Reconhecimento de voz não suportado neste navegador.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    inputMessage.value += transcript;
  };

  recognition.onerror = (event: any) => {
    console.error("Erro no reconhecimento de voz:", event.error);
  };

  recognition.start();
};
</script>
