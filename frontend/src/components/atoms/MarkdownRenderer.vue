<template>
  <div
    v-html="compiledMarkdown"
    class="markdown-content prose prose-sm md:prose-base max-w-full dark:prose-invert"
    :class="{ 'pointer-events-none opacity-75': isLoading }"
  />
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";

const props = defineProps<{
  content: string;
  loading?: boolean;
}>();

const isLoading = ref(false);

// Configuração do marked
marked.setOptions({
  breaks: true,
  gfm: true,
  smartypants: true,
});

const compiledMarkdown = computed(() => {
  if (!props.content) return "";

  isLoading.value = true;

  try {
    const rawHtml = marked.parse(props.content) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ADD_ATTR: ["target"],
      ADD_TAGS: ["iframe"],
      ALLOWED_ATTR: [
        "href",
        "target",
        "rel",
        "src",
        "alt",
        "title",
        "width",
        "height",
        "class",
        "id",
        "style",
      ],
    });

    return cleanHtml;
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return '<p class="text-red-500">Error rendering content</p>';
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  setTimeout(() => {
    const links = document.querySelectorAll(".markdown-content a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer nofollow");
    });
  }, 100);
});
</script>

<style scoped>
/* Estilos para o conteúdo markdown */
.markdown-content {
  color: inherit;
}

/* Estilos para elementos filhos usando :deep() */
.markdown-content :deep(h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-top: 1.5rem;
  border-bottom-width: 1px;
  padding-bottom: 0.5rem;
}

.markdown-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-top: 1.25rem;
}

.markdown-content :deep(h3) {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  padding-top: 1rem;
}

.markdown-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.625;
}

.markdown-content :deep(a) {
  color: #2563eb;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.dark .markdown-content :deep(a) {
  color: #60a5fa;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.25rem;
}

.markdown-content :deep(ul) {
  list-style-type: disc;
}

.markdown-content :deep(ol) {
  list-style-type: decimal;
}

.markdown-content :deep(blockquote) {
  border-left-width: 4px;
  border-color: #d1d5db;
  padding-left: 1rem;
  font-style: italic;
  color: #4b5563;
  margin: 1rem 0;
}

.dark .markdown-content :deep(blockquote) {
  border-color: #4b5563;
  color: #9ca3af;
}

.markdown-content :deep(code) {
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.dark .markdown-content :deep(code) {
  background-color: #1f2937;
}

.markdown-content :deep(pre) {
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.dark .markdown-content :deep(pre) {
  background-color: #1f2937;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.markdown-content :deep(table) {
  width: 100%;
  margin: 1rem 0;
  border-collapse: collapse;
}

.markdown-content :deep(th) {
  background-color: #f3f4f6;
  text-align: left;
  padding: 0.5rem;
  border-width: 1px;
}

.dark .markdown-content :deep(th) {
  background-color: #374151;
}

.markdown-content :deep(td) {
  padding: 0.5rem;
  border-width: 1px;
}

.markdown-content :deep(img) {
  margin: 1rem 0;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 100%;
  height: auto;
}

/* Efeito de loading */
.markdown-content.loading :deep(*) {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
