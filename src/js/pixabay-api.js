import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { displayImages } from "./render-functions";
import axios from "axios";

document.querySelector(".form").addEventListener("submit", event => {
  event?.preventDefault();
  pixabaySearch(event);
});

let errorMessageShown = false;

function pixabaySearch(event) {
  const form = document.querySelector('.form');
  const input = document.querySelector('.input');
  const gallery = document.querySelector('.gallery');

  const searchInput = input.value.trim();

  if (searchInput !== "") {
    const apiKey = '9233093-942588744ee96c4f575017f3e';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true`;

    axios.get(url)
      .then(response => {
        const data = response.data;
        if (data.hits.length === 0) {
          if (!errorMessageShown) {
            iziToast.error({
              title: 'Error',
              message: "Sorry, there are no images matching your search query. Please try again!",
              position: 'topCenter'
            });
            errorMessageShown = true;
          }
        } else {
          // Slice the first 15 results
          const first15Results = data.hits.slice(0, 15);
          displayImages(first15Results);
        }
      })
      .catch(error => {
        console.error('axios problem', error);
      });
  } else {
    iziToast.error({
      title: 'Error',
      message: "Empty input!",
      position: 'topCenter'
    });
  }
}

export { pixabaySearch };
