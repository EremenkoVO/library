<template>
  <div class="tree-menu">
    <div class="label-wrapper">
      <div
        :style="indent"
        :class="[
          { 'bg-gray-300 rounded-md': isSelected },
          'hover:bg-gray-200 hover:rounded-md p-2 cursor-pointer flex justify-between',
        ]"
        @click="select(id)"
      >
        <span>{{ label }}</span>
        <div v-if="id !== -1">
          <button type="button" @click="remove(id)">
            <FontAwesomeIcon :icon="faTrashCan" />
          </button>
        </div>
      </div>
    </div>
    <tree-menu
      v-for="node in nodes"
      :id="node.id"
      :nodes="node.nodes"
      :label="node.name"
      :depth="depth + 12"
      :selected-id="selectedId"
      :id_parent="node.id_parent"
      @select="select"
      @remove="remove"
    >
    </tree-menu>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, defineEmits, defineProps } from 'vue';

import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const emits = defineEmits(['select', 'remove']);
const props = defineProps({
  id: Number,
  label: [String, Number],
  id_parent: Number,
  nodes: Array,
  depth: Number,
  selectedId: Number,
});

const isSelected = computed(() => props.id === props.selectedId);
const indent = computed(() => ({ 'padding-left': `${props.depth}px` }));

const select = (id) => {
  emits('select', id);
};

const remove = (id) => {
  emits('remove', id);
};
</script>
