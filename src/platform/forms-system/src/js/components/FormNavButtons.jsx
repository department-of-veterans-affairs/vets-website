import React from 'react';
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
const FormNavButtons = ({ goBack, goForward, submitToContinue }) => (
  <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
    <div className="small-6 medium-5 columns">
      {goBack && (
        <ProgressButton
          onButtonClick={goBack}
          buttonText="Back"
          buttonClass="usa-button-secondary"
          beforeText="«"
        />
      )}
    </div>
    <div className="small-6 medium-5 end columns">
      <ProgressButton
        submitButton={submitToContinue}
        onButtonClick={goForward}
        buttonText="Continue"
        buttonClass="usa-button-primary"
        afterText="»"
      />
    </div>
  </div>
);

FormNavButtons.propTypes = {
  goBack: propTypes.func,
  goForward: propTypes.func,
  submitToContinue: propTypes.bool,
};

export default FormNavButtons;
