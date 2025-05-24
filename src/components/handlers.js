import { placesList, newCardTitle, newCardImage, cardPopup, 
         profileNameInput, profileDescriptionInput, 
         profileName, profileDescription, currentUserId } from '../index.js';
import { closeModal } from './modal.js';
import { createCard } from './card.js';
import { addNewCard, updateUserInfo, updateUserAvatar } from './api.js';

// Получаем элемент аватара профиля
const profileImage = document.querySelector('.profile__image');

/**
 * Устанавливает состояние загрузки для кнопки
 * @param {HTMLElement} button - Кнопка
 * @param {boolean} isLoading - Флаг загрузки
 * @param {string} defaultText - Текст по умолчанию
 */
function setLoadingState(button, isLoading, defaultText = 'Сохранить') {
  button.textContent = isLoading ? 'Сохранение...' : defaultText;
}


/**
 * Обработчик отправки формы карточки
 * @param {Event} evt - Событие формы
 */
export function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const submitButton = form.querySelector('.popup__button');
  const { title, link } = form.elements;

  setLoadingState(submitButton, true);

  addNewCard({ name: title.value, link: link.value })
    .then(cardData => {
      const cardElement = createCard(cardData, currentUserId);
      placesList.prepend(cardElement);
      form.reset();
      closeModal(cardPopup);
    })
    .catch(err => console.error('Ошибка создания карточки:', err))
    .finally(() => setLoadingState(submitButton, false));
}

/**
 * Обработчик отправки формы профиля
 * @param {Event} evt - Событие формы
 */
export function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const submitButton = form.querySelector('.popup__button');
  const { name, description } = form.elements;

  setLoadingState(submitButton, true);

  updateUserInfo({ 
    name: name.value, 
    about: description.value 
  })
    .then(userData => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(form.closest('.popup'));
    })
    .catch(err => console.error('Ошибка обновления профиля:', err))
    .finally(() => setLoadingState(submitButton, false));
}

/**
 * Обработчик отправки формы аватара
 * @param {Event} evt - Событие формы
 */
export function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const submitButton = form.querySelector('.popup__button');
  const avatarLink = form['avatar'].value.trim();

  setLoadingState(submitButton, true, 'Сохранить');

  updateUserAvatar(avatarLink)
    .then(userData => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      form.reset();
      closeModal(form.closest('.popup'));
    })
    .catch(err => console.error('Ошибка обновления аватара:', err))
    .finally(() => setLoadingState(submitButton, false, 'Сохранить'));
}