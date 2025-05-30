import { hideInputError } from './validation'; 

/**
 * Открывает модальное окно
 * @param {HTMLElement} popup - Элемент модального окна
 */
export function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscapeKey);

  
}

/**
 * Закрывает модальное окно 
 * @param {HTMLElement} popup - Элемент модального окна
 */
export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscapeKey);

    // Очищаем ошибки валидации
    const form = popup.querySelector('form');
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            hideInputError(form, input, {
                inputErrorClass: 'popup__input_type_error',
                errorClass: 'popup__error_visible'
            });
        });
    }
}

/**
 * Обработчик закрытия по Escape
 * @param {KeyboardEvent} evt - Событие клавиатуры
 */
function handleEscapeKey(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) closeModal(openedPopup);
    }
}

/**
 * Инициализирует обработчики клика по оверлею и крестику
 * @param {HTMLElement} popup - Элемент модального окна
 */
export function setupModalCloseHandlers(popup) {
    popup.addEventListener('mousedown', (evt) => {
        if (evt.target === popup || evt.target.classList.contains('popup__close')) {
            closeModal(popup);
        }
    });
}