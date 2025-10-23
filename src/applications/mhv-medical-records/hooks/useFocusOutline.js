import { useEffect } from 'react';

const useFocusOutline = elementRef => {
  useEffect(
    () => {
      setTimeout(() => {
        const applyFocusStyles = e => {
          const { target } = e;
          target.style.outline = '#face00 auto 1px';
          target.style.outlineOffset = '2px';
        };

        const removeFocusStyles = e => {
          const { target } = e;
          target.style.outline = '';
          target.style.outlineOffset = '';
        };

        const attachListeners = () => {
          const heading = elementRef?.current?.shadowRoot?.querySelector('h2');
          if (heading) {
            heading.addEventListener('focus', applyFocusStyles, true);
            heading.addEventListener('blur', removeFocusStyles, true);
          }
          return heading;
        };

        const heading = attachListeners();

        return () => {
          if (heading) {
            heading.removeEventListener('focus', applyFocusStyles, true);
            heading.removeEventListener('blur', removeFocusStyles, true);
          }
        };
      }, 400);
    },
    [elementRef],
  );
};

export default useFocusOutline;
