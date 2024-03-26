import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from "axios";
import { displayImages } from "./render-functions";

const apiKey = '9233093-942588744ee96c4f575017f3e';
let currentPage = 1;
const resultsPerPage = 15;
let totalHits = 0;

async function pixabaySearch(isLoadMore) {
    const input = document.querySelector('.input');
    const searchInput = input.value.trim();

    if (searchInput === "") {
        const loadBtn = document.querySelector(".loadbtn");
        loadBtn.style.display = 'none';
        showErrorToast("Empty input!");
        return;
    }

    const loader = document.querySelector('.loader');
    loader.style.display = 'block';

    let url = `https://pixabay.com/api/?key=${apiKey}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}`;

    if (isLoadMore) {
        currentPage++;
    } else {
        currentPage = 1;
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
                const loadBtn = document.querySelector(".loadbtn");
                loadBtn.style.display = 'block';
            } else if (totalHits <= currentPage * resultsPerPage) {
                const loadBtn = document.querySelector(".loadbtn");
                loadBtn.style.display = 'none';
                if (totalHits > resultsPerPage) {
                    showEndOfResultsMessage();
                }
            }
        }
    } catch (error) {
        console.error('axios problem', error);
        showErrorToast('axios problem');
    } finally {
        loader.style.display = 'none';
    }
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

export { pixabaySearch, showErrorToast, showEndOfResultsMessage };
