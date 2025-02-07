import { useEffect } from 'react';

export const useSetToggleParam = (toggleValue, showRudisill1995) => {
  useEffect(
    () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (toggleValue != null && toggleValue !== 'undefined') {
        urlParams.set('toggle', toggleValue);
        sessionStorage.setItem(
          'isRudisill1995',
          JSON.stringify(showRudisill1995),
        );
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${urlParams.toString()}`;
        if (window.location.href !== newUrl) {
          window.location.href = newUrl;
        }
      }
    },
    [toggleValue, showRudisill1995],
  );
};
