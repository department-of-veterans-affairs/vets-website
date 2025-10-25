import React from 'react';
import propTypes from 'prop-types';
import { saveAndRedirectToReturnUrl } from 'platform/forms/save-in-progress/actions';
import { useSelector, useDispatch } from 'react-redux';
import ProgressButton from './ProgressButton';

export const handleFinishLater = ({ form, dispatch }) => {
  dispatch(
    saveAndRedirectToReturnUrl(
      form.formId,
      form.data,
      form.version,
      form.returnUrl,
      form.submission,
    ),
  );
};

/**
 * Render the form navigation buttons for the normal form page flow.
 *
 * If `goBack` is not present, the back button will not appear. If
 * `FormNavButtons` are rendered inside a form (such as
 * ~/platform/forms/formulate-integration/Form), use `submitToContinue` and pass
 * the `goForward` function to the form's `onSubmit` instead. Doing this will
 * navigate the user to the next page only if validation is successful.
 */
const FormNavButtons = ({ goForward, submitToContinue }) => {
  const form = useSelector(state => state.form);
  const dispatch = useDispatch();
  const finishLater = event => {
    event.preventDefault();
    handleFinishLater({
      form,
      dispatch,
    });
  };
  return (
    <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
      <div className="small-12 medium-6 columns">
        <ProgressButton
          onButtonClick={finishLater}
          buttonText="Finish later"
          buttonClass="usa-button-secondary"
        />
      </div>
      <div className="small-12 medium-6 end columns">
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
};

FormNavButtons.propTypes = {
  goBack: propTypes.func,
  goForward: propTypes.func,
  submitToContinue: propTypes.bool,
};

export default FormNavButtons;

export const FormNavButtonContinue = ({ goForward, submitToContinue }) => {
  const form = useSelector(state => state.form);
  const dispatch = useDispatch();
  const finishLater = event => {
    event.preventDefault();
    handleFinishLater({
      form,
      dispatch,
    });
  };
  return (
    <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
      <div className="small-12 medium-6 columns">
        <ProgressButton
          onButtonClick={finishLater}
          buttonText="Finish later"
          buttonClass="usa-button-secondary"
        />
      </div>
      <div className="small-12 medium-6 columns">
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
};

FormNavButtonContinue.propTypes = {
  goForward: propTypes.func,
  submitToContinue: propTypes.bool,
};
