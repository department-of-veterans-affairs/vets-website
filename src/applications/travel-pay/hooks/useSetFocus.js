import { useEffect } from 'react';

import { focusElement } from 'platform/utilities/ui/focus';

const useSetFocus = () => {
  useEffect(() => {
    const firstH1 = document.getElementsByTagName('h1')[0];
    if (firstH1) {
      focusElement(firstH1);
    }
  }, []);
};

export default useSetFocus;
