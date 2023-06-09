// Function to create select element with options
function createSelectWithOptions(options) {
  const select = document.createElement('select');
  options.forEach(option => {
    const { text, value } = option;
    const optionElement = document.createElement('option');
    optionElement.text = text;
    optionElement.value = value;
    select.appendChild(optionElement);
  });
  return select;
}

// Function to build variant options with either select and options or radio inputs
export default function buildVariantOptions(selectors, inputType, callbacks) {
  const { cartFormSelector, productPriceWrapperSelector, addToCartBtnSelector, selectOptionsWrapperSelector } =
    selectors;

  // Validate selectors
  const cartForm = document.querySelector(cartFormSelector);
  const productPriceWrapper = document.querySelector(productPriceWrapperSelector);
  const addToCartBtn = document.querySelector(addToCartBtnSelector);
  const selectOptionsWrapper = document.querySelector(selectOptionsWrapperSelector);

  if (!cartForm) {
    console.error('Invalid selector: cartFormSelector');
    return;
  }
  if (!productPriceWrapper) {
    console.error('Invalid selector: productPriceWrapperSelector');
    return;
  }
  if (!addToCartBtn) {
    console.error('Invalid selector: addToCartBtnSelector');
    return;
  }
  if (!selectOptionsWrapper) {
    console.error('Invalid selector: selectOptionsWrapperSelector');
    return;
  }
  if (callbacks) {
    // Validate the callbacks array
    if (!Array.isArray(callbacks)) {
      throw new Error('Callbacks must be an array.');
    }

    callbacks.forEach(callback => {
      if (typeof callback !== 'function') {
        throw new Error('Callbacks must be functions.');
      }
    });
  }
  const variantLabels = [];
  const variantOptions = [];

  // creating the total arrays of options for each variant
  product.product_option.forEach(variant => {
    variantLabels.push(variant);
    variantOptions.push([]);
  });

  // creating each array options (variant options)
  product.product_variants.forEach(value => {
    value.variant_option_value.forEach((innerValue, index) => {
      if (!variantOptions[index].includes(innerValue)) {
        variantOptions[index].push(innerValue);
      }
    });
  });

  // Function to handle updating product details based on the selected option
  function updateProductDetails(selectedOption) {
    const sale = selectedOption.getAttribute('sale') === 'true';
    const price = selectedOption.getAttribute('price');
    const discountedPrice = selectedOption.getAttribute('discounted-price');
    const status = selectedOption.getAttribute('status');

    if (sale) {
      productPriceWrapper.innerHTML = `<span>${price}</span><span class="discounted">${discountedPrice}</span>`;
    } else {
      productPriceWrapper.innerHTML = `<span>${price}</span>`;
    }

    addToCartBtn.disabled = status === 'false';
    addToCartBtn.innerText = status === 'false' ? 'OUT OF STOCK' : 'ADD TO CART';
  }

  // Function to handle change event for variant selects and radio inputs
  function handleVariantSelectChange(variantLabels, variantOptions, inputType, callbacks) {
    const variantsActionInputs = document.querySelectorAll(
      `${selectOptionsWrapperSelector} input, ${selectOptionsWrapperSelector} select`
    );
    variantsActionInputs.forEach(input => {
      input.addEventListener('change', () => {
        let selectedValue;
        if (inputType === 'select') {
          selectedValue = Array.from(variantsActionInputs)
            .filter(input => input.tagName === 'SELECT')
            .map(select => select.value)
            .join(',');
        } else if (inputType === 'radio') {
          selectedValue = Array.from(variantsActionInputs)
            .filter(input => input.checked)
            .map(input => input.value)
            .join(',');
        }
        for (let i = 0; i < variantMainSelect.options.length; i++) {
          const option = variantMainSelect.options[i];
          if (option.text === selectedValue) {
            option.selected = true;
            updateProductDetails(option);
            callbacks?.forEach(callback => {
              callback(variantMainSelect); // Pass the updated variantMainSelect as an argument to each callback function
            });
            break;
          }
        }
      });
    });
  }

  // Create variantMainSelect element
  const variantMainSelect = document.createElement('select');
  variantMainSelect.name = 'CartAdd[0].CartAddVariantID';

  // Create options for variantMainSelect
  product.product_variants.forEach(variant => {
    const option = document.createElement('option');
    option.innerText = variant.variant_option_value;
    option.value = variant.variant_id;
    if (variant.variant_on_sale == true) {
      option.setAttribute('sale', true);
      option.setAttribute('price', variant.variant_discount_price.decimal);
      option.setAttribute('discounted-price', variant.variant_price.decimal);
    } else {
      option.setAttribute('sale', false);
      option.setAttribute('price', variant.variant_price.decimal);
    }
    option.setAttribute('status', variant.variant_status);

    variantMainSelect.appendChild(option);
  });

  // Append variantMainSelect to the cartForm
  cartForm.appendChild(variantMainSelect);

  // Build variant options with select or radio inputs
  variantLabels.forEach((label, index) => {
    const variantLabel = document.createElement('label');
    variantLabel.innerText = label;
    const options = variantOptions[index].map(option => ({
      text: option,
      value: option,
    }));
    if (inputType === 'select') {
      const variantSelect = createSelectWithOptions(options);
      variantSelect.addEventListener('change', () => {
        updateProductDetails(variantSelect);
      });
      variantLabel.appendChild(variantSelect);
    } else if (inputType === 'radio') {
      options.forEach((option, index) => {
        const radioLabel = document.createElement('label');
        radioLabel.innerText = option.text;

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = label;
        radioInput.value = option.value;
        if (index == 0) {
          radioInput.checked = true;
        }
        radioInput.addEventListener('change', () => {
          updateProductDetails(radioInput);
        });

        radioLabel.appendChild(radioInput);
        variantLabel.appendChild(radioLabel);
      });
    }

    selectOptionsWrapper.appendChild(variantLabel);
  });

  // Call the function to handle variant select change
  handleVariantSelectChange(variantLabels, variantOptions, inputType);
}
