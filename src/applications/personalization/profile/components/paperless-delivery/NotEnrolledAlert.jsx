import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const NotEnrolledAlert = () => (
  <VaAlert status="info" visible>
    <h2 slot="headline">Paperless delivery not available yet</h2>
    <p>
      You’re not enrolled in any VA benefits that offer paperless delivery
      options.
    </p>
  </VaAlert>
);
