import React from 'react';

// Re-usable description (renders inside Review & submit page like pre-need)
export const PrivacyAgreementDescription = () => (
  <>
    <p className="vads-u-margin-top--0">
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information. (See 18
      U.S.C. 1001)
    </p>
    <p>
      Please read and accept the{' '}
      <va-link
        href="https://www.va.gov/privacy-policy/"
        text="privacy policy (opens in a new tab)"
        target="_blank"
        rel="noopener noreferrer"
      />
      .
    </p>
  </>
);

// uiSchema fragment (mirrors pre-need integration pattern: field lives on review page)
export const privacyAgreementUi = {
  privacyAgreementAccepted: {
    'ui:title': 'I have read and accept the privacy policy.',
    'ui:required': () => true,
    'ui:errorMessages': {
      required:
        'You must accept the privacy policy before submitting your application.',
    },
    'ui:options': {
      hideOnReview: false,
    },
  },
};

// schema fragment
export const privacyAgreementSchema = {
  privacyAgreementAccepted: { type: 'boolean' },
};
