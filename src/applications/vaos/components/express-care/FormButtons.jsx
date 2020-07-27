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
  backButtonText,
  nextButtonText,
}) {
  return (
    <div className="vads-l-row form-progress-buttons schemaform-buttons">
      <div className="vads-u-padding-right--1">
        <ProgressButton
          onButtonClick={onBack}
          buttonText={backButtonText || 'Back'}
          buttonClass="usa-button-secondary"
        />
      </div>
      <div>
        <LoadingButton
          isLoading={pageChangeInProgress}
          loadingText={loadingText}
          type="submit"
          onClick={onSubmit}
          disabled={disabled}
          className="usa-button usa-button-primary"
        >
          {nextButtonText || 'Continue »'}
        </LoadingButton>
      </div>
    </div>
  );
}

FormButtons.propTypes = {
  onBack: PropTypes.func.isRequired,
  pageChangeInProgress: PropTypes.bool,
};
