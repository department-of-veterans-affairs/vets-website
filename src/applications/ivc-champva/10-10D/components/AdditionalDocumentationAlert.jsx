import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function AdditionalDocumentationAlert() {
  return (
    <VaAlert status="info" visible uswds>
      <h2>
        Depending on your response, additional documentation may be required to
        determine eligibility
      </h2>
    </VaAlert>
  );
}
