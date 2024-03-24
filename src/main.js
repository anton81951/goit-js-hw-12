import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { displayImages } from "./js/render-functions";
import { pixabaySearch } from "./js/pixabay-api";

const gallery = document.querySelector('.gallery');
const loader = document.createElement('div');
loader.style.display = 'none';

document.body.appendChild(loader);

document.querySelector(".form").addEventListener("submit", () => {
    loader.style.display = 'block';
    gallery.innerHTML = '';
    
    pixabaySearch()?.then(() => {
        loader.style.display = 'none';
    }).catch(error => {
        loader.style.display = 'none';
        console.error('loader problem', error);
    });
});

