<template>
  <div>
    <h1>Библиотекарь</h1>
    <hr class="mb-2" />

    <!--Модальное окно для добавление категории -->
    <modal-window
      id="add-category"
      name-header="Добавление категории"
      w="400"
      @close="closeModal({ id: 'add-category' })"
    >
      <main class="block">
        <div class="mb-2">
          <label for="name-category">Наименование категории</label>
          <input
            id="name-category"
            type="name"
            class="block"
            placeholder="Введите имя категории"
            v-model="category.name"
          />
        </div>
        <div class="mb-2">
          <label for="main-category"> Основная категория </label>
          <select id="main-category" class="block" v-model="category.main">
            <option disabled>Выберите основную категорию</option>
          </select>
        </div>
      </main>
      <menu class="w-full text-right">
        <footer>
          <button
            type="button"
            class="btn btn-default mr-1"
            @click="closeModal({ id: 'add-category' })"
          >
            Отменить
          </button>
          <button type="button" class="btn btn-primary">
            Добавить категорию
          </button>
        </footer>
      </menu>
    </modal-window>

    <!-- Модальное окно для добавление книги -->
    <modal-window
      id="add-book"
      name-header="Добавление книги"
      w="400"
      @close="closeModal({ id: 'add-book' })"
    >
      <main class="block">
        <div class="mb-2">
          <label for="name-book">Автор(ы) книги</label>
          <input
            id="name-book"
            type="text"
            class="input-text block"
            placeholder="Лев Толстой"
            v-model="newBook.author"
          />
        </div>
        <div class="mb-2">
          <label for="name-book">Наименование книги</label>
          <input
            id="name-book"
            type="text"
            class="input-text block"
            placeholder="Война и мир"
            v-model="newBook.name"
          />
        </div>
        <div class="mb-2">
          <label for="description-book">Описание книги</label>
          <textarea
            id="description-book"
            type="text"
            class="block"
            v-model="newBook.description"
          ></textarea>
        </div>
        <div class="mb-2">
          <label for="description-book">Категория</label>
          <div class="sticky">
            <select
              id="category-book"
              class="sticky-button w-full"
              v-model="newBook.category"
            >
              <option disabled>Выберите категорию</option>
            </select>
            <button
              type="button"
              class="btn btn-primary"
              title="Добавить новую категорию"
              @click="openModal('add-category')"
            >
              +
            </button>
          </div>
        </div>
        <div class="mb-2">
          <label for="cover-book">Обложка книги</label>
          <input
            id="cover-book"
            type="file"
            ref="file"
            class="block"
            accept="image/jpeg, image/png"
            @change="handleFileUpload()"
          />
        </div>
        <div class="mb-2">
          <input
            id="check-book"
            type="checkbox"
            class="mr-1"
            v-model="newBook.isCheck"
          />
          <label for="check-book">Прочитано</label>
        </div>
        <div class="mb-2">
          <label fro="path-book">Путь к книге</label>
          <input
            id="path-book"
            type="text"
            class="block"
            placeholder="C:\Books\Book.pdf"
          />
        </div>
        <div class="mb-2">
          <label>Теги</label>
          <vue3-tags-input
            :tags="newBook.tags"
            @on-tags-changed="handleChangeTag"
          ></vue3-tags-input>
        </div>
      </main>
      <menu class="w-full text-right">
        <footer>
          <button
            type="button"
            class="btn mr-1"
            @click="closeModal({ id: 'add-book' })"
          >
            Отменить
          </button>
          <button type="button" class="btn btn-primary" @click="onAddBook">
            Добавить книгу
          </button>
        </footer>
      </menu>
    </modal-window>

    <div class="space-x-2">
      <button
        type="button"
        class="btn btn-primary"
        @click="openModal('add-book')"
      >
        Добавить книгу
      </button>
      <button type="button" class="btn btn-primary" @click="getAllBooks">
        Получить список всех книг
      </button>
    </div>

    <!-- Таблица книг -->
    <div class="mt-4">
      <custom-table
        :settings="tableSettings"
        :data="allBooks"
        @delete-book="onDeleteBook"
      ></custom-table>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import Vue3TagsInput from 'vue3-tags-input';
import { addBookDB, deleteBookByIdDB, getAllBooksDB } from './middleware/Books';
import notice from './plugins/notice';

const ModalWindow = defineAsyncComponent(() =>
  import('./components/ModalWindow.vue'),
);

const CustomTable = defineAsyncComponent(() =>
  import('./components/CustomTable.vue'),
);

let newBook = reactive({
  author: '',
  name: '',
  description: '',
  cover: null,
  isCheck: false,
  path: '',
  category: null,
  tags: [],
  created: new Date().toISOString(),
});

let category = reactive({
  name: '',
  main: '',
});

const tableSettings = reactive([
  {
    id: 1,
    name: 'Наименование книги',
    visible: true,
    sort: 1,
  },
  {
    id: 2,
    name: 'Автор',
    visible: true,
    sort: 2,
  },
  {
    id: 3,
    name: 'Описание',
    visible: true,
    sort: 3,
  },
  {
    id: 4,
    name: 'Тэги',
    visible: true,
    sort: 4,
  },
  {
    id: 5,
    name: 'Прочитано',
    visible: true,
    sort: 5,
  },
  {
    id: 6,
    name: 'Путь',
    visible: false,
    sort: 6,
  },
  {
    id: 7,
    name: 'Дата добавления',
    visible: false,
    sort: 7,
  },
  {
    id: 8,
    name: 'Обложка',
    visible: true,
    sort: 8,
  },
]);

let allBooks = ref(null),
  file = ref('');

const openModal = (id) => {
  let dialog = document.getElementById(id);
  dialog.showModal();
};

const closeModal = (data) => {
  let dialog = document.getElementById(data?.id);
  dialog?.close();
};

const handleFileUpload = () => {
  newBook.cover = file.value.files[0];
};

const handleChangeTag = (tags) => {
  newBook.tags = tags;
};

const onAddBook = async () => {
  await addBookDB(newBook)
    .then(async () => {
      await getAllBooks();
      closeModal({ id: 'add-book' });
      notice.success('Книга добавлена');
    })
    .catch((errors) => {
      console.error(errors);
      notice.error(errors);
    });
};

const onDeleteBook = async (id) => {
  await deleteBookByIdDB(id)
    .then(() => {
      getAllBooks();
      notice.success('Книга была удалена');
    })
    .catch((errors) => {
      notice.error(`Произошла ошибка: ${errors}`);
    });
};

const getAllBooks = async () => {
  await getAllBooksDB()
    .then((response) => {
      console.log(response);
      allBooks.value = response;
    })
    .catch((errors) => {
      notice.error(errors);
      console.error(errors);
    });
};

onMounted(async () => {
  await getAllBooks();
});
</script>
