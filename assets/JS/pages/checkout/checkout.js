const continueBtn = document.querySelector('.new-customer__continue');
const accountContainer = document.querySelector('.account');
const newCustomerContainer = document.querySelector('.new-customer');

continueBtn.addEventListener('click', () => {
  accountContainer.style.display = 'none';
  newCustomerContainer.style.display = 'block';
});

const shippingStateBtn = document.querySelector("input[name='shipping-state']");
const shippingAddressWrapper = document.querySelector('.shipping-address.toggled');

shippingStateBtn.addEventListener('click', () => {
  shippingAddressWrapper.classList.toggle('mx-h-0');
});

/*******************************************/
const guestBtn = document.querySelector('input[name="guest-checkout-input"]');
const passwordsWrapper = document.querySelector('.user-checkout');
guestBtn.addEventListener('click', () => {
  passwordsWrapper.classList.toggle('mx-h-0');
  const inputs = passwordsWrapper.querySelectorAll('input');
  inputs.forEach(input => {
    input.disabled = !input.disabled;
  });
});

/*******************************************/
const mainPassword = document.querySelector("input[type='password'][main]");
const retypedPassword = document.querySelector("input[type='password'][retyped]");
const form = document.querySelector('.new-customer');
const guestCheck = document.querySelector('input[name="guest-checkout-input"]');

const checkPasswordsEquality = () => {
  if (mainPassword.value !== retypedPassword.value) {
    retypedPassword.validity.valid = false;
  }
};

form.addEventListener('submit', e => {
  if (!guestCheck.checked) {
    e.preventDefault();
    checkPasswordsEquality();
    form.submit();
  }
});
