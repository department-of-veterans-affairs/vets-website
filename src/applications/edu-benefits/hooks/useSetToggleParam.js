import { useEffect } from 'react';

export const useSetToggleParam = toggleValue => {
  useEffect(
    () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (toggleValue != null && toggleValue !== 'undefined') {
        urlParams.set('toggle', toggleValue);
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${urlParams.toString()}`;
        if (window.location.href !== newUrl) {
          window.location.href = newUrl;
        }
      }
    },
    [toggleValue],
  );
};
