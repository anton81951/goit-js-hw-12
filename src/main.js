// imageGallery.js

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

const gallery = document.querySelector('.gallery');
const loader = document.createElement('div');
loader.style.display = 'none';
loader.classList.add('loader');
document.body.appendChild(loader);

const loadBtn = document.querySelector(".loadbtn");
loadBtn.style.display = 'none'; // Hide load button initially

document.querySelector(".form").addEventListener("submit", async (event) => {
    event.preventDefault();
    loader.style.display = 'block';
    gallery.innerHTML = '';

    try {
        await pixabaySearch(false); // Start a new search when form is submitted
    } catch (error) {
        console.error('pixabaySearch error', error);
        showErrorToast('An error occurred while fetching images. Please try again later.');
    } finally {
        loader.style.display = 'none';
    }
});

document.querySelector(".loadbtn").addEventListener("click", () => {
    loader.style.display = 'block';
    pixabaySearch(true); // Load more images when load button is clicked
});

let currentPage = 1;
const resultsPerPage = 15;
const apiKey = '9233093-942588744ee96c4f575017f3e';
let totalHits = 0;

async function pixabaySearch(isLoadMore) {
    const input = document.querySelector('.input');
    const searchInput = input.value.trim();

    if (searchInput === "") {
        showErrorToast("Empty input!");
        return;
    }

    let url = `https://pixabay.com/api/?key=${apiKey}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}`;

    if (isLoadMore) {
        currentPage++; // Increment page number for load more
    } else {
        currentPage = 1; // Reset page number if it's a new search
    }

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.hits.length === 0) {
            const errorMessage = isLoadMore ? "Sorry, there are no more images to load." : "Sorry, there are no images matching your search query. Please try again!";
            showErrorToast(errorMessage);
        } else {
            totalHits = data.totalHits;
            const imagesToDisplay = data.hits.slice(0, resultsPerPage);
            displayImages(imagesToDisplay, isLoadMore);
            if (!isLoadMore) {
                loadBtn.style.display = 'block'; // Display load button if it's a new search and there are images
            } else if (totalHits <= currentPage * resultsPerPage) {
                loadBtn.style.display = 'none'; // Hide load button when all results are displayed
                if (totalHits > resultsPerPage) {
                    showEndOfResultsMessage(); // Show message if there are more images than the initial page size
                }
            }
        }
    } catch (error) {
        console.error('axios problem', error);
        showErrorToast('An error occurred while fetching images. Please try again later.');
    } finally {
        loader.style.display = 'none';
    }
}

function displayImages(images, isLoadMore) {
    if (!isLoadMore) {
        gallery.innerHTML = ''; // Clear gallery if it's a new search
    }

    images.forEach(image => {
        const listItem = document.createElement('li');
        listItem.classList.add('galleryItem');

        const link = document.createElement('a');
        link.href = image.largeImageURL;
        link.setAttribute('data-lightbox', 'gallery');

        const img = document.createElement('img');
        img.classList.add('smallImage');
        img.src = image.webformatURL;
        img.alt = image.tags;

        link.appendChild(img);
        listItem.appendChild(link);

        const statsContainer = document.createElement('div');
        statsContainer.classList.add('statsContainer');

        const statsColumns = ['Likes', 'Views', 'Comments', 'Downloads'];
        statsColumns.forEach(column => {
            const statsColumn = document.createElement('div');
            statsColumn.classList.add('statsColumn');

            const statsLabel = document.createElement('div');
            statsLabel.classList.add('stats');
            statsLabel.textContent = column;

            const statsValue = document.createElement('div');
            statsValue.classList.add(`${column.toLowerCase()}Number`, 'statsvalue');
            statsValue.textContent = image[column.toLowerCase()];

            statsColumn.appendChild(statsLabel);
            statsColumn.appendChild(statsValue);

            statsContainer.appendChild(statsColumn);
        });

        listItem.appendChild(statsContainer);
        gallery.appendChild(listItem);
    });

    // Initialize or refresh lightbox after rendering images
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
}

function showErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message,
        position: 'topCenter'
    });
}

function showEndOfResultsMessage() {
    iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topCenter'
    });
}

export { pixabaySearch, displayImages, showErrorToast, showEndOfResultsMessage };
