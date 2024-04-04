import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

// source: https://github.com/department-of-veterans-affairs/component-library/blob/main/packages/storybook/stories/wc-helpers.jsx#L285-L290
export const applyFocus = (parentId, headerHasFocused, setHeaderHasFocused) => {
  if (!headerHasFocused) {
    setTimeout(() => {
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

export const customizeTitle = h1 => {
  if (h1) {
    return `${h1} | How to Apply for A Discharge Upgrade | Veterans Affairs`;
  }

  return 'How to Apply for A Discharge Upgrade | Veterans Affairs';
};

export const pageSetup = H1 => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  waitForRenderThenFocus('h1');
  document.title = customizeTitle(H1);
};

export const applyErrorFocus = (
  id,
  elementHasFocused,
  setElementHasFocused,
) => {
  if (!elementHasFocused) {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.setAttribute('tabindex', '-1');
        element.addEventListener('focus', () => {
          element.style.outline = 'none';
        });
        element.focus();
        setElementHasFocused(true);
      }
    }, 500);
  }
};
