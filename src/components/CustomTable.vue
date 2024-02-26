<template>
  <div>
    <table class="table w-full">
      <thead>
        <tr>
          <template v-for="field in settings" :key="field.id">
            <th v-if="field.visible">{{ field.name }}</th>
          </template>
        </tr>
      </thead>
      <tbody v-if="isData">
        <tr v-for="book in data" :key="book.id">
          <td>{{ book.name }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.description }}</td>
          <td>{{ allTags(book.tags) }}</td>
          <td>{{ isCheckText(book.isCheck) }}</td>
          <td>
            <div v-if="book.cover">
              <img :src="book.cover" width="200" height="400" />
            </div>
            <div v-else>
              <span>Нет обложки</span>
            </div>
          </td>
          <td>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteBook(book.id)"
            >
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr style="user-select: none">
          <td colspan="8" class="text-center">Нет данных</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue';

const emits = defineEmits(['delete-book']);

const props = defineProps({
  settings: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
});

const isData = computed(() => props.data?.length > 0);

const allTags = (tags) => {
  tags = JSON.parse(tags);
  return tags?.length > 0 ? tags : 'Нет тегов';
};

const isCheckText = (isCheck) => {
  return isCheck === 1 ? 'Прочитано' : 'Не прочитано';
};

const deleteBook = (idBook) => {
  emits('delete-book', idBook);
};

const getObjectUrl = (cover) => {
  return URL.createObjectURL(cover);
};
</script>
