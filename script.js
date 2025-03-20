'use strict';

let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.img-slide');
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    const offset = -currentSlide * 100;
    document.querySelector('.gallery-images').style.transform = `translateX(${offset}%)`;
    updateGalleryIndicator(); // Actualizar el indicador
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

// Muestra la primera imagen al cargar
showSlide(currentSlide);

function updateGalleryIndicator() {
    const indicators = document.querySelectorAll('.gallery-indicator span');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Inicializar el indicador de galería
function initGalleryIndicator() {
    const slides = document.querySelectorAll('.img-slide');
    const indicatorContainer = document.querySelector('.gallery-indicator');
    slides.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.addEventListener('click', () => showSlide(index));
        indicatorContainer.appendChild(indicator);
    });
    updateGalleryIndicator();
}

document.addEventListener('DOMContentLoaded', () => {
    initGalleryIndicator(); // Llamar al inicializar la página
});

// para prensa

let slidePrensa = 0;

function showSlidePrensa(index) {
    const slidesPrensa = document.querySelectorAll('.prensa-img');
    if (index >= slidesPrensa.length) {
        slidePrensa = 0;
    } else if (index < 0) {
        slidePrensa = slidesPrensa.length - 1;
    } else {
        slidePrensa = index;
    }

    const offset = -slidePrensa * 100;
    document.querySelector('.prensa-slide').style.transform = `translateX(${offset}%)`;
}

function changeSlidePrensa(directionPrensa) {
    showSlidePrensa(slidePrensa + directionPrensa);
}

// Muestra la primera imagen al cargar
showSlidePrensa(slidePrensa);

// Inicializar el indicador de prensa
function initPrensaIndicator() {
    const slidesPrensa = document.querySelectorAll('.prensa-img');
    const indicatorContainer = document.querySelector('.prensa-indicator');
    slidesPrensa.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.addEventListener('click', () => showSlidePrensa(index));
        indicatorContainer.appendChild(indicator);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPrensaIndicator(); // Llamar al inicializar la página
});

async function fetchInstagramPosts() {
    const accessToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN'; // Reemplazar con un token válido
    const userId = 'YOUR_INSTAGRAM_USER_ID'; // Reemplazar con el ID de usuario de Instagram
    const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const feedContainer = document.getElementById('instagram-feed');
        data.data.forEach(post => {
            if (post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM') {
                const imgElement = document.createElement('a');
                imgElement.href = post.permalink;
                imgElement.target = '_blank';
                imgElement.innerHTML = `<img src="${post.media_url}" alt="${post.caption || 'Instagram Post'}">`;
                feedContainer.appendChild(imgElement);
            }
        });
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
    }
}

// Llamar a la función para cargar las publicaciones al cargar la página
document.addEventListener('DOMContentLoaded', fetchInstagramPosts);