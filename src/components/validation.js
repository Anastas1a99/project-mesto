/**
 * Показывает сообщение об ошибке для поля ввода
 * @param {HTMLFormElement} formElement - Форма, содержащая поле
 * @param {HTMLInputElement} inputElement - Поле ввода
 * @param {string} errorMessage - Текст ошибки
 * @param {Object} settings - Настройки валидации
 */
function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
}

/**
 * Скрывает сообщение об ошибке для поля ввода
 * @param {HTMLFormElement} formElement - Форма, содержащая поле
 * @param {HTMLInputElement} inputElement - Поле ввода
 * @param {Object} settings - Настройки валидации
 */
  export function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
}

/**
 * Проверяет валидность URL
 * @param {string} url - Проверяемый URL
 * @returns {boolean} Результат проверки
 */

function isValidUrl(url) {
  if (!url) return false; // Пустая строка невалидна
  
  // Быстрая проверка на минимальные требования к URL
  if (!/^https?:\/\/.+\..+/.test(url)) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return (
      (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
      parsedUrl.hostname.includes('.') && // Должна быть хотя бы одна точка в домене
      !parsedUrl.hostname.startsWith('.') &&
      !parsedUrl.hostname.endsWith('.') &&
      !url.includes(' ')
    );
  } catch {
    return false;
  }
}

/**
 * Проверяет валидность поля ввода
 * @param {HTMLFormElement} formElement - Форма
 * @param {HTMLInputElement} inputElement - Поле ввода
 * @param {Object} settings - Настройки валидации
 */
function validateInput(formElement, inputElement, settings) {
  const value = inputElement.value.trim();
  hideInputError(formElement, inputElement, settings);

  let isInvalid = false;
  let errorMessage = '';

  // Специальная обработка полей URL (карточки и аватар)
  if (inputElement.name === 'link' || inputElement.name === 'avatar') {
    if (!value) {
      isInvalid = true;
      errorMessage = 'Это обязательное поле';
    } else if (!isValidUrl(value)) {
      isInvalid = true;
      errorMessage = 'Введите корректный URL (например: https://example.com)';
    }
  } else {
    // Стандартная валидация для других полей
    isInvalid = !inputElement.validity.valid;
    errorMessage = inputElement.validationMessage;
  }

  // Дополнительные кастомные проверки
  if (!isInvalid) {
    switch (inputElement.name) {
      case 'name':
        isInvalid = value.length < 2 || value.length > 40;
        errorMessage = 'Имя должно быть от 2 до 40 символов.';
        break;
      case 'description':
        isInvalid = value.length < 2 || value.length > 200;
        errorMessage = 'Описание должно быть от 2 до 200 символов.';
        break;
      case 'title':
        isInvalid = value.length < 2 || value.length > 30;
        errorMessage = 'Название должно быть от 2 до 30 символов.';
        break;
    }
  }

  if (isInvalid) {
    showInputError(formElement, inputElement, errorMessage, settings);
    return false;
  }
  return true;
}

/**
 * Проверяет наличие невалидных полей
 * @param {Array<HTMLInputElement>} inputList - Список полей ввода
 * @returns {boolean} Есть ли невалидные поля
 */

function hasInvalidInput(inputList) {
  return inputList.some(input => {
    const value = input.value.trim();
    
    // Специальная проверка для URL (карточки и аватар)
    if (input.name === 'link' || input.name === 'avatar') {
      return !isValidUrl(value);
    }
    
    // Стандартная проверка
    if (!input.validity.valid) return true;
    
    // Кастомные проверки длины
    switch (input.name) {
      case 'name':
        return value.length < 2 || value.length > 40;
      case 'description':
        return value.length < 2 || value.length > 200;
      case 'title':
        return value.length < 2 || value.length > 30;
      default:
        return false;
    }
  });
}

/**
 * Переключает состояние кнопки отправки
 * @param {Array<HTMLInputElement>} inputList - Список полей ввода
 * @param {HTMLButtonElement} buttonElement - Кнопка отправки
 * @param {Object} settings - Настройки валидации
 */
function toggleButtonState(inputList, buttonElement, settings) {
  const hasError = hasInvalidInput(inputList);
  buttonElement.disabled = hasError;
  buttonElement.classList.toggle(settings.inactiveButtonClass, hasError);
}

/**
 * Устанавливает обработчики событий для формы
 * @param {HTMLFormElement} formElement - Форма
 * @param {Object} settings - Настройки валидации
 */
function setupFormValidation(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const submitButton = formElement.querySelector(settings.submitButtonSelector);

  // Инициализация состояния кнопки
  toggleButtonState(inputList, submitButton, settings);

  // Обработчики для полей ввода
  inputList.forEach(input => {
    input.addEventListener('input', () => {
      validateInput(formElement, input, settings);
      toggleButtonState(inputList, submitButton, settings);
    });
  });
}

/**
 * Включает валидацию для всех форм
 * @param {Object} settings - Настройки валидации
 */
function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach(form => setupFormValidation(form, settings));
}

export { enableValidation };