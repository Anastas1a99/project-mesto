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
  hideInputError(formElement, inputElement, settings); // Сначала скрываем ошибку

  if (hasInvalidInput([inputElement])) {
    // Показываем ошибку в зависимости от поля
    const errorMessage = {
      name: 'Имя должно быть от 2 до 40 символов.',
      description: 'Описание должно быть от 2 до 200 символов.',
      title: 'Название должно быть от 2 до 30 символов.',
      link: 'Введите корректную ссылку.'
    }[inputElement.name] || inputElement.validationMessage;

    showInputError(formElement, inputElement, errorMessage, settings);
  }
}

/**
 * Проверяет наличие невалидных полей
 * @param {Array<HTMLInputElement>} inputList - Список полей ввода
 * @returns {boolean} Есть ли невалидные поля
 */

function hasInvalidInput(inputList) {
  return inputList.some(input => {
    const value = input.value.trim();
    
    // Стандартная проверка
    if (!input.validity.valid) return true;
    
    // Кастомные проверки
    switch (input.name) {
      case 'name':
        return value.length < 2 || value.length > 40;
      case 'description':
        return value.length < 2 || value.length > 200;
      case 'title':
        return value.length < 2 || value.length > 30;
      case 'link':
        return !isValidUrl(value);
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