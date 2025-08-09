import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const ApiErrorAlert = () => (
  <VaAlert role="alert" status="warning" visible>
    <h2 slot="headline">This page isn’t available right now</h2>
    <p className="vads-u-margin-y--0">
      We’re sorry. Something went wrong on our end. Refresh this page or try
      again later.
    </p>
  </VaAlert>
);
