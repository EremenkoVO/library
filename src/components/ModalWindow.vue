<template>
  <transition name="fade">
    <div
      class="modal-view"
      :id="id"
      v-if="modelValue"
      @click.stop="close"
      :style="`z-index: ${zIndex}`"
    >
      <div class="modal-view__dialog" :style="setSize" @click.stop>
        <div class="modal-view__content">
          <div class="modal-view__header">
            <h3 class="modal-view__title">{{ title }}</h3>
            <a href="#close" title="Закрыть" class="close" @click.stop="close"
              ><span aria-hidden="true">&times;</span></a
            >
          </div>
          <div class="modal-view__body">
            <slot></slot>
          </div>
          <div class="modal-view__footer" v-if="hideFooter">
            <slot name="modal-view-footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue';

const emit = defineEmits(['close', 'update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: 'modal-view',
  },
  title: {
    type: String,
    default: 'Окно',
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'sm',
  },
  zIndex: {
    type: String,
    default: '2',
  },
});

const setSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-width: 500px';
    case 'lg':
      return 'max-width: 800px';
  }
  return '';
});

const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-view {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0;
  overflow-y: auto;
}
/* при отображении модального окно */
.modal-view:target {
  opacity: 1;
  pointer-events: auto;
  overflow-y: auto; /* добавляем прокрутку по y, когда элемент не помещается на страницу */
}
/* ширина модального окна и его отступы от экрана */
.modal-view__dialog {
  position: relative;
  width: auto;
  margin: 20px;
}

@media (min-width: 576px) {
  .modal-view__dialog {
    margin: 100px auto; /* для отображения модального окна по центру */
  }
}
/* свойства для блока, содержащего контент модального окна */
.modal-view__content {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  background-color: #fff;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}
@media (min-width: 768px) {
  .modal-view__content {
    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }
}
/* свойства для заголовка модального окна */
.modal-view__header {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #eceeef;
}
.modal-view__title {
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.5;
  font-size: 1.25rem;
  font-weight: 500;
  text-align: left;
}
/* свойства для кнопки "Закрыть" */

/* содержимое окна */
.modal-view__body {
  position: relative;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 15px;
  overflow: auto;
}

/* подвал окна */
.modal-view__footer {
  padding: 15px;
  border-top: 1px solid #eceeef;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
