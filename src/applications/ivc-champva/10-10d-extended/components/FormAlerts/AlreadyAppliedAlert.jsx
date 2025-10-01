import React from 'react';

const AlreadyAppliedAlert = () => (
  <va-alert status="info" class="vads-u-margin-y--4">
    <h2 slot="headline">Have you already applied for CHAMPVA benefits?</h2>
    <p>
      Learn more about what you may need to do after you apply. And find out
      what to do if we need more information from you or if you need to update
      your information.
    </p>
    <p>
      <va-link
        href="/resources/what-to-do-after-applying-for-champva-benefits/"
        text="Learn what to do after applying for CHAMPVA benefits"
      />
    </p>
  </va-alert>
);

export default AlreadyAppliedAlert;
