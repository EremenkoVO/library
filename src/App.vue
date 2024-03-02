<template>
  <div>
    <!--Модальное окно для добавление категории -->
    <ModalWindow
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
            v-model="newCategory.name"
          />
        </div>
        <div class="mb-2">
          <label for="main-category"> Основная категория </label>
          <select
            id="main-category"
            class="block"
            v-model="newCategory.id_parent"
          >
            <option disabled>Выберите основную категорию</option>
            <template v-if="isCategories">
              <option v-for="category in allCategories" :value="category.id">
                {{ category.name }}
              </option>
            </template>
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
          <button type="button" class="btn btn-primary" @click="onAddCategory">
            Добавить категорию
          </button>
        </footer>
      </menu>
    </ModalWindow>

    <!-- Модальное окно для добавление книги -->
    <ModalWindow
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
              <template v-if="isCategories">
                <option v-for="category in allCategories" :value="category.id">
                  {{ category.name }}
                </option>
              </template>
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
            v-model="newBook.path"
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
    </ModalWindow>

    <div v-if="isDevelopment" class="space-x-2">
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
      <button type="button" class="btn btn-danger" @click="clearAll">
        Очистить таблицы и переопределить
      </button>
    </div>

    <!-- Таблица книг -->
    <div class="my-4 mx-2 text-right">
      <input
        type="search"
        class="w-96"
        placeholder="Поиск..."
        v-model="search"
      />
    </div>
    <div class="mt-4 w-full flex">
      <div class="w-72 m-2 p-2 border-1 border-black">
        <TreeMenu
          label="Все"
          :nodes="roots"
          :depth="4"
          :id="-1"
          :selected-id="selectedId"
          @select="select"
          @remove="onRemoveCategory"
          @update="openModal('add-category')"
        />
        <div class="w-full">
          <button
            type="button"
            class="w-full btn btn-outline"
            title="Добавить категорию"
            @click="openModal('add-category')"
          >
            <FontAwesomeIcon :icon="faPlus" />
          </button>
        </div>
      </div>
      <CoverBooks
        :books="filterAllBooks"
        @delete="onDeleteBook"
        @add="openModal('add-book')"
      />
    </div>
  </div>
</template>

