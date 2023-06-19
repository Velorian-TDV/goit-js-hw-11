import addImages from './scripts/imageRequest';

const search_form = document.querySelector('.search-form');

search_form.addEventListener('submit', event => {

    event.preventDefault();

    addImages()

})