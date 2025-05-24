import { cardTemplate, imagePopup } from './index.js';
import { openModal } from './modal.js';


function createCard(cardData) {
  const cardElement = cardTemplate.children[0].cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardLikeButton.addEventListener('click', () => {
      cardLikeButton.classList.toggle('card__like-button_is-active');
  });

  cardDeleteButton.addEventListener('click', () => {
      const cardToRemove = cardDeleteButton.closest('.card');
      cardToRemove.remove();
  });

  cardImage.addEventListener('click', () => {
      const popupImage = imagePopup.querySelector('.popup__image');
      const popupCaption = imagePopup.querySelector('.popup__caption');
      popupImage.src = cardData.link;
      popupImage.alt = cardData.name;
      popupCaption.textContent = cardData.name;
      openModal(imagePopup);
  });

  return cardElement;
}



export { createCard };