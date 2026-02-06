import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import ProgressButton from './ProgressButton';

/**
 * Render the form navigation buttons for the normal form page flow.
 *
 * If `goBack` is not present, the back button will not appear. If
 * `FormNavButtons` are rendered inside a form (such as
 * ~/platform/forms/formulate-integration/Form), use `submitToContinue` and pass
 * the `goForward` function to the form's `onSubmit` instead. Doing this will
 * navigate the user to the next page only if validation is successful.
 */

/**
 * Helper function to wrap a handler with optional tracking callback
 * @param {Function} handler - The original handler function
 * @param {Function} trackingCallback - Optional tracking callback
 * @returns {Function} Wrapped handler with tracking
 */
const wrapWithTracking = (handler, trackingCallback) => () => {
  if (!handler) return;

  // If tracking callback is provided, call it
  if (trackingCallback) {
    trackingCallback();
  }

  // Call the original handler function
  handler();
};

const FormNavButtons = ({
  goBack,
  goForward,
  submitToContinue,
  useWebComponents,
  onBackClickTracking,
  onContinueClickTracking,
}) => {
  const handleBackClick = useCallback(
    () => wrapWithTracking(goBack, onBackClickTracking)(),
    [goBack, onBackClickTracking],
  );

  const handleContinueClick = useCallback(
    () => wrapWithTracking(goForward, onContinueClickTracking)(),
    [goForward, onContinueClickTracking],
  );

  return (
    <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
      <div className="small-6 medium-5 columns">
        {goBack && (
          <ProgressButton
            onButtonClick={handleBackClick}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
            useWebComponents={useWebComponents}
          />
        )}
      </div>
      <div className="small-6 medium-5 end columns">
        <ProgressButton
          submitButton={submitToContinue}
          onButtonClick={handleContinueClick}
          buttonText="Continue"
          buttonClass="usa-button-primary"
          afterText="»"
          useWebComponents={useWebComponents}
        />
      </div>
    </div>
  );
};

FormNavButtons.propTypes = {
  goBack: propTypes.func,
  goForward: propTypes.func,
  submitToContinue: propTypes.bool,
  useWebComponents: propTypes.bool,
  onBackClickTracking: propTypes.func,
  onContinueClickTracking: propTypes.func,
};

export default FormNavButtons;

export const FormNavButtonContinue = ({
  goForward,
  submitToContinue,
  useWebComponents,
}) => (
  <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
    <div className="medium-8 columns">
      <ProgressButton
        submitButton={submitToContinue}
        onButtonClick={goForward}
        buttonText="Continue"
        buttonClass="usa-button-primary"
        afterText="»"
        useWebComponents={useWebComponents}
      />
    </div>
  </div>
);

FormNavButtonContinue.propTypes = {
  goForward: propTypes.func,
  submitToContinue: propTypes.bool,
  useWebComponents: propTypes.bool,
};
