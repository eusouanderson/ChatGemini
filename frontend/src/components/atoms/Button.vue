<template>
  <v-btn
    class="px-6 py-3 text-white text-sm font-semibold transition-all duration-300 ease-in-out rounded-2xl shadow-md hover:shadow-lg active:scale-95 bg-gradient-to-r from-indigo-600 to-purple-600"
    :class="widthClass"
    :style="widthStyle"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  loading?: boolean;
  disabled?: boolean;
  width?: string;
}>();

const widthClass = computed(() => {
  return props.width?.startsWith("w-") ? props.width : "";
});

const widthStyle = computed(() => {
  return props.width && !props.width.startsWith("w-")
    ? { width: props.width }
    : {};
});
</script>
