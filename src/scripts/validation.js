import { newCardTitle, newCardImage, profileNameInput, profileDescriptionInput, saveButton, cardFormElement} from './index.js';

function validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
}

function validateCardForm() {
    const cardSaveButton = cardFormElement.querySelector('.popup__button');
  
    if (newCardTitle.value.length < 2 || newCardTitle.value.length > 40) {
      newCardTitle.setCustomValidity("Длина названия должна быть от 2 до 40 символов.");
    } else {
      newCardTitle.setCustomValidity(""); // Сбрасываем пользовательскую валидацию
    }
    if (validateURL(newCardImage.value)){
      newCardImage.setCustomValidity(""); // Сбрасываем пользовательскую валидацию
    }else{
      newCardImage.setCustomValidity("Введите корректную ссылку.");
    }
  
    const isTitleValid = newCardTitle.validity.valid;
    const isLinkValid = newCardImage.validity.valid;
  
    // Управление кнопкой
    if (isTitleValid && isLinkValid) {
      cardSaveButton.disabled = false;
      cardSaveButton.style.backgroundColor = ''; // Возвращаем стандартный цвет
    } else {
      cardSaveButton.disabled = true;
      cardSaveButton.style.backgroundColor = '#C4C4C4'; // Цвет неактивной кнопки
    }
  
    // Сообщения об ошибках
    document.getElementById('card-name-error').textContent =
      newCardTitle.value ? newCardTitle.validationMessage : '';
    document.getElementById('url-error').textContent =
      newCardImage.value ? newCardImage.validationMessage : '';
}

  
// Функция для проверки валидности формы
function validateProfile() {
  // Валидация имени
  if (profileNameInput.value.length < 2 || profileNameInput.value.length > 40) {
    profileNameInput.setCustomValidity("Длина имени должна быть от 2 до 40 символов.");
  } else {
    profileNameInput.setCustomValidity(""); // Сбрасываем пользовательскую валидацию
  }

  // Валидация описания
  if (profileDescriptionInput.value.length < 2 || profileDescriptionInput.value.length > 200) {
    profileDescriptionInput.setCustomValidity("Длина описания должна быть от 2 до 200 символов.");
  } else {
    profileDescriptionInput.setCustomValidity(""); // Сбрасываем пользовательскую валидацию
  }

  const isNameValid = profileNameInput.validity.valid;
  const isDescriptionValid = profileDescriptionInput.validity.valid;

  // Включаем или выключаем кнопку "Сохранить"
  if (isNameValid && isDescriptionValid) {
    saveButton.disabled = false;
    saveButton.style.backgroundColor = ''; // Возвращаем стандартный цвет
  } else {
    saveButton.disabled = true;
    saveButton.style.backgroundColor = '#C4C4C4'; // Цвет неактивной кнопки
  }

  // Отображение сообщений об ошибках
  document.getElementById('name-error').textContent = profileNameInput.value ? profileNameInput.validationMessage : '';
  document.getElementById('description-error').textContent = profileDescriptionInput.value ? profileDescriptionInput.validationMessage : '';
}

export { validateCardForm, validateProfile };