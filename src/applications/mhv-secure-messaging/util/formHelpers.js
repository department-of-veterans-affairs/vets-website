import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

export const focusOnErrorField = () => {
  setTimeout(() => {
    const errors = document.querySelectorAll('[error]:not([error=""])');
    const firstError =
      errors.length > 0 &&
      (errors[0]?.shadowRoot?.querySelector('select, input, textarea') ||
        errors[0]
          ?.querySelector('va-checkbox')
          ?.shadowRoot?.querySelector('input') ||
        errors[0].querySelector('input'));
    if (firstError) {
      focusElement(firstError);
    }
  }, 300);
};
