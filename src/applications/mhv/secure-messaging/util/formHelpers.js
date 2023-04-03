import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

export const focusOnErrorField = () => {
  focusElement(
    document
      .querySelectorAll('[error]:not([error=""]')[0]
      .shadowRoot.querySelector(
        '[aria-describedby="error-message"], #error-message, #input-error-message',
      ),
  );
};
