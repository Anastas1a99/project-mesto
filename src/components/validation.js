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
function hideInputError(formElement, inputElement, settings) {
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
  try {
    new URL(url);
    return true;
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
  let isValid = true;

  // Специальные проверки для разных типов полей
  switch (inputElement.name) {
    case 'link':
      if (!isValidUrl(value)) {
        showInputError(formElement, inputElement, 'Введите корректную ссылку.', settings);
        isValid = false;
      }
      break;
      
    case 'name':
      if (value.length < 2 || value.length > 40) {
        showInputError(formElement, inputElement, 'Имя должно быть от 2 до 40 символов.', settings);
        isValid = false;
      }
      break;
      
    case 'description':
      if (value.length < 2 || value.length > 200) {
        showInputError(formElement, inputElement, 'Описание должно быть от 2 до 200 символов.', settings);
        isValid = false;
      }
      break;
      
    case 'title':
      if (value.length < 2 || value.length > 30) {
        showInputError(formElement, inputElement, 'Название должно быть от 2 до 30 символов.', settings);
        isValid = false;
      }
      break;
  }

  // Проверка стандартной валидации
  if (isValid && !inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
    isValid = false;
  }

  if (isValid) {
    hideInputError(formElement, inputElement, settings);
  }
  
  return isValid;
}

/**
 * Проверяет наличие невалидных полей
 * @param {Array<HTMLInputElement>} inputList - Список полей ввода
 * @returns {boolean} Есть ли невалидные поля
 */
function hasInvalidInput(inputList) {
  return inputList.some(input => !input.validity.valid);
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