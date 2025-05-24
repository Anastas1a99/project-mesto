
function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
}

function isValid(formElement, inputElement, settings) {
  const value = inputElement.value.trim();

  if (inputElement.name === 'link' && !validateURL(value)) {
    showInputError(formElement, inputElement, 'Введите корректную ссылку.', settings);
    return;
  }

  if (inputElement.name === 'name') {
    if (value.length < 2 || value.length > 40) {
      showInputError(formElement, inputElement, 'Имя должно быть от 2 до 40 символов.', settings);
      return;
    }
  }

  if (inputElement.name === 'description') {
    if (value.length < 2 || value.length > 200) {
      showInputError(formElement, inputElement, 'Описание должно быть от 2 до 200 символов.', settings);
      return;
    }
  }

  if (inputElement.name === 'title') {
    if (value.length < 2 || value.length > 30) {
      showInputError(formElement, inputElement, 'Название должно быть от 2 до 30 символов.', settings);
      return;
    }
  }

  // Если поле не прошло нативную валидацию — показать стандартную ошибку
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}



function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settings.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
}

function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
}

// Вспомогательная функция валидации URL
function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export { enableValidation };
