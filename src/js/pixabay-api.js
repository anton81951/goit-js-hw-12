import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from "axios";
import { displayImages } from "./render-functions";

const apiKey = '9233093-942588744ee96c4f575017f3e';
let currentPage = 1;
const resultsPerPage = 15;
let totalHits = 0;
let searchInputValue = '';

async function pixabaySearch(isLoadMore) {
    const input = document.querySelector('.input');
    const currentSearchInput = input.value.trim();

    const loadBtn = document.querySelector(".loadbtn");
    loadBtn.style.display = 'none';

    if (!isLoadMore) {
        currentPage = 1;
        searchInputValue = currentSearchInput;
    }

    if (isLoadMore) {
        currentPage++;
    }

    if (searchInputValue === "") {
        showErrorToast("Empty input!");
        return;
    }

    const loader = document.querySelector('.loader');
    loader.style.display = 'block';

    let url = `https://pixabay.com/api/?key=${apiKey}&q=${searchInputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.hits.length === 0) {
            const errorMessage = isLoadMore ? "Sorry, there are no more images to load." : "Sorry, there are no images matching your search query. Please try again!";
            showErrorToast(errorMessage);
            document.querySelector(".form").reset();
            loadBtn.style.display = 'none';
        } else {
            totalHits = data.totalHits;
            const imagesToDisplay = data.hits.slice(0, resultsPerPage);
            displayImages(imagesToDisplay, isLoadMore);
            input.value = "";
            if (totalHits <= currentPage * resultsPerPage) {
                loadBtn.style.display = 'none';
                if (totalHits > resultsPerPage && !isLoadMore) {
                    showEndOfResultsMessage();
                }
            } else {
                loadBtn.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('axios problem', error);
        showErrorToast('axios problem');
        loadBtn.style.display = 'none';
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

export { pixabaySearch, showErrorToast, showEndOfResultsMessage, searchInputValue };
