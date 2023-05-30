const toggleContentBtns = document.querySelectorAll('.product__description-specs-reviews__controls li button');

const toggleContentDivs = document.querySelectorAll('.toggling-divs');

toggleContentBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    toggleContentBtns.forEach(btn => btn.classList.remove('active'));
    btn.classList.add('active');
    const btnKey = btn.getAttribute('toggle');
    console.log('clicked');
    toggleContentDivs.forEach(div => {
      div.classList.remove('active');
      if (div.getAttribute('toggle') === btnKey) {
        div.classList.add('active');
      }
    });
  });
});
