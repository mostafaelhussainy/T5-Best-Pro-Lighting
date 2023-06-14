// CREDIT CARD INPUTS
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
let monthOptions = '';
let yearOptions = '';
let i;
let currentYear = new Date().getFullYear();

// Populate options for credit-card-month
for (i = 1; i <= 12; i++) {
  const monthValue = ('0' + i).slice(-2);
  const monthLabel = monthNames[i - 1] + ' - (' + i + ')';
  monthOptions += '<option value="' + monthValue + '">' + monthLabel + '</option>';
}

// Populate options for credit-card-expiry-year
for (i = 0; i < 6; i++) {
  const yearValue = currentYear + i;
  yearOptions += '<option value="' + yearValue + '">' + yearValue + '</option>';
}

// Select input for credit-card-month
const monthSelectElement = document.querySelector('select[credit-card-expiry-month]');
monthSelectElement.innerHTML =
  '<select size="1" id="credit-card-month" name="credit-card-month">' + monthOptions + '</select>';

// Select input for credit-card-expiry-year
const yearSelectElement = document.querySelector('select[credit-card-expiry-year]');
yearSelectElement.innerHTML =
  '<select size="1" id="credit-card-expiry-year" name="credit-card-expiry-year">' + yearOptions + '</select>';

// SWITCHING
const addNewCreditCardBtn = document.getElementById('add-new-credit-card');
const cancelBtn = document.getElementById('cancel');
const savedCardsWrapper = document.getElementById('saved-cards');
const newCreditCardForm = document.getElementById('add-new-card');

addNewCreditCardBtn.addEventListener('click', () => {
  newCreditCardForm.classList.remove('none');
  savedCardsWrapper.classList.add('none');
});
cancelBtn.addEventListener('click', () => {
  newCreditCardForm.classList.add('none');
  savedCardsWrapper.classList.remove('none');
});

const addressBookBtn = document.getElementById('address-book');
const newAddressBtn = document.getElementById('new-address');
const addressBookWrapper = document.querySelector('.address-info__address-book');
const newAddressWrapper = document.querySelector('.address-info__new-address');

addressBookBtn.addEventListener('click', () => {
  newAddressBtn.classList.add('button--primary--ghost');
  newAddressBtn.classList.remove('button--secondary', 'button-disabled');
  addressBookBtn.classList.add('button--secondary', 'button-disabled');
  addressBookBtn.classList.remove('button--primary--ghost');

  addressBookWrapper.classList.remove('none');
  newAddressWrapper.classList.add('none');
});
newAddressBtn.addEventListener('click', () => {
  addressBookBtn.classList.add('button--primary--ghost');
  addressBookBtn.classList.remove('button--secondary', 'button-disabled');
  newAddressBtn.classList.add('button--secondary', 'button-disabled');
  newAddressBtn.classList.remove('button--primary--ghost');

  addressBookWrapper.classList.add('none');
  newAddressWrapper.classList.remove('none');
});
