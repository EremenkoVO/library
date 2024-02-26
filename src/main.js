import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/main.css';
import './assets/styles/notice.css';
import initDB from './middleware/InitDB';

async function init() {
  await initDB();
  await createApp(App).mount('#app');
}

init();