<script setup>
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ask } from '@tauri-apps/api/dialog';
import * as $array from 'alga-js/array';
import {
  computed,
  defineAsyncComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { useToast } from 'vue-toast-notification';
import Vue3TagsInput from 'vue3-tags-input';
import {
  addBookDB,
  deleteBookByIdDB,
  getAllBooksDB,
  updateBookDB,
} from './middleware/Books';
import {
  addCategoryDB,
  getAllCategoryDB,
  removeCategoryDB,
  updateCategoryDB,
} from './middleware/Category';
import initDB, { deleteTables } from './middleware/InitDB';

const ModalWindow = defineAsyncComponent(() =>
  import('./components/ModalWindow.vue'),
);
const CoverBooks = defineAsyncComponent(() =>
  import('./components/CoverBooks.vue'),
);
const TreeMenu = defineAsyncComponent(() =>
  import('./components/TreeMenu.vue'),
);

const $toast = useToast();

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

let newCategory = reactive({
  name: '',
  id_parent: null,
});

let allBooks = ref(null),
  filterAllBooks = ref(null),
  allCategories = ref(null),
  file = ref(''),
  selectedId = ref(0),
  search = ref('');

watch(search, (value) => {
  if (value?.length > 0) {
    filterAllBooks.value = $array.search(allBooks.value, value);
  } else {
    filterAllBooks.value = allBooks.value;
  }
});

const isDevelopment = computed(() => process.env.NODE_ENV === 'development');

const isCategories = computed(() => allCategories.value?.length > 0);

const roots = computed(() => allCategories.value);

const sortFilter = async (filters) => {
  allCategories.value = [];
  let node, i;

  let filtersList = await filters.map((filter) => {
    return {
      id: filter.id,
      name: filter.name,
      data: {
        id_parent: filter.id_parent,
      },
      nodes: [],
    };
  });

  for (i = 0; i < filtersList.length; i += 1) {
    node = filtersList[i];
    if (node.data.id_parent !== null) {
      let indexParent;
      await filtersList.forEach((filter, index) => {
        if (filter.id == node.data.id_parent) indexParent = index;
      });

      if (typeof indexParent !== 'undefined') {
        filtersList[indexParent].nodes.push(node);
      }
    } else {
      allCategories.value.push(node);
    }
  }
};

const select = async (id) => {
  selectedId.value = id;
};

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

const clearNewBook = () => {
  newBook.author = '';
  newBook.name = '';
  newBook.description = '';
  newBook.cover = null;
  newBook.isCheck = false;
  newBook.path = '';
  newBook.category = null;
  newBook.tags = [];
  newBook.created = new Date().toISOString();
  file.value = '';
};

const clearNewCategory = () => {
  newCategory.name = '';
  newCategory.id_parent = null;
};

const onAddBook = async () => {
  await addBookDB(newBook)
    .then(async () => {
      await getAllBooks();
      await clearNewBook();
      await closeModal({ id: 'add-book' });
      $toast.success('Книга добавлена');
    })
    .catch((errors) => {
      console.error(errors);
      $toast.error(errors);
    });
};

const onUpdateBook = async (book) => {
  await updateBookDB(book)
    .then(() => {
      $toast.success('Информация о книге была обновлена');
    })
    .catch((errors) => {
      console.error(errors);
      $toast.error(errors);
    });
};

const onDeleteBook = async (id) => {
  const yes = await ask('Вы уверены, что хотите удалить книгу?', {
    title: 'Библиотекарь',
    type: 'info',
    okLabel: 'Да',
    cancelLabel: 'Нет',
  });

  if (yes)
    await deleteBookByIdDB(id)
      .then(() => {
        getAllBooks();
        $toast.success('Книга была удалена');
      })
      .catch((errors) => {
        $toast.error(`Произошла ошибка: ${errors}`);
      });
};

const getAllBooks = async (id) => {
  await getAllBooksDB(id)
    .then((response) => {
      allBooks.value = response;
      filterAllBooks.value = response;
    })
    .catch((errors) => {
      $toast.error(errors);
      console.error(errors);
    });
};

const onAddCategory = async () => {
  await addCategoryDB(newCategory)
    .then(async () => {
      await closeModal({ id: 'add-category' });
      await getAllCategories();
      await clearNewCategory();
      $toast.success('Категория добавлена');
    })
    .catch((errors) => {
      console.error(errors);
      $toast.error(errors);
    });
};

const onUpdateCategory = async () => {
  await updateCategoryDB()
    .then(() => $toast.success('Категория была обновлена'))
    .catch((errors) => {
      console.error(errors);
      $toast.error(errors);
    });
};

const onRemoveCategory = async (id) => {
  console.log(id);
  const yes = await ask('Вы уверены, что хотите удалить категорию?', {
    title: 'Библиотекарь',
    type: 'info',
    okLabel: 'Да',
    cancelLabel: 'Нет',
  });

  if (yes)
    await removeCategoryDB(id)
      .then(async () => {
        await getAllCategories();
        $toast.success('Категория была удалена');
      })
      .catch((errors) => {
        console.error(errors);
        $toast.error(errors);
      });
};

const getAllCategories = async () => {
  await getAllCategoryDB()
    .then(async (response) => {
      sortFilter(value);
    })
    .catch((errors) => {
      console.error(errors);
      $toast.error(errors);
    });
};

const clearAll = async () => {
  const yes = await ask(
    'Вы уверены, что хотите все очистить? Процесс необратим',
    { title: 'library', type: 'warning', okLabel: 'Да', cancelLabel: 'Нет' },
  );

  if (yes) {
    await deleteTables();
    await initDB();
    await getAllCategories();
    await getAllBooks();
    $toast.success('Все данные были очищены!');
  }
};

onMounted(async () => {
  await getAllCategories();
  await getAllBooks();
});
</script>
