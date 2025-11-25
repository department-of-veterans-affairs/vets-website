import React from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function FeaturesWarning() {
  return (
    <div>
      <h2 id="additional-services">Additional services</h2>
      <p>
        <VaLink
          href="/change-address/"
          text="Change your address and other contact information"
          data-testid="change-address-link"
        />
      </p>
      <p>
        <VaLink
          href="/resources/how-to-change-your-legal-name-on-file-with-va/"
          text="Change your legal name on file with VA"
          data-testid="change-legal-name-link"
        />
      </p>
      <p>
        <VaLink
          href="/disability/get-help-filing-claim/"
          text="Get help filing your VA claim, decision review, or appeal"
          data-testid="get-help-filing-claim-link"
        />
      </p>
    </div>
  );
}
