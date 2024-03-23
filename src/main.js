import { createApp } from 'vue';
import ToastPlugin from 'vue-toast-notification';
import App from './App.vue';
import initDB from './middleware/InitDB';

import 'vue-toast-notification/dist/theme-bootstrap.css';
import './assets/styles/main.css';
import './assets/styles/notice.css';

async function init() {
  await initDB();
  await createApp(App).use(ToastPlugin).mount('#app');
}

init();
