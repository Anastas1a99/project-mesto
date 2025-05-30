import { cardTemplate, imagePopup, openConfirmDelete } from '../index.js';
import { openModal } from './modal.js';
import { likeCard, unlikeCard} from './api.js';


function createCard(cardData, currentUserId) {
  // 1. Клонируем шаблон карточки
  const cardElement = cardTemplate.children[0].cloneNode(true);
  
  // 2. Находим все необходимые элементы
  const elements = {
    image: cardElement.querySelector('.card__image'),
    title: cardElement.querySelector('.card__title'),
    likeBtn: cardElement.querySelector('.card__like-button'),
    deleteBtn: cardElement.querySelector('.card__delete-button'),
    likeContainer: cardElement.querySelector('.card__like-container'),
    likeCounter: cardElement.querySelector('.card__like-count') || createLikeCounter(cardElement)
  };

  // 3. Заполняем карточку данными
  initCardData(elements, cardData);
  
  // 4. Проверяем лайки пользователя
  checkUserLikes(elements.likeBtn, cardData.likes, currentUserId);
  
  // 5. Настраиваем обработчики событий
  setupEventHandlers(cardElement, elements, cardData, currentUserId);

  return cardElement;
}



// Создание счетчика лайков при его отсутствии
function createLikeCounter(cardElement) {
  const counter = document.createElement('span');
  counter.classList.add('card__like-count');
  cardElement.querySelector('.card__like-container').appendChild(counter);
  return counter;
}

// Заполнение карточки данными
function initCardData(elements, data) {
  elements.image.src = data.link;
  elements.image.alt = data.name;
  elements.title.textContent = data.name;
  elements.likeCounter.textContent = data.likes.length;
}

// Проверка лайков текущего пользователя
function checkUserLikes(likeButton, likes, userId) {
  if (likes.some(user => user._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }
}

// Настройка обработчиков событий
function setupEventHandlers(cardElement, elements, data, userId) {
  // Обработчик лайков
  elements.likeBtn.addEventListener('click', () => handleLikeClick(elements, data._id));
  
  // Обработчик удаления
  if (data.owner._id === userId) {
    elements.deleteBtn.addEventListener('click', () => openConfirmDelete(cardElement, data._id));
  } else {
    elements.deleteBtn.style.display = 'none';
  }
  
  // Обработчик открытия изображения
  elements.image.addEventListener('click', () => openCardImage(data, elements.image));
}


// Обработка клика по лайку
function handleLikeClick(elements, cardId) {
  // Если уже выполняется запрос - игнорируем клик
  if (elements.likeBtn.classList.contains('card__like-button_loading')) {
    return;
  }

  const isLiked = elements.likeBtn.classList.contains('card__like-button_is-active');
  
  // Добавляем класс загрузки и блокируем кнопку
  elements.likeBtn.classList.add('card__like-button_loading');
  elements.likeBtn.disabled = true;

  const action = isLiked ? unlikeCard(cardId) : likeCard(cardId);

  action
    .then(updatedCard => {
      elements.likeBtn.classList.toggle('card__like-button_is-active');
      elements.likeCounter.textContent = updatedCard.likes.length;
    })
    .catch(err => {
      console.error('Ошибка при обновлении лайка:', err);
      // Можно добавить отображение ошибки
    })
    .finally(() => {
      // Восстанавливаем состояние кнопки
      elements.likeBtn.classList.remove('card__like-button_loading');
      elements.likeBtn.disabled = false;
    });
}

// Открытие изображения карточки
function openCardImage(data, imageElement) {
  const popupImage = imagePopup.querySelector('.popup__image');
  const popupCaption = imagePopup.querySelector('.popup__caption');
  
  popupImage.src = data.link;
  popupImage.alt = data.name;
  popupCaption.textContent = data.name;
  
  openModal(imagePopup);
}

export { createCard };