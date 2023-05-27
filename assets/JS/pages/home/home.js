var swiper = new Swiper('.customerSwiper', {
  slidesPerView: 1,
  spaceBetween: 50,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    750: {
      slidesPerView: 1,
    },
    1200: {
      slidesPerView: 2,
    },
    1600: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1800: {
      slidesPerView: 3,
      spaceBetween: 45,
    },
    1920: {
      slidesPerView: 3,
      spaceBetween: 45,
    },
  },
});
