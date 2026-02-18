import React from 'react';

const DisputeCharges = () => (
  <article className="vads-u-padding--0" data-testid="dispute-charges">
    <h2 id="dispute-charges">How to dispute your copay charges</h2>
    <p>
      You have the right to dispute all or part of your VA copay charges. You’ll
      need to submit a written statement explaining why you think the copay
      charge or balance amount is incorrect. To avoid late charges, you’ll need
      to dispute the debt within <strong>30 days</strong> of receiving your
      bill.
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
