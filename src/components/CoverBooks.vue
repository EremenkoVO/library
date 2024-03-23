<template>
  <div>
    <div v-if="isBooks" class="w-full flex-wrap flex">
      <div v-for="book in books" :key="book.id" class="m-2 p-2">
        <div
          :style="`background-image: url(${book.cover}); width: 200px; height: 300px; background-size: contain;`"
          class="rounded-md cursor-pointer"
          @click.self="openBook(book.path)"
        >
          <div class="px-2 py-1 space-x-2 text-right">
            <button type="button" @click="updateBook(book)" title="Изменить">
              <FontAwesomeIcon :icon="faPen" />
            </button>
            <button type="button" @click="deleteBook(book.id)" title="Удалить">
              <FontAwesomeIcon :icon="faTrashCan" />
            </button>
          </div>
        </div>
        <div
          style="max-width: 200px; max-height: 50px"
          class="truncate"
          :title="`${book.name} - ${book.author}`"
        >
          {{ book.name }} - {{ book.author }}
        </div>
      </div>
      <div style="width: 200px; height: 300px" class="m-4">
        <button
          type="button"
          class="w-full h-full text-center btn btn-outline"
          title="Добавить книгу"
          @click="add"
        >
          <FontAwesomeIcon :icon="faPlus" />
        </button>
      </div>
    </div>
    <div v-else class="w-full flex">
      <div style="width: 200px; height: 300px" class="m-4">
        <button
          type="button"
          class="w-full h-full text-center btn btn-outline"
          title="Добавить книгу"
          @click="add"
        >
          <FontAwesomeIcon :icon="faPlus" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { faPen, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, defineEmits, defineProps } from 'vue';

const emits = defineEmits(['add', 'delete', 'update', 'open']);

const props = defineProps({
  books: {
    type: Array,
    default: () => [],
  },
});

const isBooks = computed(() => props.books?.length > 0);

const deleteBook = (id) => emits('delete', id);
const updateBook = (book) => emits('update', book);
const openBook = (path) => emits('open', { path });
const add = () => emits('add');
</script>
