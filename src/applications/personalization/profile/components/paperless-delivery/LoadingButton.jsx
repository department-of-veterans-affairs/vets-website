import React, { useLayoutEffect, useRef } from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const LoadingButton = () => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const focusButton = () => {
      const inner = ref.current?.shadowRoot?.querySelector('button');
      if (inner) {
        inner.focus();
      } else {
        requestAnimationFrame(focusButton);
      }
    };
    requestAnimationFrame(focusButton);
  }, []);

  return <VaButton loading text="Loading..." ref={ref} />;
};
