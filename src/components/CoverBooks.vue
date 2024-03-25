<template>
  <div class="w-full flex-wrap flex">
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
    <template v-if="isBooks">
      <div v-for="book in books" :key="book.id" class="m-2 p-2">
        <CoverBook
          :book="book"
          @delete="deleteBook"
          @update="updateBook"
          @open="openBook"
          @check="setCheck"
        ></CoverBook>
      </div>
    </template>
  </div>
</template>

<script setup>
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, defineAsyncComponent, defineEmits, defineProps } from 'vue';

const CoverBook = defineAsyncComponent(() => import('./CoverBook.vue'));

const emits = defineEmits(['add', 'delete', 'update', 'open', 'check']);

const props = defineProps({
  books: {
    type: Array,
    default: () => [],
  },
});

const isBooks = computed(() => props.books?.length > 0);

const deleteBook = (id) => emits('delete', id);
const updateBook = (book) => emits('update', book);
const openBook = ({ path }) => emits('open', { path });
const setCheck = ({ id, isCheck }) => emits('check', { id, isCheck });
const add = () => emits('add');
</script>
