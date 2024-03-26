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

document.querySelector(".loadbtn").addEventListener("click", () => {
    loader.style.display = 'block';
    pixabaySearch(true);
    if (loadBtn.style.display !== 'none') {
        const galleryItemHeight = document.querySelector('.smallImage').getBoundingClientRect().height;
        const scrollAmount = galleryItemHeight * 20;
        window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
        });
    }
});

let currentPage = 1;
const resultsPerPage = 15;
const apiKey = '9233093-942588744ee96c4f575017f3e';
let totalHits = 0;
