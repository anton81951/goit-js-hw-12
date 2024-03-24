import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

function displayImages(images) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

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

    // Initialize lightbox after rendering images
    const lightbox = new SimpleLightbox('.gallery a');

    const closeModal = () => {
        lightbox.close();
    };

    document.querySelector('.gallery').addEventListener('click', closeModal);

    const refreshLightbox = () => {
        lightbox.refresh();
    };

    refreshLightbox();
}

export { displayImages };
