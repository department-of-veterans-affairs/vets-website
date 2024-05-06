import React from 'react';

const DigitalSubmissionInfo = () => (
  <va-alert status="info" visible>
    <h2 slot="headline">
      Veterans can now digitally submit form 21-22 from VA.gov
    </h2>
    <p className="vads-u-margin-y--0">
      Veterans can now{' '}
      <a href="https://www.va.gov/get-help-from-accredited-representative/find-rep/">
        find a VSO
      </a>{' '}
      and{' '}
      <a href="https://www.va.gov/find-forms/about-form-21-22a/">
        sign and submit
      </a>{' '}
      a digital version of form 21-22. Digital submissions will immediately
      populate in the table below.
    </p>
  </va-alert>
);

export default DigitalSubmissionInfo;
