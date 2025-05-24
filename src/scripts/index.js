import { initialCards } from './cards.js';
import { createCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { handleCardFormSubmit, handleProfileFormSubmit } from './handlers.js';
import { enableValidation } from './validation.js';

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


initialCards.forEach((cardData) => {
    const card = createCard(cardData); 
    placesList.prepend(card);
});

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

});

const closeCardButton = cardPopup.querySelector('.popup__close');
closeCardButton.addEventListener('click', () => {
  closeModal(cardPopup);
});


const closeImageButton = imagePopup.querySelector('.popup__close');
closeImageButton.addEventListener('click', () => {
    closeModal(imagePopup);
});

profileForm.addEventListener('submit', handleProfileFormSubmit); 
cardFormElement.addEventListener('submit', handleCardFormSubmit);


const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationSettings);
