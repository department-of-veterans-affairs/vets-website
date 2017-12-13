import React from 'react';
import PropTypes from 'prop-types';

import AlertBox from '../../common/components/AlertBox';
import ErrorableTextarea from '../../common/components/form-elements/ErrorableTextarea';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';

function FeedbackForm(props) {
  return (
    <form
      className="feedback-form"
      onSubmit={(event) => {
        event.preventDefault();
        props.sendFeedback();
      }}>
      {props.errorMessage ? (
        <div className="feedback-error">
          <AlertBox status="error" onCloseAlert={props.clearError} content={props.errorMessage} isVisible/>
        </div>
      ) : null}
      <h4 className="feedback-widget-title">Tell us what you think</h4>
      <div className="va-flex">
        <div className="feedback-widget-description-container">
          <ErrorableTextarea
            label="What can we do to make Vets.gov better?"
            name="description"
            errorMessage={props.formErrors.description}
            field={{ value: props.formValues.description, dirty: false }}
            onValueChange={({ value: description }) => props.setFormValues({ description })}
            required/>
        </div>
        <div className="feedback-widget-need-help-container">
          <div className="feedback-widget-need-help-inner">
            <h3>Need help?</h3>
            Calls the Vets.gov Help Desk<br/>
            <a href="tel:18555747286">1-855-574-7286</a><br/>
            TTY:&nbsp;<a href="tel:+18008778339">1-800-877-8339</a><br/>
            Monday – Friday, 8:00 a.m. – 8:00 p.m. (<abbr title="eastern time">ET</abbr>)
          </div>
        </div>
      </div>
      <input
        id="should-send-response"
        type="checkbox"
        value={props.formValues.shouldSendResponse}
        onChange={({ target: { checked: shouldSendResponse } }) => props.setFormValues({ shouldSendResponse })}/>
      <label htmlFor="should-send-response">I would like to receive a response about my feedback.</label>
      <div className="usa-grid-full">
        <div className="usa-width-one-third">
          {props.formValues.shouldSendResponse ? (
            <div className="feedback-email-container">
              <ErrorableTextInput
                label="Your email address"
                name="email"
                field={{ value: props.formValues.email, dirty: false }}
                errorMessage={props.formErrors.email}
                onValueChange={({ value: email }) => props.setFormValues({ email })}
                required/>
            </div>
          ) : null}
          <div className="feedback-submit-container">
            <button
              type="submit"
              disabled={props.requestPending || !props.formHasValidated || props.formErrors.description || props.formErrors.email}
              className="usa-button-primary usa-width-one-whole feedback-submit-button">
              {props.requestPending ? <i className="fa fa-spin fa-spinner"/> : 'Send feedback'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

FeedbackForm.propTypes = {
  formHasValidated: PropTypes.bool,
  formErrors: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  sendFeedback: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  requestPending: PropTypes.bool
};

export default FeedbackForm;
