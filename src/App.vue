<template>
  <div>
    <!--Модальное окно для добавление/изменения категории -->
    <ModalWindow
      v-for="modal in modalCategory"
      v-model="modal.view.isShow"
      :key="modal.view.id"
      :id="modal.view.id"
      :title="modal.view.title"
      :z-index="999"
    >
      <main class="block">
        <div class="mb-2">
          <label for="name-category"
            >Наименование категории
            <sup class="text-red-500">
              <FontAwesomeIcon :icon="faAsterisk"></FontAwesomeIcon>
            </sup>
          </label>
          <input
            id="name-category"
            type="name"
            class="block"
            placeholder="Введите имя категории"
            v-model="modal.value.name"
          />
        </div>
        <div class="mb-2">
          <label for="main-category"> Основная категория </label>
          <select
            id="main-category"
            class="block"
            v-model="modal.value.id_parent"
          >
            <option :value="null">Все</option>
            <template v-if="isCategories && modal.view.id === 'add-category'">
              <option
                v-for="category in allCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </template>
            <template
              v-if="isCategories && modal.view.id === 'edit-category'"
              v-for="category in allCategories"
              :key="category.id"
            >
              <option
                v-if="modal.value.id !== category.id"
                :value="category.id"
              >
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
            @click="modal.view.isShow = false"
          >
            Отменить
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="modal.view.func"
          >
            {{ modal.view.title_btn_primary }}
          </button>
        </footer>
      </menu>
    </ModalWindow>

    <!-- Модальное окно для добавление/изменения книги -->
    <ModalWindow
      v-for="modal in modalBook"
      size="lg"
      v-model="modal.view.isShow"
      :key="modal.view.id"
      :id="modal.view.id"
      :title="modal.view.title"
      :z-index="998"
    >
      <main class="flex space-x-2">
        <div>
          <span>Обложка книги</span>
          <div
            class="h-full w-full border rounded-md cursor-pointer text-center flex flex-col justify-center hover:bg-slate-100"
            title="Изменить обложку"
            :style="`background-image: url(${modal.value.cover}); width: 350px; height: 495px; background-size: contain;`"
            @click="$refs.file[0].click()"
          >
            <input
              id="cover-book"
              type="file"
              ref="file"
              class="hidden"
              multiple="false"
              accept="image/png, image/gif, image/jpeg"
              @change="
                async (event) => {
                  let file = event.target.files[0];
                  let size = event.target.files[0].size;
                  const maxSizeInBytes = 1 * 1024 * 1024;

                  if (size > maxSizeInBytes) {
                    $toast.error('Файл слишком большой');
                    return;
                  }
                  modal.value.cover = await toBase64(file);
                  event.target.files = null;
                }
              "
            />
            <div v-if="!modal.value.cover">
              <FontAwesomeIcon :icon="faImage" />
              <div class="text-center">
                Рекомендуемый размер 350x495 (до 1 МБ)
              </div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="mb-2">
            <label for="name-book"
              >Автор(ы) книги
              <sup class="text-red-500">
                <FontAwesomeIcon :icon="faAsterisk"></FontAwesomeIcon>
              </sup>
            </label>
            <input
              id="name-book"
              type="text"
              class="input-text block"
              placeholder="Лев Толстой"
              v-model="modal.value.author"
            />
          </div>
          <div class="mb-2">
            <label for="name-book"
              >Наименование книги
              <sup class="text-red-500">
                <FontAwesomeIcon :icon="faAsterisk"></FontAwesomeIcon>
              </sup>
            </label>
            <input
              id="name-book"
              type="text"
              class="input-text block"
              placeholder="Война и мир"
              v-model="modal.value.name"
            />
          </div>
          <div class="mb-2">
            <label for="name-book">Год издания</label>
            <input
              id="name-book"
              type="number"
              class="input-text block"
              placeholder="2000"
              min="0"
              v-model="modal.value.year"
            />
          </div>
          <div class="mb-2">
            <label for="description-book">Описание книги</label>
            <textarea
              id="description-book"
              type="text"
              class="block"
              v-model="modal.value.description"
            ></textarea>
          </div>
          <div class="mb-2">
            <label for="description-book">Категория</label>
            <div class="sticky">
              <select
                id="category-book"
                class="sticky-button w-full"
                v-model="modal.value.category"
              >
                <option :value="null">Все</option>
                <template v-if="isCategories">
                  <option
                    v-for="category in allCategories"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </template>
              </select>
              <button
                type="button"
                class="btn btn-primary"
                title="Добавить новую категорию"
                @click="modalCategory.create.view.isShow = true"
              >
                <FontAwesomeIcon :icon="faPlus" />
              </button>
            </div>
          </div>
          <div class="mb-2">
            <input
              id="check-book"
              type="checkbox"
              class="mr-1"
              v-model="modal.value.isCheck"
            />
            <label for="check-book">Прочитано</label>
          </div>
          <div class="mb-2">
            <label for="path-book">Путь к книге</label>
            <div class="sticky">
              <input
                id="path-book"
                type="text"
                class="sticky-button w-full"
                placeholder="C:\Books\Book.pdf"
                v-model="modal.value.path"
              />
              <button
                type="button"
                class="btn btn-primary"
                title="Указать путь"
                @click="
                  async () => {
                    modal.value.path = await open({
                      multiple: false,
                      title: 'Указать путь к файлу',
                    });
                  }
                "
              >
                <FontAwesomeIcon :icon="faFolderOpen" />
              </button>
            </div>
          </div>
          <div class="mb-2">
            <label>Теги</label>
            <vue3-tags-input
              :tags="modal.value.tags"
              @on-tags-changed="(data) => (modal.value.tags = data)"
            ></vue3-tags-input>
          </div>
        </div>
      </main>
      <menu class="w-full text-right">
        <footer>
          <button
            type="button"
            class="btn mr-1"
            @click="modal.view.isShow = false"
          >
            Отменить
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="modal.view.func"
          >
            {{ modal.view.title_btn_primary }}
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
      <div class="min-w-72 max-w-72 m-2 p-2 border-1 border-black">
        <TreeMenu
          label="Все"
          :key="keyTreeMenu"
          :nodes="$roots"
          :depth="4"
          :id="-1"
          :selected-id="selectedId"
          @select="select"
          @remove="onRemoveCategory"
          @update="updateCategoryModal"
        />
        <div class="w-full">
          <button
            type="button"
            class="w-full btn btn-outline"
            title="Добавить категорию"
            @click="modalCategory.create.view.isShow = true"
          >
            <FontAwesomeIcon :icon="faPlus" />
          </button>
        </div>
      </div>
      <div class="min-w-96">
        <div v-if="isLoading">Загрузка...</div>
        <CoverBooks
          v-else
          :key="keyBooks"
          :books="filterAllBooks"
          @delete="onDeleteBook"
          @update="updateBookModal"
          @open="openFile"
          @check="setCheck"
          @add="modalBook.create.view.isShow = true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  faAsterisk,
  faFolderOpen,
  faImage,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ask, open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
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
  getBookInCategoryDB,
  setBookByIdCheckDB,
  updateBookDB,
} from './middleware/Books';
import {
  addCategoryDB,
  getAllCategoryDB,
  removeCategoryDB,
  updateCategoryDB,
} from './middleware/Category';
import initDB, { deleteTables } from './middleware/InitDB';
import { toBase64 } from './plugins/base64';

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

