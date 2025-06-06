import React from 'react';

const StatementOfTruth = () => {
  return (
    <>
      <legend className="signature-box--legend vads-u-display--block vads-u-width--full vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
        Statement of truth
      </legend>
      <p>
        I confirm that the identifying information in this form is accurate and
        has been represented correctly.
      </p>
      <p data-testid="cg-privacy-copy">
        I have read and accept the{' '}
        <va-link href="/privacy-policy/" text="privacy policy" external />.
      </p>
    </>
  );
};

export default StatementOfTruth;
