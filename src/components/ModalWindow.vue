<template>
  <dialog
    class="shadow-2xl rounded-md"
    :id="id"
    :style="`min-width: ${w}px; min-height: ${h}px`"
  >
    <div>
      <h2>{{ nameHeader }}</h2>
      <button type="button" class="close" @click.stop="close">&times;</button>
    </div>
    <div
      class="flex flex-col justify-between"
      style="height: 80%; align-items: flex-start"
    >
      <slot></slot>
    </div>
  </dialog>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(['close']);

const props = defineProps({
  id: String,
  nameHeader: String,
  isOpen: {
    type: Boolean,
    default: false,
  },
  w: {
    type: [Number, String],
    default: 100,
  },
  h: {
    type: [Number, String],
    default: 200,
  },
});

const close = () => emit('close', { id: props.id, flag: false });
</script>

<style scoped>
dialog {
  padding: 15px;
}

dialog > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

dialog button.close {
  font-weight: 600;
  font-size: 16px;
}
</style>
