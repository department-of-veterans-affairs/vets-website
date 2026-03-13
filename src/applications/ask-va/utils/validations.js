import { isValidForm } from '@department-of-veterans-affairs/platform-forms-system/validation';

/**
 * Get schema property names from the specified pages
 * @param {Object} formPages - The form.pages object from Redux state
 * @param {Array} pagesToCheck - Array of page objects to check
 * @returns {string[]} - Array of schema property names
 */
export const getSchemaPropertiesForPages = (formPages, pagesToCheck) => {
  return pagesToCheck.flatMap(page => {
    const pageState = formPages[page.pageKey];
    if (pageState?.schema?.properties) {
      return Object.keys(pageState.schema.properties);
    }
    return [];
  });
};

/**
 * Check if any errors match the specified schema properties
 * @param {Array} errors - Array of validation errors
 * @param {string[]} schemaProperties - Array of schema property names to check
 * @param {boolean} debug - Whether to log debug information
 * @returns {boolean} - True if any errors match the schema properties
 */
export const checkErrorsMatchProperties = (
  errors,
  schemaProperties,
  debug = false,
) => {
  return errors.some((error, index) => {
    // Skip empty error objects
    if (!error || Object.keys(error).length === 0) {
      return false;
    }

    // Check for "required" field errors - these have property="instance" and argument="fieldName"
    // Example: { property: "instance", argument: "phoneNumber", name: "required" }
    if (error.name === 'required' && error.argument) {
      const matches = schemaProperties.includes(error.argument);
      if (debug) {
        // eslint-disable-next-line no-console
        console.log(
          `Error ${index} required field "${error.argument}" matches:`,
          matches,
        );
      }
      if (matches) {
        return true;
      }
    }

    // Check if error has a 'property' field with a specific property name
    // Example: { property: "instance.phoneNumber", name: "pattern" }
    if (error.property && error.property !== 'instance') {
      const propertyName = error.property.replace('instance.', '');
      const matches = schemaProperties.includes(propertyName);
      if (debug) {
        // eslint-disable-next-line no-console
        console.log(
          `Error ${index} property "${propertyName}" matches:`,
          matches,
        );
      }
      if (matches) {
        return true;
      }
    }

    // Check if any of the error's keys match our schema properties
    const errorKeys = Object.keys(error);
    const matchingKey = errorKeys.find(key => schemaProperties.includes(key));
    if (matchingKey) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log(`Error ${index} has matching key "${matchingKey}"`);
      }
      return true;
    }

    return false;
  });
};

/**
 * Trigger error display on form fields by simulating form submission
 * This sets the "submitted" state which causes SchemaForm to show errors
 */
export const triggerErrorDisplay = () => {
  // Find and click ALL submit buttons in editing forms to trigger SchemaForm validation
  // Each SchemaForm handles its own validation display when submitted
  const forms = document.querySelectorAll('.form-review-panel-page form');

  // eslint-disable-next-line no-console
  console.log('triggerErrorDisplay: found forms:', forms.length);

  forms.forEach((form, index) => {
    // Try to find any va-button with submit attribute (may be outside form but associated)
    const panel = form.closest('.form-review-panel-page');
    const vaButton = panel?.querySelector('va-button[submit]');

    // eslint-disable-next-line no-console
    console.log(`Form ${index}: va-button found:`, vaButton);

    if (vaButton) {
      // Click the va-button - it should trigger form submission
      // eslint-disable-next-line no-console
      console.log(`Clicking va-button for form ${index}`);
      vaButton.click();
    } else {
      // Fallback: dispatch submit event directly on the form
      // eslint-disable-next-line no-console
      console.log(`Dispatching submit event on form ${index}`);
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      );
    }
  });
};

/**
 * Scroll to and focus on the first error element on the page
 */
const scrollToFirstError = () => {
  const errorElement = document.querySelector(
    '.usa-input-error, va-text-input[error], va-textarea[error], va-select[error]',
  );
  if (errorElement) {
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Focus the input within the error container
    const focusableInput = errorElement.tagName?.toLowerCase().startsWith('va-')
      ? errorElement
      : errorElement.querySelector(
          'va-text-input, va-textarea, va-select, input, select, textarea',
        );
    if (focusableInput) {
      focusableInput.focus();
    }
  }
};

/**
 * Focus on the first error element on the page
 * @param {string[]} errorProperties - Optional array of property names that have errors
 */
export const focusOnFirstError = errorProperties => {
  // First try to find existing error elements
  const errorElement = document.querySelector(
    '.usa-input-error, va-text-input[error], va-textarea[error], va-select[error]',
  );
  if (errorElement) {
    scrollToFirstError();
    return;
  }

  // If no error elements found yet, trigger error display then scroll after DOM updates
  if (errorProperties && errorProperties.length > 0) {
    triggerErrorDisplay();
    // Use requestAnimationFrame to wait for DOM to update with error elements
    requestAnimationFrame(() => {
      scrollToFirstError();
    });
  }
};

/**
 * Validates the form and checks if any of the specified pages have errors
 * @param {Object} options - Validation options
 * @param {string[]} options.pageKeysToCheck - Array of page keys to check for errors
 * @param {Array} options.pageList - Full list of pages from routes
 * @param {Object} options.form - The form object from Redux state
 * @param {boolean} options.debug - Whether to log debug information
 * @returns {boolean} - True if there are validation errors on the specified pages
 */
export const hasValidationErrorsForPages = ({
  pageKeysToCheck,
  pageList,
  form,
  debug = false,
}) => {
  if (debug) {
    // eslint-disable-next-line no-console
    console.log('=== hasValidationErrors DEBUG ===');
    // eslint-disable-next-line no-console
    console.log('pageKeysToCheck:', pageKeysToCheck);
  }

  // Find the pages we're checking from the pageList
  const pagesToCheck = pageList.filter(page =>
    pageKeysToCheck.includes(page.pageKey),
  );

  if (debug) {
    // eslint-disable-next-line no-console
    console.log('pagesToCheck:', pagesToCheck);
    console.log('pageList:', pageList);
  }

  // Get the schema property names from the pages we're checking
  const schemaProperties = getSchemaPropertiesForPages(
    form.pages,
    pagesToCheck,
  );

  if (debug) {
    // eslint-disable-next-line no-console
    console.log('schemaPropertiesForPages:', schemaProperties);
  }

  // Validate the form and get errors
  const validationResult = isValidForm(form, pageList);

  if (debug) {
    // eslint-disable-next-line no-console
    console.log('isValidForm result:', validationResult);
    // eslint-disable-next-line no-console
    console.log('Raw errors:', validationResult.errors);
  }

  const { errors } = validationResult;

  // Check if any raw errors relate to properties on the pages we're checking
  const hasErrors = checkErrorsMatchProperties(errors, schemaProperties, debug);

  // Find which specific properties have errors (for triggering error display)
  const errorProperties = hasErrors
    ? schemaProperties.filter(prop =>
        errors.some(
          error =>
            error.argument === prop ||
            (error.property && error.property.includes(prop)) ||
            Object.keys(error).includes(prop),
        ),
      )
    : [];

  if (debug) {
    // eslint-disable-next-line no-console
    console.log('hasErrors:', hasErrors);
    // eslint-disable-next-line no-console
    console.log('errorProperties:', errorProperties);
    // eslint-disable-next-line no-console
    console.log('=== END hasValidationErrors DEBUG ===');
  }

  if (hasErrors) {
    focusOnFirstError(errorProperties);
  }

  return hasErrors;
};
