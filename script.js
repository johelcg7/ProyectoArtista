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
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

// Muestra la primera imagen al cargar
showSlide(currentSlide);

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