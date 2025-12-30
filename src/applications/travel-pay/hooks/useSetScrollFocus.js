import { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';

const useSetScrollFocus = () => {
  useEffect(() => {
    let timeoutId;

    scrollTo('topScrollElement').then(() => {
      timeoutId = setTimeout(() => {
        const firstH1 = document.getElementsByTagName('h1')[0];
        if (firstH1) {
          focusElement(firstH1);
        }
        // Timeout to prevent focus-setting from interrupting smooth scroll
      }, 200);
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);
};

export default useSetScrollFocus;
