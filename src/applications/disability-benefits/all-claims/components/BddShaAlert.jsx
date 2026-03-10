import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Basic526Link from './Basic526Link';

export default function BddShaAlert() {
  return (
    <VaAlert status="warning" visible>
      <h2 slot="headline">
        A Separation Health Assessment (SHA) Part A is required
      </h2>
      <p>
        We want to ensure that we have all the information we need to process
        your claim. If you do not include a SHA Part A as part of your claim, we
        will not be able to deliver a decision within 30 days after separation.
      </p>
      <p>
        <Basic526Link
          path="supporting-evidence/separation-health-assessment"
          text="Check if you've uploaded a SHA Part A document"
        />
      </p>
    </VaAlert>
  );
}
