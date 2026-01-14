import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

// source: https://github.com/department-of-veterans-affairs/component-library/blob/main/packages/storybook/stories/wc-helpers.jsx#L285-L290
export const applyFocus = (parentId, headerHasFocused, setHeaderHasFocused) => {
  if (!headerHasFocused) {
    setTimeout(() => {
      // Guard against document being undefined if component unmounts before timeout fires
      if (typeof document === 'undefined') return;
      const header = document
        .getElementById(parentId)
        ?.shadowRoot?.querySelector('h1');

      if (header) {
        const tabindex = header.getAttribute('tabindex');

        if (header.tabIndex !== 0) {
          header.setAttribute('tabindex', '-1');

          if (typeof tabindex === 'undefined' || tabindex === null) {
            header.addEventListener(
              'blur',
              () => {
                header.removeAttribute('tabindex');
              },
              { once: true },
            );
          }
        }

        header.addEventListener('focus', () => {
          header.style.outline = 'none';
        });

        header?.focus();
        setHeaderHasFocused(true);
      }
    }, 500);
  }
};

export const pageSetup = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  waitForRenderThenFocus('h1');
};

export const applyErrorFocus = id => {
  const element = document.getElementById(id);

  const tabindex = element.getAttribute('tabindex');
  if (element.tabIndex !== 0) {
    element.setAttribute('tabindex', '-1');
    if (typeof tabindex === 'undefined' || tabindex === null) {
      element.addEventListener('focus', () => {
        element.style.outline = 'none';
      });
      element.addEventListener(
        'blur',
        () => {
          element.removeAttribute('tabindex');
        },
        { once: true },
      );
    }
  }

  element.focus();
};
