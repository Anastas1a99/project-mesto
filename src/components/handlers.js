import { placesList, cardPopup, profileName, profileDescription, currentUserId } from '../index.js';
import { closeModal } from './modal.js';
import { createCard } from './card.js';
import { addNewCard, updateUserInfo, updateUserAvatar } from './api.js';

const profileImage = document.querySelector('.profile__image');

/**
 * Блокирует или разблокирует все элементы формы
 * @param {HTMLFormElement} form - Форма
 * @param {boolean} isLocked - Флаг блокировки
 */
function toggleFormLock(form, isLocked) {
  const elements = form.elements;
  
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = isLocked;
  }
  
  const submitButton = form.querySelector('.popup__button');
  if (submitButton) {
    submitButton.textContent = isLocked ? 'Сохранение...' : 'Сохранить';
  }
}

/**
 * Обработчик отправки формы карточки
 */
export function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  
  toggleFormLock(form, true); // Блокируем форму

  addNewCard({
    name: form.elements.title.value,
    link: form.elements.link.value
  })
    .then(cardData => {
      const cardElement = createCard(cardData, currentUserId);
      placesList.prepend(cardElement);
      form.reset();
      closeModal(cardPopup);
    })
    .catch(err => {
      console.error('Ошибка создания карточки:', err);
      // Можно добавить показ ошибки пользователю
    })
    .finally(() => toggleFormLock(form, false)); // Разблокируем форму
}

/**
 * Обработчик отправки формы профиля
 */
export function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  
  toggleFormLock(form, true); // Блокируем форму

  updateUserInfo({
    name: form.elements.name.value,
    about: form.elements.description.value
  })
    .then(userData => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(form.closest('.popup'));
    })
    .catch(err => {
      console.error('Ошибка обновления профиля:', err);
    })
    .finally(() => toggleFormLock(form, false)); // Разблокируем форму
}

/**
 * Обработчик отправки формы аватара
 */
export function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  
  toggleFormLock(form, true); // Блокируем форму

  updateUserAvatar(form.elements.avatar.value.trim())
    .then(userData => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      form.reset();
      closeModal(form.closest('.popup'));
    })
    .catch(err => {
      console.error('Ошибка обновления аватара:', err);
    })
    .finally(() => toggleFormLock(form, false)); // Разблокируем форму
}