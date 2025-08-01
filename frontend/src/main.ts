import vuetify from "@/plugins/vuetify";
import { createPinia } from "pinia";

import "@/assets/styles/main.css";
import "unfonts.css";

import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(vuetify);

app.mount("#app");
