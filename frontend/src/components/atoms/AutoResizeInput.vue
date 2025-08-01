<template>
  <div class="relative inline-block">
    <span
      ref="sizer"
      class="invisible absolute whitespace-pre text-body-1 px-3"
    >
      {{ modelValue || placeholder }}
    </span>

    <v-text-field
      v-model="inputValue"
      :placeholder="placeholder"
      density="comfortable"
      variant="outlined"
      hide-details
      class="pa-0 ma-0"
      :style="{ width: computedWidth + 'px' }"
      @input="updateValue"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const inputValue = ref(props.modelValue);
const sizer = ref<HTMLElement | null>(null);
const computedWidth = ref(50); // largura mínima

const updateWidth = () => {
  if (sizer.value) {
    const width = sizer.value.offsetWidth + 24;
    computedWidth.value = Math.max(width, 50);
  }
};

const updateValue = (val: string) => {
  emit("update:modelValue", val);
  updateWidth();
};

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val;
    updateWidth();
  }
);

onMounted(() => {
  updateWidth();
});
</script>

<style scoped>
span {
  font-family: Roboto, sans-serif;
  font-size: 16px;
}
</style>
