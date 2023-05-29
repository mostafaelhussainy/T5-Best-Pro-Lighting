const openNavBtn = document.querySelector('#btn__open_nav__small-screens');
const navSmallScreen = document.querySelector('#nav__small-screens');
const navOverLay = document.querySelector('.nav__small-screens__overlay');

const toggleNav = () => navSmallScreen.classList.toggle('fadeOutLeft');
openNavBtn.addEventListener('click', toggleNav);
navOverLay.addEventListener('click', toggleNav);
