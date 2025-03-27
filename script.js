'use strict';

// Variables globales para control de carruseles
let currentSlide = 0;
let slidePrensa = 0;

/**
 * Controla la visualización de slides en el carrusel principal
 * @param {number} index - Índice del slide a mostrar
 */
function showSlide(index) {
    const slides = document.querySelectorAll('.img-slide');
    const totalSlides = slides.length;

    // Manejo de índices circulares
    currentSlide = index >= totalSlides ? 0 : index < 0 ? totalSlides - 1 : index;

    // Aplica la transformación para mostrar el slide actual
    const offset = -currentSlide * 100;
    document.querySelector('.carousel-images').style.transform = `translateX(${offset}%)`;
    updateCarouselIndicators();
}

/**
 * Actualiza los indicadores visuales del carrusel
 */
function updateCarouselIndicators() {
    const indicators = document.querySelectorAll('.carousel-indicators span');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

/**
 * Inicializa los indicadores del carrusel principal
 */
function initCarouselIndicators() {
    const slides = document.querySelectorAll('.img-slide');
    const indicatorContainer = document.querySelector('.carousel-indicators');
    
    slides.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.addEventListener('click', () => showSlide(index));
        indicatorContainer.appendChild(indicator);
    });
    updateCarouselIndicators();
}

/**
 * Cambia la visualización para mostrar todas las imágenes en formato galería
 */
function viewAllImages() {
    const gallery = document.querySelector('.gallery-images');
    gallery.style.flexWrap = 'wrap';
    gallery.style.justifyContent = 'center';
    ['buttons', 'gallery-indicator'].forEach(className => {
        document.querySelector(`.${className}`).style.display = 'none';
    });
}

/**
 * Controla la visualización de slides en el carrusel de prensa
 * @param {number} index - Índice del slide a mostrar
 */
function showSlidePrensa(index) {
    const slidesPrensa = document.querySelectorAll('.prensa-img');
    const totalSlides = slidesPrensa.length;

    // Manejo de índices circulares
    slidePrensa = index >= totalSlides ? 0 : index < 0 ? totalSlides - 1 : index;

    // Aplica la transformación para mostrar el slide actual
    const offset = -slidePrensa * 100;
    document.querySelector('.prensa-slide').style.transform = `translateX(${offset}%)`;
}

/**
 * Inicializa el carrusel de prensa
 */
function initPrensaIndicator() {
    const slidesPrensa = document.querySelectorAll('.prensa-img');
    const indicatorContainer = document.querySelector('.prensa-indicator');
    
    slidesPrensa.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.addEventListener('click', () => showSlidePrensa(index));
        indicatorContainer.appendChild(indicator);
    });
}

/**
 * Obtiene y muestra las publicaciones de Instagram
 */
async function fetchInstagramPosts() {
    const accessToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
    const userId = 'YOUR_INSTAGRAM_USER_ID';
    const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const feedContainer = document.getElementById('instagram-feed');

        data.data.forEach(post => {
            if (['IMAGE', 'CAROUSEL_ALBUM'].includes(post.media_type)) {
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

// Inicialización y event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de carruseles
    initCarouselIndicators();
    initPrensaIndicator();
    showSlide(currentSlide);
    showSlidePrensa(slidePrensa);
    fetchInstagramPosts();

    // Configuración del menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let menuOpen = false;

    // Control del menú móvil
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        menuToggle.setAttribute('aria-expanded', menuOpen);
        navLinks.classList.toggle('show');
    });

    // Cierre del menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (menuOpen && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            menuOpen = false;
            navLinks.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Cierre del menú al hacer clic en enlaces
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuOpen = false;
            navLinks.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Ajuste del menú en cambio de tamaño de ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menuOpen) {
            menuOpen = false;
            navLinks.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Control de la animación del header al hacer scroll
document.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('shrink', window.scrollY > 50);
});