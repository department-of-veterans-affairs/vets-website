import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ProgressButton from '../components/ProgressButton';
import { timeFromNow } from '../utilities/date';
import { APP_TYPE_DEFAULT } from '../constants';

export default function SubmitButtons(props) {
  const {
    onBack,
    onSubmit,
    preSubmitSection,
    renderErrorMessage,
    submission,
    formConfig,
  } = props;
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  let submitButton;
  let submitMessage;
  if (submission.status === false) {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText={`Submit ${appType}`}
        buttonClass="usa-button-primary"
      />
    );
  } else if (submission.status === 'submitPending') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Sending..."
        disabled
        buttonClass="usa-button-disabled"
      />
    );
  } else if (submission.status === 'applicationSubmitted') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText="Submitted"
        disabled
        buttonClass="form-button-green"
        beforeText="&#10003;"
      />
    );
  } else if (submission.status === 'clientError') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText={`Submit ${appType}`}
        buttonClass="usa-button-primary"
      />
    );
    submitMessage = (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header">
            <strong>
              We’re sorry, there was an error connecting to VA.gov.
            </strong>
          </p>
          <p>Please check your Internet connection and try again.</p>
        </div>
      </div>
    );
  } else if (submission.status === 'throttledError') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText={`Submit ${appType}`}
        buttonClass="usa-button-primary"
      />
    );
    submitMessage = (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header">
            <strong>We’ve run into a problem</strong>
          </p>
          <p>
            We’re sorry. Your submission didn’t go through because we received
            too many requests from you. Please wait{' '}
            {timeFromNow(moment.unix(submission.extra))} and submit your request
            again.
          </p>
        </div>
      </div>
    );
  } else if (submission.status === 'validationError') {
    submitButton = (
      <ProgressButton
        onButtonClick={onSubmit}
        buttonText={`Submit ${appType}`}
        buttonClass="usa-button-primary"
      />
    );
    submitMessage = (
      <div className="usa-alert usa-alert-error schemaform-failure-alert">
        <div className="usa-alert-body">
          <p className="schemaform-warning-header">
            <strong>
              We’re sorry. Some information in your {appType} is missing or not
              valid.
            </strong>
          </p>
          <p>
            Please check each section of your {appType} to make sure you’ve
            filled out all the information that is required.
          </p>
        </div>
      </div>
    );
  } else {
    if (renderErrorMessage) {
      submitMessage = renderErrorMessage();
    } else {
      submitMessage = (
        <div className="usa-alert usa-alert-error schemaform-failure-alert">
          <div className="usa-alert-body">
            <p className="schemaform-warning-header">
              <strong>We’re sorry, the {appType} didn’t go through.</strong>
            </p>
            <p>
              You’ll have to start over. We suggest you wait 1 day while we fix
              this problem.
            </p>
          </div>
        </div>
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      submitButton = (
        <div className="small-6 usa-width-one-half medium-6 columns">
          <a onClick={onSubmit}>Submit again</a>
        </div>
      );
    }

    return (
      <>
        <div className="row">
          <div className="small-12 medium-12 columns" role="alert">
            {submitMessage}
          </div>
        </div>
        {preSubmitSection}
        <div className="row form-progress-buttons schemaform-back-buttons">
          <div className="small-6 usa-width-one-half medium-6 columns">
            <a href="/">
              <button className="usa-button-primary">Go Back to VA.gov</button>
            </a>
          </div>
          {submitButton}
        </div>
      </>
    );
  }
  return (
    <>
      <div className="row">
        <div className="columns" role="alert">
          {submitMessage}
        </div>
      </div>
      {preSubmitSection}
      <div className="row form-progress-buttons">
        <div className="small-6 medium-5 columns">
          <ProgressButton
            onButtonClick={onBack}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
          />
        </div>
        <div className="small-6 medium-5 columns">{submitButton}</div>
        <div className="small-1 medium-1 end columns">
          <div className="hidden">&nbsp;</div>
        </div>
      </div>
    </>
  );
}

SubmitButtons.propTypes = {
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  preSubmitSection: PropTypes.element,
  renderErrorMessage: PropTypes.func,
  submission: PropTypes.object,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appType: PropTypes.string,
    }),
  }),
};
