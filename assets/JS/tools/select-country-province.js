/*
    -------------> H T M L <-------------
    !!Replace the `UNIQUE IDENTIFIER`
    <select select="country" aim="{{UNIQUE IDENTIFIER}}"></select>
    <select select="province" target="{{UNIQUE IDENTIFIER}}"></select>
*/

const countrySelects = document.querySelectorAll('select[select="country"]');
const provinceSelects = document.querySelectorAll('select[select="province"]');
let countriesObject;

const fetchCountries = async () => {
  const response = await fetch('/assets/JSON/countries.json');
  const countriesObjectJSON = await response.json();
  countriesObject = countriesObjectJSON;
  initializeSelects();
};

const initializeSelects = () => {
  countrySelects.forEach(countrySelect => {
    const provinceSelectId = countrySelect.getAttribute('aim');
    const provinceSelect = document.querySelector(`select[target="${provinceSelectId}"]`);
    insertCountriesOptions(countrySelect, countriesObject);
    insertProvincesOptions(countrySelect, provinceSelect, countriesObject);
  });
};

const insertCountriesOptions = (countrySelect, countriesObject) => {
  const countryOptions = countriesObject.map(countryObject => {
    const selected = countryObject.countryName === 'United States' ? 'selected' : '';
    return `<option value="${countryObject.countryName}" ${selected}>${countryObject.countryName}</option>`;
  });
  countrySelect.innerHTML = countryOptions.join('');
};

const insertProvincesOptions = (countrySelect, provinceSelect, countriesObject) => {
  const countryObject = countriesObject.find(countryObject => countryObject.countryName === countrySelect.value);
  if (countryObject) {
    const provinceOptions = countryObject.regions.map(region => {
      const selected = region.name === provinceSelect.getAttribute('value') ? 'selected' : '';
      return `<option value="${region.name}" ${selected}>${region.name}</option>`;
    });
    provinceSelect.innerHTML = provinceOptions.join('');
  }
};

countrySelects.forEach(countrySelect => {
  countrySelect.addEventListener('change', () => {
    const provinceSelectId = countrySelect.getAttribute('aim');
    const provinceSelect = document.querySelector(`select[target="${provinceSelectId}"]`);
    insertProvincesOptions(countrySelect, provinceSelect, countriesObject);
  });
});

fetchCountries();
