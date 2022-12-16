import React from 'react';

export default {
  required: false,
  notice: (
    <div className="vads-u-margin-bottom--4">
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information (See 18
      U.S.C. 1001).{' '}
      <a
        href="https://www.va.gov/privacy-policy/"
        target="_blank"
        rel="noreferrer"
      >
        Learn more about our privacy policy
      </a>
    </div>
  ),
  field: 'privacyAgreementAccepted',
  label: <span>I have read and accept the privacy policy</span>,
  error: 'You must accept the privacy policy before continuing.',
};
