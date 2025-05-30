import './pages/index.css';
import { createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { handleCardFormSubmit, handleProfileFormSubmit, handleAvatarFormSubmit } from './components/handlers.js';
import { enableValidation } from './components/validation.js';
import { getUserInfo, getInitialCards, deleteCard } from './components/api.js';

export const cardTemplate = document.querySelector('#card-template').content;
export const placesList = document.querySelector('.places__list');

export const profilePopup = document.querySelector('.popup_type_edit');
export const cardPopup = document.querySelector('.popup_type_new-card');
export const imagePopup = document.querySelector('.popup_type_image');

export const profileName = document.querySelector('.profile__title');
export const profileDescription = document.querySelector('.profile__description');
export const profileNameInput = profilePopup.querySelector('.popup__input_type_name');
export const profileDescriptionInput = profilePopup.querySelector('.popup__input_type_description');
const profileForm = profilePopup.querySelector('.popup__form');
export const saveButton = profileForm.querySelector('.popup__button');

export const newCardTitle = document.querySelector('.popup__input_type_card-name');
export const newCardImage = document.querySelector('.popup__input_type_url');
export const cardFormElement = cardPopup.querySelector('.popup__form');

const popups = document.querySelectorAll('.popup');
popups.forEach(popup => popup.classList.add('popup_is-animated'));

export let currentUserId = null;


const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarPopup.querySelector('.popup__input_type_avatar-link');
const avatarButton = document.querySelector('.profile__avatar-edit-button');
const profileImage = document.querySelector('.profile__image');

const confirmDeletePopup = document.querySelector('.popup_type_confirm-delete');
const confirmDeleteForm = confirmDeletePopup.querySelector('form');
const confirmDeleteButton = confirmDeleteForm.querySelector('.popup__button');


getUserInfo()
  .then(user => {
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    profileImage.style.backgroundImage = `url(${user.avatar})`;
    currentUserId = user._id;

    // Загрузим карточки после того, как получили currentUserId
    return getInitialCards();
  })
  .then(cards => {
    cards.forEach(cardData => {
      const card = createCard(cardData, currentUserId);
      placesList.prepend(card);
    });
  })
  .catch(err => console.error('Ошибка при загрузке данных:', err));


popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
});



// Открытие попапа редактирования профиля
const editButton = document.querySelector('.profile__edit-button');
editButton.addEventListener('click', () => {
    profileNameInput.value = profileName.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    openModal(profilePopup);
});

const closeEditButton = profilePopup.querySelector('.popup__close');
closeEditButton.addEventListener('click', () => {
  closeModal(profilePopup);
});

const addButton = document.querySelector('.profile__add-button');
addButton.addEventListener('click', () => {
    newCardTitle.value = newCardTitle.textContent;
    newCardImage.value = newCardImage.textContent;
    openModal(cardPopup);
    //validateCardForm();
});

const closeCardButton = cardPopup.querySelector('.popup__close');
closeCardButton.addEventListener('click', () => {
  closeModal(cardPopup);
});

// Закрытие попапа картинки
const closeImageButton = imagePopup.querySelector('.popup__close');
closeImageButton.addEventListener('click', () => {
    closeModal(imagePopup);
});

profileForm.addEventListener('submit', handleProfileFormSubmit); 
cardFormElement.addEventListener('submit', handleCardFormSubmit);

// Открытие попапа при клике по иконке редактирования
avatarButton.addEventListener('click', () => {
  avatarInput.value = '';
  openModal(avatarPopup);
});

// Закрытие попапа
const closeAvatarButton = avatarPopup.querySelector('.popup__close');
closeAvatarButton.addEventListener('click', () => closeModal(avatarPopup));

// Отправка формы
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

let isDeleting = false; // Флаг для отслеживания процесса удаления
let cardToDelete = null;

export function openConfirmDelete(cardElement, cardId) {
  cardToDelete = { element: cardElement, id: cardId };
  confirmDeleteButton.disabled = false; // Сбрасываем состояние кнопки
  confirmDeleteButton.textContent = 'Да';
  openModal(confirmDeletePopup);
}

confirmDeleteForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  
  if (isDeleting || !cardToDelete) return;
  
  isDeleting = true;
  confirmDeleteButton.disabled = true;
  confirmDeleteButton.textContent = 'Удаление...';

  deleteCard(cardToDelete.id)
    .then(() => {
      cardToDelete.element.remove();
      closeModal(confirmDeletePopup);
    })
    .catch(err => {
      console.error('Ошибка удаления карточки:', err);
      // Можно добавить отображение ошибки пользователю
      const errorElement = document.createElement('div');
      errorElement.textContent = 'Не удалось удалить карточку';
      errorElement.style.color = '#ff0000';
      confirmDeleteForm.appendChild(errorElement);
      setTimeout(() => errorElement.remove(), 3000);
    })
    .finally(() => {
      isDeleting = false;
      confirmDeleteButton.disabled = false;
      confirmDeleteButton.textContent = 'Да';
      cardToDelete = null;
    });
});


const confirmDeleteCloseButton = confirmDeletePopup.querySelector('.popup__close');
confirmDeleteCloseButton.addEventListener('click', () => closeModal(confirmDeletePopup));


const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationSettings);

