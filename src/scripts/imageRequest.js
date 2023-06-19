import "simplelightbox/dist/simple-lightbox.min.css";

import SimpleLightbox from 'simplelightbox';
import axios from 'axios';
import { Notify } from 'notiflix';
import { hideButton, showButton } from './addSearchButton';

const URL = 'https://pixabay.com/api/';
const KEY = '37437370-877202df46223cca979279914';

const gallery = document.querySelector('.gallery');
const searchQuery = document.querySelector('.searchQuery');

let pageCounter = 0;
let histCounter = 0;

searchQuery.addEventListener('change', () => {

    histCounter = 0;
    pageCounter = 0;
    gallery.innerHTML = '';
    hideButton();

});

let carosel = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250
});

carosel.on('error.simplelightbox', function (e) {
    console.log(e);
});  

async function createElement(arr) {

    const htmlElements = arr.map(element => `
        <div class="photo-card">
            <a href="${element.largeImageURL}">
                <img
                    src="${element.webformatURL}" 
                    alt="${element.tags}" 
                    loading="lazy"
                    class="test" 
                />
            </a>
            
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <b>${element.likes}</b>
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <b>${element.views}</b>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <b>${element.comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <b>${element.downloads}</b>
                </p>
            </div>
        </div>
    `);

    gallery.insertAdjacentHTML('beforeend', htmlElements.join(''));

    carosel.refresh();

}

async function resp(options) {

    const response = await axios.get(URL, options);
    const { hits, total, totalHits } = response.data;

    if (histCounter === 0 && total != 0) {
        
        Notify.success(`Hooray! We found ${totalHits} images.`)

    }

    histCounter += hits.length;

    if (total === 0) {
        
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');

    }
    
    else if (histCounter >= totalHits) {

        Notify.failure("We're sorry, but you've reached the end of search results.");
        await hideButton();
        await createElement(hits);

    }
    
    else {

        await Promise.all([hideButton(), createElement(hits), showButton()]);

    }

}

async function addImages() {

    pageCounter++;

    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params: {
            key: KEY,
            q: searchQuery.value,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
            page: pageCounter,
        },
    };

    try {

        await resp(options);
    
    } catch {
    
        Notify.failure('Error');
    
    }

}

export default addImages;