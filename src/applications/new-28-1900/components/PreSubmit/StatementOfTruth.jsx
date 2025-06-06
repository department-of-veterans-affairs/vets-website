import React from 'react';
import PropTypes from 'prop-types';

const StatementOfTruth = ({ content }) => {
  const { label = '' } = content;
  return (
    <>
      <legend className="signature-box--legend vads-u-display--block vads-u-width--full vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
        {`${label} statement of truth`}
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

StatementOfTruth.propTypes = {
  content: PropTypes.object,
};

export default StatementOfTruth;
