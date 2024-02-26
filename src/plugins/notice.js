// Инициализация инстанса Notice
var notice = {};
var noticeWrapper;

// Создание и добавление к документу обертки для сообщений
function initWrapper() {
  noticeWrapper = document.createElement('div');
  noticeWrapper.classList.add('notice-wrapper');
  document.querySelector('body').append(noticeWrapper);
}

/**
 * Создание одиночного экземпляра сообщения
 * @param {array} status - список классов у сообщения
 * @param {string} message - текстовое наполнение сообщения
 */
function create(status, message) {
  // Если количество сообщений становится больше,
  // либо равно 3, прекращаем показ
  //if (noticeWrapper.childElementCount >= 3) return

  if (message.includes('<script>'))
    throw alert('ERROR, IN MESSAGE INCLUDES SCRIPT TAGS');

  // Создание сообщения
  var noti = document.createElement('div');

  // Добавление списка классов сообщению
  noti.classList.add(...status);
  noti.style.zIndex = 9999999;

  // Изменение прозрачности у сообщений
  // для создания более плавного
  // появления и исчезновения
  setTimeout(function () {
    noti.style.opacity = '1';

    setTimeout(function () {
      noti.style.opacity = '0';

      setTimeout(function () {
        noticeWrapper.removeChild(noti);
      }, 200);
    }, 4000);
  }, 100);

  // Присваиваем сообщению текст, который
  // указал пользователь
  noti.innerHTML = message;

  // Добавляем наше сообщение в обертку
  // и выводим его на страницу
  noticeWrapper.append(noti);
}

notice.default = function (message) {
  create(['notice-default', 'notice'], message);
};

// Создание сообщения "Успех"
notice.success = function (message) {
  create(['notice-success', 'notice'], message);
};

// Создание сообщения "Ошибка"
notice.error = function (message) {
  create(['notice-error', 'notice'], message);
};

// Создаем сообщение "Информация"
notice.info = function (message) {
  create(['notice-info', 'notice'], message);
};

// Инициализация и монтирование обертки
initWrapper();

export default notice;
