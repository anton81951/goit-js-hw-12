import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

import { displayImages } from "./js/render-functions";
import { pixabaySearch } from "./js/pixabay-api";

const gallery = document.querySelector('.gallery');
const loader = document.createElement('div');
loader.style.display = 'none';
loader.classList.add('loader');
document.body.appendChild(loader);

document.querySelector(".form").addEventListener("submit", async (event) => {
    event.preventDefault();
    loader.style.display = 'block';
    gallery.innerHTML = '';
    
    try {
        await pixabaySearch();
    } catch (error) {
        console.error('loader problem', error);
    } finally {
        loader.style.display = 'none';
    }
});

