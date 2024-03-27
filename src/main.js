import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

import { pixabaySearch, showErrorToast, showEndOfResultsMessage } from "./js/pixabay-api";

const gallery = document.querySelector('.gallery');
const loader = document.createElement('div');
loader.style.display = 'none';
loader.classList.add('loader');
document.body.appendChild(loader);

const loadBtn = document.querySelector(".loadbtn");
loadBtn.style.display = 'none';

document.querySelector(".form").addEventListener("submit", async (event) => {
    event.preventDefault();
    loader.style.display = 'block';
    gallery.innerHTML = '';

    try {
        await pixabaySearch(false);
    } catch (error) {
        console.error('fetching error', error);
        showErrorToast('fetching error');
    } finally {
        loader.style.display = 'none';
    }
});

document.querySelector(".loadbtn").addEventListener("click", async () => {
    loader.style.display = 'block';
    await pixabaySearch(true);
    loader.style.display = 'none';

    const galleryHeight = gallery.offsetHeight;
    window.scrollBy({
        top: galleryHeight / 2,
        behavior: 'smooth'
    });
});
