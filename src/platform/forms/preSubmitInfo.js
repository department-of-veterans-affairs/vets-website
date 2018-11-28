import React from 'react';

export default {
  required: true,
  notice: (
    <div>
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information. (See 18
      U.S.C. 1001)
    </div>
  ),
  field: 'privacyAgreementAccepted',
  label: (
    <span>
      I have read and accept the{' '}
      <a target="_blank" href="/privacy/">
        privacy policy
      </a>
    </span>
  ),
  error: 'You must accept the privacy policy before continuing.',
};
