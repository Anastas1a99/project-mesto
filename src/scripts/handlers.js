import { placesList, newCardTitle, newCardImage, cardPopup, profileNameInput, profileDescriptionInput, profileName, profileDescription, currentUserId } from '../index.js';
import { closeModal } from './modal.js';
import { createCard } from './card.js';
import { addNewCard, updateUserInfo, updateUserAvatar } from './api.js';

const profileImage = document.querySelector('.profile__image');

function setLoading(button, isLoading, defaultText = 'Сохранить') {
  if (isLoading) {
    button.textContent = 'Сохранение...';
  } else {
    button.textContent = defaultText;
  }
}


export function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const form = evt.target;
  const submitButton = form.querySelector('.popup__button');
  const title = form.title.value;
  const link = form.link.value;

  setLoading(submitButton, true);

  addNewCard({ name: title, link })
    .then(cardData => {
      // Создаем карточку и добавляем в список
      const card = createCard(cardData, currentUserId);
      document.querySelector('.places__list').prepend(card);

      closeModal(form.closest('.popup'));
    })
    .catch(err => {
      console.error('Ошибка добавления карточки:', err);
    })
    .finally(() => {
      setLoading(submitButton, false);
    });
}

export function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const form = evt.target;
  const submitButton = form.querySelector('.popup__button');
  const name = form.name.value;
  const about = form.description.value;

  setLoading(submitButton, true);

  updateUserInfo({ name, about })
    .then(user => {
      // Обновляем профиль на странице
      document.querySelector('.profile__title').textContent = user.name;
      document.querySelector('.profile__description').textContent = user.about;

      closeModal(form.closest('.popup'));
    })
    .catch(err => {
      console.error('Ошибка обновления профиля:', err);
      // Попап остается открыт, текст кнопки сменится в finally
    })
    .finally(() => {
      setLoading(submitButton, false);
    });
}


export function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const avatarInput = form.querySelector('.popup__input_type_avatar-link');
  const button = form.querySelector('.popup__button');

  const avatarLink = avatarInput.value.trim();

  button.textContent = 'Сохранение...';

  updateUserAvatar(avatarLink)
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(form.closest('.popup'));
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      button.textContent = 'Сохранить';
    });
}