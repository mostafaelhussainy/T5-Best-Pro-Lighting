const mainPassword = document.querySelector("input[type='password'][main]");
const retypedPassword = document.querySelector("input[type='password'][retyped]");
const form = document.querySelector('#create-account-form');

console.log(form);
const checkPasswordsEquality = () => {
  if (mainPassword.value !== retypedPassword.value) {
    retypedPassword.setCustomValidity('Passwords must match');
    retypedPassword.validity.valid = false;
  }
};

form.addEventListener('submit', e => {
  e.preventDefault();
  checkPasswordsEquality();
  console.log(retypedPassword.validity.valid);
  form.submit();
});
