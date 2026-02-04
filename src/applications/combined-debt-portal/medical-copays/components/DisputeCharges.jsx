import React from 'react';

const DisputeCharges = () => (
  <article className="vads-u-padding--0" data-testid="dispute-charges">
    <h2 id="dispute-charges">How to dispute your copay charges</h2>
    <p>
      You have the right to dispute all or part of your VA copay charges. Write
      a letter explaining why you think the copay charges or balance amount may
      not be correct. To avoid late charges, you’ll need to dispute the debt
      within 30 days of receiving your bill.
    </p>
    <p>
      Mail the letter, or bring it in person, to the business office or health
      administration office at your nearest VA medical center. If you send your
      dispute by mail, please include "Billing Dispute" on the mailing envelope.
    </p>
    <p>
      <va-link-action
        href="/health-care/pay-copay-bill/dispute-charges/"
        text="Learn more about disputing your copay charges"
        type="secondary"
      />
    </p>
  </article>
);

export default DisputeCharges;
