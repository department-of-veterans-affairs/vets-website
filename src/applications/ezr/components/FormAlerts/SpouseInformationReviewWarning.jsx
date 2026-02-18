import React from 'react';
import PropTypes from 'prop-types';

const SpouseInformationReviewWarning = props => {
  return !props.isFormReviewPage ? (
    <>
      <div className="vads-u-margin-top--4">
        <va-alert slim status="info" tabIndex={-1} visible>
          <p className="vads-u-margin-y--0 vads-u-font-weight--normal">
            You can review and edit your spouse information. Or select{' '}
            <strong>Continue</strong> to go to the next part of this form.
          </p>
        </va-alert>
      </div>
    </>
  ) : null;
};

SpouseInformationReviewWarning.propTypes = {
  isFormReviewPage: PropTypes.bool,
};

export default SpouseInformationReviewWarning;
