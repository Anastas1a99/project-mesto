import { cardTemplate, imagePopup, openConfirmDelete } from '../index.js';
import { openModal } from './modal.js';
import { likeCard, unlikeCard, deleteCard } from './api.js';

function createCard(cardData, currentUserId) {
  const cardElement = cardTemplate.children[0].cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeContainer = cardElement.querySelector('.card__like-container'); 



  let cardLikeCount = cardElement.querySelector('.card__like-count');
  if (!cardLikeCount) {
    cardLikeCount = document.createElement('span');
    cardLikeCount.classList.add('card__like-count');
    cardLikeContainer.appendChild(cardLikeCount); 
  }

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardLikeCount.textContent = cardData.likes.length;

  

  if (cardData.likes.some(user => user._id === currentUserId)) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }

  cardLikeButton.addEventListener('click', () => {
    const isLiked = cardLikeButton.classList.contains('card__like-button_is-active');

    const likeAction = isLiked ? unlikeCard(cardData._id) : likeCard(cardData._id);

    likeAction.then(updatedCard => {
      cardLikeButton.classList.toggle('card__like-button_is-active', !isLiked);
      cardLikeCount.textContent = updatedCard.likes.length;
    }).catch(err => {
      console.error('Ошибка при обновлении лайка:', err);
      alert('Не удалось обновить лайк');
    });
  });

  const deleteButton = cardElement.querySelector('.card__delete-button');

  
  if (cardData.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      openConfirmDelete(cardElement, cardData._id);
    });
  } else {
    deleteButton.style.display = 'none';
  }


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