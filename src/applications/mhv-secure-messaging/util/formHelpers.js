import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

export const focusOnErrorField = () => {
  const errors = document.querySelectorAll('[error]:not([error=""])');
  const firstError =
    errors.length > 0 &&
    errors[0]?.shadowRoot?.querySelector(
      '[aria-describedby="error-message"], #error-message, #input-error-message, .usa-error-message',
    );
  if (firstError) {
    focusElement(firstError);
  }
};
