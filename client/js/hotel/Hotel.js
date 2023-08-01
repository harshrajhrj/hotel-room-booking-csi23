var swiper = new Swiper(".h-hotel-carousel-content", {
    effect: "coverflow",
    slidesPerView: "auto",
    // spaceBetween: 25,
    // loop: true,
    // centerSlide: 'true',
    centeredSlides: true,
    fade: 'true',
    grabCursor: 'true',
    pagination: {
        el: ".h-hotel-swiper-pagination",
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
    },
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 300,
        slideShadows: false
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        650: {
            slidesPerView: 2,
        },
        1096: {
            slidesPerView: 3,
        },
    },
});