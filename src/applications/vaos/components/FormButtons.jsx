import React from 'react';
import PropTypes from 'prop-types';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

export default function FormButtons({
  onBack,
  onSubmit,
  pageChangeInProgress,
  loadingText,
  disabled,
}) {
  return (
    <div className="vads-l-row form-progress-buttons schemaform-buttons">
      <div className="vads-l-col--6 vads-u-padding-right--2p5">
        <ProgressButton
          onButtonClick={onBack}
          buttonText="Back"
          buttonClass="usa-button-secondary vads-u-width--full"
          beforeText="«"
        />
      </div>
      <div className="vads-l-col--6">
        <LoadingButton
          isLoading={pageChangeInProgress}
          loadingText={loadingText}
          type="submit"
          onClick={onSubmit}
          disabled={disabled}
          className="usa-button usa-button-primary vads-u-width--full"
        >
          Continue »
        </LoadingButton>
      </div>
    </div>
  );
}

FormButtons.propTypes = {
  onBack: PropTypes.func.isRequired,
  pageChangeInProgress: PropTypes.bool,
};
