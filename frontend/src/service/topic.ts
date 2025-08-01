import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useTopicStore = defineStore("topic", () => {
  const saveTopics = ref<{ content: string }[]>([]);

  const addTopic = (msg: { content: string }) => {
    if (!saveTopics.value.find((t) => t.content === msg.content)) {
      saveTopics.value.push(msg);
    }
  };
  // Persistence

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("savedTopics");
    if (saved) saveTopics.value = JSON.parse(saved);
  };

  watch(
    saveTopics,
    (val) => {
      localStorage.setItem("savedTopics", JSON.stringify(val));
    },
    { deep: true }
  );

  return { saveTopics, addTopic, loadFromLocalStorage };
});