let allBooks = ref(null),
  filterAllBooks = ref(null),
  allCategories = ref(null),
  roots = ref([]),
  file = ref(''),
  selectedId = ref(null),
  search = ref(''),
  keyTreeMenu = ref(1),
  keyBooks = ref(1),
  isLoading = ref(false);

watch(search, (value) => {
  if (value?.length > 0) {
    filterAllBooks.value = $array.search(allBooks.value, value);
  } else {
    filterAllBooks.value = allBooks.value;
  }
});

watch(selectedId, (value) => {
  keyBooks.value = keyBooks.value + 1;
  if (value == -1) {
    getAllBooks();
    return;
  }

  modalBook.create.value.category = value;
  getBookInCategory(value);
});

/**
 * Флаг режим разработчика
 * @return {boolean}
 */
const isDevelopment = computed(() => process.env.NODE_ENV === 'development');

/**
 * Флаг наличие категорий
 * @return {boolean}
 */
const isCategories = computed(() => allCategories.value?.length > 0);

/**
 * Отсортированы категории
 * @returns {array}
 */
const $roots = computed(() => roots.value);

/**
 * Модальные окна для создания/редактирования категорий
 * @returns {object}
 */
const modalCategory = reactive({
  create: {
    view: {
      id: 'add-category',
      title: 'Добавить категорию',
      title_btn_primary: 'Добавить',
      isShow: false,
      func: async () => {
        if (!modalCategory.create.value.name) {
          $toast.error('Заполните все обязательные поля');
          return;
        }

        await addCategoryDB(modalCategory.create.value)
          .then(async () => {
            modalCategory.create.view.isShow = false;
            $toast.success('Категория добавлена');
          })
          .then(async () => {
            await getAllCategories();
          })
          .then(() => {
            modalCategory.create.value.name = '';
            modalCategory.create.value.id_parent = null;
            keyTreeMenu.value = keyTreeMenu.value + 1;
          })
          .catch((errors) => {
            console.error(errors);
            $toast.error(errors);
          });
      },
    },
    value: {
      id: null,
      name: '',
      id_parent: null,
    },
  },
  edit: {
    view: {
      id: 'edit-category',
      title: 'Изменить категорию',
      title_btn_primary: 'Изменить',
      isShow: false,
      func: async () => {
        if (!modalCategory.edit.value.name) {
          $toast.error('Заполните все обязательные поля');
          return;
        }

        await updateCategoryDB(modalCategory.edit.value)
          .then(() => {
            modalCategory.edit.view.isShow = false;
            $toast.success('Категория была обновлена');
          })
          .then(async () => {
            await getAllCategories();
          })
          .then(() => {
            modalCategory.edit.value.name = '';
            modalCategory.edit.value.id_parent = null;
            keyTreeMenu.value = keyTreeMenu.value + 1;
          })
          .catch((errors) => {
            console.error(errors);
            $toast.error(errors);
          });
      },
    },
    value: {
      id: null,
      name: '',
      id_parent: null,
    },
  },
});

