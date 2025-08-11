import React, { useEffect, useRef } from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const LoadingButton = () => {
  const ref = useRef(null);

  useEffect(() => {
    const focusButton = () => {
      const inner = ref.current?.shadowRoot?.querySelector('button');
      if (inner) {
        inner.focus();
      } else {
        setTimeout(focusButton, 50);
      }
    };
    focusButton();
  }, []);

  return <VaButton loading text="Loading..." ref={ref} />;
};
