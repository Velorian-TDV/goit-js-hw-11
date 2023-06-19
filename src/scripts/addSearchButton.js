import addImages from "./imageRequest";

const main_block = document.querySelector('.main-block');

export async function showButton() {
    main_block.querySelector('.load').style.display = 'block';
    main_block.querySelector('.load').addEventListener('click', addImages);
}

export async function hideButton() {
    main_block.querySelector('.load').style.display = 'none';
}