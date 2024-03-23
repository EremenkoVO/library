<template>
  <div
    :style="`background-image: url(${coverHolder(
      book.cover,
    )}); width: 200px; height: 283px; background-size: contain;`"
    class="rounded-md cursor-pointer"
    @click.self="openBook(book)"
    @mouseover="displayXMark(true)"
    @mouseleave="displayXMark(false)"
  >
    <div v-if="isHover" class="px-2 py-1 space-x-2 space-y-1">
      <button
        type="button"
        class="btn btn-rounded bg-white"
        @click="setCheck(book)"
        title="Изменить"
      >
        <FontAwesomeIcon :icon="isIconCheck(book.isCheck)" />
      </button>
      <button
        type="button"
        class="btn btn-rounded bg-white"
        @click="updateBook(book)"
        title="Изменить"
      >
        <FontAwesomeIcon :icon="faPen" />
      </button>
      <button
        type="button"
        class="btn btn-rounded bg-white"
        @click="deleteBook(book.id)"
        title="Удалить"
      >
        <FontAwesomeIcon :icon="faTrashCan" />
      </button>
    </div>
    <div
      v-if="!isHover && Boolean(book.isCheck)"
      class="px-2 py-1 space-x-2 space-y-1"
    >
      <button type="button" class="btn btn-rounded bg-white">
        <FontAwesomeIcon :icon="isIconCheck(book.isCheck)" />
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
</template>

<script setup>
import {
  faCheck,
  faPen,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, defineEmits, defineProps, ref } from 'vue';

const emits = defineEmits(['add', 'delete', 'update', 'open', 'check']);

let hover = ref(false);

const props = defineProps({
  book: {
    type: Object,
  },
});

const coverHolder = (cover) => {
  return (
    cover ||
    'data:image/png;base64,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'
  );
};

const isHover = computed(() => hover.value);

const displayXMark = (flag) => {
  hover.value = flag;
};

const isIconCheck = (flag) => {
  return flag ? faCheck : faXmark;
};

const deleteBook = (data) => emits('delete', data);
const updateBook = (data) => emits('update', data);
const openBook = (data) => emits('open', data);
const setCheck = (data) => emits('check', data);
</script>