/**
 * Модальные окна для создания/редактирования информации о книги
 * @returns {object}
 */
const modalBook = reactive({
  create: {
    view: {
      id: 'add-book',
      title: 'Добавить книгу',
      title_btn_primary: 'Добавить',
      isShow: false,
      func: async () => {
        if (!modalBook.create.value.author || !modalBook.create.value.name) {
          $toast.error('Заполните все обязательные поля');
          return;
        }

        await addBookDB(modalBook.create.value)
          .then(async () => {
            modalBook.create.view.isShow = false;
            $toast.success('Книга добавлена');
          })
          .then(() => {
            modalBook.create.value.author = '';
            modalBook.create.value.name = '';
            modalBook.create.value.description = '';
            modalBook.create.value.year = '';
            modalBook.create.value.cover = null;
            modalBook.create.value.isCheck = false;
            modalBook.create.value.path = '';
            modalBook.create.value.category = null;
            modalBook.create.value.tags = [];
            modalBook.create.value.created = new Date().toISOString();
            file.value = '';
          })
          .then(async () => {
            if (selectedId.value == -1) {
              getAllBooks();
            } else {
              getBookInCategory(selectedId.value);
            }
          })
          .catch((errors) => {
            console.error(errors);
            $toast.error(errors);
          });
      },
    },
    value: {
      id: null,
      author: '',
      name: '',
      description: '',
      cover: null,
      isCheck: false,
      path: '',
      category: null,
      tags: [],
      created: new Date().toISOString(),
    },
  },
  edit: {
    view: {
      id: 'edit-book',
      title: 'Изменить книгу',
      title_btn_primary: 'Изменить',
      isShow: false,
      func: async () => {
        await updateBookDB(modalBook.edit.value)
          .then(() => {
            modalBook.edit.view.isShow = false;
            $toast.success('Информация о книге была обновлена');
          })
          .then(() => {
            modalBook.edit.value.author = '';
            modalBook.edit.value.name = '';
            modalBook.edit.value.description = '';
            modalBook.edit.value.year = '';
            modalBook.edit.value.cover = null;
            modalBook.edit.value.isCheck = false;
            modalBook.edit.value.path = '';
            modalBook.edit.value.category = null;
            modalBook.edit.value.tags = [];
            modalBook.edit.value.created = new Date().toISOString();
            file.value = '';
          })
          .then(async () => {
            await getAllBooks();
          })
          .catch((errors) => {
            console.error(errors);
            $toast.error(errors);
          });
      },
    },
    value: {
      id: null,
      author: '',
      name: '',
      description: '',
      cover: null,
      isCheck: false,
      path: '',
      category: null,
      tags: [],
      created: new Date().toISOString(),
    },
  },
});

/**
 * Сортировка категорий
 * @param {array} filters
 */
