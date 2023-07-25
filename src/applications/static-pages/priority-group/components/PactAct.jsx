import React from 'react';

const PactAct = () => (
  <va-alert close-btn-aria-label="Close notification" status="info" visible>
    <h2 slot="headline">
      The PACT Act expands benefit access for Veterans exposed to burn pits and
      other toxic substances
    </h2>
    <div>
      <p className="vads-u-margin-y--0">
        The PACT Act is a new law that expands access to VA health care and
        benefits for Veterans exposed to burn pits and other toxic substances.
        This law helps us provide generations of Veterans—and their
        survivors—with the care and benefits they’ve earned and deserve.
      </p>
      <p>
        <a href="https://va.gov/resources/the-pact-act-and-your-va-benefits">
          Learn how the PACT Act may affect your VA benefits and care
        </a>
      </p>
    </div>
  </va-alert>
);

export default PactAct;
