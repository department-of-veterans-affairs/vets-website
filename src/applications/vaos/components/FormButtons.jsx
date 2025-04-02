import React from 'react';
import PropTypes from 'prop-types';
import ProgressButton from '@department-of-veterans-affairs/platform-forms-system/ProgressButton';
import LoadingButton from './LoadingButton';

export default function FormButtons({
  onBack,
  onSubmit,
  pageChangeInProgress,
  loadingText,
  disabled,
  backBeforeText,
  backButtonText,
  nextButtonText,
  displayNextButton = true,
}) {
  return (
    <div className="vads-l-row form-progress-buttons schemaform-buttons">
      <div className="vaos__form-button-back mobile:vads-u-padding-right--1p5 medium-screen:vads-u-padding-right--0p5">
        <ProgressButton
          onButtonClick={onBack}
          buttonText={backButtonText || 'Back'}
          buttonClass="usa-button-secondary"
          beforeText={typeof backBeforeText === 'string' ? backBeforeText : '«'}
        />
      </div>
      {displayNextButton && (
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
            {nextButtonText && { nextButtonText }}

            {!nextButtonText && (
              <>
                Continue{' '}
                <va-icon
                  icon="navigate_far_next"
                  class="vads-u-padding-left--1"
                />
              </>
            )}
          </LoadingButton>
        </div>
      )}
    </div>
  );
}

FormButtons.propTypes = {
  onBack: PropTypes.func.isRequired,
  backBeforeText: PropTypes.string,
  backButtonText: PropTypes.string,
  disabled: PropTypes.bool,
  displayNextButton: PropTypes.bool,
  loadingText: PropTypes.string,
  nextButtonText: PropTypes.string,
  pageChangeInProgress: PropTypes.bool,
  onSubmit: PropTypes.func,
};
