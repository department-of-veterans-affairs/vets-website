import React from 'react';
import PropTypes from 'prop-types';
import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';
import LoadingButton from '@department-of-veterans-affairs/platform-site-wide/LoadingButton';

export default function FormButtons({
  onBack,
  onSubmit,
  pageChangeInProgress,
  loadingText,
  disabled,
  backBeforeText,
  backButtonText,
  nextButtonText,
}) {
  return (
    <div className="vads-l-row form-progress-buttons schemaform-buttons">
      <div className="vaos__form-button-back xsmall-screen:vads-u-padding-right--1p5 medium-screen:vads-u-padding-right--0p5">
        <ProgressButton
          onButtonClick={onBack}
          buttonText={backButtonText || 'Back'}
          buttonClass="usa-button-secondary"
          beforeText={typeof backBeforeText === 'string' ? backBeforeText : '«'}
        />
      </div>
      <div className="vaos__form-button-next">
        <LoadingButton
          isLoading={pageChangeInProgress}
          loadingText={loadingText}
          type="submit"
          onClick={onSubmit}
          disabled={disabled}
          className="usa-button usa-button-primary"
          aria-label={nextButtonText || 'Continue'}
        >
          {nextButtonText || 'Continue »'}
        </LoadingButton>
      </div>
    </div>
  );
}

FormButtons.propTypes = {
  onBack: PropTypes.func.isRequired,
  backBeforeText: PropTypes.string,
  backButtonText: PropTypes.string,
  disabled: PropTypes.bool,
  loadingText: PropTypes.string,
  nextButtonText: PropTypes.string,
  pageChangeInProgress: PropTypes.bool,
  onSubmit: PropTypes.func,
};
