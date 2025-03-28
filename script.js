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
 * Cambia el slide actual en el carrusel principal.
 * @param {number} direction - Dirección del cambio (-1 para anterior, 1 para siguiente).
 */
function changeSlide(direction) {
    showSlide(currentSlide + direction);
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
 * Obtiene y muestra las publicaciones de Instagram
 */
async function fetchInstagramPosts() {
    const accessToken = 'IGAAS8CoJ1UzJBZAE05VUJKSlp0My1JS3RfUWVNM0FDQnhEeVBGbzdWX2F0NmRqbTJsQUR5QWpidDVrT0FqYzY4a1VSdTFsd2V4U1F6ZAjlKTVBZAb1I0YmRTSHRzX2pOWkNsMHIxbDF5VVlVVERIMlN1Sy1aOXRUUXc3dlQ1QXFMVQZDZD';
    const userId = '17841400353584478';
    const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();
        const feedContainer = document.getElementById('instagram-feed');
        
        if (!data.data || data.data.length === 0) {
            feedContainer.innerHTML = '<p class="no-posts">No hay publicaciones disponibles.</p>';
            return;
        }

        feedContainer.innerHTML = data.data
            .filter(post => ['IMAGE', 'CAROUSEL_ALBUM'].includes(post.media_type))
            .slice(0, 6) // Limitar a 6 posts
            .map(post => {
                const caption = post.caption || 'Nueva publicación de Instagram';
                const date = new Date(post.timestamp).toLocaleDateString();
                return `
                    <a href="${post.permalink}" target="_blank" class="instagram-post">
                        <img src="${post.media_url}" alt="${caption}">
                        <div class="post-overlay">
                            <p class="post-caption">${caption}</p>
                            <small>${date}</small>
                        </div>
                    </a>
                `;
            })
            .join('');

    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        document.getElementById('instagram-feed').innerHTML = 
            '<p class="error-message">Error al cargar las publicaciones.</p>';
    }
}

// Inicialización y event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de carruseles
    initCarouselIndicators();
    
    showSlide(currentSlide);

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