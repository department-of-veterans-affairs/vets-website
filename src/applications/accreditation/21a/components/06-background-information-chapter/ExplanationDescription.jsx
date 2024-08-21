import React from 'react';

const ExplanationDescription = () => (
  <div>
    <p>
      <strong>Note:</strong>
    </p>
    <ul>
      <li>You must provide copies of any relevant documents below. </li>
      <li>
        Failure to disclose requested information may result in denial of
        accreditation under{' '}
        <va-link
          href="https://www.law.cornell.edu/cfr/text/38/14.629"
          text="38 C.F.R. § 14.629"
        />{' '}
        or in disciplinary proceedings under{' '}
        <va-link
          href="https://www.law.cornell.edu/cfr/text/38/14.633"
          text="38 C.F.R. § 14.633"
        />{' '}
        if you are already accredited.
      </li>
      <li>Incomplete applications will not be processed.</li>
    </ul>
  </div>
);

export default ExplanationDescription;
