<template>
  <v-chip
    :color="sender === 'user' ? 'primary' : 'grey-lighten-2'"
    :text-color="sender === 'user' ? 'white' : 'black'"
    class="text-wrap"
    :class="sender === 'user' ? 'user-message' : 'ai-message'"
    @dragstart="() => onDragStart({ content })"
  >
    <span v-if="sender !== 'user'" class="font-weight-bold mr-1"
      >{{ sender }}:</span
    >
    {{ content }}
  </v-chip>
</template>

<script setup lang="ts">
defineProps<{
  content: string;
  sender: "user" | "gemini";
  onDragStart: (msg: { content: string }) => void;
}>();
</script>
