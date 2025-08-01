<template>
  <v-list-item
    class="mb-4"
    :class="
      msg.sender === 'user'
        ? 'justify-end text-right'
        : 'justify-start text-left'
    "
  >
    <div
      :class="
        msg.sender === 'user'
          ? 'bg-primary text-white'
          : 'bg-grey-lighten-3 text-black'
      "
      class="rounded-xl px-4 py-2 max-w-[90%] w-auto"
      style="border: 1px solid rgba(0, 0, 0, 0.1)"
    >
      <MarkdownRenderer :content="msg.content" />
    </div>
  </v-list-item>
</template>

<script setup lang="ts">
import MarkdownRenderer from "@/components/atoms/MarkdownRenderer.vue";

interface Message {
  sender: "user" | "model";
  content: string;
}

defineProps<{
  msg: Message;
}>();
</script>
