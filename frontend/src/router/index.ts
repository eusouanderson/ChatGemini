import { createMemoryHistory, createRouter } from "vue-router";

const manualRoutes = [{ path: "/", name: "Chat", component: "" }];

export const router = createRouter({
  history: createMemoryHistory(),
  routes: manualRoutes,
});
