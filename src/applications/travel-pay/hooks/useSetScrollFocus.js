import { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';

const useSetScrollFocus = () => {
  useEffect(() => {
    scrollTo('topScrollElement').then(() => {
      setTimeout(() => {
        const firstH1 = document.getElementsByTagName('h1')[0];
        if (firstH1) {
          focusElement(firstH1);
        }
        // Timeout to prevent focus-setting from interrupting smooth scroll
      }, 250);
    });
  }, []);
};

export default useSetScrollFocus;
