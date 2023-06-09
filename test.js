/*  
	--- --- --- ---> P L U S H        S T R U C T U R E <--- --- --- ---
	-----> M A I N        F O R M        T H A T        W R A P S        T H E        O U R        V A R I A N T S <-----
	<%= form({action: cartPath(), method: "POST", class:""}) { %>
		↓↓↓↓ This is the div that wraps your pirces (normal/discounted prices) | !NOTE: don't forget your selector (UNIQUE)
		<div class="prices-div"></div>
  
		↓↓↓↓ This is the div that wraps the variants options as (select or input:radio) elements | !NOTE: don't forget your selector (UNIQUE)
	    <div class="variants-select-wrapper"></div>
	 
		↓↓↓↓ This is the add to cart button !NOTE: don't forget your selector (UNIQUE) | !NOTE: give the disabled button unqiue style
		<button class="" type="submit">ADD TO CART</button>
	<% } %>

  --- --- --- ---> I N S I D E        J S <--- --- --- ---
	import buildVariantOptions from "../Lexmodo-components/variants-builder.js";
	buildVariantOptions(
	  {
	    cartFormSelector: 'form[action="/cart/"]', // Pass in your cart selector | !NOTE: ("string" value)
	    productPriceWrapperSelector: ".price-row", // Pass in your price div selector that will wrap your prices | !NOTE: ("string" value)
	    addToCartBtnSelector: ".add-product-to-cart", // Pass in your "add to cart" button selector | !NOTE: ("string" value)
	    selectOptionsWrapperSelector: ".variants-select-wrapper", // Pass in your cart selector | !NOTE: ("string" value)
	  },
	  inputType, // Set inputType to 'select' or 'radio' as needed | !NOTE: ("string" value)
	  callbacks // Pass the array of callback functions | !NOTE: [reference to the array, reference to the array, ...] or you can omit it
	);
*/

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
  // if there're variants for the product
  if (product.product_option) {
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

    callbacks?.forEach(callback => {
      if (typeof callback !== 'function') {
        throw new Error('Callbacks must be functions.');
      }
    });

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
    variantMainSelect.style.display = 'none';

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
    handleVariantSelectChange(variantLabels, variantOptions, inputType, callbacks);
  }
}
