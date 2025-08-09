import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const DataErrorAlert = () => (
  <VaAlert role="alert" status="warning" visible>
    <p className="vads-u-margin-y--0">
      We’re sorry. Something went wrong on our end and we can’t load your
      documents available for paperless delivery. Try again later.
    </p>
  </VaAlert>
);
