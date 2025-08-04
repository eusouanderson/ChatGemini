import { createMemoryHistory, createRouter } from "vue-router";

import ChatView from "@/page/ChatPage.vue";

const manualRoutes = [{ path: "/", name: "Chat", component: ChatView }];

export const router = createRouter({
  history: createMemoryHistory(),
  routes: manualRoutes,
});