const sortFilter = async (filters) => {
  roots.value = [];
  let node, i;

  let filtersList = await filters.map((filter) => {
    return {
      id: filter.id,
      name: filter.name,
      id_parent: filter.id_parent,
      nodes: [],
    };
  });

  for (i = 0; i < filtersList.length; i += 1) {
    node = filtersList[i];
    if (node.id_parent !== null) {
      let indexParent;
      await filtersList.forEach((filter, index) => {
        if (filter.id == node.id_parent) indexParent = index;
      });

      if (typeof indexParent !== 'undefined') {
        filtersList[indexParent].nodes.push(node);
      }
    } else {
      await roots.value.push(node);
    }
  }
};

/**
 * Триггер для обновления категорий
 * @param {*} data
 */
const updateCategoryModal = async (data) => {
  modalCategory.edit.view.isShow = true;
  modalCategory.edit.value.id = data.id;
  modalCategory.edit.value.id_parent = data.id_parent;
  modalCategory.edit.value.name = data.label;
};

/**
 * Триггер для обновления информации о книге
 * @param {*} data
 */
const updateBookModal = async (data) => {
  modalBook.edit.view.isShow = true;
  modalBook.edit.value.id = data.id;
  modalBook.edit.value.author = data.author;
  modalBook.edit.value.name = data.name;
  modalBook.edit.value.description = data.description;
  modalBook.edit.value.year = data.year;
  modalBook.edit.value.cover = data.cover;
  modalBook.edit.value.isCheck = data.isCheck;
  modalBook.edit.value.path = data.path;
  modalBook.edit.value.category = data.id_category;
  modalBook.edit.value.tags = JSON.parse(data.tags);
  modalBook.edit.value.created = data.created;
};

/**
 * Обновление выбранного пункта категорий
 * @param {number} id
 */
const select = async (id) => {
  selectedId.value = id;
};

/**
 * Обновление информации о книге
 * @param {*} id
 */
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

/**
 * Обновление категории
 * @param {*} id
 */
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

/**
 * Получение книг по категории
 * @param {*} id_category
 */
const getBookInCategory = async (id_category) => {
  isLoading.value = true;
  await getBookInCategoryDB(id_category)
    .then((response) => {
      allBooks.value = response;
      filterAllBooks.value = response;
      isLoading.value = false;
    })
    .catch((error) => {
      $toast.error('Ошибка получения списка книг');
      isLoading.value = false;
    });
};

/**
 * Получение всех книг
 */
const getAllBooks = async () => {
  isLoading.value = true;
  await getAllBooksDB()
    .then((response) => {
      allBooks.value = response;
      filterAllBooks.value = response;
      isLoading.value = false;
    })
    .catch((errors) => {
      $toast.error(errors);
      console.error(errors);
      isLoading.value = false;
    });
};

/**
 * Получение всех категорий
 */
const getAllCategories = async () => {
  await getAllCategoryDB()
    .then(async (response) => {
      allCategories.value = response;
      sortFilter(response);
    })
    .catch((errors) => {
      console.error(errors);
      $toast.error(errors);
    });
};

/**
 * Очистить всю бд (для разработчика)
 */
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

/**
 * Открыть файл
 * @param {*} param0
 */
const openFile = async ({ path }) => {
  if (path) {
    $toast.info('Открытие...');
    try {
      await invoke('open_file', {
        filePath: path,
      });
      console.log('File opened successfully');
    } catch (error) {
      $toast.error('Ошибка открытия файла:', error);
    }
  }
};

/**
 * Обновление массива книг где есть флаг прочтения книги
 * @param {*} id
 * @param {*} isCheck
 */
const updateArrBook = async (id, isCheck) => {
  allBooks.value?.forEach((book) => {
    if (book.id === id) {
      book.isCheck = isCheck;
    }
  });
};

/**
 * Обновления флага прочтения книги
 * @param {*} param0
 */
const setCheck = async ({ id, isCheck }) => {
  isCheck = isCheck == 0 ? 1 : 0;
  setBookByIdCheckDB({ id, isCheck })
    .then(() => {
      $toast.success('Информация о книге была обновлена');
    })
    .then(() => {
      updateArrBook(id, isCheck);
    })
    .catch((error) => {
      $toast.error(`Ошибка: ${error}`);
    });
};

onMounted(async () => {
  selectedId.value = -1;
  await getAllCategories();
  await getAllBooks();
});
</script>
