<template>
  <div>
    <h3>Analisar Projeto Diretamente</h3>
    <input v-model="projectPath" placeholder="Caminho do projeto" />
    <Button @click="triggerAnalysis" :disabled="chatStore.isLoading">
      {{ chatStore.isLoading ? "Analisando..." : "Analisar" }}
    </Button>
    <p v-if="error" style="color: red">{{ error }}</p>
    <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
  </div>
</template>
<script lang="ts" setup>
import Button from "../atoms/Button.vue";
import { ref } from "vue";
import { useChatStore } from "@/service/chat";

const projectPath = ref("/app");
const error = ref<string | null>(null);
const successMessage = ref("");
const chatStore = useChatStore();

const triggerAnalysis = async () => {
  if (!projectPath.value) {
    error.value = "O caminho do projeto é obrigatório.";
    return;
  }

  error.value = null;
  successMessage.value = "";

  try {
    await chatStore.analyzeProject(projectPath.value);
    successMessage.value = "Análise solicitada com sucesso!";
  } catch (err: any) {
    error.value = err.message || "Falha ao solicitar análise.";
  }
};
</script>
