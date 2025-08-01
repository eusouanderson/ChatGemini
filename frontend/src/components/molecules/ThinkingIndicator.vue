<template>
  <div
    class="thinking-indicator rounded-xl px-4 py-2 bg-grey-lighten-3 text-black max-w-[90%] w-auto italic flex items-center"
  >
    <v-progress-circular
      indeterminate
      size="16"
      width="2"
      color="primary"
      class="mr-2"
    />
    Gemini está pensando...
  </div>
</template>

<script setup lang="ts">
// Pode não precisar de nada aqui
</script>

<style scoped>
.thinking-indicator {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
