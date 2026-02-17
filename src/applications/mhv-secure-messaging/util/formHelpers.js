import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

export const focusOnErrorField = () => {
  setTimeout(() => {
    const errors = document.querySelectorAll('[error]:not([error=""])');

    if (errors.length === 0) {
      return;
    }

    const firstErrorElement = errors[0];
    let firstError = null;

    if (firstErrorElement.tagName === 'VA-RADIO') {
      firstError = firstErrorElement
        .querySelector('va-radio-option')
        ?.querySelector('input');
    } else if (firstErrorElement.shadowRoot) {
      firstError =
        firstErrorElement.shadowRoot.querySelector('input, textarea');
      if (!firstError) {
        // Fall back to select if no input or textarea is found
        firstError = firstErrorElement.shadowRoot.querySelector('select');
      }
    }

    // Check for va-checkbox
    if (!firstError) {
      firstError = firstErrorElement
        .querySelector('va-checkbox')
        ?.shadowRoot?.querySelector('input');
    }

    // Check for direct input elements
    if (!firstError) {
      firstError = firstErrorElement.querySelector('input');
    }

    if (firstError) {
      focusElement(firstError);
    }
  }, 300);
};
