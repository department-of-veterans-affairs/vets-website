import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function SectionCompleteAlert() {
  return (
    <VaAlert status="success" visible uswds>
      <h2>Section Complete</h2>
    </VaAlert>
  );
}
