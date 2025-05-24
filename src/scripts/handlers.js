import { placesList, 
    profileName, 
    profileDescription, 
    profileNameInput, 
    profileDescriptionInput, 
    newCardTitle, 
    newCardImage, 
    cardPopup, 
    profilePopup } from './index.js';
import { closeModal } from './modal.js';
import { createCard } from './card.js';

export function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const newCardData = {
        name: newCardTitle.value,
        link: newCardImage.value,
    };
    const newCard = createCard(newCardData);
    placesList.prepend(newCard);
    closeModal(cardPopup);
}

export function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closeModal(profilePopup);
}