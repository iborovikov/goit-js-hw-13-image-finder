import './styles.css';
import makeCardMurcup from './card-marcup.hbs';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '21303341-d10a6a4fa4d93860f80e51245'

const serchFormRef = document.querySelector('.search-form')
const galaryListRef = document.querySelector('.gallery');
const inputRef = document.querySelector('.input');
const showMoreBtnRef = document.querySelector('.show-more-btn');
let pageNumber = 1;
const scrolloptions = {
    top: 0,
    behavior: "smooth"
};

serchFormRef.addEventListener('submit', onFormSubmit);
showMoreBtnRef.addEventListener('click', onShowMoreBtnClick);
galaryListRef.addEventListener('click', onCardClick)


function onFormSubmit(e) {
    e.preventDefault();
    resetPage();
   
    pageNumber = 1;
    scrolloptions.top = 0;

    makePageMurcup();
};

async function makePageMurcup() {
    const serchItem = inputRef.value;
    const cardData = await fetchCards(serchItem, pageNumber);
    if (chekInput(serchItem, cardData)) {
        galaryListRef.insertAdjacentHTML('beforeend', makeCardMurcup(cardData));
        window.scrollTo(scrolloptions);
    };
};

function chekInput(serchItem, cardData) {
    if (cardData.total === 0) {
        notifaicationPhotoNotFound()
        return 
    } else if (serchItem === '') {
        notifaicationOnAmptySerch()
        return 
    } else {
        return true
    }
    
}

async function fetchCards(serchItem, pageNumber) {
    try {
    const response = await fetch(`${BASE_URL}?image_type=photo&orientation=horizontal&q=${serchItem}&page=${pageNumber}&per_page=12&key=${API_KEY}`);
    const page = await response.json();
    return page;
} catch (err) {
    return error({
        title: 'Ошибка!',
        text: `${err}`
    });
    };
};

function onShowMoreBtnClick() { 
    pageNumber += 1;
    scrolloptions.top += 945;
    makePageMurcup();
};

function resetPage() {
    galaryListRef.innerHTML = '';
};

function notifaicationOnAmptySerch(serchItem) {
    return error({
        title: 'Ошибка!',
        text: 'Заполните поле поиска!'
    });
};

function notifaicationPhotoNotFound() {
    return error({
        title: 'Ошибка!',
        text: 'Изображение не найдено!'
    });
};

async function onCardClick(e) {
    const serchItem = inputRef.value;
    const cardData = await fetchCards(serchItem, pageNumber);
    const arrayOfCards = cardData.hits;
    const cardId = Number(e.target.getAttribute('id'));
    const object = arrayOfCards.find(obj => obj.id === cardId);
    const index = arrayOfCards.indexOf(object);
    const largeImg = arrayOfCards[index].largeImageURL;

    const instance = basicLightbox.create(`<img src="${largeImg}" width="800" height="auto">`);
    instance.show();
}

