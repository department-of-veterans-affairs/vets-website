import React from 'react';

const Ineligible = () => (
  <va-alert status="info" class="vads-u-margin-bottom--2">
    <h2 slot="headline" className="vads-u-font-size--h3">
      We don’t have a COE on file for you
    </h2>
    <p>
      We can’t find a VA home loan Certificate of Eligibility for you. To
      request a COE, you’ll need to fill out and submit a Request for a
      Certificate of Eligibility (VA Form 26-1880)
    </p>
    <a href="/housing-assistance/home-loans/">
      Learn more about VA-backed home loans
    </a>
  </va-alert>
);

export default Ineligible;
