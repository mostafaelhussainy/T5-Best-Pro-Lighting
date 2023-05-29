const readMoreBtn = document.getElementById('read-more');
const hiddenSummary = document.querySelector('.summary--hidden');
const readLessBtn = document.getElementById('read-less');

readMoreBtn.addEventListener('click', () => {
  hiddenSummary.classList.remove('summary--hidden--active');
  readMoreBtn.classList.add('none');
});

readLessBtn.addEventListener('click', () => {
  hiddenSummary.classList.add('summary--hidden--active');
  readMoreBtn.classList.remove('none');
});
